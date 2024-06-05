const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('./src/models/User');
const OU = require('./src/models/OU');
const Division = require('./src/models/Division');
const CredentialRepository = require('./src/models/CredentialRepository');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

const seedData = async () => {
  try {
    // Create OUs
    const newsManagementOU = await OU.create({ name: 'News management' });
    const softwareReviewsOU = await OU.create({ name: 'Software reviews' });
    const hardwareReviewsOU = await OU.create({ name: 'Hardware reviews' });
    const opinionPublishingOU = await OU.create({ name: 'Opinion publishing' });

    console.log('Organisational Units seeded');

    // Create Divisions
    const financeDivision = await Division.create({ name: 'Finance', ou: newsManagementOU._id });
    const itDivision = await Division.create({ name: 'IT', ou: softwareReviewsOU._id });
    const developmentDivision = await Division.create({ name: 'Development', ou: softwareReviewsOU._id });
    const testingDivision = await Division.create({ name: 'Testing', ou: hardwareReviewsOU._id });
    const editorialDivision = await Division.create({ name: 'Editorial', ou: opinionPublishingOU._id });

    console.log('Divisions seeded');

    // Create Credential Repositories
    await CredentialRepository.create({ name: 'Finance Credentials', division: financeDivision._id });
    await CredentialRepository.create({ name: 'IT Credentials', division: itDivision._id });
    await CredentialRepository.create({
      name: 'Development Credentials',
      division: developmentDivision._id,
      credentials: [
        { username: 'devUser1', password: 'devPassword1' },
        { username: 'devUser2', password: 'devPassword2' },
      ],
    });
    await CredentialRepository.create({ name: 'Testing Credentials', division: testingDivision._id });
    await CredentialRepository.create({ name: 'Editorial Credentials', division: editorialDivision._id });

    console.log('Credential Repositories seeded');

    // Create Users
        const user1 = await User.create({
            username: 'user1',
            password: 'password1',
            role: 'normal',
            divisions: [financeDivision._id],
            ous: [newsManagementOU._id],
            credentialRepository: financeDivision._id,
        });
        
        const user2 = await User.create({
            username: 'user2',
            password: 'password2',
            role: 'management',
            divisions: [itDivision._id, developmentDivision._id],
            ous: [softwareReviewsOU._id],
            credentialRepository: itDivision._id,
        });

    console.log('Users seeded');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from MongoDB after seeding
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();