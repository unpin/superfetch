import { assertEquals, AssertionError } from "./deps.ts";

export class FetchResponse {
  #response: Response;
  #bodyAccessed = false;

  constructor(response: Response) {
    this.#response = response;
  }

  get body() {
    this.#bodyAccessed = true;
    return this.#response.body;
  }

  get json() {
    this.#bodyAccessed = true;
    return this.#response.json();
  }

  get text() {
    this.#bodyAccessed = true;
    return this.#response.text();
  }

  close() {
    if (!this.#bodyAccessed) {
      this.#response.body?.cancel();
    }
    return this;
  }

  expect(statusCode: number): FetchResponse;
  expect(header: string, value: string): FetchResponse;
  expect(header: string, regex: RegExp): FetchResponse;
  expect(k: unknown, v?: unknown): FetchResponse {
    try {
      const { status, headers } = this.#response;
      if (typeof k === "number") {
        assertEquals(status, k, "Status code does not match");
      } else if (typeof k === "string") {
        const value = headers.get(k);
        if (!value) throw new AssertionError(`"${k}" header is not provided`);
        if (typeof v === "string") {
          assertEquals(value, v, "String does not match");
        } else if (v instanceof RegExp) {
          assertEquals(v.test(value), true, "Regex does not match");
        }
      }
      return this;
    } catch (error) {
      this.#response.body?.cancel();
      throw error;
    }
  }
}
