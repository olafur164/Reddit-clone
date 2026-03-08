import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@holm/eslint-config/base";
import { nextjsConfig } from "@holm/eslint-config/nextjs";
import { reactConfig } from "@holm/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
