import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import './index.css';
import App from 'pages/App';
import Menu from 'pages/Menu'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/" component={App}></Route>
    <Route path="/menu" component={Menu}></Route>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
