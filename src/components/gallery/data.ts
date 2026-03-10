export type GalleryProject = {
  id: number;
  title: string;
  category: "design" | "code";
  description: string;
  tech: string[];
  stats?: string;
  link: string;
  github?: string;
};

export const galleryProjects: GalleryProject[] = [
  // home screen projects here
  // {
  //   id: 1,
  //   category: "design",
  //   title: "#",
  //   description: "#",
  //   tech: ["#"],
  //   link: "#",
  // },
  {
    id: 2,
    category: "code",
    title: "Portfolio",
    description:
      "Personal portfolio website showcasing selected projects and design work.",
    tech: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Framer Motion"],
    stats: "0 Stars",
    link: "https://himanshuk951-portfolio.vercel.app/",
    github: "https://github.com/Himanshuk951/himanshuk951-portfolio",
  },
];
