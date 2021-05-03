const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

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

module.exports = Utils;