#!/usr/bin/env node

const ready = require("../src/ready.js");
const Utils = require("../src/utils.js");
const package = require("../package.json");

const { _: _path, v = undefined } = Utils.useOptions(process.argv);

function bootstrap() {
    if (v) {
        Utils.doneLog(`DOCUSEE version => ${package.version}`);
        return;
    }

    if (_path) {
        ready(_path[0]);
    }
}

bootstrap();