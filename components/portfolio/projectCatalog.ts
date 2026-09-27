import repositories from "../../design/github-repositories.json";

export type Project = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  fork: boolean;
  archived: boolean;
  topics: string[];
};

// The shelf is a snapshot of the account's complete public repository listing.
// Keep the source names and descriptions intact, including missing descriptions.
export const projects: Project[] = repositories;

export function shelfTitle(name: string) {
  return name.replace(/[-_]/g, " ");
}
