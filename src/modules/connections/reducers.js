import { types } from './actions';

const initialState = [];

const timerReducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case types.ADD_CONNECTION:
      return [
        ...state,
        action.payload,
      ];
    case types.EDIT_CONNECTION:
      const i = state.findIndex(( item ) => item.id === action.payload.id );
      if ( i === -1 ){
        return [...state];
      } else {
        return [
          ...state.slice(0, i),
          action.payload,
          ...state.slice(i + 1),
        ];
      }
    default:
      return state;
  }
};

export default timerReducer;
