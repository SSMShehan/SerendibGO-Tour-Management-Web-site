// Quick script to ensure staff user exists in the database
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

async function ensureStaffUser() {
    try {
        // Use fallback MongoDB URI if .env is not available
        const MONGODB_URI = process.env.MONGODB_URI ||
            'mongodb+srv://admin:admin123@serandibgo.izvdsyx.mongodb.net/serendibgo?retryWrites=true&w=majority';

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });


        console.log('✅ Connected to MongoDB');

        // Check if staff user exists
        const staffEmail = 'staff@serandibgo.com';
        let staffUser = await User.findOne({ email: staffEmail });

        if (staffUser) {
            console.log('✅ Staff user already exists:');
            console.log('   Email:', staffUser.email);
            console.log('   Role:', staffUser.role);
            console.log('   Active:', staffUser.isActive);
            console.log('   Verified:', staffUser.isVerified);

            // Update to ensure it's active and verified
            staffUser.isActive = true;
            staffUser.isVerified = true;
            await staffUser.save({ validateBeforeSave: false });
            console.log('✅ Staff user updated to active and verified');
        } else {
            console.log('❌ Staff user not found, creating...');

            // Create staff user
            const hashedPassword = await bcrypt.hash('password123', 12);

            staffUser = await User.create({
                firstName: 'Admin',
                lastName: 'Staff',
                email: staffEmail,
                password: hashedPassword,
                phone: '+94771234500',
                role: 'staff',
                isVerified: true,
                isActive: true,
                status: 'active'
            });

            console.log('✅ Staff user created successfully!');
            console.log('   Email:', staffUser.email);
            console.log('   Role:', staffUser.role);
        }

        console.log('\n📋 Login Credentials:');
        console.log('   Email: staff@serandibgo.com');
        console.log('   Password: password123');
        console.log('\n🔗 Login endpoints:');
        console.log('   General: POST /api/auth/login');
        console.log('   Staff: POST /api/staff/auth/login');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    }
}

ensureStaffUser();
