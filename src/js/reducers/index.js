import * as ActionTypes from "../constants/action-types";

const initialState = {
  caspioAuthToken: null,
  caspioTables: [],
  caspioViews: [],
  selectedDataSource: null,
  selectedDataSourceType: null,
  selectedDataSourceColumns: [],
  selectedDataSourceDomain: null,
  selectedDataSourceUUID: null,
  selectedDataSourceFirstName: null,
  selectedDataSourceLastName: null,
  jobRunning: false,
  emailAPIs: [{prospect:false}, {hunter:true}],
  leads: []
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.AUTHORIZE_CASPIO:
      return Object.assign({}, state, {
        caspioAuthToken: action.payload
      })
    case ActionTypes.SET_DATA_SOURCE_TABLES_CASPIO:
      return Object.assign({}, state, {
        caspioTables: action.payload
      });
    case ActionTypes.SET_DATA_SOURCE_VIEWS_CASPIO:
      return Object.assign({}, state, {
        caspioViews: action.payload
      });
    case ActionTypes.SET_DATA_SOURCE_COLUMNS_CASPIO:
      return Object.assign({}, state, {
        selectedDataSourceColumns: action.payload
      })
    case ActionTypes.SET_DATA_SOURCE_DOMAIN:
      return Object.assign({}, state, {
        selectedDataSourceDomain: action.payload
      })
    case ActionTypes.SET_DATA_SOURCE_UUID:
      return Object.assign({}, state, {
        selectedDataSourceUUID: action.payload
      })
    case ActionTypes.SET_DATA_SOURCE_FIRST_NAME:
      return Object.assign({}, state, {
        selectedDataSourceFirstName: action.payload
      })
    case ActionTypes.SET_DATA_SOURCE_LAST_NAME:
      return Object.assign({}, state, {
        selectedDataSourceLastName: action.payload
      })
    case ActionTypes.SET_JOB_RUNNING:
      return Object.assign({}, state, {
        jobRunning: action.payload
      })
    case ActionTypes.SET_DATA_SOURCE:
      return Object.assign({}, state, {
        selectedDataSource: action.payload
      })
    case ActionTypes.SET_DATA_SOURCE_TYPE:
      return Object.assign({}, state, {
        selectedDataSourceType: action.payload
      })
    case ActionTypes.SET_EMAIL_APIS:
      return Object.assign({}, state, {
        emailAPIs: action.payload
      })
      case ActionTypes.ADD_LEAD:
        return Object.assign({}, state, {
          leads: state.leads.concat(action.payload)
        })
    default:
      return state
  }
};

export default rootReducer;
