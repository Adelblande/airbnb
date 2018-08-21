'use strict'

const Property = use('App/Models/Property')
/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Show a list of all properties.
   * GET properties
   */
  async index ({ request }) {
    const { latitude, longitude } = request.all()

    const properties = Property.query()
      .nearBy(latitude, longitude, 10)
      .fetch()
    
    return properties
  }

    /**
   * Create/save a new property.
   * POST properties
   */
  async store ({ auth, request }) {
    const { id } = auth.user
    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ])

    const properties = await Property.create({
      ...data,
      userId: id
    })

    return properties
  }

  /**
   * Display a single property.
   * GET properties/:id
   */
  async show ({ params }) {
    const property = await Property.findOrFail(params.id)
    await property.load('images')
    return property
  }

  /**
   * Update property details.
   * PUT or PATCH properties/:id
   */
  async update ({ params, request }) {
    const property = await Property.findOrFail(params.id)

    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ])

    property.merge(data)
    await property.save()

    return property
  }

  /**
   * Delete a property with id.
   * DELETE properties/:id
   */
  async destroy ({ params, request, response }) {
    const property = await Property.findOrFail(params.id)
    if(property.userId !== auth.user.id) {
      return response.status(401).send({error: 'Not Authorized'})
    }
    await property.delete()
  }
}

module.exports = PropertyController
