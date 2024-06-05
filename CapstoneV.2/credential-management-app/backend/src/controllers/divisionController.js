const Division = require('../models/Division');

const getDivisions = async (req, res) => {
  try {
    const divisions = await Division.find();
    res.json(divisions);
  } catch (error) {
    console.error('Error fetching Divisions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getDivisions };