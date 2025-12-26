// Simple script to create fresh admin and staff with known passwords
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function createFreshCredentials() {
    try {
        // Use fallback MongoDB URI
        const MONGODB_URI = process.env.MONGODB_URI ||
            'mongodb+srv://admin:admin123@serandibgo.izvdsyx.mongodb.net/serendibgo?retryWrites=true&w=majority';

        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB\n');

        // Delete existing admin and staff
        await User.deleteMany({ email: { $in: ['admin@serandibgo.com', 'staff@serandibgo.com'] } });
        console.log('Deleted old admin and staff accounts\n');

        // Create ADMIN with password: admin123
        const adminPassword = 'admin123';
        const adminHash = await bcrypt.hash(adminPassword, 12);

        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@serandibgo.com',
            password: adminHash,
            phone: '+94771111111',
            role: 'admin',
            isVerified: true,
            isActive: true,
            status: 'active'
        });

        // Verify the password immediately
        const adminCheck = await bcrypt.compare('admin123', admin.password);
        console.log('✅ ADMIN CREATED');
        console.log('   Email: admin@serandibgo.com');
        console.log('   Password: admin123');
        console.log('   Password Verified:', adminCheck ? 'YES ✅' : 'NO ❌');
        console.log('   Role:', admin.role);
        console.log('   Active:', admin.isActive);
        console.log('   Verified:', admin.isVerified);
        console.log('');

        // Create STAFF with password: staff123
        const staffPassword = 'staff123';
        const staffHash = await bcrypt.hash(staffPassword, 12);

        const staff = await User.create({
            firstName: 'Staff',
            lastName: 'Member',
            email: 'staff@serandibgo.com',
            password: staffHash,
            phone: '+94772222222',
            role: 'staff',
            isVerified: true,
            isActive: true,
            status: 'active'
        });

        // Verify the password immediately
        const staffCheck = await bcrypt.compare('staff123', staff.password);
        console.log('✅ STAFF CREATED');
        console.log('   Email: staff@serandibgo.com');
        console.log('   Password: staff123');
        console.log('   Password Verified:', staffCheck ? 'YES ✅' : 'NO ❌');
        console.log('   Role:', staff.role);
        console.log('   Active:', staff.isActive);
        console.log('   Verified:', staff.isVerified);
        console.log('');

        console.log('='.repeat(50));
        console.log('WORKING CREDENTIALS:');
        console.log('='.repeat(50));
        console.log('');
        console.log('ADMIN:');
        console.log('  Email: admin@serandibgo.com');
        console.log('  Password: admin123');
        console.log('');
        console.log('STAFF:');
        console.log('  Email: staff@serandibgo.com');
        console.log('  Password: staff123');
        console.log('');
        console.log('Login Endpoints:');
        console.log('  POST /api/auth/login (all users)');
        console.log('  POST /api/staff/auth/login (staff only)');
        console.log('');

    } catch (error) {
        console.error('Error:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
}

createFreshCredentials();
