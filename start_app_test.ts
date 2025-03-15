import { assertEquals, assertMatch } from "@std/assert";
import { stub } from "@std/testing/mock";
import { startHonoApp, startOakApp } from "./start_app.ts";
import type { Application } from "@oak/oak";
import type { Hono } from "@hono/hono";
import * as fmt from "@std/fmt";
import opn from "@rdsq/open";

// Mocking log module
const log = {
  info: stub(console, "log"),
};

// Mocking Oak Application correctly
const mockOakApp = {
  listen: stub({} as Application, "listen", async () => {}),
  addEventListener: stub({} as Application, "addEventListener", () => {}),
} as unknown as Application;

// Mocking Hono Application correctly
const mockHonoApp = {
  fetch: stub({} as Hono, "fetch", () => new Response("OK")),
} as unknown as Hono;

Deno.test("startOakApp logs correct startup message", async () => {
  await startOakApp(mockOakApp, { name: "TestApp", port: 9000, open: false });

  assertMatch(log.info.calls[0].args[0], /Aplikacja : TestApp/);
  assertMatch(
    log.info.calls[1].args[0],
    new RegExp(fmt.yellow("localhost:9000")),
  );
});

Deno.test("startHonoApp logs correct startup message", async () => {
  await startHonoApp(mockHonoApp, {
    name: "HonoTest",
    port: 3000,
    open: false,
  });

  assertMatch(log.info.calls[0].args[0], /Aplikacja Hono 🔥: HonoTest/);
  assertMatch(
    log.info.calls[1].args[0],
    new RegExp(fmt.yellow("localhost:3000")),
  );
});

// Mock `opn` to avoid opening the browser
const opnStub = stub(opn, "open", () => Promise.resolve());

Deno.test("startOakApp should not open browser when open is false", async () => {
  await startOakApp(mockOakApp, { open: false });
  assertEquals(opnStub.calls.length, 0);
});

Deno.test("startOakApp should attempt to open browser when open is true", async () => {
  await startOakApp(mockOakApp, { open: true });
  assertEquals(opnStub.calls.length, 1);
});

Deno.test("startHonoApp starts the Hono server correctly", async () => {
  const serveStub = stub(Deno, "serve", () => ({ port: 5000 }));

  await startHonoApp(mockHonoApp, { host: "127.0.0.1", port: 5000 });

  assertEquals(serveStub.calls[0].args[0].hostname, "127.0.0.1");
  assertEquals(serveStub.calls[0].args[0].port, 5000);

  serveStub.restore();
});

// Cleanup stubs
Deno.test("Restore stubs", () => {
  log.info.restore();
  opnStub.restore();
});
