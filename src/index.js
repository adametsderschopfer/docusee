import { Validator } from "jsonschema";
import Utils from "./utils.js";
import fs from "fs";
import pretty from "pretty";
import {render} from "ejs";
import * as path from "path";
import rimraf from "rimraf";

export class CreateDocs {
    constructor({ json, path }) {
        if (!json) {
            Utils.errLog("Nothing has been found along this path...");

            return;
        }

        this.json = json;
        this.path = path;
        this.PROJECT_PATH = "docs-html";
        this.schema = getSchema();
    }

    FILES = {
        css: ["template_style.css", "bootstrap.min.css"],
        js: ["bootstrap.bundle.js", "main.js"],
    };

    pathToPublic = path.dirname(
            import.meta.url).replace("file:///", "");

    bugCollector(errs) {
        let errors = [];

        Array.from(errs).map((vErr) => {
            errors = [
                ...errors,
                {
                    argument: vErr.argument,
                    message: vErr.message,
                },
            ];
        });

        return errors;
    }

    validate() {
        Utils.processLog("Validate json...");
        return new Promise((fulfilled, rej) => {
            const v = new Validator();
            const result = v.validate(this.json, this.schema);

            if (result.errors.length) {
                const _errs = this.bugCollector(result.errors);
                Utils.processLog("Validate json => error");

                rej(_errs);
            } else {
                Utils.processLog("Validate json => done");

                fulfilled({ json: result.instance });
            }
        });
    }

    async copyAssets(dir) {
        Utils.processLog("Copy assets...");
        const _path = await this.createDir(dir, "assets");
        Object.keys(this.FILES).map((fileExt) => {
            if (this.FILES[fileExt].length) {
                this.FILES[fileExt].map((file) => {
                    fs.copyFile(
                        `${this.pathToPublic}/public/${fileExt}/${file}`,
                        `${_path}/${file}`,
                        (err) => {
                            if (err) {
                                Utils.errLog(`Asset is not found => ${err}`);
                            }
                        }
                    );
                });
            }
        });
    }

    async createDir(dir, cusDir) {
        const projectPath = `${dir}/${cusDir || this.PROJECT_PATH}`;

        return new Promise(async(fulfilled, rej) => {
            try {
                if (fs.existsSync(projectPath)) {
                    await this.removeDir(projectPath);
                    Utils.processLog("Old dir are removed...");
                }
            } catch (err) {
                rej(err);
            }

            Utils.processLog(`Start create dir in => ${dir}...`);

            fs.mkdir(projectPath, (err) => {
                if (err) {
                    rej();
                    Utils.errLog(JSON.stringify(err, null, 2));
                    return;
                }

                Utils.processLog(`Dir created in => ${projectPath}...`);
                fulfilled(projectPath);
            });
        });
    }

    async removeDir(dir) {
        Utils.processLog("Remove old dir...");
        return new Promise((fulfilled, rej) => {
            rimraf(dir, (err) => {
                if (err) { 
                    rej(err); 
                    return
                } 

                fulfilled(); 
            })
        })
    }

    create(_json) {
        return new Promise(async (fulfilled, rej) => {
            const { dir } = path.parse(this.path);

            try {
                const _path = await this.createDir(dir);
                await this.copyAssets(_path);

                Utils.processLog("Start create template...");

                const template = new DOCSTemplate(_json, this.pathToPublic);
                const buffer = Buffer.from(pretty(template.getTemplate(), { ocd: true }));

                fs.writeFile(`${_path}/index.html`, buffer, "utf-8", (err) => {
                    if (err) {
                        throw err;
                    }

                    Utils.processLog("Template was created...");
                    fulfilled();
                });
            } catch (error) {
                Utils.errLog(`Something went wrong: ${error}`);
                rej()
            }
        })
    }

    async start() {
        try {
            const { json } = await this.validate();

            await this.create(json);
            Utils.doneLog('Docs was created!')
        } catch (err) {
            Utils.errLog(JSON.stringify(err, null, 2));
        }
    }
}

function getSchema() {
    return {
        type: "object",
        properties: { 
            title: {
                type: "string",
            },
            navigation: {
                type: "array",
                items: {
                    type: "object",
                }
            }, 
            content: {
                type: 'array'
            }
        },
        required: ["title", "content"],
    };
}

class DOCSTemplate {
    constructor(data, pathToPublic) {
        this.data = data;
        this.pathToPublic = pathToPublic;
    }

    getHead() {
        return `
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.data.title}</title>

        <link rel="stylesheet" href="./assets/bootstrap.min.css">
        <link rel="stylesheet" href="./assets/template_style.css">
      `;
    }

    getFooter() {
        return `
          <script src="./assets/bootstrap.bundle.js"></script>
          <script src="./assets/main.js"></script>
        `;
    }

    getTemplate() {
        const head = this.getHead();
        const footer = this.getFooter();

        const common = fs.readFileSync(`${this.pathToPublic}/page.ejs`, 'utf-8')

        const html = render(common, {
            head, 
            footer,
            ...this.data
        })

        return html;
    }
}