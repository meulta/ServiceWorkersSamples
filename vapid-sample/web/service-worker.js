self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.text() : 'No message...';
  event.waitUntil(
    self.registration.showNotification('Chat bot!', {
      body: payload,
    })
  );
});