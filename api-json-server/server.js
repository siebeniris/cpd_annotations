// https://robkendal.co.uk/blog/how-to-build-a-restful-node-js-api-server-using-json-files/
//https://github.com/typicode/json-server

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()


server.use(middlewares)
server.use(router)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
})

server.use(jsonServer.bodyParser)
// server.use((req, res, next) => {
//     if (req.method === 'POST') {
//         req.body.createdAt = Date.now()
//     }
//     // Continue to JSON Server router
//     next()
// })

server.listen(9000, () => {
    console.log('JSON Server is running on 9000')
})
