export const SOCIAL_MEDIA_LINKS = {
  instagram: "https://www.instagram.com/ionyx___",
  // linkedin: "https://linkedin.com/in/Himanshu Kumar",
  x: "https://x.com/Himanshu951k",
  github: "https://github.com/Himanshuk951",
} as const;

export type SocialPlatform = keyof typeof SOCIAL_MEDIA_LINKS;

export const SOCIAL_COMMAND_ALIASES: Record<string, SocialPlatform> = {
  instagram: "instagram",
  // linkedin: "linkedin",
  x: "x",
  twitter: "x",
  github: "github",
  gethub: "github",
};

export const SOCIAL_MEDIA_LIST = Object.entries(SOCIAL_MEDIA_LINKS)
  .map(([platform, url]) => `- ${platform} :: ${url}`)
  .join("\n");
