import type { MetadataRoute } from "next";

const siteUrl = "https://studio.jakubkanna.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/legal"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
