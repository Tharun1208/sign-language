import {
  LayoutDashboard,
  ScanFace,
  Image as ImageIcon,
  Film,
  BookOpenText,
  Database,
  Info,
  Settings,
} from "lucide-react";

/**
 * Single source of truth for the app navigation.
 * Used by both the sidebar and the command palette so the two never drift.
 */
export const navGroups = [
  {
    label: "Workspace",
    items: [
      { title: "Overview", path: "/dashboard", hint: "Live metrics", icon: LayoutDashboard, keywords: "home dashboard stats" },
      { title: "Live detection", path: "/live-recognition", hint: "Camera", icon: ScanFace, keywords: "webcam camera sign realtime" },
      { title: "Image detection", path: "/image-recognition", hint: "Upload", icon: ImageIcon, keywords: "photo upload predict" },
      { title: "Video translation", shortTitle: "Video", path: "/video-translation", hint: "Transcript", icon: Film, keywords: "clip transcript subtitle" },
    ],
  },
  {
    label: "Reference",
    items: [
      { title: "Sign dictionary", path: "/dictionary", icon: BookOpenText, keywords: "alphabet reference practice learn" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Dataset and model", path: "/analytics", icon: Database, keywords: "analytics accuracy performance" },
      { title: "About", path: "/about", icon: Info, keywords: "project team stack" },
      { title: "Settings", path: "/settings", icon: Settings, keywords: "profile voice preferences" },
    ],
  },
];

export const navItems = navGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label }))
);

export const pageMeta = {
  "/dashboard": { title: "Overview", subtitle: "Recognition health at a glance" },
  "/live-recognition": { title: "Live detection", subtitle: "Real-time sign translation" },
  "/image-recognition": { title: "Image detection", subtitle: "Read a sign from a photo" },
  "/video-translation": { title: "Video translation", subtitle: "Timestamped transcripts" },
  "/dictionary": { title: "Sign dictionary", subtitle: "A–Z reference and practice" },
  "/analytics": { title: "Dataset and model", subtitle: "Accuracy and dataset splits" },
  "/about": { title: "About", subtitle: "Project, stack and team" },
  "/settings": { title: "Settings", subtitle: "Profile, voice and recognition" },
};

export const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
