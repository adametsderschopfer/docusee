#!/usr/bin/env node

import {ready} from '../src/ready.js'
import Utils from "../src/utils.js";

const { _: _path } = Utils.useOptions(process.argv);

ready(_path[0]);