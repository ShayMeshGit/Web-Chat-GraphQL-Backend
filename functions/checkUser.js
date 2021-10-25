const { logger } = require('../util/logger');
const { userSignupSchema, userLoginSchema } = require('../validation/user.valid');
const User = require('../models/User');


const checkLoginForm = async (loginInput) => {
    const { email, password } = loginInput;
    
    const error = new Error('Wrong User credentials.');
    const reasons = [];

    logger.info(`Validting user login input...`)
    await userLoginSchema.validate(loginInput, { abortEarly: false });

    logger.info(`Checking if user exists in database...`)
    const user = await User.findOne({ email });
    if (!user) {
        reasons.push('Wrong email or password, try again...');
        error.reasons = reasons;
        logger.error(`Wrong email ${error}`);
        throw error;
    }

    logger.info(`Checking user password...`)
    const valid = await user.validatePassword(password);
    if (!valid) {
        reasons.push('Wrong email or password, try again...');
        error.reasons = reasons;
        logger.error(`Wrong password ${error}`);
        throw error;
    }

    return user;
}


const checkSingupForm = async (singupInput) => {
    const { email, username } = singupInput;

    logger.info(`Validting user singup input...`)
    await userSignupSchema.validate(singupInput, { abortEarly: false });

    const emailExists = await User.findOne({ email })
    const usernameExists = await User.findOne({ username });

    const reasons = [];

    logger.info(`Checking if email exists in database...`)
    if (emailExists) {
        logger.error(`Email already exists!`);
        reasons.push('Email already exists!');
    }

    logger.info(`Checking if  exists in database...`)
    if (usernameExists) {
        logger.error(`Username already exists!`);
        reasons.push('Username already exists!')
    }

    if (reasons.length > 0) {
        const error = new Error('User credentials already exists.');
        error.reasons = reasons;
        throw error;
    }
}


module.exports = {
    checkLoginForm,
    checkSingupForm
};