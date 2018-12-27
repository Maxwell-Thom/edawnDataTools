import Axios from 'axios'
import Constants from './../constants/Constants'
import * as Actions from "./../actions/index";

export function authorize() {
  console.log("Caspio authenticate")
  const caspioAuthenticationBody = "grant_type="+Constants.caspioGrantType+"&client_id="+Constants.caspioClientID+"&client_secret="+Constants.caspioClientSecret
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return function(dispatch) {
    Axios.post("https:c5ebl095.caspio.com/oauth/token", caspioAuthenticationBody, config)
      .then(function (response) {
        let tokenType = response.data.token_type
        let accessToken = response.data.access_token
        dispatch(Actions.authorizeCaspio(tokenType+" "+accessToken));
      })
      .catch(function (error) {
        console.log(error);
      });
    }

}

export async function requestData(accessToken, pageNumber, pageSize, dataSourceType, dataSourceName) {
  console.log("requestData "+pageNumber+" "+pageSize+" "+dataSourceType+" "+dataSourceName)
  const config = {
    headers: {
      "Authorization": accessToken
    },
    params: {
      "q" : "{pageNumber:"+pageNumber+", pageSize:"+pageSize+"}"
      //"q" : "{limit:"+pageNumber+"}"
    }
  }

   const data = await Axios.get("https://c5ebl095.caspio.com/rest/v1/"+dataSourceType+"/"+dataSourceName+"/rows" ,config)
     .then(function (response) {
        return response
     })
     .catch(function (error) {
       console.log(error);
     });
   return data
}

export function requestDataSources(accessToken, dataSourceType) {
  console.log("requestDataSources "+dataSourceType)
  console.log("accessToken "+accessToken)
  const config = {
    headers: {
      "Authorization": accessToken
    }
  }

  return (dispatch) => {
    Axios.get("https://c5ebl095.caspio.com/rest/v1/"+dataSourceType ,config)
      .then(function (response) {
        if (dataSourceType === Constants.dataSourceEnum.table) {
          dispatch(Actions.setDataSourceTablesCaspio(response.data.Result));
        } else {
          dispatch(Actions.setDataSourceViewsCaspio(response.data.Result));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
}

export async function requestDataSourceColumns(accessToken, dataSourceType, dataSourceName) {
  console.log("requestDataSourceColumns "+dataSourceType+" "+dataSourceName)
  const config = {
    headers: {
      "Authorization": accessToken
    }
  }

  if (dataSourceType === Constants.dataSourceEnum.table) {
    const dataSourceColumns = await Axios.get("https://c5ebl095.caspio.com/rest/v1/"+dataSourceType+"/"+dataSourceName+"/columns" ,config)
      .then(function (response) {
        return response.data.Result
      })
      .catch(function (error) {
        console.log(error);
      });
     return dataSourceColumns
   } else {
     const dataSourceColumns = await requestData(accessToken, 1, 5, dataSourceType, dataSourceName)
       .then(function (response) {
         return Object.keys(response.data.Result[0])
       })
       .catch(function (error) {
         console.log(error);
       });
     return dataSourceColumns
   }
}
