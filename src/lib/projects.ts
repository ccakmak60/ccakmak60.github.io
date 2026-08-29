import data from "./projects.json";

export type Project = {
  name: string;
  type: string;
  description?: string;
  url?: string;
};

export const projects: Project[] = data;
