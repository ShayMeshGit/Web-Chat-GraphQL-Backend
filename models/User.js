const mongoose = require('mongoose');
const { Schema } = mongoose;
const { logger } = require('../util/logger');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})

UserSchema.pre('save', async function (next) {
    let user = this;
    if (!user.isModified('password')) { return next(); }
    if (!user.isModified('email')) { return next(); }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.method({
    validatePassword: async function (data) {
        try {
            const isEqual = await bcrypt.compare(data, this.password);
            return isEqual;
        } catch (err) {
            throw err
        }

    }
})


module.exports = mongoose.model('User', UserSchema);
