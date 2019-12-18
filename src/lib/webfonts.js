const webfont = require("webfont").default;
const fs = require("fs");
const chalk = require("chalk");
const _ = require("underscore");
const loading = require("loading-cli");
let conf = {};

module.exports = {
  createConfig: config => {
    conf = {
      files: `${config.glyphs}/*.svg`,
      name:config.name,
      fontName: config.prefix,
      fontId:config.prefix,
      dest: config.output,
      template: config.isCustomTemplate ? config.template : config.styleType,
      templateFontName: config.name,
      fixedWidth: true,
      fontHeight: 1000,
      formats: config.formats,
      styleType:config.styleType
    };
    module.exports.saveConfig(conf);
    return conf;
  },
  createFont: (config, callback) => {
    const load = loading({
      text: chalk.green.bold("Creating WebFont"),
      color: "white",
      frames: ["◰", "◳", "◲", "◱"]
    }).start();
    webfont(config)
      .then(result => {
        config.formats.forEach(format => {
          let writeFont = fs.createWriteStream(
            `${config.dest}/${config.name}.${format}`
          );
          writeFont.write(result[format]);
          writeFont.end();
        });

        let writeStyle = fs.createWriteStream(
          `${config.dest}/${config.name}.${config.styleType}`
        );
        writeStyle.write(result.template);
        writeStyle.end();

        load.stop();

        callback();
      })
      .catch(err => {
        load.stop();
        console.log(error);
      });
  },
  saveConfig: config => {
    let json = JSON.stringify(config);
    fs.writeFile(
      `${config.dest}/${config.name}.was`,
      json,
      "utf8",
      err => {
        if (err) {
          return console.error(err);
        }
        console.log("Configuration file created");
      }
    );
  }
};
