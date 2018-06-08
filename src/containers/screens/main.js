import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Paper } from 'react-md';

import { ConnectionList } from '../connection';
import { connectionListShape } from '../../constants/shapes';
import { connectionsOperations } from '../../modules/connections';

const MainScreen = (
  { connections,
    onClick,
    onConnectionEdit,
    onConnectionDelete,
  } ) => (
  <div className="app-screen__main">
    { connections.length === 0 ? (
      <div className="app-screen__main__no-results">
        No connections
      </div>
    ) : (
      <div className="app-screen__main__list">
        <span className="app-paper-title">Connections</span>
        <Paper>
          <ConnectionList
            onDelete={onConnectionDelete}
            onEdit={onConnectionEdit}
            onItemClick={onClick}
            list={connections}
          />
        </Paper>
      </div>
    )}
  </div>
);

MainScreen.propTypes = {
  connections: connectionListShape,
  onClick: PropTypes.func,
  onConnectionEdit: PropTypes.func,
  onConnectionDelete: PropTypes.func,
};

MainScreen.defaultProps = {
  connections: [],
  onClick: ()=>{},
  onConnectionEdit: ()=>{},
  onConnectionDelete: ()=>{},
};

class MainScreenContainer extends Component{

  static propTypes = {
    connections: connectionListShape,
    onConnectionDelete: PropTypes.func,
    onConnectionEdit: PropTypes.func,
  };

  static defaultProps = {
    connections: [],
    onConnectionDelete: ()=>{},
    onConnectionEdit: ()=>{},
  };

  render(){
    return (
      <MainScreen
        connections={this.props.connections}
        onClick={this.props.triggerConnection}
        onConnectionDelete={this.props.onConnectionDelete}
        onConnectionEdit={this.props.onConnectionEdit}
      />
    );
  }
}

const mapStateToProps = state => ({
    connections: state.connections,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  ...connectionsOperations,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainScreenContainer);
