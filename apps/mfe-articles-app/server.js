/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const compression = require('compression');
const express = require('express');
const fs = require('fs');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({
    dir: '.',
    dev,
});
const handle = app.getRequestHandler();

const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression'] || dev) {
        return false;
    }

    return compression.filter(req, res);
};

const serverOptions = {
    key: fs.readFileSync('./server-privkey.pem'),
    cert: fs.readFileSync('./server-cert.pem'),
};

app.prepare()
    .then(() => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        const server = express();
        const target = 'https://www5.qa.hbr.org/';

        server.use(
            '/resources',
            createProxyMiddleware({ target, changeOrigin: true }),
        );

        server.use(
            '/api',
            createProxyMiddleware({
                target,
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: 'mfe.dev.hbr.org',
            }),
        );

        server.use(compression({ filter: shouldCompress }));

        server.all('*', (req, res) => handle(req, res));

        const httpsServer = https.createServer(serverOptions, server);
        httpsServer.listen(port, () => {
            console.log(`HTTP Server running on port ${port} =====`);
        });
        httpsServer.on('error', (e) => {
            console.error(e);
        });
    })
    .catch((err) => {
        console.log('An error occurred, unable to start the server');
        console.log(err);
    });
