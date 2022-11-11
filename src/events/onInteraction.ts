import { Interaction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Handles the interaction create event.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Interaction} interaction The interaction payload from Discord.
 */
export const onInteraction = async (
  bot: ExtendedClient,
  interaction: Interaction
) => {
  try {
    if (interaction.isChatInputCommand()) {
      const target = bot.commands.find(
        (c) => c.data.name === interaction.commandName
      );

      if (target) {
        await target.run(bot, interaction);
      }
    }
  } catch (err) {
    await errorHandler(bot, "on interaction", err);
  }
};
