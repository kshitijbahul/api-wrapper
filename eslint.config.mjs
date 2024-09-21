import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { 
    globals: { 
      ...globals.browser,
      ...globals.node,
      ...globals.jest,
    } 
  }},
  pluginJs.configs.recommended,
];