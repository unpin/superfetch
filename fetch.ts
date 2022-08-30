import { FetchResponse } from "./fetch-response.ts";

type METHOD = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
    return new Fetch(url, "POST");
  }

  static patch(url: string) {
    return new Fetch(url, "PATCH");
  }

  static put(url: string) {
    return new Fetch(url, "PUT");
  }

  static get(url: string) {
    return new Fetch(url, "GET");
  }

  static delete(url: string) {
    return new Fetch(url, "DELETE");
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
