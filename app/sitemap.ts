import type { MetadataRoute } from "next";

const siteUrl = "https://studio.jakubkanna.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/portfolio", "/contact"];
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
  }));
}
