
import React from 'react'
import ReactDOM from 'react-dom'
import Home from '../components/Home'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import axios from 'axios';
import App from '../components/App'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    // Routes all the routes from '/' to App.
    <Router>
      <Route path="/" component={App}/>
    </Router>,
    document.body.appendChild(document.createElement('div')),
  )
})
