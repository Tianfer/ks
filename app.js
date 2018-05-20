const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const xmlParser = require('koa-xml-body')
const static = require('koa-static')
// const path = require('path')

const router = require('./router')

app.use(static(`${__dirname}/public`))
app.use(xmlParser())
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
console.log('running at 3000')