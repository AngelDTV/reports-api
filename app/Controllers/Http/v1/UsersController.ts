// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from "App/Models/Role";
import User from "App/Models/User";

export default class UsersController {


  async index ({ params, response}) {
    if (!params.id) {
      const users = await User.all()
      return response.ok({
        users: users
      })
    }
    const user = await User.find(params.id)
    return response.ok({
      user: user
    })
  }

  async getCollaborators ({response}) {
    try {
      const collabRole = await Role.findByOrFail('name', 'Collaborator')
      const users = await User.findByOrFail('role_id', collabRole.id)

      return response.ok({
        users: users
      })
    } catch (error) {
      return response.badRequest({
        message: "Error al obtener los colaboradores"
      })
    }
  }

  async profile ({ auth, response}) {
    const user = auth.user
    return response.ok(user)
  }

}
