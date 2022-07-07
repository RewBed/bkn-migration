module.exports = class ArgvParser {

    /**
     * Объект хранящий в себе значения параметров
     *
     * @type {{}}
     */
    parseFields = {}

    /**
     * Запустить парсер аргументов
     */
    parse() {

        // цикл нужно начинать с третьего параметра, так как первые два это путь к файлам
        let i = 2;

        // перебор всех параметров
        while (i < process.argv.length) {
            if(this.parseFields.hasOwnProperty(process.argv[i])) {
                let param = this.parseFields[process.argv[i]];

                if(param.isFLag) {
                    param.value = true;
                    i++;
                }
                else {
                    param.value = process.argv[i + 1];
                    i += 2;
                }
            }
            else {
                i++;
            }
        }

        for(let key in this.parseFields) {
            if(this.parseFields[key].isRequired) {
                if(!this.parseFields[key].value) {
                    console.error('Не указан обязательный аргумент: ' + key);
                    process.exit();
                }
            }
        }
    }

    /**
     * Добавляет параметр для парсинга
     *
     *
     * @param alias {String}
     * Имя параметра
     *
     * @param isFLag {boolean}
     * Параметр является флагом, следовательно, у него не может быть значения
     *
     * @param isRequired
     * @param defaultVal
     */
    setParam(alias, isFLag = false, isRequired = false,  defaultVal = '') {
        this.parseFields[alias] = {
            alias,
            isFLag,
            isRequired,
            value: defaultVal
        };
    }

    /**
     * Вернуть значение параметра
     *
     * @param alias
     * @returns {string|*}
     */
    getParamVal(alias) {
        if(this.parseFields.hasOwnProperty(alias)) {
            return this.parseFields[alias].value;
        }
        return '';
    }
}