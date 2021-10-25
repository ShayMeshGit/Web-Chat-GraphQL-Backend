const { logger } = require('../util/logger');


const graphqlErrorHandler = (error) => {
    if (!error.originalError) return error;
    logger.error(`Sending error: ${JSON.stringify(error)}`);
    const {message, reasons} = error.originalError;
    return {message, reasons}
}


module.exports = graphqlErrorHandler;