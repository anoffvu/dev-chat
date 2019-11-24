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

import firebase from 'firebase';
import { Link } from 'react-router-dom';

export class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false
  };

  // state setter
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // show the errors, if any
  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  // submit button handler
  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          // console.log(signedInUser);
          // console.log('user Signed in!');
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  // checks if login form is valid
  isFormValid = ({ email, password }) => email && password;

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
      email,
      password,

      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <GridColumn style={{ maxWidth: 450 }}>
          {/* Header */}
          <Header as='h1' icon color='violet' textAlign='center'>
            <Icon name='code branch' color='violet' />
            Login to DevChat
          </Header>

          {/* Form */}
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
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

              {/* Submit Button */}
              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                color='violet'
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
            Don't have an account?<Link to='/register'>Register</Link>{' '}
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Login;
