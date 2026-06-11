import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/driver/", "/admin/", "/corporate/", "/profile/"]
    },
    sitemap: "https://ridex-app.vercel.app/sitemap.xml"
  };
}
