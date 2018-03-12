import ElectronService from '../../services/electron';
import { actions } from './actions';

export const setSettings = payload => ( dispatch, getState ) => {

  ElectronService.saveData({
    ...getState(),
    settings: {
      ...payload,
    },
  });

  return dispatch(actions.setSettings(payload));

};

export default {
  setSettings,
};
