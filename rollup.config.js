// Rollup plugins
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import rollup_start_dev from "./rollup_start_dev";
// import babel from 'rollup-plugin-babel';
// import { uglify } from 'rollup-plugin-uglify';
// import svelte from "rollup-plugin-svelte";
// import resolve from "rollup-plugin-node-resolve";
// import commonjs from "rollup-plugin-commonjs";
// import css from "rollup-plugin-css-only";
const production = !process.env.ROLLUP_WATCH;


export default {
  input: './src/index.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name : "app",
    file: "public/bundle.js"
  },
  plugins: [
    resolve(),
    commonjs(),

    
    // In dev mode, call `npm run start:dev` once
    // the bundle has been generated
    !production && rollup_start_dev,

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()

    // uglify()
  ],

  watch: {
    clearScreen: false
  }
};