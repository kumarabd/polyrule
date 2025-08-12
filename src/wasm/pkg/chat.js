// Generated loader adjusted for CRA/Webpack: provide explicit async init
import * as imports from "./chat_bg.js";
import { __wbg_set_wasm } from "./chat_bg.js";

export async function init() {
  const wasmUrl = new URL("./chat_bg.wasm", import.meta.url);
  const response = await fetch(wasmUrl);
  const bytes = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes, { "./chat_bg.js": imports });
  __wbg_set_wasm(instance.exports);
  if (typeof instance.exports.__wbindgen_start === 'function') {
    instance.exports.__wbindgen_start();
  }
}

export * from "./chat_bg.js";
