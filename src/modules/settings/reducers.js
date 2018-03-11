import ElectronService from '../../services/electron';
import { types } from './actions';

console.log(ElectronService.os);
const initialState = {
  name: ElectronService.os.hostname(),
  profileImage: '',
  slackId: '',
  defaultPemPath: '',
};

const timerReducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case types.SET_SETTINGS:
      console.log(action.payload);
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default timerReducer;
