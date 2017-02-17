if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(function(reg) {
      console.log('Service workers available!', reg);
     
    }).catch(function(err) {
      console.log('Oh no! Service workers is not available', err);
    });
}