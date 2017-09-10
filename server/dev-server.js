import express from 'express';

export default () => {
    const app = express();
    app.get('/', (req, res) => {
        res.json({
            version: '1.0.1',
            title: 'test server',
            description: 'in order to create an server for project ajax rquest'
        });
    });

    app.listen('5000');

    console.log('server is running:', 'http://localhost:5000');
};
