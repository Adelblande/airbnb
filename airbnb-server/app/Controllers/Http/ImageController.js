'use strict'

const Helpers = use('Helpers')
const Image = use('App/Models/Image')
const Property = use('App/Models/Property')

class ImageController {
  async store({ params, request }) {
    try{

      const property = await Property.findOrFail(params.id)
      
      const images = request.file('image', {
        types: ['image'],
        size: '2mb'
      })
      
      await images.moveAll(Helpers.tmpPath('uploads'), file => ({
        name: `${Date.now()}-${file.clientName}`
      }))
      
      if (!images.movedAll()) {
        return images.errors()
      }

      await Promise.all(
        images
        .movedList()
        .map(image => property.image().create({ path: image.fileName }))
      )
    } catch(err){
      return console.log('Erro nessa porra...', err.message)
    }
  }
}

module.exports = ImageController