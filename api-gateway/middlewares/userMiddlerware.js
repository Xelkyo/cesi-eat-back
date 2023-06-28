const registry = require('../routes/registry.json')
const jwt = require('jsonwebtoken')

const { protect } = require('./authMiddleware')
const { deliver } = require('./deliverMiddleware')


const userHandler = (req, res, requestOption, next) => {
  const user = registry.services['user']
  const url = user.url + user.action[req.params.path] 
  const path = req.params.path
  console.log(url)
  console.log(requestOption)

  if (req.params.path == 'login' || req.params.path == 'register') {
    console.log('banane')
    deliver(req, res, requestOption, url, path)
  } 

  if (req.params.path == 'restaurants' && protect(req, res, 1, next)) {
    deliver(req, res, requestOption, url, path)
  }

  if (req.params.path == 'restaurant' && protect(req, res, 2, next)) {
    //get token from header
    token = req.headers.authorization.split(' ')[1]
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    url += decoded.id

    deliver(req, res, requestOption, url, path)
  }

  if (protect(req, res, 5, next)) {
    deliver(req, res, requestOption, url, path)
  }

  console.log('nutella')
  //res.send('User not allowed to access this ressorce')
  
}



module.exports = { userHandler } 