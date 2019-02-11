import { readFileSync } from "fs";

export function readFile(path: string): string {
    return readFileSync(path, "utf8")
        .replace(/\r\n/g, "\n");
}
