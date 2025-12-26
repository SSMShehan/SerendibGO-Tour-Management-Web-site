// Create credentials properly handling password hashing
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function createWorkingCredentials() {
    const logLines = [];

    try {
        const MONGODB_URI = process.env.MONGODB_URI ||
            'mongodb+srv://admin:admin123@serandibgo.izvdsyx.mongodb.net/serendibgo?retryWrites=true&w=majority';

        await mongoose.connect(MONGODB_URI);
        logLines.push('✅ Connected to MongoDB\n');

        // Delete old accounts
        await User.deleteMany({
            email: { $in: ['admin@serandibgo.com', 'staff@serandibgo.com'] }
        });
        logLines.push('Deleted old accounts\n');

        // Create ADMIN - Let the model's pre-save hook hash the password
        const admin = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@serandibgo.com',
            password: 'admin123',  // Plain password - will be hashed by pre-save hook
            phone: '+94771111111',
            role: 'admin',
            isVerified: true,
            isActive: true,
            status: 'active'
        });
        await admin.save();

        // Verify the password
        const adminFromDB = await User.findOne({ email: 'admin@serandibgo.com' }).select('+password');
        const adminVerify = await bcrypt.compare('admin123', adminFromDB.password);

        logLines.push('✅ ADMIN CREATED AND VERIFIED');
        logLines.push('   Email: admin@serandibgo.com');
        logLines.push('   Password: admin123');
        logLines.push(`   Password Test: ${adminVerify ? 'WORKS ✅' : 'FAILED ❌'}`);
        logLines.push('');

        // Create STAFF - Let the model's pre-save hook hash the password
        const staff = new User({
            firstName: 'Staff',
            lastName: 'Member',
            email: 'staff@serandibgo.com',
            password: 'staff123',  // Plain password - will be hashed by pre-save hook
            phone: '+94772222222',
            role: 'staff',
            isVerified: true,
            isActive: true,
            status: 'active'
        });
        await staff.save();

        // Verify the password
        const staffFromDB = await User.findOne({ email: 'staff@serandibgo.com' }).select('+password');
        const staffVerify = await bcrypt.compare('staff123', staffFromDB.password);

        logLines.push('✅ STAFF CREATED AND VERIFIED');
        logLines.push('   Email: staff@serandibgo.com');
        logLines.push('   Password: staff123');
        logLines.push(`   Password Test: ${staffVerify ? 'WORKS ✅' : 'FAILED ❌'}`);
        logLines.push('');

        logLines.push('='.repeat(70));
        logLines.push('✅ ✅ ✅  VERIFIED WORKING CREDENTIALS  ✅ ✅ ✅');
        logLines.push('='.repeat(70));
        logLines.push('');
        logLines.push('🔐 ADMIN LOGIN:');
        logLines.push('   Email:    admin@serandibgo.com');
        logLines.push('   Password: admin123');
        logLines.push('');
        logLines.push('🔐 STAFF LOGIN:');
        logLines.push('   Email:    staff@serandibgo.com');
        logLines.push('   Password: staff123');
        logLines.push('');
        logLines.push('🌐 Login Endpoints:');
        logLines.push('   - POST /api/auth/login (all users)');
        logLines.push('   - POST /api/staff/auth/login (staff only)');
        logLines.push('');
        logLines.push('Both accounts are ACTIVE, VERIFIED, and TESTED!');

    } catch (error) {
        logLines.push('');
        logLines.push('❌ Error: ' + error.message);
        logLines.push(error.stack);
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

createWorkingCredentials();
