export function googleFormLinks(formUrl: string): { embedUrl: string; openUrl: string } | null {
  try {
    const url = new URL(formUrl);
    if (url.origin !== "https://docs.google.com" || url.username || url.password ||
      !/^\/forms\/d\/(?:e\/)?[a-zA-Z0-9_-]+\/viewform\/?$/.test(url.pathname)) return null;
    url.hash = "";
    url.searchParams.delete("embedded");
    const openUrl = url.href;
    url.searchParams.set("embedded", "true");
    return { embedUrl: url.href, openUrl };
  } catch {
    return null;
  }
}
