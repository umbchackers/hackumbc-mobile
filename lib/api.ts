const BASE_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL;

function createApi(accessToken: string | null) {
  async function request<T>(url: string, options: RequestInit = {}, isPublic = false): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(!isPublic && accessToken ? { 'Authorization': `${accessToken}` } : {}),
      ...options.headers,
    };

    const response = await fetch(BASE_URL + url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error:', response.status, errorBody);
      throw new Error(`API Error ${response.status}: ${errorBody}`);
    }

    const json = await response.json();
    return json as T;
  }

  return {
    get: <T>(url: string, isPublic = false) => request<T>(url, {}, isPublic),
    post: <T>(url: string, body: any, isPublic = false) => request<T>(url, { method: 'POST', body: JSON.stringify(body) }, isPublic),
    put: <T>(url: string, body: any, isPublic = false) => request<T>(url, { method: 'PUT', body: JSON.stringify(body) }, isPublic),
    del: <T>(url: string, isPublic = false) => request<T>(url, { method: 'DELETE' }, isPublic),
  };
}

export { createApi };
