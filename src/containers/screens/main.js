import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'react-md';

import ElectronService from '../../services/electron';

const MainScreen = ( { onClick } ) => (
  <div className="app-screen__main">
    <Button
      raised
      primary
      onClick={onClick}
    >
      Open Terminal
    </Button>
  </div>
);

MainScreen.propTypes = {
  onClick: PropTypes.func,
};

MainScreen.defaultProps = {
  onClick: ()=>{},
};

class MainScreenContainer extends Component{

  constructor(props){
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    ElectronService.openConnection();
  }

  render(){
    return (
      <MainScreen onClick={this.handleClick} />
    );
  }
}

const mapStateToProps = state => ({
  
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainScreenContainer);
