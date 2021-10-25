const { logger } = require('../util/logger');
const User = require('../models/User');
const { checkLoginForm, checkSingupForm } = require('../functions/checkUser');
const { singupError, loginError } = require('../errors');
const jwt = require('jsonwebtoken');

const signup = async (parent, { SignupInput }, context, req) => {
    SignupInput.email = SignupInput.email.toLowerCase();
    SignupInput.username = SignupInput.username.toLowerCase();
    logger.info(`Got args for creating a user ${JSON.stringify(SignupInput)}`);
    try {
        await checkSingupForm(SignupInput)

        const newUser = new User(SignupInput);

        const userCreated = await newUser.save();
        logger.info(`User Saved!`);

        const { _id } = userCreated;
        return {
            _id,
            ...userCreated._doc,
        };
    } catch (err) {
        singupError(err);
    }
}

const login = async (parent, { LoginInput }, context, req) => {
    LoginInput.email = LoginInput.email.toLowerCase();
    logger.info(`Got args for Logining a user ${JSON.stringify(LoginInput)}`);

    try {
        const user = await checkLoginForm(LoginInput, true);

        logger.info(`Generating authentication token...`)
        const token = jwt.sign({
            _id: user._id.toString(),
        }, process.env.SECRET, { expiresIn: '1h' });

        logger.info(`${user.username} Logged In!`);
        return { token, userId: user._id};

    } catch (err) {
        loginError(err)
    }
}

const user = async(parent, { id }, context, req) => {
    const user = await User.findById(id);
    logger.info(`Sending back the user: ${user}`);
    return user;
}


module.exports = AuthService = {
    user,
    signup,
    login
}