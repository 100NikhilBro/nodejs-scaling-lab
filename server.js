const { config } = require('dotenv');
config();

const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));



const pino = require('pino');
const logger = pino();

const pinoHttp = require('pino-http');
app.use(pinoHttp());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {

    logger.info('Home Route hit');

    let s = 0;

    for(let i = 0; i < 5e7; i++){
        s = s + i;
    }

    return res.json({
        Server: "Nginx-Server",
        Health: "Good",
        sum: s,
        container: process.env.HOSTNAME
    });
});

app.listen(PORT, () => {
    logger.info(`Server started on ${PORT}`);
});
