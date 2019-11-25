import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import { connect } from 'react-redux';

import './App.css';

const App = ({ currentUser, currentChannel }) => (
  <Grid columns='equal' className='app' style={{ background: '#eee' }}>
    <ColorPanel />
    <SidePanel currentUser={currentUser} key={currentUser && currentUser.id} />
    <GridColumn style={{ marginLeft: 320 }}>
      <Messages
        currentChannel={currentChannel}
        key={currentChannel && currentChannel.id}
        currentUser={currentUser}
      />
    </GridColumn>
    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
});

export default connect(mapStateToProps)(App);
