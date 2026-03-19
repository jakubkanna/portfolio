import type { MetadataRoute } from "next";

export const dynamic = "force-static";

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
