import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FFCS-inator",
    short_name: "FFCS-inator",
    description:
      "Generate priority-based timetables in seconds. No more clashes, no more stress.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "browser"],
    background_color: "#cee4e5",
    theme_color: "#cee4e5",
    orientation: "portrait-primary",
    lang: "en",
    dir: "ltr",
    categories: ["ffcs", "timetable", "education", "productivity"],
    screenshots: [
      {
        src: "/screenshots/screenshot-wide-1.png",
        sizes: "2880x1556",
        type: "image/png",
        label: "Home screen",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-wide-2.png",
        sizes: "2880x1556",
        type: "image/png",
        label: "Home screen",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-wide-3.png",
        sizes: "2880x1556",
        type: "image/png",
        label: "Home screen",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-wide-4.png",
        sizes: "2880x1556",
        type: "image/png",
        label: "Home screen",
        form_factor: "wide",
      },
      {
        src: "/screenshots/screenshot-1.png",
        sizes: "750x1334",
        type: "image/png",
      },
      {
        src: "/screenshots/screenshot-2.png",
        sizes: "750x1334",
        type: "image/png",
      },
    ],
    icons: [
      {
        src: "/logo_ffcs/icon-16x16.webp",
        sizes: "16x16",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-32x32.webp",
        sizes: "32x32",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-48x48.webp",
        sizes: "48x48",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-64x64.webp",
        sizes: "64x64",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-72x72.webp",
        sizes: "72x72",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-76x76.webp",
        sizes: "76x76",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-96x96.webp",
        sizes: "96x96",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-114x114.webp",
        sizes: "114x114",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-120x120.webp",
        sizes: "120x120",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-128x128.webp",
        sizes: "128x128",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-144x144.webp",
        sizes: "144x144",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-152x152.webp",
        sizes: "152x152",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-180x180.webp",
        sizes: "180x180",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-192x192.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "maskable",
      },
      {
        src: "/logo_ffcs/icon-196x196.webp",
        sizes: "196x196",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-228x228.webp",
        sizes: "228x228",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-256x256.webp",
        sizes: "256x256",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logo_ffcs/icon-384x384.webp",
        sizes: "384x384",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Open Home",
        short_name: "Home",
        description: "Go to the home page",
        url: "/",
        icons: [
          {
            src: "/logo_ffcs/icon-192x192.webp",
            sizes: "192x192",
            type: "image/webp",
          },
        ],
      },
      {
        name: "Saved Timetables",
        short_name: "Saved Timetables",
        description: "View your saved timetables",
        url: "/saved",
        icons: [
          {
            src: "/logo_ffcs/icon-192x192.webp",
            sizes: "192x192",
            type: "image/webp",
          },
        ],
      },
      {
        name: "Slots",
        short_name: "Slots",
        description: "View available slots",
        url: "/slots",
        icons: [
          {
            src: "/logo_ffcs/icon-192x192.webp",
            sizes: "192x192",
            type: "image/webp",
          },
        ],
      },
    ],
    protocol_handlers: [
      {
        protocol: "web+ffcsinator",
        url: "/?q=%s",
      },
    ],
  };
}
