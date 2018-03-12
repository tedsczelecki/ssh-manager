import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  FontIcon,
  List,
  ListItem,
  MenuButton,
  Subheader
} from 'react-md';

import { connectionListShape } from '../../constants/shapes';

const ConnectionListMenu = ( { onDelete, onEdit } ) => (
  <MenuButton
    icon
    className="app-connection-list__menu"
    id="menu-button-2"
    menuItems={[
      <ListItem key={0} primaryText="Edit" onClick={onEdit} />,
      <ListItem key={1} primaryText="Delete" onClick={onDelete} />,
    ]}
    anchor={{
      x: MenuButton.HorizontalAnchors.LEFT,
      y: MenuButton.VerticalAnchors.TOP,
    }}
  >
    more_vert
  </MenuButton>
);

ConnectionListMenu.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

ConnectionListMenu.defaultProps = {
  onDelete: ()=>{},
  onEdit: ()=>{},
};

const ConnectionList = (
  { list,
    onDelete,
    onEdit,
    onItemClick
  } ) => (
    <List className="app-connection-list">
      { list.map(( conn, i ) => (
        <ListItem
          rightIcon={
            <Button
              icon
              primary
              className="app-connection-list__trigger"
              onClick={onItemClick.bind(this, conn)}
            >
              open_in_new
            </Button>
          }
          leftIcon={
            <ConnectionListMenu
              onDelete={onDelete.bind(this, conn)}
              onEdit={onEdit.bind(this, conn)}
            />
          }
          key={i}
          primaryText={conn.name}
          secondaryText={conn.team || null}
        />
      ))}
    </List>
);

ConnectionList.propTypes = {
  list: connectionListShape,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onItemClick: PropTypes.func,
};

ConnectionList.defaultProps = {
  list: [],
  onDelete: ()=>{},
  onEdit: ()=>{},
  onItemClick: ()=>{},
};

export default ConnectionList;
