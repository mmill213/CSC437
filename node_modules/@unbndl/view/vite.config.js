import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";


export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "view"
    }
  },
    plugins: [
      dts({
        insertTypesEntry: true,
        rollupTypes: true
      })
    ]
});
