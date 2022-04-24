// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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


}
