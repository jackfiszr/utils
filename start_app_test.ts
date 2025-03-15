import { startHonoApp, startOakApp } from "./start_app.ts";
import { assertEquals, assertMatch } from "@std/assert";
import { stub } from "@std/testing/mock";
import type { Application } from "@oak/oak";
import type { Hono } from "@hono/hono";

const mockOakApp = {
  listen: stub({} as Application, "listen", async () => {}),
} as unknown as Application;

const mockHonoApp = {
  fetch: stub({} as Hono, "fetch", () => new Response("OK")),
} as unknown as Hono;

Deno.test("startOakApp logs correct startup message", async () => {
  const log = { info: stub(console, "log") };

  await startOakApp(mockOakApp, { name: "TestApp", port: 9000, open: false });

  assertMatch(log.info.calls[0].args[0], /Aplikacja: TestApp/);
  assertMatch(log.info.calls[1].args[0], new RegExp("localhost:9000"));

  log.info.restore();
});

Deno.test("startHonoApp logs correct startup message", async () => {
  const log = { info: stub(console, "log") };

  const server = await startHonoApp(mockHonoApp, {
    name: "HonoTest",
    port: 3000,
    open: false,
  });

  assertMatch(log.info.calls[0].args[0], /Aplikacja Hono 🔥: HonoTest/);
  assertMatch(log.info.calls[1].args[0], new RegExp("localhost:3000"));

  await server?.shutdown();
  log.info.restore();
});

Deno.test("startHonoApp starts the Hono server correctly", async () => {
  const serveStub = stub(Deno, "serve");

  await startHonoApp(mockHonoApp, {
    host: "127.0.0.1",
    port: 5000,
    open: false,
  });

  assertEquals(serveStub.calls[0].args[0].hostname, "127.0.0.1");
  assertEquals(serveStub.calls[0].args[0].port, 5000);

  serveStub.restore();
});

Deno.test("startOakApp should not open browser when open is false", async () => {
  let called = false;

  await startOakApp(mockOakApp, { open: false }, () => {
    called = true;
    return Promise.resolve();
  });

  assertEquals(called, false);
});

Deno.test("startOakApp should attempt to open browser when open is true", async () => {
  let called = false;

  await startOakApp(mockOakApp, { open: true }, () => {
    called = true;
    return Promise.resolve();
  });

  assertEquals(called, true);
});

Deno.test("startHonoApp should attempt to open browser when open is true", async () => {
  const serveStub = stub(Deno, "serve");

  let called = false;

  await startHonoApp(mockHonoApp, { open: true }, () => {
    called = true;
    return Promise.resolve();
  });

  assertEquals(called, true);

  serveStub.restore();
});
