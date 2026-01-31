import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = "https://studio.jakubkanna.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/catalog", "/contact"];
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
  }));
}
