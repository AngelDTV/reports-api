import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export default class CheckRole {
  public async handle({auth, response, request}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = await auth.user
    if (!user) {
      return response.unauthorized({
        message: 'User is not logged in',
        status: false
      })
    }
    const role = await Role.findOrFail(user.roleId)

    if (request.url().includes('admin')){
      if (!(role.name == 'Admin')) return response.unauthorized()
    }
    if (request.url().includes('supervisor')){
      if (!(role.name == 'Supervisor')) return response.unauthorized()
    }

    await next()
  }
}
