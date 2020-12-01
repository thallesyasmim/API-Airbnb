'use strict'

const User = use('App/Models/User') // import Model User

class UserController {
    async create({ request }) { // First Method - Create
        const data = request.only(['username', 'email', 'password']) // Devolve como um objeto esses dados do corpo da requisição

        console.log(data) // { username: ..., email: ..., password: ... }

        const user = await User.create(data); // Create User

        console.log(user) // Ultimate User

        return user // JSON
    }
}

module.exports = UserController
