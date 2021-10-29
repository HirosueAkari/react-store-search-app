import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import './index.css';
import App from 'pages/App';
import FreeWord from 'pages/FreeWord'
import PrefName from 'pages/PrefName'
import Conditions from 'pages/conditions'
import Location from 'pages/Location'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/" component={App}></Route>
    <Route path="/free" component={FreeWord}></Route>
    <Route path="/pref" component={PrefName}></Route>
    <Route path="/conditions" component={Conditions}></Route>
    <Route path="/location" component={Location}></Route>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
