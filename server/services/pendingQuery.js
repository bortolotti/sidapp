var feathersApp = null;

module.exports = {

    async get(params) {
        return Promise.resolve(
            { id : 1}
        )
    },
    setup(app, path) {
        feathersApp = app
    }
    
}