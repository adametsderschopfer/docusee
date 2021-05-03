#!/usr/bin/env node

const ready = require("../src/ready.js");
const Utils = require("../src/utils.js");

const { _: _path } = Utils.useOptions(process.argv);

ready(_path[0]);