import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";
import { registerCommands } from "../utils/registerCommands";

/**
 * Handles the ready event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const onReady = async (bot: ExtendedClient) => {
  try {
    logHandler.log("debug", "Bot logged in.");
    await bot.env.debugHook.send({
      content: `Bot has authenticated as ${bot.user?.tag}!`,
      avatarURL: bot.user?.displayAvatarURL(),
      username: bot.user?.username,
    });

    // auto-register commands in non-production environment
    if (!bot.env.prod) {
      await registerCommands(bot);
    }
  } catch (err) {
    await errorHandler(bot, "on ready", err);
  }
};
