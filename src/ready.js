import * as path from "path";
import * as fs from "fs";

import { CreateDocs } from "./index.js";
import Utils from "../src/utils.js";

export function ready(p) {
    Utils.createView();
    const normalizedPath = path.resolve(p);
    const needExt = ".json" || ".json5";
    const ext = path.extname(normalizedPath);

    const errMessage = () =>
        Utils.errLog("Nothing has been found along this path...");

    if (ext !== needExt) {
        Utils.errLog(`[${ext}] - is not supported`);
        return;
    }
    
    Utils.processLog("Check exists...");

    fs.stat(normalizedPath, (err, stats) => {
        if (err) {
            errMessage();
            return;
        }

        if (stats) {
            fs.readFile(normalizedPath, (err, data) => {
                if (err) {
                    errMessage();
                }
                Utils.processLog("Check file...");

                const json = JSON.parse(data);
                new CreateDocs({ json, path: normalizedPath }).start();
            });
        }
    });
}