let mysql = require('mysql');
const fs = require("fs");
const path = require('path');

module.exports = class LoadMigrations {

    connection = {};

    /**
     * Путь до рабочей папки
     *
     * @type {string}
     */
    rootFolder = '';

    /**
     * Путь до файла с запросом для получения процедур
     *
     * @type {string}
     */
    proceduresSql = 'GetProcedures.sql';

    /**
     * Путь до файла с запросом для получения тригеров
     *
     * @type {string}
     */
    triggertSql = 'GetTriggers.sql';

    /**
     * @param rootFolder
     * Папка для сохранения файлов
     *
     * @param dbName
     * Имя базы данных
     */
    constructor(rootFolder, dbName) {
        this.rootFolder = rootFolder;

        this.connection = mysql.createConnection({
            host     : '****',
            user     : '****',
            password : '****',
            database : dbName
        });
        this.connection.connect();

        this.createMigrate(dbName)
            .then(() => {
                this.connection.end();
                console.log('resolve');
            });
    }

    /**
     * Запустить создание миграций
     *
     * @param dbName
     * @returns {Promise<unknown>}
     */
    async createMigrate(dbName) {

        await this.getProcedures(dbName);
        await this.getTables(dbName);
        await this.getTriggers(dbName);

        return new Promise((resolve) => {
            resolve();
        });
    }

    /**
     * Создать файлы для таблиц
     *
     * @param dbName
     * @returns {Promise<void>}
     */
    async getTables(dbName) {

        console.log('Выгрузка таблиц и представлений');

        return new Promise((resolve, reject) => {
            let query = "SHOW FULL TABLES";
            this.connection.query(query, async (error, tables) => {
                if(error)
                    reject();

                let i = 1;
                for (const table of tables) {
                    await this.getCreateTable(table[`Tables_in_${dbName}`]);
                    process.stdout.write("\r" + 'Обработано: ' + i + '/' + tables.length);
                    i++;
                }

                console.log("");
                resolve();
            });
        });

    }

    /**
     * Получить тригеры
     *
     * @returns {Promise<unknown>}
     */
    async getTriggers(dbName) {

        console.log('Выгрузка триггеров');

        return new Promise((resolve, reject) => {
            let query = "show triggers";
            this.connection.query(query, async (error, triggers) => {
                if(error)
                    reject();

                let i = 1;
                for (const trigger of triggers) {
                    await this.getCreateTrigger(trigger.Trigger, dbName);
                    process.stdout.write("\r" + 'Обработано: ' + i + '/' + triggers.length);
                    i++;
                }

                console.log("");
                resolve();
            });
        });
    }

    /**
     * Вернуть код для создания тригера
     *
     * @param triggerName
     * @param dbName
     * @returns {Promise<void>}
     */
    async getCreateTrigger(triggerName, dbName) {
        return new Promise((resolve, reject) => {

            const data = fs.readFileSync(path.join(__dirname, this.triggertSql));
            let query = this.setDBName(data.toString(), dbName);
            query = this.setTableName(query, triggerName)

            this.connection.query(query, (error, results) => {
                if(error)
                    reject();

                let filePath = this.rootFolder + '/' + triggerName + '.sql';
                fs.writeFileSync(filePath, results[0]['text']);

                resolve(results);
            });
        });
    }

    /**
     * Вернуть код для создания таблицы
     *
     * @param tableName
     * @returns {Promise<void>}
     */
    async getCreateTable(tableName) {
        return new Promise((resolve, reject) => {
            this.connection.query("SHOW CREATE TABLE `"+tableName+"`", (error, results) => {
                if(error)
                    reject();

                let filePath = this.rootFolder + '/' + tableName + '.sql';
                fs.writeFileSync(filePath, results[0]['Create Table']);

                resolve(results);
            });
        });
    }

    /**
     * Получить процедуры
     *
     * @param dbName
     */
    async getProcedures(dbName) {

        console.log('Выгрузка процедур и функций...');

        return new Promise((resolve, reject) => {
            try {
                const data = fs.readFileSync(path.join(__dirname, this.proceduresSql));
                let query = this.setDBName(data.toString(), dbName);

                // выгрузка процедур и функций из базы
                this.connection.query(query, (error, results) => {
                    if(error)
                        reject('query err');

                    results.forEach((procedure, index) => {
                        process.stdout.write("\r" + 'Обработано: ' + (index + 1) + '/' + results.length);
                        let filePath = this.rootFolder + '/' + procedure.name + '.sql';
                        fs.writeFileSync(filePath, procedure.text);
                    });

                    console.log("");
                    resolve();
                });

            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Вставить название базы данных в запрос
     * в запросе все фрагменты DB_NAME заменяются на параметр dbName
     *
     * @param sql
     * @param dbName
     * @returns {string}
     */
    setDBName(sql, dbName) {
        const searchRegExp = /DB_NAME/g;
        return sql.replace(searchRegExp, dbName);
    }

    /**
     * Вставить название таблицы в запрос
     * в запросе все фрагментыTABLE_NAME заменяются на параметр tableName
     *
     * @param sql
     * @param tableName
     * @returns {string}
     */
    setTableName(sql, tableName) {
        const searchRegExp = /TABLE_NAME/g;
        return sql.replace(searchRegExp, tableName);
    }
}