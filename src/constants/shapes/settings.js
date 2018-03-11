import PropTypes from 'prop-types';

export const settingsShape = PropTypes.shape({
  name: PropTypes.string,
  profileImage: PropTypes.string,
  slack: PropTypes.string,
  defaultPemPath: PropTypes.string,
});