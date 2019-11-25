import React, { Component, Fragment } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';

export class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    activeChannel: '',
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modal: false,
    firstLoad: true
  };

  componentDidMount() {
    this.addListeners();
  }

  // add all listeners
  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      // console.log(loadedChannels);
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      // console.log(this.state.channels);
    });
  };

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  // change channel state globally
  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  // sets the channel to be active
  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  // sets inital channel to first channel
  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      const firstChannel = this.state.channels[0];
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  // handles any input changes to reflect in state
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // close the channel add modal
  closeModal = () => {
    this.setState({ modal: false });
  };

  // close the channel add modal
  openModal = () => {
    this.setState({ modal: true });
  };

  // adds a channel to the state
  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;
    const key = channelsRef.push().key;

    // construct the new DB insertion
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      creadtedBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    // Add to DB
    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: '' });
        this.closeModal();
        console.log('channel added');
      })
      .catch(err => {
        console.log(err);
      });
  };

  // submission of a new channel
  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  // checks if modal fields are non-empty
  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  // displays all channels
  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => {
          this.changeChannel(channel);
        }}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  render() {
    const { channels, modal } = this.state;

    return (
      <Fragment>
        <Menu.Menu style={{ paddingBotton: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name='exchange' /> CHANNELS
            </span>{' '}
            ({channels.length}) <Icon name='add' onClick={this.openModal} />
          </Menu.Item>
        </Menu.Menu>

        {/* Display all active channels */}
        {this.displayChannels(channels)}

        {/* Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header> Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              {/* Name of new channel */}
              <Form.Field>
                <Input
                  fluid
                  label='Name of Channel'
                  name='channelName'
                  onChange={this.handleChange}
                ></Input>
              </Form.Field>

              {/* Description of new channel */}
              <Form.Field>
                <Input
                  fluid
                  label='About the Channel'
                  name='channelDetails'
                  onChange={this.handleChange}
                ></Input>
              </Form.Field>
            </Form>
          </Modal.Content>

          {/* Modal Buttons */}
          <Modal.Actions>
            <Button color='green' inverted onClick={this.handleSubmit}>
              <Icon name='checkmark' /> Add
            </Button>
            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel })(Channels);
