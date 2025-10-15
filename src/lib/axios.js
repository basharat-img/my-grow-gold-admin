const isFormData = (value) => typeof FormData !== "undefined" && value instanceof FormData;

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(onFulfilled, onRejected) {
    this.handlers.push({ onFulfilled, onRejected });
    return this.handlers.length - 1;
  }
}

const mergeHeaders = (base, override) => {
  const headers = new Headers();
  if (base) {
    Object.entries(base).forEach(([key, value]) => {
      if (typeof value !== "undefined") {
        headers.set(key, value);
      }
    });
  }
  if (override) {
    Object.entries(override).forEach(([key, value]) => {
      if (typeof value !== "undefined") {
        headers.set(key, value);
      }
    });
  }
  return headers;
};

class AxiosLikeInstance {
  constructor(defaults = {}) {
    this.defaults = {
      baseURL: "",
      headers: {},
      ...defaults,
    };
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  async request(config) {
    let requestConfig = {
      ...this.defaults,
      ...config,
      headers: { ...this.defaults.headers, ...(config?.headers ?? {}) },
    };

    for (const { onFulfilled, onRejected } of this.interceptors.request.handlers) {
      try {
        if (typeof onFulfilled === "function") {
          const result = await onFulfilled(requestConfig);
          if (result) {
            requestConfig = result;
          }
        }
      } catch (error) {
        if (typeof onRejected === "function") {
          const maybeConfig = await onRejected(error);
          if (maybeConfig) {
            requestConfig = maybeConfig;
            continue;
          }
        }
        throw error;
      }
    }

    const { baseURL, url, data, method = "get", headers } = requestConfig;
    if (!url) {
      throw new Error("Request URL is required");
    }

    const finalUrl = baseURL ? new URL(url, baseURL).toString() : url;

    const init = {
      method: method.toUpperCase(),
      headers: mergeHeaders(undefined, headers),
    };

    if (typeof data !== "undefined") {
      if (isFormData(data)) {
        init.body = data;
      } else if (typeof data === "string" || data instanceof Blob) {
        init.body = data;
      } else {
        init.body = JSON.stringify(data);
        if (!init.headers.has("Content-Type")) {
          init.headers.set("Content-Type", "application/json");
        }
      }
    }

    let fetchResponse;
    try {
      fetchResponse = await fetch(finalUrl, init);
    } catch (networkError) {
      await this.#runResponseErrorInterceptors(networkError);
      throw networkError;
    }

    const responseHeaders = {};
    fetchResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let parsedData;
    const contentType = fetchResponse.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      parsedData = await fetchResponse.json().catch(() => null);
    } else {
      parsedData = await fetchResponse.text().catch(() => null);
    }

    const axiosResponse = {
      data: parsedData,
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: responseHeaders,
      config: requestConfig,
    };

    if (!fetchResponse.ok) {
      const error = new Error("Request failed with status code " + fetchResponse.status);
      error.config = requestConfig;
      error.response = axiosResponse;
      error.status = fetchResponse.status;
      await this.#runResponseErrorInterceptors(error);
      throw error;
    }

    return this.#runResponseSuccessInterceptors(axiosResponse);
  }

  async #runResponseSuccessInterceptors(response) {
    let current = response;
    for (const { onFulfilled } of this.interceptors.response.handlers) {
      if (typeof onFulfilled === "function") {
        current = await onFulfilled(current);
      }
    }
    return current;
  }

  async #runResponseErrorInterceptors(error) {
    let currentError = error;
    for (const { onRejected } of this.interceptors.response.handlers) {
      if (typeof onRejected === "function") {
        try {
          return await onRejected(currentError);
        } catch (nextError) {
          currentError = nextError;
        }
      }
    }
    return Promise.reject(currentError);
  }

  get(url, config) {
    return this.request({ ...config, method: "get", url });
  }

  post(url, data, config) {
    return this.request({ ...config, method: "post", url, data });
  }

  put(url, data, config) {
    return this.request({ ...config, method: "put", url, data });
  }

  patch(url, data, config) {
    return this.request({ ...config, method: "patch", url, data });
  }

  delete(url, config) {
    return this.request({ ...config, method: "delete", url });
  }
}

const axios = {
  create(defaults) {
    return new AxiosLikeInstance(defaults);
  },
};

export default axios;
