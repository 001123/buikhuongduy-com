import { execFileSync } from "node:child_process";

export interface PageDates {
  created?: Date;
  modified?: Date;
}

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

/**
 * First and last commit dates touching `files` (paths from the project root), for schema.org `dateCreated`/`dateModified`.
 * Returns nothing outside a git checkout or in a shallow clone, where the history would give wrong dates.
 */
export function gitDates(files: string[]): PageDates {
  if (git(["rev-parse", "--is-shallow-repository"]) !== "false") return {};
  const dates = git(["log", "--format=%cI", "--", ...files]).split("\n").filter(Boolean);
  if (dates.length === 0) return {};
  return { created: new Date(dates.at(-1)!), modified: new Date(dates[0]) };
}
