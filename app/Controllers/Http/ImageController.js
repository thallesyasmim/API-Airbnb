'use strict'

// Import Models What using for Create, etc
const Image = use('App/Models/Image')
const Property = use('App/Models/Property')

const Helpers = use('Helpers')

class ImageController {
    async store({ params, request }) { // Create Method
        const property = await Property.findOrFail(params.id) // Find Property

        const images = request.file('image', { // Find Images for Multipart Form Data 
            types: ['image'],
            size: '2mb'
        })


        await images.moveAll(Helpers.tmpPath('uploads'), file => ({ // Move Images folder 'Uploads'
            name: `${Date.now()}-${file.clientName}` // Moment + File.clientName
        }))

        if(!images.movedAll()) { 
            return images.errors()
        }

        await Promise.all(
            images
                .movedList()
                .map(image => property.images().create({ path: image.fileName })) // Create Relationship For Property
        )
    }

    async show ({ params, response }) { // Return One Image
        return response.download(Helpers.tmpPath(`uploads/${params.path}`))
    }
}

module.exports = ImageController