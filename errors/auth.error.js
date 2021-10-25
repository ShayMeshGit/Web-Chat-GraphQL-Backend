const { logger } = require('../util/logger');
const singupError =  (err) => {

    if (err.name === 'ValidationError') {
        const error = new Error('Validation Error');
        error.reasons = err.errors;
        logger.error(`Validation failed: ${JSON.stringify(error)}`)
        throw error;
    }

    if (err.reasons) {
        logger.error(`${err.message} ${JSON.stringify(err)}`)
        throw err;
    }

    const error = new Error('User creation failed');
    logger.error(`Got error trying to create user with: ${err}`)
    throw error;
}

const loginError =  (err) => {

    if (err.name === 'ValidationError') {
        const error = new Error('Validation Error');
        error.reasons = err.errors;
        logger.error(`Validation failed: ${JSON.stringify(error)}`)
        throw error;
    }

    if (err.reasons) {
        logger.error(`Worng password or username: ${JSON.stringify(err)}`)
        throw err;
    }


    const error = new Error('Got error trying to login');
    logger.error(`Got error trying to create user with: ${err}`)
    throw error;
}

module.exports = {
    singupError,
    loginError
}