import className from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, TextField, Toolbar } from 'react-md';

import { connectionsOperations } from '../../modules/connections';
import { connectionShape } from '../../constants/shapes';

import './new-connection.css';

const uuidv1 = require('uuid/v1');

const NewConnectionScreen = (
  { setFocusRef,
    values,
    visible,
    onClose,
    onKeyDown,
    onSave,
    onSubmit,
    onValueChange,
  } ) => {

  const containerClass = className('app-new-connection-screen', {
    'app-new-connection-screen--visible': visible
  });

  return (
    <div className={containerClass}>
      <div className="app-new-connection-screen__content">
        <Toolbar
          themed
          actions={<Button icon onClick={onSave}>save</Button>}
          nav={<Button icon onClick={onClose}>close</Button>}
          title={values.id ? 'Edit' : 'Create' }
        />
        <div className="app-new-connection-screen__form">
          <TextField
            id="app-connection-name"
            label="Name"
            ref={setFocusRef}
            value={values.name}
            onChange={onValueChange.bind(this, 'name')}
            onKeyDown={onKeyDown}
          />
          <TextField
            id="app-connection-user"
            label="User"
            value={values.user}
            onChange={onValueChange.bind(this, 'user')}
            onKeyDown={onKeyDown}
          />
          <TextField
            id="app-connection-domain"
            label="Domain"
            placeholder="ubuntu"
            value={values.domain}
            onChange={onValueChange.bind(this, 'domain')}
            onKeyDown={onKeyDown}
          />
          <TextField
            id="app-connection-params"
            label="Params"
            value={values.params}
            onChange={onValueChange.bind(this, 'params')}
            onKeyDown={onKeyDown}
          />
          <TextField
            id="app-connection-pem-location"
            label="Pem Location"
            value={values.pemLocation}
            onChange={onValueChange.bind(this, 'pemLocation')}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

NewConnectionScreen.propTypes = {
  setFocusRef: PropTypes.func,
  values: connectionShape,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
  onSave: PropTypes.func,
  onSubmit: PropTypes.func,
  onValueChange: PropTypes.func,
};

NewConnectionScreen.defaultProps = {
  setFocusRef: ()=>{},
  values: {},
  visible: false,
  onClose: ()=>{},
  onKeyDown: ()=>{},
  onSave: ()=>{},
  onSubmit: ()=>{},
  onValueChange: ()=>{},
};

class NewConnectionScreenContainer extends Component{

  static propTypes = {
    addConnection: PropTypes.func.isRequired,
    editConnection: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    onClose: ()=>{},
    onSave: ()=>{},
  };

  constructor(props){
    super(props);

    this.state = {
      values: this.props.values || this.getDefaultConnection,
    };

    this.focusRef = null;

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.setFocusRef = this.setFocusRef.bind(this);
  }

  get getDefaultConnection(){
    return {
      name: '',
      user: 'ubuntu',
      domain: '',
      params: '',
      pemLocation: '',
    };
  }

  componentWillReceiveProps(nextProps){
    if ( this.state.values !== nextProps.values){
      this.setState(() => ({
        values: !nextProps.values ? this.getDefaultConnection : nextProps.values,
      }));
    }
    console.log('?', nextProps.visible); 
    if ( nextProps.visible ){
      setImmediate( (  ) => this.focusRef.focus());
    } else {
      this.setState(() => ({
        values: this.getDefaultConnection,
      }));
    }

  }

  handleFormSubmit(){
    if ( this.state.values.id ){
      this.props.editConnection(this.state.values);
    } else {
      this.props.addConnection({
        id: uuidv1(),
        ...this.getDefaultConnection,
        ...this.state.values
      });
    }
    this.props.onClose();
  }

  handleKeyDown(evt){
    if ( evt.which === 13 ){
      this.handleFormSubmit();
    }
  }

  handleValueChange(field, value){
    this.setState(() => ({
      values: {
        ...this.state.values,
        [field]: value
      }
    }));
  }

  setFocusRef(node){
    if ( node ){
      this.focusRef = node;
    }
  }

  render(){
    return (
      <NewConnectionScreen
        setFocusRef={this.setFocusRef}
        values={this.state.values}
        visible={this.props.visible}
        onClose={this.props.onClose}
        onKeyDown={this.handleKeyDown}
        onSave={this.handleFormSubmit}
        onValueChange={this.handleValueChange}
      />
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  ...connectionsOperations,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewConnectionScreenContainer);
