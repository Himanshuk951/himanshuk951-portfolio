export type ArtifactProject = {
  id: string;
  title: string;
  tagline: string;
  year: string;
  type: "design" | "code";
  link: string;
  image: string;
};

export const artifactProjects: ArtifactProject[] = [
  // projects here
  // {
  //   id: "01",
  //   title: "Portfolio",
  //   tagline: "Working.",
  //   year: "2026",
  //   type: "design",
  //   link: "#",
  //   image: "/working.jpg",
  // },
  {
    id: "02",
    title: "Portfolio",
    tagline:
      "Personal portfolio website showcasing selected projects and design work.",
    year: "2026",
    type: "code",
    link: "https://himanshuk951-portfolio.vercel.app/",
    image: "/portfoliocover.png",
  },
];

export const EMPTY_PROJECT_MESSAGE =
  "Project in progress. Will be updated soon";
