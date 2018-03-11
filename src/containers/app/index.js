import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Drawer, FontIcon, Toolbar } from 'react-md';

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
  { settingsVisible,
    onSettingsSave,
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
        title="Connections"
      />
      <MainScreen />

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
    </div>
  );
};

App.propTypes = {
  settingsVisible: PropTypes.bool,
  onToggleSettings: PropTypes.func,
};

App.defaultProps = {
  settingsVisible: false,
  onToggleSettings: ()=>{},
}

class AppContainer extends Component {

  static propTypes = {
  };

  constructor(props){
    super(props);

    this.state = {
      settingsVisible: false,
    };

    this.handleToggleSettings = this.handleToggleSettings.bind(this);
  }

  handleToggleSettings(visibility = false){
    this.setState(() => ({
      settingsVisible: visibility,
    }));
  }

  render() {
    return (
      <App
        settingsVisible={this.state.settingsVisible}
        onToggleSettings={this.handleToggleSettings}
      />
    );
  }
}

export default AppContainer;
