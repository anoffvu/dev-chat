import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessageForm from './MessageForm';
import Message from './Message';
import MessagesHeader from './MessagesHeader';
import firebase from '../../firebase';
class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messagesLoading: true,
    listeners: []
  };

  componentDidMount() {
    const { channel, user } = this.state;
    // console.log('Messages Mounted');

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  componentWillUnmount() {
    // Temporary until we add all listeners
    const { channel } = this.state;
    {
      channel != null && this.state.messagesRef.child(channel.id).off();
    }
  }

  addListeners = channelId => {
    this.addMessagelistener(channelId);
  };

  addMessagelistener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      console.log(loadedMessages);
    });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  render() {
    const { messagesRef, channel, messages, user } = this.state;
    return (
      <Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className='messages'>
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />
      </Fragment>
    );
  }
}

export default Messages;
