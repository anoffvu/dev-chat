import React, { Component } from 'react';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  GridColumn
} from 'semantic-ui-react';

import firebase from '../../firebase';

import md5 from 'md5';

import { Link } from 'react-router-dom';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  // state setter
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // form validity checker
  isFormValid = () => {
    let validityErrors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      // check if form is empty, throw error
      error = { message: 'Fill in all fields.' };
      this.setState({ errors: validityErrors.concat(error) });
      console.log(error);
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      // check if form is invalid, throw error
      error = { message: 'Password is invalid' };
      this.setState({ errors: validityErrors.concat(error) });
      console.log(error);
      return false;
    } else {
      // must be valid
      return true;
    }
  };

  // show the errors, if any
  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  // password validity checker
  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      // pw length
      return false;
    } else if (password !== passwordConfirmation) {
      // pw matches
      return false;
    } else {
      // pw matches and meets length req.
      return true;
    }
  };

  // helper to check if form values are empty (used in form validation)
  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    // will check if any of these are of length 0
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  // submit button handler
  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          // we receive the user back as a resolve from firebase

          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              console.log(createdUser);
              this.saveUser(createdUser).then(() => {
                console.log('user saved');
                this.setState({ loading: false });
              });
            })
            .catch(err => {
              console.log(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        // if the request fails at firebase, display the error
        .catch(err => {
          // console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  // returns 'error' if errors contains an error associated to the passed in name
  // used to set the styling className
  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? 'error'
      : '';
  };

  render() {
    // destructure
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <GridColumn style={{ maxWidth: 450 }}>
          {/* Header */}
          <Header as='h1' icon color='orange' textAlign='center'>
            <Icon name='puzzle piece' color='orange' />
            Register for DevChat
          </Header>

          {/* Form */}
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              {/* Username input field */}
              <Form.Input
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={this.handleChange}
                value={username}
                // highlight if error is with this field
                className={this.handleInputError(errors, 'username')}
                type='text'
              />

              {/* Email input field */}
              <Form.Input
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email Address'
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, 'email')}
                type='email'
              />

              {/* Password field */}
              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, 'password')}
                type='password'
              />

              {/* Password confirm */}
              <Form.Input
                fluid
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'password')}
                type='password'
              />

              {/* Submit Button */}
              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                color='orange'
                fluid
                size='large'
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}

          <Message>
            Already a user? <Link to='/login'>Login</Link>{' '}
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;
