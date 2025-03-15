import type { Application } from "@oak/oak";
import type { Hono } from "@hono/hono";
import { log } from "./logger.ts";
import * as fmt from "@std/fmt";
import opn from "@rdsq/open";

/**
 * Options for starting an application.
 */
interface StartAppOptions {
  /** The name of the application. */
  name?: string;
  /** The user who is starting the application. */
  user?: string;
  /** The hostname on which the application should run. */
  host?: string;
  /** The port number for the application. */
  port?: number;
  /** Whether to open the application in a browser upon startup. */
  open?: boolean;
}

/**
 * Common function to start an application using Oak or Hono.
 *
 * @param app - The application instance (Oak or Hono).
 * @param options - Configuration options for the application.
 * @param isHono - Whether the application is a Hono instance (default: false).
 */
async function commonAppStart(
  app: Application | Hono,
  options: StartAppOptions,
  isHono: boolean = false,
) {
  const {
    name = "App",
    user = "unknown",
    host = "localhost",
    port = 8080,
    open = true,
  } = options;
  const { deno: denoVer } = Deno.version;

  log.info(`Aplikacja ${isHono ? "Hono 🔥" : ""}: ${name} [Deno ${denoVer}]`, [
    "bold",
    "white",
    "underline",
  ]);
  log.info(
    `uruchomiona pod adresem http://${
      fmt.yellow(`${host}:${port}`)
    }\n > przez użytkownika ${fmt.bold(user.toUpperCase())}`,
    ["gray"],
  );

  if (isHono) {
    Deno.serve({ hostname: host, port }, (app as Hono).fetch);
  } else {
    (app as Application).addEventListener("listen", async () => {
      if (open) await opn(`http://${host}:${port}`);
    });
    await (app as Application).listen(`${host}:${port}`);
  }
}

/**
 * Starts an Oak application with the specified options.
 *
 * @param app - The Oak application instance.
 * @param options - Configuration options for starting the application.
 */
export async function startOakApp(
  app: Application,
  options: StartAppOptions = {},
) {
  await commonAppStart(app, options, false);
}

/**
 * Starts a Hono application with the specified options.
 *
 * @param app - The Hono application instance.
 * @param options - Configuration options for starting the application.
 */
export async function startHonoApp(app: Hono, options: StartAppOptions = {}) {
  await commonAppStart(app, options, true);
}
