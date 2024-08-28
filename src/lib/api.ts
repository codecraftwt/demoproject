type endpoint = string
type headerOptions = {
  Authorization: string
  'Content-Type': string
}

class ApiClass {
  apiUrl: string | undefined
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL
  }

  async get(endpoint: string, auth?: any, params?: any) {
    const url = new URL(`${this.apiUrl}/${endpoint}`)

    // Append query parameters to the URL if any
    if (params) {
      Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key])
      )
    }

    const headers = this._composeHeaders(auth)
    const response = await fetch(url.toString(), {
      headers: headers,
    })
    if (!response.ok) {
      throw new Error('Bad Response')
    }
    const responseData = await response.json()
    return responseData
  }

  async post(endpoint: endpoint, payload: any, auth?: any) {
    const url: string = `${this.apiUrl}/${endpoint}`
    const headers: headerOptions = this._composeHeaders(auth)
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Bad Response: ${await this._responseErrorHandler(errorResponse)}`
      )
    }
    const responseData = await response.json()
    return responseData
  }

  async put(endpoint: endpoint, payload: any, auth?: any) {
    const url: string = `${this.apiUrl}/${endpoint}`
    const headers: headerOptions = this._composeHeaders(auth)
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: payload ? JSON.stringify(payload) : null,
    })
    if (!response.ok) {
      throw new Error('Bad Response')
    }
    const responseData = await response.json()
    return responseData
  }

  async patch(endpoint: endpoint, payload: any, auth?: any) {
    const url: string = `${this.apiUrl}/${endpoint}`
    const headers: headerOptions = this._composeHeaders(auth)
    const response = await fetch(url, {
      method: 'PATCH',
      headers: headers,
      body: payload ? JSON.stringify(payload) : null,
    })
    if (!response.ok) {
      throw new Error('Bad Response')
    }
    const responseData = await response.json()
    return responseData
  }

  async delete(endpoint: endpoint, auth?: any) {
    const url: string = `${this.apiUrl}/${endpoint}`
    const headers: headerOptions = this._composeHeaders(auth)
    const response = await fetch(url, {
      method: 'DELETE',
      headers: headers,
    })
    if (!response.ok) {
      throw new Error('Bad Response')
    }
    const responseData = await response.json()
    return responseData
  }

  async upload(
    endpoint: endpoint,
    payload: any,
    auth?: any,
    method: 'POST' | 'PUT' = 'POST'
  ) {
    const url: string = `${this.apiUrl}/${endpoint}`
    const headers: any = this._composeUploadHeaders(auth)
    try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: payload,
      })
      if (!response.ok) {
        const errorResponse = await response.json()
        const errorMessage = await this._responseErrorHandler(errorResponse)
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        )
      }
      const responseData = await response.json()
      return responseData
    } catch (error) {
      if (error instanceof Error) {
        // If it's an error we threw above
        throw error
      } else {
        // If it's an error from fetch itself
        throw new Error(`Network error: ${error}`)
      }
    }
  }

  _composeHeaders(authToken?: string): headerOptions {
    return {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    }
  }

  _composeUploadHeaders(authToken?: string): any {
    return {
      Authorization: `Bearer ${authToken}`,
      //'Content-Type': 'multipart/form-data',
    }
  }

  async _responseErrorHandler(response: any) {
    // if the response has a status or status text return it.
    // else return a generic error
    if (response.status && response.statusText && response.status !== 500) {
      // if the status is 500 return a generic error
      if (response.message) {
        return `${response.statusText} - ${response.message}`
      }
      return `${response.statusText}`
    } else {
      if (response.message) {
        return `${response.message}`
      }
      return 'Unexpected Error'
    }
  }
}

const Api = new ApiClass()
export default Api
