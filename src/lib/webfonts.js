const webfont = require("webfont").default;
const path = require("path");
const fs = require("fs");
const _ = require("underscore");
const loading = require("loading-cli");
let conf = {};

module.exports = {
  createConfig: config => {
    conf = {
      files: path.resolve(__dirname, `${config.glyphs}/*.svg`),
      fontName: config.prefix,
      dest: path.resolve(__dirname, config.output),
      template: config.isCustomTemplate
        ? path.resolve(__dirname, config.template)
        : config.styleType,
      templateFontPath: path.resolve(__dirname, config.output),
      fixedWidth: true,
      fontHeight: 1000,
      formats: config.formats,
      original: config
    };
    module.exports.saveConfig(conf);
    return conf;
  },
  createFont: (config,callback) => {
    const load = loading({
      text: "Creating WebFont",
      color: "white",
      frames: ["◰", "◳", "◲", "◱"]
    }).start();
    webfont(config)
      .then(result => {
        config.formats.forEach(format => {
          let writeFont = fs.createWriteStream(
            path.resolve(
              __dirname,
              `${config.original.output}/${config.original.name}.${format}`
            )
          );
          writeFont.write(result[format]);
          writeFont.end();
        });

        let writeStyle = fs.createWriteStream(
          path.resolve(
            __dirname,
            `${config.original.output}/${config.original.name}.${config.original.styleType}`
          )
        );
        writeStyle.write(result.template);
        writeStyle.end();

        load.stop();

        callback();
      })
      .catch(err => {
        load.stop();
        console.error(error);
      });
  },
  saveConfig: (config)=>{
    let json = JSON.stringify(config);
    fs.writeFile(path.resolve(__dirname,`${config.original.output}/${config.original.name}.was`), json, 'utf8', ()=>{
      console.log("Configuration file created");
    });
  }
};
