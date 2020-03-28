const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use('/api', createProxyMiddleware({
        target: 'http://localhost:5051'
    }));
    app.use('/apiv1', createProxyMiddleware({
        target: 'http://localhost:5051'
    }));
};