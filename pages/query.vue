<template>
  <v-layout 
    row 
    wrap>
    <v-layout>
      <v-flex 
        text-xs-left
        xs4
        ma-1>
        <span class="title">Queries</span>

        <v-text-field
          v-model="query.code"
          label="Code"
          maxlength="10"
          :disabled="(query._id != null)? true : false"
          type="text" />

        <v-text-field
          v-model="query.name"
          maxlength="100"
          label="Name"
          type="text" />

        <v-textarea
          v-model="query.sqlQuery"
          label="Query"
          rows="3" />

        <v-text-field
          v-model="query.sqlConnection.connectionString"
          label="SQL Connection String"
          type="text" />          
        
        <v-text-field
          v-model="query.sqlConnection.user"
          label="SQL User"
          type="text" />          

        <v-text-field
          v-model="query.sqlConnection.password"
          label="SQL Password"
          type="password" />

        <v-text-field
          v-model="query.expireMinutes"
          label="Expire Cache (Minutes)"
          type="number" />

        <v-textarea
          v-model="query.dataRepository.createTableScript"
          label="Create Table Script"
          rows="3" />

        <v-textarea
          v-model="query.dataRepository.insertScript"
          label="Insert Script"
          rows="3" />

        <v-btn v-on:click="addOrUpdateQuery" round color="primary" dark>Save</v-btn>
        <v-btn v-on:click="clear" round dark>Clear</v-btn>

        <v-list>
          <v-list-tile 
            v-for="(l, i) in queries" 
            :key="i"
            :color="(query._id == l._id)?'white':' grey'"
            @click="query = l">
            <v-list-tile-content>
              <span class="heading">{{ l.code }}, {{ l.name }}</span>
              <span class="caption">Atualizado em {{ l.lastUpdate }}</span>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

      </v-flex>

      <!-- 
      <v-flex 
        v-if="current_location != null" 
        xs8
        ma-1>
        <v-flex xs12>
          <span class="title">Rotas</span>
        </v-flex>
        <v-layout
          row 
          wrap>
          <v-flex
            xs8
            pr-1>
            <v-select
              v-model="new_target"
              :items="available_targets.map(i => i.name)"
              label="Destino" />
          </v-flex>
          <v-flex 
            xs2 
            pl-1>
            <v-text-field 
              v-model="new_distance"
              type="number"
              label="Distância" />          
          </v-flex>
          <v-flex 
            xs2
            pl-1>
            <v-btn @click="addRoute()"><v-icon>add</v-icon></v-btn>
          </v-flex>
        </v-layout>
        <v-list 
          two-line>
          <v-list-tile 
            v-for="(r, i) in current_routes" 
            :key="i">
            <v-list-tile-content>
              <span class="heading">{{ r.location.name }}</span>
              <span class="caption">{{ r.distance }} Km</span>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      -->
            
    </v-layout>
  </v-layout>
</template>
<script>
export default {
  asyncData(app) {
    return app.$axios.get('/query')
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.error(error)
        return []
      })
      .then(records => {
        var result = {
          queries: records
        }
        return result
      })
  },
  data () {
    return {
      query: {
          _id : null,
          code : '',
          name : '',
          sqlQuery : '',
          expireMinutes : 2,
          lastUpdate : null,
          sqlConnection : {
            connectionString: '',
            user: '',
            password: ''  
          },
          dataRepository : {
            createTableScript : '',
            insertScript: ''
          }
      }
    }
  },
//   computed: {
//     available_targets: function () {
//       if(!this.current_location || !this.current_location.routes) {
//         return this.queries
//       }

//       var available = this.queries
//         .filter(l => {
//           return this.current_routes
//             .filter(r => r.location._id == l._id).length == 0
//         })
//         .filter(l => l._id !== this.current_location._id)
//       return available
//     },
//     current_location: function () {
//       if (!this.current) {
//         return null
//       }
//       var selected = this.queries.filter(i => i._id === this.current)[0]
//       return selected
//     },
//     current_routes: function () {
//       if (!this.current_location || !this.current_location.routes) {
//         return []
//       }

//       var r = this.current_location.routes || []
//       return r.map(r => {
//           return {
//             location: this.queries.filter(l => l._id === r.target)[0],
//             distance: this.current_location.routes[r]
//           }
//         })
//     }
//   },
  methods: {

    clear() {
        this.query = {
          _id : null,
          code : '',
          name : '',
          sqlQuery : '',
          expireMinutes : 2,
          lastUpdate : null,
          sqlConnection : {
            connectionString: '',
            user: '',
            password: ''  
          },
          dataRepository : {
            createTableScript : '',
            insertScript: ''
          }
        }
    },

    addOrUpdateQuery () {

      if (this.query == null)
        return
      
      var newQuery = ((this.query._id || '') == '')

      if (newQuery) {
        if (((this.query.code || '') == '') || 
            (this.queries.filter(i => i.code === this.query.code).length > 0)) {
            alert('Invalid Code')
            return
        }
      }

      if ((this.query.name || '') == '') {
          alert('Name is required')
          return
      }

      if ((this.query.sqlQuery || '') == '') {
          alert('SQL query is required')
          return
      }

      var sqlConnection = this.query.sqlConnection

      if (sqlConnection == null) {
          alert('SQL connection information is required')
          return
      }

      if ((sqlConnection.connectionString || '') == '') {
          alert('SQL connection string is required')
          return
      }

      if ((sqlConnection.user || '') == '') {
          alert('SQL connection user is required')
          return
      }
      
      if ((sqlConnection.password || '') == '') {
          alert('SQL connection password is required')
          return
      }

      if ((this.query.expireMinutes || 0) == 0) {
          alert('Expire cache is required')
          return
      }

      var dataRepository = this.query.dataRepository

      if (dataRepository == null) {
          alert('Data repository information is required')
          return
      }

      if ((dataRepository.createTableScript || '') == '') {
          alert('Create table script is required')
          return
      }

      if ((dataRepository.insertScript || '') == '') {
          alert('Insert script is required')
          return
      }

      if (newQuery)
        this.$axios.post('/query', this.query)
            .then(result => {
              console.log('Query was been created:', result.data)
              this.queries.push(result.data)
              this.clear()
            })
            .catch(error => console.error('Failed to create this query:', error))

      else
        this.$axios.put('/query', this.query)
            .then(result => {
              console.log('Query was been updated:', result.data)
              this.clear()
            })
            .catch(error => console.error('Failed to update this query:', error))

    }
  }
}
</script>
