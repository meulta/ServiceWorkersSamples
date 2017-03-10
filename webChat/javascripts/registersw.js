var toto = caches.open('v1');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./webchatsw.js')
    .then(function(reg) {
      Notification.requestPermission();
      console.log('Service workers available!', reg);
      document.getElementById("swStatus").innerText = "SW Status: registered!"
       subscribeDevice();
      
    }).catch(function(err) {
      console.log('Oh no! Service workers is not available', err);
    });
}

function subscribeDevice() {
  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    // Demande d'inscription au Push Server (1)
    return serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true });
  }).then(function (subscription) {
    register(subscription);
    //sauvegarde de l'inscription dans le serveur applicatif (2)
    // fetch(ROOT_URL + '/register-to-notification', {
    //   method: 'post',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   credentials: 'same-origin',
    //   body: JSON.stringify(subscription)
    // }).then(function (response) {
    //   return response.json();
    // }).catch(function (err) {
    //   console.log('Could not register subscription into app server', err);
    // });
  }).catch(function (subscriptionErr) {
    // Check for a permission prompt issue
    console.log('Subscription failed ' + subscriptionErr);
  });
}


    var register = function(registrationHandle) {
        var connection = splitConnection();
        var token = generateToken(connection.originalUri, connection.sasKeyName, connection.sasKeyValue);
        sendRequest(connection.originalUri, registrationHandle.endpoint, token);
    }

    function splitConnection() {
        var connectionString = "Endpoint=sb://testtestest.servicebus.windows.net/;SharedAccessKeyName=DefaultListenSharedAccessSignature;SharedAccessKey=m2LvBCPkjpvJ/YBUFKeG2CXqpRVnxpoNfbTQeICGdVQ=";
        var hubName = "Test";
        var parts = connectionString.split(';');
        var endpoint = "", sasKeyName = "", sasKeyValue = "";
        if (parts.length != 3) {
            throw "Error parsing connection string";
        }

        parts.forEach(function (part) {
            if (part.indexOf('Endpoint') == 0) {
                endpoint = 'https' + part.substring(11);
            } else if (part.indexOf('SharedAccessKeyName') == 0) {
                sasKeyName = part.substring(20);
            } else if (part.indexOf('SharedAccessKey') == 0) {
                sasKeyValue = part.substring(16);
            }
        });

        var originalUri = endpoint + hubName;

        return {
            originalUri: originalUri,
            endpoint: endpoint,
            sasKeyName: sasKeyName,
            sasKeyValue: sasKeyValue
        };
    }

    function generateToken(originalUri, sasKeyName, sasKeyValue) {
        var targetUri = encodeURIComponent(originalUri.toLowerCase()).toLowerCase();
        var expiresInMins = 10; // 10 minute expiration

        // Set expiration in seconds.
        var expireOnDate = new Date();
        expireOnDate.setMinutes(expireOnDate.getMinutes() + expiresInMins);
        var expires = Date.UTC(expireOnDate.getUTCFullYear(), expireOnDate
            .getUTCMonth(), expireOnDate.getUTCDate(), expireOnDate
                .getUTCHours(), expireOnDate.getUTCMinutes(), expireOnDate
                    .getUTCSeconds()) / 1000;
        var tosign = targetUri + '\n' + expires;

        // Using CryptoJS.
        var signature = CryptoJS.HmacSHA256(tosign, sasKeyValue);
        var base64signature = signature.toString(CryptoJS.enc.Base64);
        var base64UriEncoded = encodeURIComponent(base64signature);

        // Construct authorization string.
        var sasToken = "SharedAccessSignature sr=" + targetUri + "&sig="
            + base64UriEncoded + "&se=" + expires + "&skn=" + sasKeyName;
        return sasToken;
    }

    function sendRequest(originalUri, registrationHandle, sasToken) {
        var registrationPayload =
            "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
            "<entry xmlns=\"http://www.w3.org/2005/Atom\">" +
            "<content type=\"application/xml\">" +
            "<GcmRegistrationDescription xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://schemas.microsoft.com/netservices/2010/10/servicebus/connect\">" +
            "<GcmRegistrationId>{GCMRegistrationId}</GcmRegistrationId>" +
            "</GcmRegistrationDescription>" +
            "</content>" +
            "</entry>";

        // Update the payload with the registration ID obtained earlier.
        registrationPayload = registrationPayload.replace("{GCMRegistrationId}", registrationHandle);

        var url = originalUri + "/registrations/?api-version=2014-09";
        var client = new XMLHttpRequest();

        client.onload = function () {
            if (client.readyState == 4) {
                if (client.status == 200) {
                    console.debug("Notification Hub Registration succesful!");
                    console.debug(client.responseText);
                } else {
                    console.debug("Notification Hub Registration did not succeed!");
                    console.debug("HTTP Status: " + client.status + " : " + client.statusText);
                    console.debug("HTTP Response: " + "\n" + client.responseText);
                }
            }
        };

        client.onerror = function () {
            console.error("ERROR - Notification Hub Registration did not succeed!");
        }

        client.open("POST", url, true);
        client.setRequestHeader("Content-Type", "application/atom+xml;type=entry;charset=utf-8");
        client.setRequestHeader("Authorization", sasToken);
        client.setRequestHeader("x-ms-version", "2014-09");

        try {
            client.send(registrationPayload);
        }
        catch (err) {
            console.error(err.message);
        }
    }