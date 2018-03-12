import { actions } from './actions';
import ElectronService from '../../services/electron';

export const addConnection = payload => ( dispatch, getState ) => {
  dispatch(actions.addConnection(payload));
  setImmediate((  ) => updateSavedConnections()(dispatch, getState));
};

export const editConnection = payload => ( dispatch, getState ) => {
  dispatch(actions.editConnection(payload));
  setImmediate((  ) => updateSavedConnections()(dispatch, getState));
};

export const triggerConnection = conn => ( dispatch, getState ) => {
  console.log('HEY', conn);
  const settings = getState().settings;
  ElectronService.openConnection(conn, settings);
};

export const updateSavedConnections = () => ( dispatch, getState ) => {
  ElectronService.saveData({
    settings: { ...(getState().settings || {}) },
    connections: [ ...(getState().connections || []) ],
  });
};

export default {
  addConnection,
  editConnection,
  triggerConnection,
  updateSavedConnections,
};
