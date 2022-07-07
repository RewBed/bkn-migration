let ExecProcess = require('./ExecProcess');

module.exports = class GitProcess extends ExecProcess {

    /**
     * Выполнить git pull
     *
     * @returns {Promise<unknown>}
     */
    pull() {
        return new Promise((resolve, reject) => {
            this.process('git pull')
                .then(() => resolve())
                .catch(() => reject());
        })
    }

    /**
     * Commit and Push
     *
     * @param commitText {string}
     * @returns {Promise<unknown>}
     */
    async commitAndPush(commitText) {

        await this.process('git add .', true);
        let dif = await this.process('git diff --staged', false);

        if(dif) {
            await this.process(`git commit -m "${commitText}"`);
            await this.process('git push');
        }

        return new Promise((resolve) => {
            resolve();
        });
    }
}