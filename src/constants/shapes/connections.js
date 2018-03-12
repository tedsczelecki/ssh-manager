import PropTypes from 'prop-types';

export const connectionShape = PropTypes.shape({
  name: PropTypes.string,
  team: PropTypes.string,
  domain: PropTypes.string,
  params: PropTypes.string,
  pemLocation: PropTypes.string,
});

export const connectionListShape = PropTypes.arrayOf(connectionShape);
