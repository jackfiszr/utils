/**
 * Logging utilities for Deno scripts.
 * @module
 */
import { getProperty } from "./misc.ts";
import * as stdFmt from "@std/fmt";
import * as stdLog from "@std/log";

type FmtFn = (str: string) => string;

interface DlogOptions {
  color: keyof typeof stdFmt;
  title?: string;
  mainMsg?: string;
  subMsg?: string;
  subColor?: keyof typeof stdFmt;
  subPrefix?: string;
}

/**
 * Logs a formatted message to the console with optional sub-message.
 *
 * @param options - The options for the log message.
 * @param options.color - The color of the main message text. Defaults to "white".
 * @param options.subColor - The color of the sub-message text. Defaults to "dim".
 * @param options.subPrefix - The prefix for the sub-message. Defaults to " > ".
 * @param options.title - The title of the log message.
 * @param options.mainMsg - The main message text.
 * @param options.subMsg - The sub-message text.
 */
export function dlog(options: DlogOptions) {
  const {
    color = "white",
    subColor = "dim",
    subPrefix = " > ",
    title = "",
    mainMsg = "",
    subMsg = "",
  } = options;

  const bold = stdFmt.bold as FmtFn;
  const colorFn = getProperty(stdFmt, color) as FmtFn;
  console.log(bold(colorFn(`\n${title}: ${mainMsg}`)));

  if (subMsg) {
    const subColorFn = getProperty(stdFmt, subColor) as FmtFn;
    console.log(subColorFn(subPrefix + subMsg));
  }
}

/**
 * Logs an array of messages to the console with specified text and color formatting.
 *
 * @param msgs - An array of message objects, each containing:
 *   - `text`: The message text to be logged.
 *   - `color`: The color to apply to the message text, which should be a key of the `fmt` object.
 */
export function mlog(
  msgs: Array<{ text: string; color: keyof typeof stdFmt }>,
) {
  const bold = stdFmt.bold as FmtFn;
  msgs.forEach((msg) => {
    const color = getProperty(stdFmt, msg.color) as FmtFn;
    console.log(bold(color(msg.text)));
  });
}

/**
 * Sets up and returns a logger instance with optional file logging.
 *
 * @param {string} [logFilePath] - Optional path to a log file. If provided, logs with level "ERROR" and above will be written to this file.
 * @returns {Promise<log.Logger>} A promise that resolves to a logger instance.
 *
 * @example
 * ```ts
 * // Setup logger with console and file handlers
 * const logger = await setupLogger('/path/to/logfile.log');
 * logger.debug('This is a debug message');
 * logger.error('This is an error message');
 * ```
 *
 * @example
 * ```ts
 * // Setup logger with only console handler
 * const logger = await setupLogger();
 * logger.debug('This is a debug message');
 * logger.error('This is an error message');
 * ```
 */
export default async function getLogger(
  logFilePath?: string,
): Promise<stdLog.Logger> {
  const logConfig: stdLog.LogConfig = {
    handlers: {
      console: new stdLog.ConsoleHandler("DEBUG", {
        formatter: (logRecord) => {
          let { msg } = logRecord;
          const fmtArr = logRecord.args[0] as [keyof typeof stdFmt];
          fmtArr?.forEach((color) => {
            const fmtFn = stdFmt[color] as FmtFn;
            msg = fmtFn(msg);
          });
          return msg;
        },
      }),
    },
    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["console", "file"],
      },
    },
  };
  if (logFilePath && logConfig.handlers) {
    logConfig.handlers.file = new stdLog.FileHandler("ERROR", {
      filename: logFilePath,
      formatter: (record) =>
        `${record.datetime} ${record.levelName} ${record.msg}`,
    });
  }
  await stdLog.setup(logConfig);
  return stdLog.getLogger();
}

/**
 * A simple logger instance without file logging.
 *
 * @constant
 * @type {Logger}
 * @async
 */
export const log: stdLog.Logger = await getLogger();
