import Axios from 'axios'
import Constants from './Constants'

export async function authenticate() {
  console.log("Caspio authenticate")
  const caspioAuthenticationBody = "grant_type="+Constants.caspioGrantType+"&client_id="+Constants.caspioClientID+"&client_secret="+Constants.caspioClientSecret
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return await Axios.post("https://c5ebl095.caspio.com/oauth/token", caspioAuthenticationBody, config)
}

export async function requestData(accessToken, pageNumber, dataSourceType, dataSourceName) {
  console.log("Caspio requestContacts for page: "+pageNumber)
  const config = {
    headers: {
      "Authorization": accessToken
    },
    params: {
      "q" : "{pageNumber:"+pageNumber+", pageSize:"+Constants.caspioPageSize+"}"
    }
  }

   const data = await Axios.get("https://c5ebl095.caspio.com/rest/v1/"+dataSourceType+"/"+dataSourceName+"/rows" ,config)
   console.log(data)
   return data
}

export async function requestDataSources(accessToken, dataSourceType) {
  const config = {
    headers: {
      "Authorization": accessToken
    }
  }

   const dataSources = await Axios.get("https://c5ebl095.caspio.com/rest/v1/"+dataSourceType ,config)
   console.log("DataSources: ")
   console.log(dataSources)
   return dataSources
}

export async function requestDataSourceColumns(accessToken, dataSourceType, dataSourceName) {
  const config = {
    headers: {
      "Authorization": accessToken
    }
  }

   const dataSourceColumns = await Axios.get("https://c5ebl095.caspio.com/rest/v1/"+dataSourceType+"/"+dataSourceName+"/columns" ,config)
   console.log("DataSourceColumns: ")
   console.log(dataSourceColumns)
   return dataSourceColumns
}
