var webPush = require('web-push');
var restify = require('restify');
var builder = require('botbuilder');

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

var server = restify.createServer();
server.use(restify.bodyParser());

server.listen(process.env.port || process.env.PORT || 3000, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var pushPerUser = [];

bot.on("outgoing", function (message) {
    if (pushPerUser && pushPerUser[message.address.user.id]) {
        var pushsub = pushPerUser[message.address.user.id];

        webPush.sendNotification({
            endpoint: pushsub.endpoint,
            TTL: "0",
            keys: {
                p256dh: pushsub.key,
                auth: pushsub.authSecret
            }
        }, message.text);
    }
});

bot.on("event", function (message) {
    if (message.name === "pushsubscriptionadded") {
        pushPerUser[message.user.id] = message.value;
    }
});

var loop = false;
bot.dialog('/', function (session) {
    if (session.message.text === "stop") {
        session.send("Stopping loop");
        loop = false;
    }
    else {
        loop = true;
        testLoop(session);
    }
});

var testLoop = (session) => {
    if (loop) {
        session.send("Hello World of web push! :)");
        setTimeout(() => testLoop(session), 5000);
    }
};

server.get(/\/web\/?.*/, restify.serveStatic({
    directory: __dirname
}));

server.post('/register', function (req, res) {
    res.send(201);
});