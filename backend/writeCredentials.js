// Write credentials to file
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function createAndVerify() {
    const logLines = [];

    try {
        const MONGODB_URI = process.env.MONGODB_URI ||
            'mongodb+srv://admin:admin123@serandibgo.izvdsyx.mongodb.net/serendibgo?retryWrites=true&w=majority';

        await mongoose.connect(MONGODB_URI);
        logLines.push('✅ Connected to MongoDB');

        // Delete old accounts
        const deleteResult = await User.deleteMany({
            email: { $in: ['admin@serandibgo.com', 'staff@serandibgo.com'] }
        });
        logLines.push(`Deleted ${deleteResult.deletedCount} old accounts`);

        // Create ADMIN
        const adminHash = await bcrypt.hash('admin123', 12);
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

        const adminVerify = await bcrypt.compare('admin123', admin.password);
        logLines.push('');
        logLines.push('✅ ADMIN CREATED');
        logLines.push('   Email: admin@serandibgo.com');
        logLines.push('   Password: admin123');
        logLines.push(`   Password Works: ${adminVerify ? 'YES ✅' : 'NO ❌'}`);

        // Create STAFF
        const staffHash = await bcrypt.hash('staff123', 12);
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

        const staffVerify = await bcrypt.compare('staff123', staff.password);
        logLines.push('');
        logLines.push('✅ STAFF CREATED');
        logLines.push('   Email: staff@serandibgo.com');
        logLines.push('   Password: staff123');
        logLines.push(`   Password Works: ${staffVerify ? 'YES ✅' : 'NO ❌'}`);

        logLines.push('');
        logLines.push('='.repeat(60));
        logLines.push('VERIFIED WORKING CREDENTIALS:');
        logLines.push('='.repeat(60));
        logLines.push('');
        logLines.push('ADMIN LOGIN:');
        logLines.push('  Email: admin@serandibgo.com');
        logLines.push('  Password: admin123');
        logLines.push('');
        logLines.push('STAFF LOGIN:');
        logLines.push('  Email: staff@serandibgo.com');
        logLines.push('  Password: staff123');
        logLines.push('');
        logLines.push('Login Endpoints:');
        logLines.push('  - POST /api/auth/login');
        logLines.push('  - POST /api/staff/auth/login');

    } catch (error) {
        logLines.push('');
        logLines.push('❌ Error: ' + error.message);
    } finally {
        await mongoose.connection.close();
        logLines.push('');
        logLines.push('Database connection closed');
    }

    // Write to file
    const output = logLines.join('\n');
    fs.writeFileSync('CREDENTIALS.txt', output);
    console.log(output);
    process.exit(0);
}

createAndVerify();
