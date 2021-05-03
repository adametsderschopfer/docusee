const path = require("path");
const fs = require("fs");

const { CreateDocs } = require("./index.js");
const Utils = require("../src/utils.js");

function ready(p) {
    if (!p) {
        Utils.errLog(
            "You must specify the path like here => \n docusee ./path/to/your/docs.json"
        );
        return;
    }

    Utils.createView();
    const normalizedPath = path.resolve(p);
    const needExt = ".json" || ".json5";
    const ext = path.extname(normalizedPath);

    const errMessage = () =>
        Utils.errLog("Nothing has been found along this path...");

    if (ext && ext !== needExt) {
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

module.exports = ready;