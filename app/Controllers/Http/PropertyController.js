'use strict'

const Property = use('App/Models/Property')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Show a list of all properties.
   * GET properties
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request }) { // List property
    const { latitude, longitude } = request.all()
  
    const properties = Property.query() // Find Property as 10km Distance
      .with('images')
      .NearBy(latitude, longitude, 10)
      .fetch()
  
    return properties
  }  

  /**
   * Render a form to be used for creating a new property.
   * GET properties/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
 

  /**
   * Create/save a new property.
   * POST properties
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) { // Create Property
    const { id } = auth.user // Find Id User Authentication
    const data = request.only([ // Return Object
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ])

    const property = await Property.create({ ...data, user_id: id })

    return property

  }

  /**
   * Display a single property.
   * GET properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const property = await Property.findOrFail(params.id)
    
    await property.load('images') // Loading Images With Property

    return property

  }

  /**
   * Render a form to update an existing property.
   * GET properties/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
 
  /**
   * Update property details.
   * PUT or PATCH properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const property = await Property.findOrFail(params.id)

    const data = request.only([ // Return Object
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ])

    property.merge(data) // Update Data

    await property.save() // Async

    return property

  }

  /**
   * Delete a property with id.
   * DELETE properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const property = await Property.findOrFail(params.id)

    if(property.user_id !== auth.user.id) { // Se o imóvel não for do usuário autenticado...
      return response.status(401).send({ error: 'Not authorized' }) // Não autorize ele deletar o imóvel
    }

    await property.delete()
  }
}

module.exports = PropertyController
