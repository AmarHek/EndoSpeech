import * as Path from "path";
import * as fs from "fs";

// on app start, initialize all relative directories for file saving etc.
export function initDirectories() {
    if (!fs.existsSync(Path.join(process.cwd(), "data"))) {
        fs.mkdirSync(Path.join(process.cwd(), "data"));
    }
    if (!fs.existsSync(Path.join(process.cwd(), "data/freezes"))) {
        fs.mkdirSync(Path.join(process.cwd(), "data/freezes"));
    }
    if (!fs.existsSync(Path.join(process.cwd(), "data/examples"))) {
        fs.mkdirSync(Path.join(process.cwd(), "data/examples"));
    }
}
