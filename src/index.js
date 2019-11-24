import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Spinner from './Spinner';
import App from './components/App';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import registerServiceWorker from './registerServiceWorker';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import { setUser } from './actions';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

// import 'semantic-ui-css/semantic.min.css';
const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
  // if already authenticated, send to home page
  componentDidMount() {
    console.log(this.props.isLoading);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log(user);
        this.props.setUser(user);
        this.props.history.push('./');
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Switch>
    );
  }
}

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

// connecting to roo makes the state a part of the props
const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser })(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
