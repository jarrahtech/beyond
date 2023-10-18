import { defineConfig } from "vite";

var baseUrl = process.env['BASE_URL'];
if (baseUrl == undefined || baseUrl.trim()==="/") { // required as Electron.js does not like 
  console.log("Rewriting root Base URL to empty")
  baseUrl = "";
  process.env['BASE_URL'] = baseUrl;
} else {
  baseUrl = baseUrl.trim();
}
console.log("Base URL: '"+baseUrl+"'");
console.log(JSON.stringify(process.env.npm_package_version));
export default defineConfig({
  base: baseUrl,
  build: {
    minify: 'esbuild',
  }
});
