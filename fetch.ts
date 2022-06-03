import { FetchResponse } from "./fetch-response.ts";

enum METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

enum CONTENT_TYPE {
  TEXT = "text/plain",
  JSON = "application/json",
}

export class Fetch {
  #url: string;
  #method: METHOD;
  #headers: Record<string, string>;

  constructor(url: string, method: METHOD) {
    this.#url = url;
    this.#method = method;
    this.#headers = Object.create(null);
  }

  static post(url: string) {
    return new Fetch(url, METHOD.POST);
  }

  static patch(url: string) {
    return new Fetch(url, METHOD.PATCH);
  }

  static put(url: string) {
    return new Fetch(url, METHOD.PUT);
  }

  static get(url: string) {
    return new Fetch(url, METHOD.GET);
  }

  static delete(url: string) {
    return new Fetch(url, METHOD.DELETE);
  }

  set(key: string, value: string) {
    this.#headers[key] = value;
    return this;
  }

  end() {
    return this.send(null);
  }

  setContentType(data?: unknown) {
    if (typeof data === "string") {
      this.#headers["Content-Type"] = CONTENT_TYPE.TEXT;
    } else if (typeof data === "object") {
      this.#headers["Content-Type"] = CONTENT_TYPE.JSON;
    }
  }

  async send(data: unknown) {
    this.setContentType(data);
    const res = await fetch(this.#url, {
      method: this.#method,
      headers: this.#headers,
      body: data ? JSON.stringify(data) : null,
    });
    return new FetchResponse(res);
  }
}
