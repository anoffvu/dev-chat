import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

class MessageForm extends Component {
  state = {
    message: '',
    loading: false,
    user: this.props.currentUser,
    channel: this.props.currentChannel,
    errors: []
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: this.state.message,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    return message;
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat('Add a message')
      });
    }
  };

  render() {
    const { errors, message, loading } = this.state;

    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          onChange={this.handleChange}
          style={{ marginBotton: '0.7em' }}
          disabled={loading}
          label={<Button icon={'add'} />}
          value={message}
          labelPosition='left'
          placeholder='Write your message'
          className={
            errors.some(error => error.includes('message')) ? 'error' : ''
          }
        />
        <Button.Group icon widths='2'>
          {/* Add reply button */}
          <Button
            onClick={this.sendMessage}
            color='orange'
            content='Add Reply'
            labelPosition='left'
            icon='edit'
          />
          {/* Upload Media button */}
          <Button
            color='teal'
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
          />
          {/* <Button
            color='orange'
            content='Add Reply'
            labelPosition='left'
            icon='edit'
          /> */}
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
