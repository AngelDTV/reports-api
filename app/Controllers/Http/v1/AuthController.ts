// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import Role from "App/Models/Role"
import User from "App/Models/User"
import Hash from '@ioc:Adonis/Core/Hash'
import Env from '@ioc:Adonis/Core/Env'
import View from "@ioc:Adonis/Core/View"
import Mail from "@ioc:Adonis/Addons/Mail"

export default class AuthController {

  async register ({ request, response})
  {
    const data = request.only(['email', 'name', 'lastname', 'password'])
    let code = await this.generateOneTimeCode(100000, 999999)
    let role = await Role.findByOrFail('name', 'Collaborator')
    let userObject = {
      name: data['name'],
      lastname: data['lastname'],
      email: data['email'],
      password: data['password'],
      roleId: role.id,
      points: 20,
      oneTimeCode: code
    }
    try {
      await User.create(userObject)
      return response.created({
        message: 'User created successfully'
      })
    } catch (error) {
      return response.abort(400, {
        message: error.message
      })
    }

  }

  async login ({ request, response, auth }){
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await User.findByOrFail('email', email)
      let role = await this.getUserRole(user)
      if (role === 'Admin' || role === 'Supervisor') {
        if (!(await Hash.verify(user.password, password))) {
          return response.badRequest({
            message: 'Invalid credentials',
            role: role,  // This is for the frontend to know if the user is admin or not
            status: false
          })
        }
        await this.sendCodeEmail(user.email)
        return response.ok({
          message: 'Credentials are valid',
          role: role,  // This is for the frontend to know if the user is admin or not
          status: true
        })
      }

      const token = await auth.use('api').attempt(email, password)
      return response.ok({
        message: 'login successful',
        role: role,  // This is for the frontend to know if the user is admin or not
        status: true,
        token: token
      })

    } catch (error) {
      return response.notFound({
        message: 'User not found',
        status: false
      })
    }
  }

  async getUserRole(user: User){
    let role = await Role.findOrFail(user.roleId)
    return role?.name
  }

  async loginWithOneTimeCode({ request, response, auth }) {
    let code = request.input('code')
    let email = request.input('email')
    try {
      const user = await User.findByOrFail('email', email)
      if (user.oneTimeCode === code) {
        let role = await this.getUserRole(user)
        if (role === 'Admin' || role === 'Supervisor') {
          if (role === 'Supervisor') {
            const token = await auth.use('api').generate(user)
            return response.ok({
              message: 'Credentials are valid',
              role: role,  // This is for the frontend to know if the user is admin or not
              status: true,
              token: token
            })
          }
          return response.ok({
            message: 'Credentials are valid',
            role: role,  // This is for the frontend to know if the user is admin or not
            status: true,
          })
        }
        return response.ok({
          message: 'Not authorized',
          role: role,  // This is for the frontend to know if the user is admin or not
          status: false
        })
      }
    } catch (error) {

    }

  }

  async loginMobile({request, response, auth}){
    const email = request.input('email')
    const password = request.input('password')

    try {
      await User.findByOrFail('email', email)
      const token = await auth.use('api').attempt(email, password)
      return response.ok({
        token: token['token']
      })
    } catch (error) {
      return response.badRequest({
        message: 'Something went wrong',
      })
    }
  }

  async loginWithApp({request, auth, response}){
    const email = request.input('email')
    try {
      const user = await User.findByOrFail('email', email)
      const token = await auth.use('api').generate(user)
      return response.ok({
        token: token
      })
    }catch (error) {
      console.log(error)
      return response.notFound({
        token: null
      })
    }
  }

  async generateOneTimeCode(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  public async sendCodeEmail(email) {
    const user = await User.findByOrFail('email', email)
    try {
      let newCode = await this.generateOneTimeCode(1000, 9999)
      user.oneTimeCode = newCode
      await user.save()
      const html = await View.render('mails/one_time_code', {
        code: user.oneTimeCode
      })

      await Mail.use('smtp').send((message) => {
        message
          .from(Env.get('MAIL_FROM_ADDRESS') as string)
          .to(user.email)
          .subject('Solicitud de cambio de contraseña')
          .html(html)
      })
      return true
    } catch (error) {
      return false
    }
  }

  public async logout({auth, response}){
    try {
      await auth.use('api').logout()
      return response.ok({
        message: 'Logout successful'
      })
    } catch (error) {
      return response.badRequest({
        message: 'Something went wrong'
      })
    }
  }


}