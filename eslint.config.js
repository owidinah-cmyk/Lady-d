import nextVitals from "eslint-config-next/core-web-vitals";
import nextJs from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextVitals,
  ...nextJs,
];
