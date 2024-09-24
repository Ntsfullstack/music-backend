const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB, connectionParams);
        console.log('Connected to database');
    } catch (error) {
        console.error(`Error connecting to the database. \n${error}`);
        throw error;
    }
};
