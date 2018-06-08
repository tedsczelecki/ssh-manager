import classNames from 'classnames';
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
    getContentRef,
    settingsVisible,
    showAddButton,
    onConnectionDelete,
    onConnectionEdit,
    onSettingsSave,
    onToggleNewConnection,
    onToggleSettings
  } ) => {
  const addButtonClasses = classNames('app-wrapper__add-connection-btn', {
    'app-wrapper__add-connection-btn--visible': showAddButton,
  });
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
        className="app-toolbar app-wrapper__header"
      />
      <div ref={(node) => getContentRef(node)} className="app-wrapper__content">
        <MainScreen
          onConnectionDelete={onConnectionDelete}
          onConnectionEdit={onConnectionEdit}
        />
        <Button
          primary
          floating
          className={addButtonClasses}
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
    </div>
  );
};

App.propTypes = {
  activeConnection: connectionShape,
  connectionScreenVisible: PropTypes.bool,
  getContentRef: PropTypes.func,
  settingsVisible: PropTypes.bool,
  onConnectionDelete: PropTypes.func,
  onConnectionEdit: PropTypes.func,
  onToggleNewConnection: PropTypes.func,
  onToggleSettings: PropTypes.func,
};

App.defaultProps = {
  activeConnection: null,
  connectionScreenVisible: false,
  getContentRef: ()=>{},
  settingsVisible: false,
  showAddButton: true,
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

    this.contentRef = null;

    this.state = {
      activeConnection: null,
      connectionScreenVisible: false,
      settingsVisible: false,
      showAddButton: true,
    };

    this.handleConnectionDelete = this.handleConnectionDelete.bind(this);
    this.handleConnectionEdit = this.handleConnectionEdit.bind(this);
    this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
    this.handleGetContentRef = this.handleGetContentRef.bind(this);
    this.handleToggleNewConnection = this.handleToggleNewConnection.bind(this);
    this.handleToggleSettings = this.handleToggleSettings.bind(this);
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleDocumentScroll);
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

  handleDocumentScroll(){
    const showAddButton =
      this.contentRef.scrollTop <=
      (this.contentRef.scrollHeight - this.contentRef.offsetHeight - 20 );
    if ( showAddButton !== this.state.showAddButton ){
      this.setState(() => ({
        showAddButton,
      }))
    }
  }

  handleGetContentRef(node){
    if ( node && !this.contentRef ){
      this.contentRef = node;
      this.contentRef.addEventListener('scroll', this.handleDocumentScroll);
    }
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
        getContentRef={this.handleGetContentRef}
        settingsVisible={this.state.settingsVisible}
        showAddButton={this.state.showAddButton}
        onConnectionEdit={this.handleConnectionEdit}
        onConnectionDelete={this.handleConnectionDelete}
        onToggleNewConnection={this.handleToggleNewConnection}
        onToggleSettings={this.handleToggleSettings}
      />
    );
  }
}

export default AppContainer;
