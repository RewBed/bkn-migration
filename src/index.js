#!/usr/bin/env node

'use strict';

/*
let Argv = require('./modules/ArgvParser');
const fs = require("fs");
const path = require('path');
let LoadMigrations = require('./modules/dbGeneratorServices/LoadMigrations');

let argv = new Argv();

argv.setParam('path', false, false,'./dbStructure');
argv.setParam('dbName', false, true);
argv.parse();

// путь до рабочей папки
let folderPath = argv.getParamVal('path') + '/' + argv.getParamVal('dbName');

// проверяем существование папки
if(!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log('Создана директория: ' + path.resolve(folderPath));
}

new LoadMigrations(path.resolve(folderPath), argv.getParamVal('dbName'));*/

/*
const yaml = require('js-yaml');
const fs   = require('fs');

// Get document, or throw exception on error
try {
    const doc = yaml.load(fs.readFileSync('./mg-config.example.yaml', 'utf8'));
    console.log(doc);
} catch (e) {
    console.log(e);
}

 */

let x = 20;

x = x + 2;

console.log(x);

console.log("START AS GLOBAL");