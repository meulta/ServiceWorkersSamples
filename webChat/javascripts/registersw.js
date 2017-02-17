if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./webchatsw.js')
    .then(function(reg) {
      Notification.requestPermission();
      console.log('Service workers available!', reg);
      document.getElementById("swStatus").innerText = "SW Status: registered!"
    }).catch(function(err) {
      console.log('Oh no! Service workers is not available', err);
    });
}