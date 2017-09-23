import express from 'express';
import path from 'path';
import fs from 'fs';
const staticServer = () => {
    const app = express();
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build/index.html'));
    });

    app.get(/(\/$)|(\/[a-zA-Z0-9]*$)|(\/([a-zA-Z0-9]*\/)$)/, (req, res) => {
         res.redirect('/');
         // res.sendFile(path.resolve(__dirname, '../build/index.html'));
    });
    app.get(/([a-zA-Z0-9\_\-]*).((\.(html|jpg|bmp|gif|jpeg|png|js|css|svg|eot|ttf|woff|scss|less))|(\?\w*\S*[&=]*))$/, (req, res) => {
        const mUrl = req.originalUrl;
        const resFile = path.resolve(__dirname, '../build/' + mUrl);
        if (fs.existsSync(resFile)) {
            res.sendFile(resFile);
        } else {
            console.log(resFile);
            res.status(404);
            res.end();
        }
    });
    app.get('/static', (req, res) => {
        res.jsonp({
            title: 'dev-server',
            author: 'elmer',
            browser: 'webkit-node 1.0.2'
        });
    });
    app.listen('5000');

    console.log('server is running:', 'http://localhost:5000');
};


staticServer();
