import {RecordDoc} from "../models";
import {NextFunction, Request, Response} from "express";
import * as fs from "fs";
import * as Path from "path";

let IMAGE_DIR: string;
let DIR_PATIENCE: number;
if (process.env.NODE_ENV === "development") {
    IMAGE_DIR = Path.join(__dirname, "../../data/examples/");
    DIR_PATIENCE = 10000000; // very high number
} else {
    // CHANGE HERE BETWEEN TEST AND DEPLOY
    IMAGE_DIR = "\\\\Vcwdapp\\storage$\\SHORTTERM\\0\\0\\";
    // IMAGE_DIR = Path.join(process.cwd(), "data/examples/");
    DIR_PATIENCE = 7200; // 2 hours
}
const NEGATIVE_OFFSET_IN_SECONDS = -10;
const IMAGE_PATIENCE = 120 // 2 minutes
// DIR_PATIENCE makes sure that only directories from the past two hours are chosen
// IMAGE_PATIENCE makes sure that a match only counts within 2 minutes of image creation
// Image to text match works only in one direction (i.e. image is created before text)

export function findDirectory(req: Request, res: Response, next: NextFunction) {
    const records = req.body.records;
    let freezes: string[] = [];
    let bestMatches = 0;
    let bestAvgTimeDiff = 1000; // average time difference between record and (matching) freeze
    let bestDirectory = "";
    const directories: string[] = fs.readdirSync(IMAGE_DIR);
    if (directories.length === 0) {
        const message = "Keinen Ordner gefunden, der innerhalb der letzten zwei Stunden erstellt wurde!";
        console.log(message);
        res.status(404).send({message: message});
    }
    for (const dir of directories) {
        const [matches, avgTimeDiff] = matchDirectory(records, dir);
        console.log("Ordner: ", dir, " | Matches: ", matches, " | Zeit: ", avgTimeDiff);
        if (matches > bestMatches) {
            bestMatches = matches;
            bestAvgTimeDiff = avgTimeDiff;
            bestDirectory = dir;
            console.log("Update bester Ordner: ", bestDirectory)
        } else if (matches === bestMatches && bestMatches !== 0) {
            // if another dir has same number of matches, check average time as second criterion
            if (avgTimeDiff < bestAvgTimeDiff) {
                bestMatches = matches;
                bestAvgTimeDiff = avgTimeDiff;
                bestDirectory = dir;
                console.log("Update bester Ordner: ", bestDirectory)
            }
        }
    }
    if (bestMatches === 0) {
        // no folder with matching freezes found
        const message = "Keinen Ordner gefunden, der zu den Bildern passt.";
        console.log(message);
        res.status(500).send({message: message});
    } else {
        freezes = fileFilter(fs.readdirSync(Path.join(IMAGE_DIR, bestDirectory)));
        req.body.freezes = freezes;
        req.body.directory = bestDirectory;
        next();
    }
}

function matchDirectory(records: RecordDoc[], directory: string): [number, number] {
    // takes directory and first checks for time of creation with DIR_PATIENCE
    // then checks all images (filtered by fileFilter) for match by IMAGE_PATIENCE
    // also finds freeze with minimum time difference to a record to compute avgTimeDiff as second criterion
    let nMatches = 0;
    // get last Modified time of directory and check time difference in UNIX units
    let testTime = Math.round(+fs.statSync(Path.join(IMAGE_DIR, directory)).mtime / 1000);
    const currentTime = Math.round(+new Date() / 1000);
    if (Math.abs(currentTime - testTime) > DIR_PATIENCE) {
        return [0, 1000];
    } else {
        const freezes = fileFilter(fs.readdirSync(Path.join(IMAGE_DIR, directory)));
        let minDiffSum = 0; // variable for storing best times
        for (const record of records) {
            let matched = false; // tracker to only count one match within freezes
            let minDiff = 1000; // minimum time difference for this record
            for (const freeze of freezes) {
                testTime = Math.round(+fs.statSync(Path.join(IMAGE_DIR, directory, freeze)).mtime / 1000);
                let diff = record.timestamp - testTime;
                //if image was created shortly after the text, consider it as a potential match
                if(diff > NEGATIVE_OFFSET_IN_SECONDS){
                    diff = Math.abs(diff);
                }
                // diff > 0: just bother if testTime is actually before record.timestamp (our criterion)
                if (diff > 0) {
                    // diff <= IMAGE_PATIENCE: record must be created within IMAGE_PATIENCE after freeze timestamp
                    // matched: only count image_patience match once per record
                    if (diff <= IMAGE_PATIENCE && !matched) {
                        nMatches += 1;
                        matched = true;
                    }
                    // check for smallest time difference
                    if (diff < minDiff) {
                        minDiff = diff;
                    }
                }
            }
            minDiffSum += minDiff;
        }
        const avgTimeDiff = minDiffSum / records.length; // get average time difference for matched records
        return [nMatches, avgTimeDiff];
    }
}

function fileFilter(files: string[]): string[] {
    // File Filter: Nur jpgs erlaubt und erster character des Strings muss ein 'O' sein
    const result: string[] = []
    for (const file of files) {
        if (file[0] === "O" && file.split(".")[1] === "jpg") {
            result.push(file);
        }
    }
    return result;
}

