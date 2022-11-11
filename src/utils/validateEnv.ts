import { WebhookClient } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { logHandler } from "./logHandler";

/**
 * Validates that environment variables are set.
 *
 * @returns {ExtendedClient["env"]} The config object to attach to the bot instance.
 */
export const validateEnv = (): ExtendedClient["env"] => {
  if (
    !process.env.TOKEN ||
    !process.env.DEBUG_HOOK ||
    !process.env.HOME_GUILD
  ) {
    logHandler.log("error", "Missing environment variables~!");
    process.exit(1);
  }

  return {
    token: process.env.TOKEN,
    debugHook: new WebhookClient({ url: process.env.DEBUG_HOOK }),
    homeGuild: process.env.HOME_GUILD,
    prod: process.env.NODE_ENV === "production",
  };
};
