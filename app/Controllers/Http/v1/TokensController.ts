// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Token from 'App/Models/Token'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class TokensController {

  async create({response, request}){
    try {
      let email = request.input('email')
      const user = await User.findByOrFail('email', email)
      const prevTokens = await Token.query().where('user_id', user.id).where('status', 'active').first()
      if (prevTokens) {
        prevTokens.status = 'inactive'
        await prevTokens.save()
      }
      const payload = cuid()
      const hashedPayload = await Hash.make(payload)
      await Token.create({
        payload: hashedPayload,
        userId: user.id,
        status: 'active'
      })
      return response.created({
        message: 'Token created successfully',
        token: payload
      })
    } catch (error) {
      return response.badRequest({
        message: "Something went wrong",
        status: false
      })
    }
  }


}
