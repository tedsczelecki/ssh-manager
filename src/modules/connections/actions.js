const ADD_CONNECTION = 'app/connections/ADD_CONNECTION';
const EDIT_CONNECTION = 'app/connections/EDIT_CONNECTION';

const addConnection = payload => ({
  type: ADD_CONNECTION, payload
});

const editConnection = payload => ({
  type: EDIT_CONNECTION, payload
});

export const types = {
  ADD_CONNECTION,
  EDIT_CONNECTION,
};

export const actions = {
  addConnection,
  editConnection,
};

export default {
  types,
  actions,
};
