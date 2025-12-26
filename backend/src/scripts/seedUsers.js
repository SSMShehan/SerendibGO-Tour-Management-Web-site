const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@serendibgo.com',
        password: 'password123',
        role: 'admin'
    },
    {
        name: 'Test Guide',
        email: 'guide@serendibgo.com',
        password: 'password123',
        role: 'guide'
    },
    {
        name: 'Test Traveler',
        email: 'traveler@serendibgo.com',
        password: 'password123',
        role: 'user'
    }
];

const seedUsers = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI is not defined');
            process.exit(1);
        }

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected');

        await User.deleteMany();
        console.log('Users cleared');

        // Hash passwords
        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        await User.insertMany(users);
        console.log('Users seeded');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
