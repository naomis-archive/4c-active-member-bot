import { REST, Routes } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Registers the commands for the bot.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @returns {boolean} True on successful registration.
 */
export const registerCommands = async (bot: ExtendedClient) => {
  try {
    if (!bot.user?.id) {
      await bot.env.debugHook.send({
        content: "Cannot register commands as bot has not authenticated.",
      });
      return false;
    }
    const rest = new REST({ version: "10" }).setToken(bot.env.token);
    const commandData = bot.commands.map((command) => command.data.toJSON());

    if (!commandData.length) {
      await bot.env.debugHook.send({
        content: "No commands found to register.",
      });
      return false;
    }

    if (bot.env.prod) {
      await rest.put(Routes.applicationCommands(bot.user.id), {
        body: commandData,
      });
      await bot.env.debugHook.send({
        content: "Registered commands globally!",
      });
      return;
    }

    await rest.put(
      Routes.applicationGuildCommands(bot.user.id, bot.env.homeGuild),
      {
        body: commandData,
      }
    );
    await bot.env.debugHook.send({
      content: `Registered commands for guild ${bot.env.homeGuild}!`,
    });
  } catch (err) {
    await errorHandler(bot, "register commands", err);
  }
};
