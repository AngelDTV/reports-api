import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Token from 'App/Models/Token'
import Hash from '@ioc:Adonis/Core/Hash'
import AuthController from 'App/Controllers/Http/v1/AuthController'

export default class CheckToken {
  public async handle({request, response, auth}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const authController = new AuthController()
    const user = await auth.user
    if (!user) {
      return response.unauthorized({
        message: 'User is not logged in',
        status: false
      })
    }
    let role = await authController.getUserRole(user)

    if (role === 'Admin') {
      return await next()
    }
    const token = request.input('token')
    if (!token) {
      return response.methodNotAllowed({
        message: 'Token is required',
        status: false
      })
    }

    const tokenObj = await Token.query().where('user_id', user.id).where('status', 'active').first()
    if (!tokenObj) {
      return response.methodNotAllowed({
        message: 'Token is not valid',
        status: false
      })
    }

    if (!(await Hash.verify(tokenObj.payload, token))) {
      return response.methodNotAllowed({
        message: 'Token is invalid',
        status: false
      })
    }

    tokenObj.status = 'inactive'
    await tokenObj.save()

    await next()
  }
}
