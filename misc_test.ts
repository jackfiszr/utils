import {
  getProperty,
  pdfToTxt,
  runCmd,
  timeDiff,
  txtToCleanArr,
} from "./misc.ts";
import { createMockPdf } from "./test_utils.ts";
import { assertEquals, assertRejects } from "@std/assert";
import { existsSync } from "@std/fs";

Deno.test("getProperty should return correct property value", () => {
  const obj = { name: "Deno", version: "1.0.0" };
  assertEquals(getProperty(obj, "name"), "Deno");
  assertEquals(getProperty(obj, "version"), "1.0.0");
});

Deno.test("runCmd should execute command", async () => {
  await runCmd("echo Hello, Deno!");
});

Deno.test("timeDiff should calculate correct time difference", () => {
  const startTime = 1700000000000;
  const endTime = 1700000365000;
  assertEquals(timeDiff(startTime, endTime), "00:06:05");
});

Deno.test("txtToCleanArr should return unique uppercase strings", () => {
  const content = "hello\nworld\nhello\nDeno";
  assertEquals(txtToCleanArr(content), ["HELLO", "WORLD", "DENO"]);
});

// Mocking dependencies
const mockPdfFilePath = "test.pdf";
const mockTxtFilePath = "test.txt";

// Helper function to clean up files after test
async function cleanup() {
  if (existsSync(mockPdfFilePath)) await Deno.remove(mockPdfFilePath);
  if (existsSync(mockTxtFilePath)) await Deno.remove(mockTxtFilePath);
}

Deno.test("pdfToTxt should return the expected text file path when conversion is successful", async () => {
  await createMockPdf(mockPdfFilePath);

  const result = await pdfToTxt(mockPdfFilePath, { silent: true });

  assertEquals(result, mockTxtFilePath);
  assertEquals(existsSync(mockTxtFilePath), true);

  await cleanup();
});

Deno.test("pdfToTxt should throw an error if the text file is not created", async () => {
  await createMockPdf(mockPdfFilePath);

  // Simulating failure by ensuring text file does not exist
  if (existsSync(mockTxtFilePath)) await Deno.remove(mockTxtFilePath);

  await assertRejects(
    async () => {
      await pdfToTxt("non_existent.pdf", { silent: true });
    },
    Error,
    "Plik tekstowy nie został utworzony",
  );

  await cleanup();
});
