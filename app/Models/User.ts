import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Report from './Report'
import Appoinment from './Appoinment'
import Token from './Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public name: string

  @column()
  public oneTimeCode?: number

  @column()
  public lastname: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public points: number

  @column()
  public roleId: number

  @hasMany(() => Report)
  public reports: HasMany<typeof Report>

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Appoinment)
  public appoinments: HasMany<typeof Appoinment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
