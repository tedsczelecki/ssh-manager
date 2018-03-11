const SET_SETTINGS = 'app/base/SET_SETTINGS';

const setSettings = payload => ({
  type: SET_SETTINGS, payload
});

export const types = {
  SET_SETTINGS,
};

export const actions = {
  setSettings,
};

export default {
  types,
  actions,
};
