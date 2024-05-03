import { join } from "path";
import pkg from "./package.json";
import { defineNitroConfig } from "nitropack/config";
import nitroCloudflareBindings from "nitro-cloudflare-dev";

//https://nitro.unjs.io/config
export default defineNitroConfig({
  noPublicDir: true,
  modules: [nitroCloudflareBindings],
  srcDir: "./src",
  runtimeConfig: {
    version: pkg.version
  },
  alias: {
    "@": join(__dirname, "src")
  },
});
