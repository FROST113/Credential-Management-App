const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Roles = require("./src/models/Roles");
const User = require("./src/models/User");
const OU = require("./src/models/OU");
const Division = require("./src/models/Division");
const CredentialRepository = require("./src/models/CredentialRepository");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

const seedData = async () => {
  try {

    // Create Role
    const AdminRole =  await Roles.create({ roleId: 1, rolename: 'Admin' });
    const ManagmentRole =  await Roles.create({ roleId: 2, rolename: 'Managment' });
    const NormalRole =  await Roles.create({ roleId: 3, rolename: 'Normal' });

    console.log("Roles seeded");

    // Create OUs
    const newsManagementOU = await OU.create({ name: "News management" });
    const softwareReviewsOU = await OU.create({ name: "Software reviews" });
    const hardwareReviewsOU = await OU.create({ name: "Hardware reviews" });
    const opinionPublishingOU = await OU.create({ name: "Opinion publishing" });

    console.log("Organizational Units seeded");

    const ouList = [
      newsManagementOU,
      softwareReviewsOU,
      hardwareReviewsOU,
      opinionPublishingOU,
    ];
    console.log("Organizational Units Preped");

    const divisionList = [];
    // Create Divisions
    for (const val of ouList) {
      console.log(val.name);
      const financeDivision = await Division.create({
        name: "Finance",
        quick_reference: "Finance - " + val.name,
        ou: val._id,
      });
      divisionList.push(financeDivision);
      const itDivision = await Division.create({
        name: "IT",
        quick_reference: "IT - " + val.name,
        ou: val._id,
      });
      divisionList.push(itDivision);

      const developmentDivision = await Division.create({
        name: "Development",
        quick_reference: "Development - " + val.name,
        ou: val._id,
      });
      divisionList.push(developmentDivision);

      const testingDivision = await Division.create({
        name: "Testing",
        quick_reference: "Testing - " + val.name,
        ou: val._id,
      });
      divisionList.push(testingDivision);

      const editorialDivision = await Division.create({
        name: "Editorial",
        quick_reference: "Editorial - " + val.name,
        ou: val._id,
      });
      divisionList.push(editorialDivision);
    }

    console.log("Divisions seeded");

    console.log(divisionList);
    // Create Credential Repositories
    for (const item of divisionList) {
      await CredentialRepository.create({
        name: item.quick_reference + " Credentials",
        division: item._id,
        credentials: [
          {
            systemname: "Test System 1",
            username: "devUser1",
            password: "devPassword1",
          },
          {
            systemname: "Test System 2",
            username: "devUser2",
            password: "devPassword2",
          },
        ],
      });
    }

    console.log("Credential Repositories seeded");

    // Create Users
    const user1 = await User.create({
      username: "user1",
      password: "password1",
      role: AdminRole.roleId,
      divisions: [divisionList[1]._id, divisionList[2]._id],
    });

    const user2 = await User.create({
      username: "user2",
      password: "password2",
      role: ManagmentRole.roleId,
      divisions: [divisionList[0]._id, divisionList[1]._id],
    });

    const user3 = await User.create({
      username: "user3",
      password: "password3",
      role: NormalRole.roleId,
      divisions: [divisionList[0]._id, divisionList[1]._id],
    });

    console.log("Users seeded");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Disconnect from MongoDB after seeding
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedData();
