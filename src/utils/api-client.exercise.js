import * as auth from 'auth-provider'

const apiURL = process.env.REACT_APP_API_URL

function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${customConfig.token}`,
    },
    data: customConfig.data,
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      auth.logout()
      window.location.assign(window.location)
      return Promise.reject('Please re-authenticate')
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
