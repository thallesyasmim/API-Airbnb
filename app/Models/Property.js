'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Database = use('Database')

class Property extends Model {
    user() {
        return this.belongsTo('App/Models/User')
    }

    images() {
        return this.hasMany('App/Models/Image')
    }

    static scopeNearBy (query, latitude, longitude, distance) { // Scope Query
        const haversine = `(6371 * acos(cos(radians(${latitude}))
          * cos(radians(latitude))
          * cos(radians(longitude)
          - radians(${longitude}))
          + sin(radians(${latitude}))
          * sin(radians(latitude))))` // Calculus Naval
      
        return query // Avanced Query For PostgreSQL Database
          .select('*', Database.raw(`${haversine} as distance`)) // Return Property Close distance
          .whereRaw(`${haversine} < ${distance}`)
      }
}

module.exports = Property
