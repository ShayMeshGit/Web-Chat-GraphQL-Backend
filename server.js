require("dotenv").config();

const { logger, logReq } = require("./util/logger");

//Express
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const graphqlErrorHandler = require("./graphql/error");

//Graphql schema
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const { makeExecutableSchema } = require("graphql-tools");

//Server
const http = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");

//Database
const mongoose = require("mongoose");

const PORT = process.env.PORT || 4000;
const DB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

logger.info(`Creating graphql schema...`);
const GRAPHQL_SCHEMA = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

const corsWhiteList = ["http://localhost:3000", `http://localhost:${PORT}`];

const expressApp = express();

const reqChain = () => {
  logger.info(`express app req chain...`);

  logger.info(`Binding [logReq]`);
  expressApp.use(logReq);

  logger.info(`Binding [cors] with Allowed origins: ${corsWhiteList}`);
  expressApp.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }
        if (corsWhiteList.indexOf(origin) !== -1) {
          return callback(null, true);
        }
        const error = new Error();
        logger.error(`Origin not Allowed!: ${origin}`);
        return callback(error);
      },
      optionsSuccessStatus: 200,
    })
  );

  logger.info(`Allowing the client to set Header Authorization`);
  expressApp.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    next();
  });

  logger.info(`Binding [graphqlHTTP]`);
  expressApp.use(
    "/graphql",
    graphqlHTTP({
      schema: GRAPHQL_SCHEMA,
      graphiql: {
        subscriptionEndpoint: `ws://localhost:${PORT}/subscriptions`,
      },
      customFormatErrorFn: graphqlErrorHandler,
    })
  );

  logger.info("Chain finished");
  return expressApp;
};

const createSubscriptionServer = (graphqlHTTPServer) => {
  logger.info(
    `WebSocket server is listeing on: ws://localhost:${PORT}/subscriptions`
  );
  SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema: GRAPHQL_SCHEMA,
      onConnect: (connectionParams, webSocket) => {
        logger.info(`Client connected`);
      },
      onDisconnect: (args) => {
        logger.info("Client disconnected");
      },
    },
    {
      server: graphqlHTTPServer,
      path: "/subscriptions",
    }
  );
};

const start = async () => {
  reqChain(expressApp);

  logger.info(`Initializing server with express app`);
  const server = http.createServer(expressApp);
  try {
    logger.info(`Attempting to connect to database with URI: ${DB_URI}`);
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`Successfully connected to database!`);
  } catch (error) {
    logger.error(
      `Got error while attempting to connect to database with: ${error}`
    );
  }

  server.listen(PORT, () => {
    logger.info(`Server is listening on: http://localhost:${PORT}/graphql`);
    createSubscriptionServer(server);
  });
};

logger.info(`Starting server`);
start();
