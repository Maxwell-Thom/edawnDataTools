import * as ActionTypes from "../constants/action-types";

export function authorizeCaspio(payload) {
  return { type: ActionTypes.AUTHORIZE_CASPIO, payload }
};

export function getDataCaspio(payload) {
  return { type: ActionTypes.GET_DATA_CASPIO, payload }
};

export function setDataSourceTablesCaspio(payload) {
  return { type: ActionTypes.SET_DATA_SOURCE_TABLES_CASPIO, payload }
};

export function setDataSourceViewsCaspio(payload) {
  return { type: ActionTypes.SET_DATA_SOURCE_VIEWS_CASPIO, payload }
};

export function getDataSourceColumnsCaspio(payload) {
  return { type: ActionTypes.GET_DATA_SOURCE_COLUMNS_CASPIO, payload }
};
