var endpoint;
var key;
var authSecret;

navigator.serviceWorker.register('service-worker.js')
    .then(function (registration) {
        return registration.pushManager.getSubscription()
            .then(function (subscription) {
                if (subscription) {
                    return subscription;
                }
                
                var toto = registration.pushManager.subscribe({ 
                    userVisibleOnly: true 
                });

                return toto;
                
            });
    }).then(function (subscription) {
        var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
        key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
        var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
        authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';

        endpoint = subscription.endpoint;

        fetch('https://3f633db4.ngrok.io/register', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                endpoint: subscription.endpoint,
                key: key,
                authSecret: authSecret
            }),
        });
    });

document.getElementById('doIt').onclick = function () {
    var payload = "toto";
    var delay = "5";
    var ttl = "0";
    fetch('https://3f633db4.ngrok.io/sendNotification', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            endpoint: endpoint,
            key: key,
            authSecret: authSecret,
            payload: payload,
            delay: delay,
            ttl: ttl,
        }),
    });
};