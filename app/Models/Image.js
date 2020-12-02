'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env') /* Add Import */ 

class Image extends Model {
    static get computed()  { // Static Method
        return ['url']
    }

    getUrl({ path }) { // Get Path and Create URL using env Variable
        return `${Env.get('APP_URL')}/images/${path}`
    }

}

module.exports = Image
