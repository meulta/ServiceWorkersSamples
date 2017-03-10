var webPush = require('web-push');
var restify = require('restify');


webPush.setGCMAPIKey(process.env.GCM_API_KEY);

var server = restify.createServer();
server.use(restify.bodyParser());

server.listen(process.env.port || process.env.PORT || 3000, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

server.get(/\/web\/?.*/, restify.serveStatic({
    directory: __dirname
}));

server.post('/register', function (req, res) {
    res.send(201);
});

server.post('/sendNotification', function (req, res) {
    setTimeout(function () {
        webPush.sendNotification({
            endpoint: req.body.endpoint,
            TTL: req.body.ttl,
            keys: {
                p256dh: req.body.key,
                auth: req.body.authSecret
            }
        }, req.body.payload)
            .then(function () {
                res.send(201);
            })
            .catch(function (error) {
                console.log(error);
                res.send(500);
            });
    }, req.body.delay * 1000);
});