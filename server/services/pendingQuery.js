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
-> Cassandra            
CREATE KEYSPACE SID_DW WITH REPLICATION = { 
'class' : 'SimpleStrategy', 
'replication_factor' : 1 
};
  
USE system;
USE sid_dw;
DROP TABLE IND001;
CREATE TABLE IF NOT EXISTS IND001 ( 
   id text PRIMARY KEY, 
   lastname text, 
   firstname text,
   code text,
   data map<text, text> );
select * from ind001
insert into ind001 (id, lastname, firstname, code, data) values ('ddddddddd2', 'birt', 'carlos', 'code', { 'field' : 'value' })
        */
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
            if (regisCodeVar == null) 
                data.push(q) /* Caso não possua variável pendente no redis está na hora de atualizar os dados */
        }

        return data


    },
    setup(app, path) {
        feathersApp = app
    }
    
}