
import Route from '@ioc:Adonis/Core/Route'



import './v1/auth-routes'
import './v1/reports-routes'
import './v1/token-routes'



Route.get('/', async () => {
  return { hello: 'world' }
})
