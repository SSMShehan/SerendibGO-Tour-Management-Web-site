const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@serandibgo.izvdsyx.mongodb.net/serendibgo?appName=serandibgo';

console.log('--- MongoDB Debug Script ---');
console.log(`Node Environment: ${process.env.NODE_ENV}`);
console.log(`Attempting to connect to: ${uri.replace(/:([^:@]+)@/, ':****@')}`); // Hide password

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('✅ Connection Sucessful!');
        console.log('Database is accessible.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed!');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);

        if (err.message.includes('bad auth')) {
            console.log('\nPossible Cause: Invalid Credentials (username/password).');
        } else if (err.message.includes('ETIMEDOUT') || err.message.includes('querySrv ETIMEOUT')) {
            console.log('\nPossible Cause: Network timeout. Check if your IP address is whitelisted in MongoDB Atlas.');
            console.log('Go to Atlas > Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0) for testing.');
        } else if (err.message.includes('ENOTFOUND')) {
            console.log('\nPossible Cause: DNS/Hostname issue. The URI might be incorrect.');
        }

        process.exit(1);
    });
