import { prisma } from "./prisma";

export async function getSetting(key: string, defaultValue = "") {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    return setting?.value ?? defaultValue;
  } catch (error) {
    console.warn("getSetting: DB error, returning default:", error);
    return defaultValue;
  }
}

export async function getSettingsByGroup(group: string) {
  try {
    return prisma.siteSetting.findMany({ where: { group } });
  } catch (error) {
    console.warn("getSettingsByGroup: DB error, returning empty:", error);
    return [];
  }
}

export async function getAllSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  } catch (error) {
    console.warn("getAllSettings: DB error, returning empty object:", error);
    return {};
  }
}

export async function setSetting(key: string, value: string, group = "general") {
  try {
    return await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group },
    });
  } catch (error) {
    console.error("setSetting: DB error:", error);
    throw new Error("Failed to save setting");
  }
}

export async function setSettings(
  entries: { key: string; value: string; group?: string }[]
) {
  try {
    const results = await Promise.all(
      entries.map(({ key, value, group }) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value, group: group ?? "general" },
        })
      )
    );
    return results;
  } catch (error) {
    console.error("setSettings: DB error:", error);
    throw new Error("Failed to save settings");
  }
}

export async function deleteSetting(key: string) {
  try {
    return await prisma.siteSetting.delete({ where: { key } });
  } catch (error) {
    console.error("deleteSetting: DB error:", error);
    throw new Error("Failed to delete setting");
  }
}
