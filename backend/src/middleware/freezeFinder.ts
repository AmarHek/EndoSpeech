import {Freeze, FreezeDoc} from "../models";
import {NextFunction, Request, Response} from "express";
import * as fs from "fs";
import * as Path from "path";

let IMAGE_DIR: string;
let DIR_PATIENCE: number;
if (process.env.NODE_ENV === "development") {
    IMAGE_DIR = Path.join(__dirname, "../../data/examples/");
    DIR_PATIENCE = 10000000; // very high number
} else {
    IMAGE_DIR = "\\\\Vcwdapp\\storage$\\SHORTTERM\\0\\0\\";
    DIR_PATIENCE = 7200; // 2 hours
}
const IMAGE_PATIENCE = 120 // 2 minutes
// DIR_PATIENCE makes sure that only directories from the past two hours are chosen
// IMAGE_PATIENCE makes sure that a match only counts within 2 minutes of image creation
// Image to text match works only in one direction (i.e. image is created before text)

export function findDirectory(req: Request, res: Response, next: NextFunction) {
    const records = req.body.records;
    let freezes: string[] = [];
    let bestMatches = 0;
    let sameCounter = 0;
    let rightDirectory = "";
    const possibleDirectories: string[] = fs.readdirSync(IMAGE_DIR);
    if (possibleDirectories.length === 0) {
        res.status(500).send({message: "Keinen passenden Ordner gefunden. Bitte manuell auswählen."});
    }
    for (const dir of possibleDirectories) {
        const matches = countMatches(records, dir);
        console.log(dir, matches)
        if (matches > bestMatches) {
            rightDirectory = dir;
            bestMatches = matches;
            sameCounter = 0;
        } else if (matches === bestMatches && bestMatches !== 0) {
            sameCounter += 1;
        }
    }
    if (bestMatches === 0) {
        res.status(500).send({message: "Keinen passenden Ordner gefunden. Bitte manuell auswählen."});
    } else if (sameCounter > 0) {
        res.status(500).send({message: (sameCounter + 1) + " mögliche Ordner gefunden. Bitte manuell auswählen."});
    } else if (rightDirectory.length > 0) {
        freezes = fileFilter(fs.readdirSync(Path.join(IMAGE_DIR, rightDirectory)));
        req.body.freezes = freezes;
        req.body.directory = rightDirectory;
        next();
    } else {
        res.status(500).send({message: "Keinen passenden Ordner gefunden. Bitte manuell auswählen."});
    }

}

function countMatches(records: any, directory: string): number {
    let nMatches = 0;
    // get last Modified time of directory and check time difference in UNIX units
    let testTime = Math.round(+fs.statSync(Path.join(IMAGE_DIR, directory)).mtime / 1000);
    const currentTime = Math.round(+new Date() / 1000);
    if (Math.abs(currentTime - testTime) > DIR_PATIENCE) {
        return 0;
    } else {
        const freezes = fileFilter(fs.readdirSync(Path.join(IMAGE_DIR, directory)));
        for (const record of records) {
            for (const freeze of freezes) {
                testTime = Math.round(+fs.statSync(Path.join(IMAGE_DIR, directory, freeze)).mtime / 1000);
                const diff = record.timestamp - testTime;
                // diff > 0: testTime must be before record.timestamp
                // diff <= IMAGE_PATIENCE: record must be created within IMAGE_PATIENCE after freeze timestamp
                if (diff <= IMAGE_PATIENCE && diff > 0) {
                    nMatches += 1;
                    break;
                }
            }
        }
        return nMatches;
    }
}

function fileFilter(files: string[]): string[] {
    // TODO: An erster Stelle O raushauen
    // TODO: nur jpg erlauben
    const result: string[] = []
    for (const file of files) {
        if (file[0] === "O" && file.split(".")[1] === "jpg") {
            result.push(file);
        }
    }
    return result;
}

