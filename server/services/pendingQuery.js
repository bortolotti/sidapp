const ObjectId = require('mongoose').Types.ObjectId
const QueryModel = require('./query').Model

var feathersApp = null;

module.exports = {
    /* Header-Param: Accept: application/json */
    async find(params) {

        var queries = QueryModel.find()

        var data = new Array()

        for await (const q of QueryModel.find()) {
            const codeVar = await redisClient.getAsync(q.code)
            console.log(codeVar)
            if (codeVar == null) 
                data.push(q) /* Caso não possua variável pendente no redis está na hora de atualizar os dados */
        }

        return data

        // return queries.exec().then(
        //     q => {

        //         var data = new Array()

        //         q.forEach(e => {
        //             const codeVar = await redisClient.get(e.code)
        //             if (codeVar == null)
        //                 data.push(e)

        //             // redisClient.get("DDDD", function (err, reply) {
        //             //     console.log("Entrou redis")
        //             //     // if (reply == null) {
        //             //     //     data.push(e)
        //             //     // }
        //             // })

        //             // if (v == null) {
        //             //     data.push(e)
        //             //     redisClient.set(e.code, e.sqlQuery, function (err, data) {
        //             //         if (err) return
        //             //         redisClient.expire(e.code, e.expireMinutes * 60)
        //             //     })
        //             // }
                        
        //         })

        //         return data
        //     }
        // )

    },
    setup(app, path) {
        feathersApp = app
    }
    
}