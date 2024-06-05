const User = require('../models/User');
const Division = require('../models/Division');
const Role = require('../models/Roles');

const fetchUserData = async (username) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not found');
    }

    const userData = {
      _id: user._id,
      username: user.username,
      role: await fetchRoleName(user.role),
      divisions: user.divisions,
    };

    return userData;
  } catch (error) {
    throw new Error('Error fetching user data: ' + error.message);
  }
};


const fetchRoleName = async (roleId) => {
  try {
    const role = await Role.findOne({ roleId });

    if (!role) {
      throw new Error('Role not found');
    }

    return role.rolename;
  } catch (error) {
    throw new Error('Error fetching role name: ' + error.message);
  }
};



module.exports = { fetchUserData };