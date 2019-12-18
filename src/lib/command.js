"use strict";

const path = require("path");
const { Form, Input, Confirm, MultiSelect, Select } = require("enquirer");
let config = {};

module.exports = {
  storeConfig: configuration => {
    config = configuration;
  },
  setConfigProp: (name,value)=>{
    config[name] = value;
  },
  getConfig: () => {
    return config;
  },
  showConfig: () => {
    console.log(module.exports.getConfig());
  },
  askFontConfig: () => {
    const prompt = new Form({
      name: "user",
      message: "Basic font configuration:",
      choices: [
        { name: "name", message: "Font Name", initial: "MyAwesomeFont" },
        { name: "prefix", message: "Icons prefix", initial: "my-icon" },
        { name: "output", message: "Output Path", initial: "assets/fonts/" },
        {
          name: "glyphs",
          message: "Glyph´s Path",
          initial: "assets/images/svg"
        }
      ]
    });

    return prompt;
  },
  askForTemplate: (required,callback) => {
    if(required === true){
      const promptReq = new Input({
        message: "What is your template path?",
        initial: "../templates/template.any",
        requred:true
      });
      promptReq.run().then(template => {
        module.exports.setConfigProp("template",template);
        module.exports.setConfigProp("isCustomTemplate",true);
        callback();
      })
      .catch(error => {
        console.log(error);
      });
    }else{
      const prompt = new Confirm({
        name: "templates",
        message: "Did you has your own template?"
      });
      prompt.run().then(value => {
        if (value === true) {
          const promptTo = new Input({
            message: "What is your template path?",
            initial: "../templates/template.css.any"
          });
          promptTo.run().then(template => {
            module.exports.setConfigProp("template",template);
            module.exports.setConfigProp("isCustomTemplate",true);
            callback();
          })
          .catch(error => {
            console.log(error);
          });
        }else{
          module.exports.setConfigProp("isCustomTemplate",false);
          callback();
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
    
  },
  askForFontsFormat: () => {
    const prompt = new MultiSelect({
      name: "value",
      message: "Which font types you need?",
      limit: 6,
      choices: [
        { name: "svg", value: "svg" },
        { name: "ttf", value: "ttf" },
        { name: "eot", value: "eot" },
        { name: "woff", value: "woff" },
        { name: "woff2", value: "woff2" }
      ]
    });

    return prompt;
  },
  askForType: () =>{
    const prompt = new Select({
      name: 'color',
      message: 'Pick a file type for style',
      choices: ['css', 'scss','other']
    });
    return prompt;
  },
  askForCustomType: ()=>{
    const promptType = new Input({
      message: "What format do you want to use?",
      initial: "less"
    });
    return promptType;
  }
};
