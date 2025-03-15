import { pdfToTxt as pdfrexToTxt } from "@jackfiszr/pdfrex";
import { dlog, log } from "./logger.ts";
import { existsSync } from "@std/fs";

/**
 * Retrieves the value of a specified property from an object.
 *
 * @template T - The type of the object.
 * @template K - The key of the property to retrieve, which must be a key of T.
 * @param {T} obj - The object from which to retrieve the property.
 * @param {K} key - The key of the property to retrieve.
 * @returns {T[K]} The value of the specified property.
 */
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

/**
 * Converts a PDF file to a text file using the `pdftotext` command.
 * If the `pdftotext` command fails, it attempts to use `pdfrex` as a fallback.
 * Logs the status of the conversion process unless the `silent` option is set to true.
 *
 * @param pdfFilePath - The path to the PDF file to be converted.
 * @param config - Optional configuration object.
 * @param config.silent - If true, suppresses logging output. Defaults to false.
 * @returns A promise that resolves to the path of the generated text file.
 * @throws If the text file is not created successfully.
 */
export async function pdfToTxt(
  pdfFilePath: string,
  config = { silent: false },
): Promise<string> {
  const programName = "pdftotext";
  let title = "JUŻ ISTNIEJE";
  const txtFilePath = pdfFilePath.replace(".pdf", ".txt");
  if (!existsSync(txtFilePath)) {
    title = "UTWORZONO";
    try {
      const command = new Deno.Command(programName, {
        args: [pdfFilePath, txtFilePath],
      });
      const child = command.spawn();
      await child.status;
    } catch (_error) {
      try {
        await pdfrexToTxt(pdfFilePath);
      } catch (error) {
        log.error(
          `BŁĄD: Nie można przekonwertować pliku ${pdfFilePath} do pliku tekstowego\n${error}`,
        );
        Deno.exit(1);
      }
    }
  }
  if (!existsSync(txtFilePath)) {
    throw new Error("Plik tekstowy nie został utworzony");
  } else if (!config.silent) {
    log.info(`${title}: ${txtFilePath}`, ["white", "italic"]);
  }
  return txtFilePath;
}

/**
 * Executes a given command string in the shell.
 *
 * @param cmdStr - The command string to be executed.
 *
 * @example
 * ```typescript
 * await runCmd("echo Hello, World!");
 * ```
 *
 * This function logs the command being executed and logs again once the command has finished executing.
 * It uses Deno's Command API to spawn a new process and waits for the process to complete.
 */
export async function runCmd(cmdStr: string) {
  dlog({ color: "dim", title: "WYKONUJĘ", mainMsg: cmdStr });

  const [cmd, ...args] = cmdStr.split(" ");
  const command = new Deno.Command(cmd, { args });
  const child = command.spawn();
  await child.status;

  dlog({ color: "dim", title: "WYKONANO", mainMsg: cmdStr });
}

/**
 * Calculates the difference between two timestamps and returns it as a formatted string.
 *
 * @param startTime - The start time in milliseconds since the Unix epoch.
 * @param endTime - The end time in milliseconds since the Unix epoch.
 * @returns A string representing the time difference in the format "HH:MM:SS".
 */
export function timeDiff(startTime: number, endTime: number): string {
  return new Date(endTime - startTime - 3600000).toTimeString().substring(0, 8);
}

/**
 * Converts a string of text content into a cleaned array of unique, trimmed, and uppercase strings.
 *
 * @param fileTextContent - The content of the file as a single string.
 * @returns An array of unique, trimmed, and uppercase strings.
 *
 * @remarks
 * - Each line in the input string is trimmed of whitespace.
 * - Empty lines are removed.
 * - Duplicate lines (case-insensitive) are reported and removed.
 *
 * @example
 * ```typescript
 * const content = "hello\nworld\nhello\n";
 * const result = txtToCleanArr(content);
 * console.log(result); // Output: ["HELLO", "WORLD"]
 * ```
 */
export function txtToCleanArr(fileTextContent: string): string[] {
  const lines = new Set<string>();

  return fileTextContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const upperCaseLine = line.toUpperCase();
      if (lines.has(upperCaseLine)) {
        dlog({
          color: "red",
          title: upperCaseLine,
          mainMsg: "Pozycja występuje na liście więcej niż raz",
          subMsg: "Każde następne wystąpienie będzie sygnalizowane",
        });
        return null;
      }
      lines.add(upperCaseLine);
      return upperCaseLine;
    })
    .filter(Boolean) as string[];
}
