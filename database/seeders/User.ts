import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        email: 'angeldtvvv@gmail.com',
        name: 'Angel',
        lastname: 'Del Toro',
        password: '123456',
        roleId: 1,
        points: 20,
        oneTimeCode: 83123
      },
    ])
  }
}
