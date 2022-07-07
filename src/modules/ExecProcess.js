const {exec} = require("child_process");

module.exports = class ExecProcess {
    /**
     * Выполнить команду
     *
     * @param command
     * Команда
     *
     * @param print
     * Сразу выводить в консоль
     *
     * @returns {Promise<unknown>}
     */
    async process(command, print = true) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    if(print)
                        console.log(`error: ${error.message}`);
                    reject(error.message);
                }
                if (stderr) {
                    if(print)
                        console.log(`stderr: ${stderr}`);

                    resolve(stderr);
                }

                if(print)
                    console.log(`stdout: ${stdout}`);

                resolve(stdout);
            });
        });
    }
}