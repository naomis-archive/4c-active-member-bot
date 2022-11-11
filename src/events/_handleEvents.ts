import { ExtendedClient } from "../interfaces/ExtendedClient";

import { onInteraction } from "./onInteraction";
import { onReady } from "./onReady";

/**
 * Bootstraps the event listeners.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const handleEvents = (bot: ExtendedClient) => {
  bot.on("ready", async () => {
    await onReady(bot);
  });

  bot.on("interactionCreate", async (interaction) => {
    await onInteraction(bot, interaction);
  });
};
