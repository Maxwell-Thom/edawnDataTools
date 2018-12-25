import * as ActionTypes from "../constants/action-types";

const initialState = {
  caspioAuthToken: null,
  caspioTables: [],
  caspioViews: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.AUTHORIZE_CASPIO:
      return Object.assign({}, state, {
        caspioAuthToken: action.payload
      })
    // case ActionTypes.GET_DATA_CASPIO:
    //   return Object.assign({}, state, {
    //     caspioAuthToken: action.payload
    //   })
    case ActionTypes.SET_DATA_SOURCE_TABLES_CASPIO:
      return Object.assign({}, state, {
        caspioTables: action.payload
      });
    case ActionTypes.SET_DATA_SOURCE_VIEWS_CASPIO:
      return Object.assign({}, state, {
        caspioViews: action.payload
      });
    // case ActionTypes.GET_DATA_SOURCE_COLUMNS_CASPIO:
    //   return Object.assign({}, state, {
    //     caspioAuthToken: action.payload
    //   })
    default:
      return state
  }
};

export default rootReducer;
