import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ridex-app.vercel.app";
  const routes = [
    "",
    "/features",
    "/pricing",
    "/business",
    "/about",
    "/contact",
    "/help"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8
  }));
}
