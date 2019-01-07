import Axios from 'axios'
import Constants from './../constants/Constants'

export async function getProspectEmail(domain, firstName, lastName, tolerance) {
  const config = {
    headers: {
      "Authorization": Constants.prospectSecretKey,
    },
    params: {
      "domain": domain,
      "first_name": firstName,
      "last_name": lastName
    }
  }

  return await Axios.get("https://api.prospect.io/public/v1/emails/search?", config)
    .then(function(response) {
      if (response.data.data.length > 0) {
        let email = response.data.data[0].attributes.value
        let confidence = response.data.data[0].attributes.confidence
        if (confidence >= tolerance) {
          return email
        }
      }
      return null
    })
    .catch(function(error) {
      console.log(error);
      return null
    });
}
