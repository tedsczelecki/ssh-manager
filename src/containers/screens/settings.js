import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, TextField, Toolbar } from 'react-md';

import { settingsOperations } from '../../modules/settings';
import { settingsShape } from '../../constants/shapes';

const SettingsHeader = ({ onClose, onSave }) => (
  <Toolbar
    themed
    actions={<Button icon onClick={onSave}>save</Button>}
    nav={<Button icon onClick={onClose}>arrow_back</Button>}
    title="Settings"
  />
);

SettingsHeader.propTypes = {
  onClose: PropTypes.func,
};

SettingsHeader.defaultProps = {
  onClose: ()=>{},
};

const SettingsScreen = (
  { values,
    onChange,
    onClose,
    onSave,
  } ) => (
  <div className="app-settings-screen">
    <SettingsHeader
      onClose={onClose}
      onSave={onSave}
    />
    <div className="app-settings-screen__form">
      <TextField
        id="app-settings-name"
        label="Name"
        value={values.name}
        onChange={onChange.bind(this, 'name')}
      />
      <TextField
        id="app-settings-profile-image"
        label="Profile Image"
        value={values.profileImage}
        onChange={onChange.bind(this, 'profileImage')}
      />
      <TextField
        id="app-settings-slack-id"
        label="Slack ID"
        value={values.slackId}
        onChange={onChange.bind(this, 'slackId')}
      />
      <TextField
        id="app-settings-default-ssh-path"
        label="Default SSH Path"
        value={values.defaultPemPath}
        onChange={onChange.bind(this, 'defaultPemPath')}
      />
    </div>
  </div>
);

SettingsScreen.propTypes = {
  values: settingsShape,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

SettingsScreen.defaultProps = {
  values: {},
  onChange: ()=>{},
  onClose: ()=>{},
  onSave: () => {},
};

class SettingsScreenContainer extends Component{

  static propTypes = {
    settings: settingsShape,
    setSettings: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    settings: {},
    onClose: ()=>{},
  };

  constructor(props){
    super(props);

    this.state = {
      settings: this.props.settings,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if ( this.state.settings !== nextProps.settings ){
      this.setState(() => ({
        settings: nextProps.settings,
      }));
    }
  }

  handleChange(field, value){
    this.setState(() => ({
      settings:{
        ...this.state.settings,
        [field]: value,
      }
    }));
  }

  render(){
    const { settings } = this.state;
    return (
      <SettingsScreen
        values={this.state.settings}
        onChange={this.handleChange}
        onClose={this.props.onClose}
        onSave={this.props.setSettings.bind(this, settings)}
      />
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  ...settingsOperations,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreenContainer);
