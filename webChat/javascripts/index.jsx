"use strict";
const botframework_webchat_1 = require('botframework-webchat');
const react_1 = require('react');
var ServicedChat = react_1.ReactDOM.createClass({
    render: () => {
        <div>
            <botframework_webchat_1.Chat directLine={{ secret: "imlHuziUpQU.cwA.kk4.viQQCpWvY5OKs5A5Rs_7GlkcEcLlY6hcxTFOUqZlNyk" }} user={'meulta'}/>
        </div>;
    }
});
react_1.ReactDOM.render(<ServicedChat />, document.getElementById('container'));
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(function (reg) {
        console.log('Service workers available!', reg);
    }).catch(function (err) {
        console.log('Oh no! Service workers is not available', err);
    });
}
