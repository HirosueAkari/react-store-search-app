import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import './index.css';
import App from 'pages/App';
import FreeWord from 'pages/FreeWord'
import PrefName from 'pages/PrefName'
import Conditions from 'pages/conditions'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/" component={App}></Route>
    <Route path="/free" component={FreeWord}></Route>
    <Route path="/pref" component={PrefName}></Route>
    <Route path="/conditions" component={Conditions}></Route>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
