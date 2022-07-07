#!/usr/bin/env node

'use strict';

const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

let Argv = require('./modules/ArgvParser');
let LoadMigrations = require('./modules/dbGeneratorServices/LoadMigrations');
let GitProcess = require('./modules/GitProcess');

let configFilePath = process.cwd() + "/mg-config.yaml";

// настройки
let config = {
    db: {
        host: '',
        username: '',
        password: '',
        port: ''
    },
    path: {
        folder: ''
    }
};

// проверка существования конфига
if(fs.existsSync(configFilePath)) {
    try {
        config = yaml.load(fs.readFileSync(configFilePath, 'utf8'));

        // аргументы при запуске
        let argv = new Argv();
        argv.setParam('dbName', false, true);
        argv.setParam('git', true, false, false);
        argv.parse();

        // путь до рабочей папки
        let folderPath = process.cwd() + '/' + config.path.folder + '/' + argv.getParamVal('dbName');

        // проверяем существование папки
        if(!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log('Создана директория: ' + path.resolve(folderPath));
        }

        let git = new GitProcess();
        let migration = new LoadMigrations(path.resolve(folderPath), argv.getParamVal('dbName'), config.db.host, config.db.user, config.db.password, config.db.port);

        // если есть флаг GIT
        if(argv.getParamVal('git')) {
            git.pull().then(() => {
                migration.load().then(() => {
                    let commit = "update " + new Date().toTimeString();
                    git.commitAndPush(commit).then(r => r);
                });
            });
        }

        // только выгружаем миграцию
        else {
            migration.load().then(r => r);
        }


    } catch (e) {
        console.error("Ошибка чтения файла настроек");
    }
}
else {
    console.error("Отсутствует файл настроек");
}




