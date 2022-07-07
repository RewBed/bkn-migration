#!/usr/bin/env node

'use strict';

const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

let Argv = require('./modules/ArgvParser');
let LoadMigrations = require('./modules/dbGeneratorServices/LoadMigrations');

let configFilePath = process.cwd() + "/mg-config.yaml";

// проверка существования конфига
if(fs.existsSync(configFilePath)) {
    try {
        const config = yaml.load(fs.readFileSync(configFilePath, 'utf8'));

        let argv = new Argv();

        // argv.setParam('path', false, false,'./dbStructure');
        argv.setParam('dbName', false, true);
        argv.parse();

        // путь до рабочей папки
        let folderPath = process.cwd() + '/' + config.path.folder + '/' + argv.getParamVal('dbName');

        // проверяем существование папки
        if(!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log('Создана директория: ' + path.resolve(folderPath));
        }



        new LoadMigrations(path.resolve(folderPath), argv.getParamVal('dbName'), config.db.host, config.db.user, config.db.password, config.db.port);
    } catch (e) {
        console.error("Ошибка чтения файла настроек");
    }
}
else {
    console.error("Отсутствует файл настроек");
}




