export interface Contributor {
  name: string;
  role: "Frontend Developer" | "Backend Developer";
  portfolio: string;
  github: string;
  linkedin: string;
}

export interface ContributorGroup {
  label: string;
  members: Contributor[];
}

/** Swap in real names + URLs when ready — the page renders from this file. */
export const contributorGroups: ContributorGroup[] = [
  {
    label: "Frontend",
    members: [
      {
        name: "Midhun Sujith Nair",
        role: "Frontend Developer",
        portfolio: "https://midhun.me",
        github: "https://github.com/midhun122",
        linkedin: "https://www.linkedin.com/in/midhunsujithnair/",
      },
      {
        name: "Akshay A Kaimal",
        role: "Frontend Developer",
        portfolio: "",
        github: "",
        linkedin: "https://www.linkedin.com/in/akshay-a-kaimal-24b9b5358",
      },
    ],
  },
  {
    label: "Backend",
    members: [
      {
        name: "Aditya S Pai",
        role: "Backend Developer",
        portfolio: "",
        github: "https://github.com/frizzycodes",
        linkedin: "https://www.linkedin.com/in/adithyaspai",
      },
      {
        name: "Jaisal Francis",
        role: "Backend Developer",
        portfolio: "",
        github: "https://github.com/jaisalfrancis77-collab",
        linkedin: "https://www.linkedin.com/in/jaisal-francis-33b1a4281",
      },
    ],
  },
];
