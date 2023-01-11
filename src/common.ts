import Os from "os";
import path from "path";

const DB_FILENAME = "scraperdb";

export function getDatabasePath(): string {
  return path.join(Os.homedir(), ".boat-scraper", DB_FILENAME);
}
