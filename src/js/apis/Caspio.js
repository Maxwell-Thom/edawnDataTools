import Axios from 'axios'
import Constants from './../constants/Constants'
import * as Actions from "./../actions/index";

export function authorize() {
  const caspioAuthenticationBody = "grant_type=" + Constants.caspioGrantType + "&client_id=" + Constants.caspioClientID + "&client_secret=" + Constants.caspioClientSecret
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return function(dispatch) {
    Axios.post("https:c5ebl095.caspio.com/oauth/token", caspioAuthenticationBody, config)
      .then(function(response) {
        let tokenType = response.data.token_type
        let accessToken = response.data.access_token
        dispatch(Actions.authorizeCaspio(tokenType + " " + accessToken));
      })
      .catch(function(error) {
        console.log(error);
      });
  }

}

export async function requestData(accessToken, pageNumber, pageSize, dataSourceType, dataSourceName) {
  const config = {
    headers: {
      "Authorization": accessToken
    },
    params: {
      "q": "{pageNumber:" + pageNumber + ", pageSize:" + pageSize + "}"
      //"q" : "{limit:"+pageNumber+"}"
    }
  }

  const data = await Axios.get("https://c5ebl095.caspio.com/rest/v1/" + dataSourceType + "/" + dataSourceName + "/rows", config)
    .then(function(response) {
      return response
    })
    .catch(function(error) {
      console.log(error);
    });
  return data
}

export function requestDataSources(accessToken, dataSourceType) {
  const config = {
    headers: {
      "Authorization": accessToken
    }
  }

  return (dispatch) => {
    Axios.get("https://c5ebl095.caspio.com/rest/v1/" + dataSourceType, config)
      .then(function(response) {
        if (dataSourceType === Constants.dataSourceEnum.tables) {
          dispatch(Actions.setDataSourceTablesCaspio(response.data.Result));
        } else {
          dispatch(Actions.setDataSourceViewsCaspio(response.data.Result));
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

export function requestDataSourceColumns(accessToken, dataSourceType, dataSourceName) {
  const config = {
    headers: {
      "Authorization": accessToken
    }
  }

  return function(dispatch) {
    if (dataSourceType === Constants.dataSourceEnum.tables) {
      Axios.get("https://c5ebl095.caspio.com/rest/v1/" + dataSourceType + "/" + dataSourceName + "/columns", config)
        .then(function(response) {
          var result = []
          for (var i = 0; i < response.data.Result.length; i++) {
            result[i] = response.data.Result[i].Name;
          }
          dispatch(Actions.setDataSourceColumnsCaspio(result));
        })
        .catch(function(error) {
          console.log(error);
        });
    } else if (dataSourceType === Constants.dataSourceEnum.views) {
      requestData(accessToken, 1, 5, dataSourceType, dataSourceName)
        .then(function(response) {
          dispatch(Actions.setDataSourceColumnsCaspio(Object.keys(response.data.Result[0])))
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
}

export function postCaspioRow(accessToken, dataSourceType, dataSourceName, lead, firstNameColumn, lastNameColumn, uuidColumn, domainColumn, emailColumn) {

  let data = {
    "people_first_name": lead.firstName,
    "people_last_name": lead.lastName,
    "people_uuid": lead.uuid,
    "organizations_domain": lead.domain,
  }

  const config = {
    headers: {
      "Authorization": accessToken
    }
  }
  let url = 'https://c5ebl095.caspio.com/rest/v1/'+dataSourceType+'/'+dataSourceName+'/rows'
  //let url = 'https://c5ebl095.caspio.com/rest/v1/'+dataSourceType+'/'+dataSourceName+'/rows?q={"where":"people_uuid='+lead.uuid+'"}'
  Axios.post(url, data, config)
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error);
    });
}
