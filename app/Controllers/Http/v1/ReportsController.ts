// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Appoinment from "App/Models/Appoinment"
import Report from "App/Models/Report"
import User from "App/Models/User"
import { DateTime } from "luxon"

export default class ReportsController {
  async create ({ request, response }) {
    const data = request.only(['type', 'description', 'points', 'user_id'])
    const reportObj = {
      type: data['type'],
      description: data['description'],
      points: data['points'],
      userId: data['user_id']
    }
    try {
      const user = await User.findOrFail(data['user_id'])
      if (reportObj.type === 'demerit'){
        user.points = user.points - reportObj.points
      }else{
        user.points = user.points + reportObj.points
      }
      await user.save()
      await Report.create(reportObj)
      return response.created({
        message: 'Report created successfully'
      })
    }catch (error) {
      return response.abort(400, {
        message: error.message
      })
    }

  }

  async index ({params, response}){
    if (params.id){
      const user = await User.findOrFail(params.id)
      const reports = await Report.findByOrFail('user_id', user.id)
      return response.ok(reports)
    }else{
      const reports = await Report.all()
      return response.ok(reports)
    }
  }

  async show ({params, response}){
    const report = await Report.findOrFail(params.id)
    return response.ok(report)
  }

  async update ({params, request, response}){
    const data = request.only(['description', 'points'])
    const report = await Report.findOrFail(params.id)
    report.description = data['description'] ? data['description'] : report.description
    if (data['points']){
      const user = await User.findOrFail(report.userId)
      if (report.type === 'demerit'){
        user.points = user.points - data['points']
      }else{
        user.points = user.points + data['points']
      }
    }
    await report.save()
    return response.ok({
      message: 'Report updated successfully'
    })
  }
  async delete ({params, response}){
    try {
      const report = await Report.findOrFail(params.id)
      const user = await User.findOrFail(report.userId)
      if (report.type === 'demerit'){
        user.points = user.points + report.points
      }else{
        user.points = user.points - report.points
      }
      await user.save()
      await report.delete()
      return response.ok({
        message: 'Report deleted successfully'
      })
    } catch (error) {
      return response.notFound({
        message: 'Report not found'
      })
    }
  }

  async appealReport({ request, response}){
    const data = request.only(['report_id'])
    const report = await Report.findOrFail(data['report_id'])
    report.appealed = true
    await report.save()
    const appoinment = await Appoinment.create({
      userId: report.userId,
      date: DateTime.local().plus({days: 1})
    })
    return response.ok({
      message: 'Report appealed successfully',
      appoinment_date: appoinment.date
    })
  }

}
