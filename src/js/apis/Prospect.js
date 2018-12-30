import Axios from 'axios'
import Constants from './../constants/Constants'

export async function getProspectEmail(domain, firstName, lastName) {
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
      console.log(response)
      if (response.data.data > 0) {
        let email = response.data.data[0].attributes.value
        let confidence = response.data.data[0].attributes.confidence

        if (confidence >= 90) {
          return email
        }
      }
      return null
    })
    .catch(function(error) {
      console.log(error);
    });
}
