import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Drawer, Toolbar } from 'react-md';

import { connectionShape } from '../../constants/shapes';
import {
  MainScreen,
  NewConnectionScreen,
  SettingsScreen
} from '../screens';

import './app.css';

const SettingsMenu = ( { onClick } ) => (
  <Button
    icon
    primary
    onClick={onClick}
  >
    settings
  </Button>
);

SettingsMenu.propTypes = {
  onClick: PropTypes.func,
};

SettingsMenu.defaultProps = {
  onClick: ()=>{},
};

const App = (
  { activeConnection,
    connectionScreenVisible,
    settingsVisible,
    onSettingsSave,
    onConnectionDelete,
    onConnectionEdit,
    onToggleNewConnection,
    onToggleSettings
  } ) => {
  return (
    <div className="app-wrapper">
      <Toolbar
        colored
        actions={
          <SettingsMenu
            className="app-toolbar__sessions-btn"
            onClick={onToggleSettings.bind(this, true)}
          />
        }
        className="app-toolbar"
      />
      <MainScreen
        onConnectionDelete={onConnectionDelete}
        onConnectionEdit={onConnectionEdit}
      />

      <Button
        primary
        floating
        className="app-wrapper__add-connection-btn"
        onClick={onToggleNewConnection.bind(this, true)}
      >
        add
      </Button>

      <Drawer
        header={null}
        id="app-settings-view"
        position="right"
        visible={settingsVisible}
        onVisibilityChange={onToggleSettings}
      >
        <SettingsScreen
          onClose={onToggleSettings.bind(this, false)}
          onSave={onSettingsSave}
        />
      </Drawer>
      <NewConnectionScreen
        values={activeConnection}
        visible={connectionScreenVisible}
        onClose={onToggleNewConnection.bind(this, false)}
        onSave={onSettingsSave}
      />
    </div>
  );
};

App.propTypes = {
  activeConnection: connectionShape,
  connectionScreenVisible: PropTypes.bool,
  settingsVisible: PropTypes.bool,
  onConnectionDelete: PropTypes.func,
  onConnectionEdit: PropTypes.func,
  onToggleNewConnection: PropTypes.func,
  onToggleSettings: PropTypes.func,
};

App.defaultProps = {
  activeConnection: null,
  connectionScreenVisible: false,
  settingsVisible: false,
  onConnectionDelete: ()=>{},
  onConnectionEdit: ()=>{},
  onToggleNewConnection: ()=>{},
  onToggleSettings: ()=>{},
}

class AppContainer extends Component {

  static propTypes = {
  };

  constructor(props){
    super(props);

    this.state = {
      activeConnection: null,
      connectionScreenVisible: false,
      settingsVisible: false,
    };

    this.handleToggleSettings = this.handleToggleSettings.bind(this);
    this.handleToggleNewConnection = this.handleToggleNewConnection.bind(this);
    this.handleConnectionEdit = this.handleConnectionEdit.bind(this);
    this.handleConnectionDelete = this.handleConnectionDelete.bind(this);
  }

  handleConnectionEdit(conn){
    this.setState(() => ({
      activeConnection: conn,
      connectionScreenVisible: true,
    }));
  }

  handleConnectionDelete(conn){
    console.log('DELETE', conn);
  }

  handleToggleNewConnection(visibility = false){
    this.setState(() => ({
      connectionScreenVisible: visibility,
      activeConnection: visibility ? this.state.activeConnection : null,
    }));
  }

  handleToggleSettings(visibility = false){
    this.setState(() => ({
      settingsVisible: visibility,
    }));
  }

  render() {
    return (
      <App
        activeConnection={this.state.activeConnection}
        connectionScreenVisible={this.state.connectionScreenVisible}
        settingsVisible={this.state.settingsVisible}
        onConnectionEdit={this.handleConnectionEdit}
        onConnectionDelete={this.handleConnectionDelete}
        onToggleNewConnection={this.handleToggleNewConnection}
        onToggleSettings={this.handleToggleSettings}
      />
    );
  }
}

export default AppContainer;
