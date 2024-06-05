const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// models
const User = require("./models/User");
const OU = require("./models/OU");
const Division = require("./models/Division");
const CredentialRepository = require("./models/CredentialRepository");

// controllers
const { fetchUserData } = require("./controllers/userController");
const Roles = require("./models/Roles");
const Role = require("./models/Roles");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Registration Route
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password and default role (Normal)
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 3, // Default role for Normal users
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const userData = await fetchUserData(username);

    // Generate a JWT token
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour (adjust as needed)
    });

    // Respond with the token
    res.json({ token, userData });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log(err.message);
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = await fetchUserData(decoded.username);

    // Check if divisions are present before continuing

    if (!req.user) {
      console.error("User not available.");
      return res.status(403).json({ error: "Forbidden" });
    }

    // Check if divisions are present before continuing
    if (!req.user.divisions) {
      console.error("User divisions not available.");
      return res.status(403).json({ error: "Forbidden" });
    }

    // Check if divisions are present before continuing
    if (req.user.divisions.length === 0) {
      console.error("User divisions array 0");
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      // Attach divisions to the request for later use
      req.divisions = req.user.divisions;

      next();
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

// Fetch User Data Route
app.get("/api/user-data", verifyToken, async (req, res) => {
  try {
    const userData = await fetchUserData(req.user.username);
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// View Credential Repository Route
app.get(
  "/api/credential-repository/:divisionId",
  verifyToken,
  async (req, res) => {
    try {
      const divisionId = req.params.divisionId;

      // Verify user permissions
      if (!req.user || !req.user.divisions.includes(divisionId)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Find the credential repository for the division
      const credentialRepository = await CredentialRepository.findOne({
        division: divisionId,
      });

      if (!credentialRepository) {
        return res
          .status(404)
          .json({ error: "Credential repository not found" });
      }

      // Fetch the Division and OU details
      const division = await Division.findById(divisionId).populate('ou');
      
      if (!division) {
        return res.status(404).json({ error: "Division not found" });
      }

      const ou = division.ou;

      // Include OU and Division details in the response
      const responseData = {
        credentialRepository,
        division: {
          _id: division._id,
          name: division.name,
          quick_reference: division.quick_reference,
        },
        ou: {
          _id: ou._id,
          name: ou.name,
        },
      };

      res.json(responseData);
    } catch (error) {
      console.error("Error fetching credential repository:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Add Credential Route
app.post(
  "/api/credential-repository/:divisionId/add-credential",
  verifyToken,
  async (req, res) => {
    try {
      const divisionId = req.params.divisionId;

      // Verify user permissions
      if (!req.user || !req.user.divisions.includes(divisionId)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const { systemname, username, password } = req.body;

      // Find the credential repository for the division
      const credentialRepository = await CredentialRepository.findOne({
        division: divisionId,
      });

      if (!credentialRepository) {
        return res
          .status(404)
          .json({ error: "Credential repository not found" });
      }

      // Add the new credential
      credentialRepository.credentials.push({ systemname, username, password });
      await credentialRepository.save();

      res.json({ message: "Credential added successfully" });
    } catch (error) {
      console.error("Error adding credential:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update Credential Route
app.put("/api/credential/:credentialId/update", verifyToken, async (req, res) => {
  try {
    const credentialId = req.params.credentialId;

    // Verify user permissions
    const user = req.user;
    const credential = await CredentialRepository.findOne({ "credentials._id": credentialId });

    if (!user || !user.divisions.includes(credential.division)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { systemname, username, password } = req.body;

    // Find and update the credential
    const updatedCredential = await CredentialRepository.findOneAndUpdate(
      { "credentials._id": credentialId },
      {
        $set: {
          "credentials.$.systemname": systemname,
          "credentials.$.username": username,
          "credentials.$.password": password,
        },
      },
      { new: true }
    );

    if (!updatedCredential) {
      return res.status(404).json({ error: "Credential not found" });
    }

    res.json({ message: "Credential updated successfully" });
  } catch (error) {
    console.error("Error updating credential:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch OUs Route
app.get("/api/ous", async (req, res) => {
  try {
    const ous = await OU.find();
    res.json(ous);
  } catch (error) {
    console.error("Error fetching OUs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch Linked Divisions Route
app.get("/api/divisions/:ouName", async (req, res) => {
  try {
    const ouName = req.params.ouName;

    // Find the OU by name
    const ou = await OU.findOne({ name: ouName });

    if (!ou) {
      return res.status(404).json({ error: "OU not found" });
    }

    // Find linked divisions based on OU
    const linkedDivisions = await Division.find({ ou: ou._id });

    res.json(linkedDivisions);
  } catch (error) {
    console.error("Error fetching linked divisions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/api/users', verifyToken, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    const divisions = await Division.find();
    const ous = await OU.find();
    const roles = await Roles.find();

    console.table({users,divisions});
    // Return the users in the response
    res.json({users,divisions,ous,roles});
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a division to the user
app.post('/api/users/:userId/add-division', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { divisionId } = req.body;

    // Validate if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the division to the user's divisions array
    user.divisions.push(divisionId);

    // Save the user with the updated divisions
    await user.save();

    res.json({ message: 'Division added to user successfully' });
  } catch (error) {
    console.error('Error adding division to user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all roles
app.get("/api/roles", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update user's role
app.put("/api/users/:userId/update-role", async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    // Update the user's role
    await User.findByIdAndUpdate(userId, { role });
    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/users/:userId/remove-division/:divisionId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const divisionId = req.params.divisionId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the division from the user's divisions array
    user.divisions = user.divisions.filter((div) => div.toString() !== divisionId);

    // Save the updated user
    await user.save();

    res.json({ message: "Division removed from user successfully" });
  } catch (error) {
    console.error("Error removing division from user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
