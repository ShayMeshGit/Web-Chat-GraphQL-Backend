const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;

const myFormat = printf( ({ level, message, timestamp}) => {
    return `${timestamp} [${level}] : ${message}` ; 
   
});

const logger = createLogger({
  format: combine(
	format.colorize(),
	splat(),
	timestamp(),
	myFormat
  ),
  transports: [
	new transports.Console(),
  ]
});

const logReq = (req, res, next) => {
    logger.info(`Got Req to url: ${req.url}`);
    return next();
}
module.exports = {logger, logReq}