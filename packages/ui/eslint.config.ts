import { defineConfig } from "eslint/config";

import { baseConfig } from "@holm/eslint-config/base";
import { reactConfig } from "@holm/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
