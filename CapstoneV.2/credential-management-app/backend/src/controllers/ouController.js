const OU = require('../models/OU');

const getOUs = async (req, res) => {
  try {
    const ous = await OU.find();
    res.json(ous);
  } catch (error) {
    console.error('Error fetching OUs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getOUs };