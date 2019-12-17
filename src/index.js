"use strict";

const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const cmd = require("./lib/command");
const wf = require("./lib/webfonts");
const _ = require("underscore");
const path =  require("path");
const fs =  require("fs");

module.exports = {
  run: async () => {
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync("WebFont Assistant 🤖", { horizontalLayout: "full" })
      )
    );
    console.log(
      chalk.white.bold(
        "Welcome to WebFont Assistant, just answer the next questions to help you create a newly webfont from your own glyphs 🎉"
      )
    );
    await cmd
      .askFontConfig()
      .run()
      .then(baseConfig => {
        cmd.storeConfig(baseConfig);
        cmd
          .askForFontsFormat()
          .run()
          .then(formats => {
            if (!_.isEmpty(formats)) {
              cmd.setConfigProp("formats", formats);
            } else {
              cmd.setConfigProp("formats", ["ttf"]);
            }
            cmd
              .askForType()
              .run()
              .then(types => {
                if (types === "other") {
                  cmd
                    .askForCustomType()
                    .run()
                    .then(type => {
                      cmd.setConfigProp("styleType", type);
                      cmd.askForTemplate(true, () => {
                        wf.createConfig(cmd.getConfig());
                      });
                    });
                } else {
                  cmd.setConfigProp("styleType", types);
                  cmd.setConfigProp("template", types);
                  cmd.askForTemplate(false, () => {
                    let conf = wf.createConfig(cmd.getConfig());
                    wf.createFont(conf, () => {
                      clear();
                      let name = cmd.getConfig().name
                      console.log(
                        chalk.white.bold(`WebFont ${name} created successfully ✨🎉`)
                      );
                    });
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  },
  runExistent: async (configPath) => {
    clear();
    fs.readFile(path.resolve(__dirname,configPath),"utf8",(err,data)=>{
      if (err){
        console.log(err);
      }else{
        let config = JSON.parse(data);
        wf.createFont(config, () => {
          clear();
          console.log(
            chalk.white.bold(`WebFont ${config.original.name} created from config successfully ✨🎉`)
          );
        });
      }
    })
  }
};
