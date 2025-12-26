// Comprehensive script to check database and test login
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function checkDatabaseAndLogin() {
    try {
        // Use fallback MongoDB URI
        const MONGODB_URI = process.env.MONGODB_URI ||
            'mongodb+srv://admin:admin123@serandibgo.izvdsyx.mongodb.net/serendibgo?retryWrites=true&w=majority';

        console.log('🔗 Connecting to MongoDB...\n');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB\n');
        console.log('='.repeat(60));
        console.log('CHECKING ALL USERS IN DATABASE');
        console.log('='.repeat(60) + '\n');

        // Get all users
        const allUsers = await User.find({}).select('+password');

        console.log(`📊 Total users in database: ${allUsers.length}\n`);

        if (allUsers.length === 0) {
            console.log('❌ NO USERS FOUND IN DATABASE!\n');
            console.log('Creating fresh admin and staff accounts...\n');

            // Create admin
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

            console.log('✅ Admin created:');
            console.log('   Email: admin@serandibgo.com');
            console.log('   Password: admin123');
            console.log('   Role:', admin.role);
            console.log('');

            // Create staff
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

            console.log('✅ Staff created:');
            console.log('   Email: staff@serandibgo.com');
            console.log('   Password: staff123');
            console.log('   Role:', staff.role);
            console.log('');

        } else {
            // List all users
            console.log('Found users:\n');

            for (const user of allUsers) {
                console.log(`👤 User: ${user.firstName} ${user.lastName}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Active: ${user.isActive}`);
                console.log(`   Verified: ${user.isVerified}`);
                console.log(`   Status: ${user.status || 'N/A'}`);
                console.log(`   Has Password: ${user.password ? 'Yes' : 'No'}`);
                console.log('');
            }

            // Test password for admin and staff
            console.log('\n' + '='.repeat(60));
            console.log('TESTING PASSWORD VERIFICATION');
            console.log('='.repeat(60) + '\n');

            const testPasswords = ['password123', 'admin123', 'staff123', '123456', 'admin', 'staff'];

            for (const user of allUsers) {
                if (['admin', 'staff'].includes(user.role)) {
                    console.log(`🔐 Testing passwords for ${user.email}...`);

                    for (const testPwd of testPasswords) {
                        try {
                            const isMatch = await bcrypt.compare(testPwd, user.password);
                            if (isMatch) {
                                console.log(`   ✅ CORRECT PASSWORD: "${testPwd}"`);
                                break;
                            }
                        } catch (err) {
                            // continue
                        }
                    }
                    console.log('');
                }
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('FINAL CREDENTIALS TO USE');
        console.log('='.repeat(60) + '\n');

        // Get fresh list of admin and staff
        const adminUser = await User.findOne({ role: 'admin' }).select('+password');
        const staffUser = await User.findOne({ role: 'staff' }).select('+password');

        if (adminUser) {
            console.log('🔑 ADMIN LOGIN:');
            console.log(`   Email: ${adminUser.email}`);

            // Try to find working password
            const passwords = ['admin123', 'password123', '123456'];
            for (const pwd of passwords) {
                const match = await bcrypt.compare(pwd, adminUser.password);
                if (match) {
                    console.log(`   Password: ${pwd}`);
                    break;
                }
            }
            console.log('');
        }

        if (staffUser) {
            console.log('🔑 STAFF LOGIN:');
            console.log(`   Email: ${staffUser.email}`);

            // Try to find working password
            const passwords = ['staff123', 'password123', '123456'];
            for (const pwd of passwords) {
                const match = await bcrypt.compare(pwd, staffUser.password);
                if (match) {
                    console.log(`   Password: ${pwd}`);
                    break;
                }
            }
            console.log('');
        }

        console.log('🔗 Login Endpoints:');
        console.log('   General: POST /api/auth/login');
        console.log('   Staff: POST /api/staff/auth/login');
        console.log('');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('✅ Database connection closed\n');
        process.exit(0);
    }
}

checkDatabaseAndLogin();
