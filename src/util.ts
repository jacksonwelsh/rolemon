import { GuildMember } from "discord.js";

export const userHasRole = (
  roleId: string,
  member: GuildMember | null
): boolean => member?.roles.cache.some((role) => role.id === roleId) ?? false;
