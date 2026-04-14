import { prisma } from "./prisma";

export async function getSetting(key: string, defaultValue = "") {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return setting?.value ?? defaultValue;
}

export async function getSettingsByGroup(group: string) {
  return prisma.siteSetting.findMany({ where: { group } });
}

export async function getAllSettings() {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function setSetting(key: string, value: string, group = "general") {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value, group },
  });
}

export async function setSettings(
  entries: { key: string; value: string; group?: string }[]
) {
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
}

export async function deleteSetting(key: string) {
  return prisma.siteSetting.delete({ where: { key } });
}
