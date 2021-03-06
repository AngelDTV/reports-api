// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from "App/Models/Role"
import User from "App/Models/User"

export default class RolesController {


  async create({request, response}){
    const data = request.only(['name'])
    try {
      await Role.create({
        name: data['name']
      })
      return response.created({
        message: 'Role created successfully'
      })
    } catch (error) {
      return response.abort(400, {
        message: error.message
      })
    }
  }

  async assignRole({request, response}){
    const data = request.only(['email', 'roleId'])

    try {
      let user = await User.findByOrFail('email', data['email'])
      let role = await Role.findOrFail(data['roleId'])
      user.roleId = role.id
      await user.save()
      return response.created({
        message: 'Role assigned successfully'
      })
    }catch (error) {
      return response.abort(400, {
        message: error.message
      })
    }
  }

  async getRoles({response}){
    try {
      const roles = await Role.all()
      return response.ok({
        roles: roles
      })
    } catch (error) {
      return response.abort(400, {
        message: error.message
      })
    }
  }
}
