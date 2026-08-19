export const getParticipantIds = (chatId: string): string[] => {
  if (!chatId) return [];
  const [cleanId, queryPart] = chatId.split("?");
  const withoutPrefix = cleanId.replace(/^group_/, "");
  const baseMembers = withoutPrefix.split("_vs_").filter(Boolean);
  if (!queryPart) return baseMembers;
  const params = new URLSearchParams(queryPart);
  const adds = params.has("add") ? params.get("add")!.split(",").filter(Boolean) : [];
  const rms = params.has("rm") ? params.get("rm")!.split(",").filter(Boolean) : [];
  const current = new Set([...baseMembers, ...adds]);
  rms.forEach((r) => current.delete(r));
  return Array.from(current);
};

export const parseGroupName = (convId: string, convName?: string | null) => {
  if (convName) return convName;
  if (convId.startsWith("group_") && convId.includes("?")) {
    const queryPart = convId.split("?")[1];
    const params = new URLSearchParams(queryPart);
    const nameParam = params.get("name");
    if (nameParam) return nameParam;
  }
  return "";
};

export const parseGroupTheme = (convId: string) => {
  if (convId.startsWith("group_") && convId.includes("?")) {
    const queryPart = convId.split("?")[1];
    const params = new URLSearchParams(queryPart);
    const themeParam = params.get("theme");
    if (themeParam) return themeParam;
  }
  return "default";
};

export const parseGroupAdmin = (convId: string) => {
  if (convId.startsWith("group_") && convId.includes("?")) {
    const queryPart = convId.split("?")[1];
    const params = new URLSearchParams(queryPart);
    const adminParam = params.get("admin");
    if (adminParam) return adminParam;
  }
  return "";
};
