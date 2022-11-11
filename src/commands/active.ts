import {
  AttachmentBuilder,
  GuildMember,
  PermissionFlagsBits,
  Role,
  SlashCommandBuilder,
} from "discord.js";

import { Command } from "../interfaces/Command";
import { MemberList } from "../interfaces/MemberList";

export const active: Command = {
  data: new SlashCommandBuilder()
    .setName("active")
    .setDescription("Get a list of active members.")
    .addRoleOption((option) =>
      option
        .setName("active-role")
        .setDescription("The role that is used to indicate someone is active.")
        .setRequired(true)
    ),
  run: async (bot, interaction) => {
    await interaction.deferReply();

    const { guild, member } = interaction;

    if (
      !guild ||
      !member ||
      !(member as GuildMember).permissions.has(
        PermissionFlagsBits.ManageMessages
      )
    ) {
      await interaction.editReply({
        content:
          "To avoid excessive API calls, only staff may run this command.",
      });
      return;
    }

    const activeRole = interaction.options.getRole("active-role", true) as Role;

    const memberList = await guild.members.fetch();

    const members = memberList.filter((m) => m.roles.cache.has(activeRole.id));

    const result: MemberList = {};

    for (const [, member] of members) {
      result[member.user.id] = {
        tag: member.user.tag,
        avatar: member.user.displayAvatarURL(),
      };
    }

    const attachment = new AttachmentBuilder(
      Buffer.from(JSON.stringify(result, null, 2), "utf-8"),
      {
        name: "members.json",
      }
    );

    await interaction.editReply({
      content: "Here are the active members.",
      files: [attachment],
    });
  },
};
