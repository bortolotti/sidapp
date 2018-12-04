const ObjectId = require('mongoose').Types.ObjectId
const QueryModel = require('./query').Model

var feathersApp = null;

module.exports = {
    /* Header-Param: Accept: application/json */
    async create(params) {
/*
    "databaseConnectionSettings" : {
        "user" : "tasy",
        "password" : "tasy",
        "connectionString" : "vm-oracle:1521/projjetta"
    }
*/    
        console.log(params)

        if (params != null && params.length > 0) {

            params.forEach(async function (v, i) {

                const q = await QueryModel.find({ "code" : { "$eq" : v.code } })
    
                if (q != null && q.length > 0) {
    
                    var code = q[0].code
                    var expireMinutes = q[0].expireMinutes || 1
    
                    if (code != '') {
                        /* Criar variável no redis */
                        redisClient.set(code, "1", "EX", expireMinutes * 60)
                    }
    
                    // TODO: Carregar os dados no Cassandra
                    if (v.data != null && v.data.length > 0) {
                        console.log('Carregando dados no Cassandra')
                    }
    
                }
    
            })

        }

        return Promise.resolve([])
    },

    async find(params) {

        var queries = QueryModel.find()

        var data = new Array()

        for await (const q of QueryModel.find()) {
            const regisCodeVar = await redisClient.getAsync(q.code)
            console.log(regisCodeVar)
            if (regisCodeVar == null) 
                data.push(q) /* Caso não possua variável pendente no redis está na hora de atualizar os dados */
        }

        return data

        // return queries.exec().then(
        //     q => {

        //         var data = new Array()

        //         q.forEach(e => {
        //             const regisCodeVar = await redisClient.get(e.code)
        //             if (regisCodeVar == null)
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