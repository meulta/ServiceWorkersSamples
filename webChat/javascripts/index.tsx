import { Chat } from 'botframework-webchat';
import { ReactDOM } from 'react';

var ServicedChat = ReactDOM.createClass({
  render: () => {
        <div>
            <Chat directLine={{ secret: "imlHuziUpQU.cwA.kk4.viQQCpWvY5OKs5A5Rs_7GlkcEcLlY6hcxTFOUqZlNyk" }} user={ 'meulta' }/>
        </div>
    }
});

ReactDOM.render(<ServicedChat />, document.getElementById('container'));

