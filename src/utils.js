import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import yargs from "yargs";
import fs from "fs";
import path from "path";
import { hideBin } from "yargs/helpers";

const Utils = {};

Utils.errLog = function(param) {
    console.log(chalk.red.bgBlack.bold(param));
};

Utils.processLog = (text) => {
    console.log(chalk.yellow.bold(text));
};

Utils.doneLog = (text) => {
    console.log(chalk.green.bold(text));
};

Utils.createView = () => {
    clear();

    console.log(
        chalk.yellow(figlet.textSync("DOCUSEE", { horizontalLayout: "full" }))
    );
};

Utils.useOptions = (argv) => {
    const options = yargs(hideBin(argv)).argv;
    return options;
};

export default Utils;