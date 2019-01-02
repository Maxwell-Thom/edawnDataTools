import Axios from 'axios'
import Constants from './../constants/Constants'

export async function getHunterEmail(domain, firstName, lastName) {
  const config = {
    params: {
      "domain": domain,
      "first_name": firstName,
      "last_name": lastName,
      "api_key": Constants.hunterSecretKey
    }
  }

  return await Axios.get("https://api.hunter.io/v2/email-finder?", config)
    .then(function(response) {
      if (response.data.data) {
        let email = response.data.data.email
        let confidence = response.data.data.score

        if (confidence >= 90) {
          return email
        }
      }
      return null
    })
    .catch(function(error) {
      //console.log(error);
      return null
    });
}
