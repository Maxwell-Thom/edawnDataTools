import * as ActionTypes from "../constants/action-types";

export function authorizeCaspio(payload) {
  return {
    type: ActionTypes.AUTHORIZE_CASPIO,
    payload
  }
};

export function setDataSourceTablesCaspio(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE_TABLES_CASPIO,
    payload
  }
};

export function setDataSourceViewsCaspio(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE_VIEWS_CASPIO,
    payload
  }
};

export function setDataSourceColumnsCaspio(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE_COLUMNS_CASPIO,
    payload
  }
};

export function setDataSourceDomain(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE_DOMAIN,
    payload
  }
};

export function setDataSourceUUID(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE_UUID,
    payload
  }
};

export function setDataSourceFirstName(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE_FIRST_NAME,
    payload
  }
};

export function setDataSourceLastName(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE_LAST_NAME,
    payload
  }
};

export function setJobRunning(payload) {
  return {
    type: ActionTypes.SET_JOB_RUNNING,
    payload
  }
};

export function setDataSource(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE,
    payload
  }
};

export function setDataSourceType(payload) {
  return {
    type: ActionTypes.SET_DATA_SOURCE_TYPE,
    payload
  }
};
