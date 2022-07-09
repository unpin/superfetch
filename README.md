# Superfetch

> ⚠️ Not yet ready for production. Many things are subject to change.

## About

Superfetch is a high-level abstraction for testing APIs.

## Examples

Assert status code is equal 200

```ts
import { Fetch } from "./deps.ts";

const response = Fetch.get("http://example.com")
  .end();
response.expect(200); // assert status code is 200
```

Assert Content-Type is equal "application/json"

```ts
import { Fetch } from "./deps.ts";

const response = await Fetch.get("http://example.com")
  .end();
response.expect("Content-Type", "application/json"); // assert header
```

You can also use regular expressions

```ts
import { Fetch } from "./deps.ts";

const response = await Fetch.get("http://example.com")
  .end();
response.expect("Content-Type", /json/); // assert header
```

Content-Type is set based on body type.

```ts
import { Fetch } from "./deps.ts";

const response = await Fetch.post("http://example.com")
  .send({ foo: "bar" }); // Content-Type will be set to application/json
```

```ts
import { Fetch } from "./deps.ts";

const response = await Fetch.post("http://example.com")
  .send("Hello There!"); // Content-Type will be set to text/plain
```

## API

### .expect(statusCode: number): Fetch

Checks if status code is equal to given status code.

### .expect(k: string, v: string): Fetch

Checks if header is equal to given value.

### .expect(k: string, regex: RegExp): Fetch

Checks if header matches regular expression.

### .send(body: any): Fetch

Sends request with body and returns FetchResponse object.

### .end(): FetchResponse

Send request and returns FetchResponse object.

```ts
import { Fetch } from "./deps.ts";

const response = await Fetch.post("http://example.com")
  .set("Content-Type", "application/json")
  .set("Authorization", "Bearer 12345")
  .send({ foo: "bar" });

response
  .expect(200)
  .expect("Content-Type", "application/json")
  .expect("Authorization", /Bearer/);

const body = await response.json();
assertEquals(body, { foo: "bar" });
```
