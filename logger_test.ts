import { dlog, mlog } from "./logger.ts";

Deno.test("dlog should not throw error", () => {
  dlog({ color: "red", title: "Test", mainMsg: "Main message" });
});

Deno.test("mlog should not throw error", () => {
  mlog([
    { text: "Message 1", color: "green" },
    { text: "Message 2", color: "yellow" },
  ]);
});
