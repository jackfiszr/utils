# @jackfiszr/utils

This module provides a collection of utility functions for various purposes.

## Logging

### `dlog(options: DlogOptions)`

Logs a formatted message to the console with an optional sub-message.

**Parameters:**

- `options`: The options for the log message.
  - `color`: The color of the main message text. Defaults to "white".
  - `subColor`: The color of the sub-message text. Defaults to "dim".
  - `subPrefix`: The prefix for the sub-message. Defaults to " > ".
  - `title`: The title of the log message.
  - `mainMsg`: The main message text.
  - `subMsg`: The sub-message text.

### `mlog(msgs: Array<{ text: string; color: keyof typeof fmt }>)`

Logs an array of messages to the console with specified text and color
formatting.

**Parameters:**

- `msgs`: An array of message objects, each containing:
  - `text`: The message text to be logged.
  - `color`: The color to apply to the message text.

## Oak and Hono app launchers

### `startOakApp(app: Application, options: StartAppOptions = {})`

Starts an Oak application with the specified options.

**Parameters:**

- `app`: The Oak application instance.
- `options`: Configuration options for starting the application.
- `openFn`: Function to open the app in a browser (default: `open` from
  [@rdsq/open](https://jsr.io/@rdsq/open)).

**Returns:** A promise that resolves to an Oak `Application`.

### `startHonoApp(app: Hono, options: StartAppOptions = {})`

Starts a Hono application with the specified options.

**Parameters:**

- `app`: The Hono application instance.
- `options`: Configuration options for starting the application.
- `openFn`: Function to open the app in a browser (default: `open` from
  [@rdsq/open](https://jsr.io/@rdsq/open)).

**Returns:** A promise that resolves to a `Deno.HttpServer`.

## Test utils

### `createMockPdf(filenames: string | string[], directory?: string, numPages?: number): Promise<void>`

Creates one or multiple test PDFs with a specified number of pages.

**Parameters:**

- `filenames`: A single filename or an array of filenames to create.
- `directory`: (Optional) Directory where the PDFs should be saved. Defaults to
  the current working directory.
- `numPages`: (Optional) Number of pages in each PDF. Defaults to 1.

**Returns:** A promise that resolves when all PDFs are created.

**Example Usage:**

```typescript
await createMockPdf("test.pdf"); // Creates a single-page PDF named test.pdf in the current directory.

await createMockPdf(["file1.pdf", "file2.pdf"], "./output", 3);
// Creates two PDFs (file1.pdf & file2.pdf) with 3 pages each in the "output" directory.
```

## Miscellaneous

### `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`

Retrieves the value of a specified property from an object.

**Parameters:**

- `obj`: The object from which to retrieve the property.
- `key`: The key of the property to retrieve.

**Returns:** The value of the specified property.

### `pdfToTxt(pdfFilePath: string, config = { silent: false }): Promise<string>`

Converts a PDF file to a text file.

**Parameters:**

- `pdfFilePath`: The path to the PDF file to be converted.
- `config`: Optional configuration object.
  - `silent`: If true, suppresses log output. Defaults to false.

**Returns:** A promise that resolves to the path of the generated text file.

### `runCmd(cmdStr: string)`

Executes a given command string in the shell.

**Parameters:**

- `cmdStr`: The command string to be executed.

**Example:**

```typescript
await runCmd("echo Hello, World!");
```

### `timeDiff(startTime: number, endTime: number): string`

Calculates the difference between two timestamps and returns it as a formatted
string.

**Parameters:**

- `startTime`: The start time in milliseconds since the Unix epoch.
- `endTime`: The end time in milliseconds since the Unix epoch.

**Returns:** A string representing the time difference in the format "HH:MM:SS".

### `txtToCleanArr(fileTextContent: string): string[]`

Converts a string of text content into a cleaned array of unique, trimmed, and
uppercase strings.

**Parameters:**

- `fileTextContent`: The content of the file as a single string.

**Returns:** An array of unique, trimmed, and uppercase strings.

**Example:**

```typescript
const content = "hello\nworld\nhello\n";
const result = txtToCleanArr(content);
console.log(result); // Output: ["HELLO", "WORLD"]
```
