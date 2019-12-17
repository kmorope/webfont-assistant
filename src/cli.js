#! /usr/bin/env node

const argv = require("yargs").argv;
const _ = require("underscore");
let command = require("./index");

if (
  !_.isUndefined(argv.config) &&
  !_.isNull(argv.config)
) {
    command.runExistent(argv.config);
} else {
  command.run();
}
