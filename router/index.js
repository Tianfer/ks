const Router = require('koa-router')
const router = new Router()

const util = require('../wechat/util')
const paramsConfig = require('../config/params')
const wechat = require('../data/wechat')

const Course = require('../sql/connect/course')
const Manage = require('../sql/connect/manage')
const User = require('../sql/connect/user')

// 评论页面
router.get('/comment', (ctx) => {
  var id = ctx.request.query.id
  if (ctx.cookies.get('user_id')) {
    ctx.redirect(`/html/comment.html?id=${id}`)
  } else {
    ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechat.corpid}&redirect_uri=http%3A%2F%2Fcourse.bgcloud.top%2Fcomment%2FgetUserInfo%3Fid%3D${id}&response_type=code&scope=snsapi_base&agentid=${wechat.agentid}&state=mob_login#wechat_redirect`)
  }
})

// 评论节目获取用户信息
router.get('/comment/getUserInfo', async (ctx) => {
  const query = ctx.request.query
  console.log(query)
  if (query.code) {
    const res = await util.getUserInfo(query.code)
    if (res.errcode === 0) {
      // 设置cookie，过期时间为7天
      ctx.cookies.set('user_id', res.UserId, {
        expires: new Date(Date.now() + 604800000)
      })
      ctx.redirect(`/html/comment.html?id=${query.id}`)
    } else {
      ctx.body = res
    }
  } else {
    ctx.body = '请您登录后再评论'
  }
})

// 评论成功页面
router.get('/comment_success', (ctx) => {
  ctx.redirect('/html/comment_success.html')
})

// 管理界面
router.get('/manage', async (ctx) => {
  const user_id = ctx.cookies.get('user_id')
  if (user_id) {
    const result = await User.getUserInfo(user_id)
    if (result.code === 0) {
      if (result.data[0].level >= 2) {
        ctx.redirect(`/html/manage.html`)
      } else {
        ctx.body = '您暂无权限查看'
      }
    } else {
      ctx.body = result
    }
  } else {
    ctx.redirect(`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${wechat.corpid}&agentid=${wechat.agentid}&redirect_uri=http%3A%2F%2Fcourse.bgcloud.top%2Fmanage%2FgetUserInfo&state=web_login`)
  }
})

// 获取用户信息
router.get('/manage/getUserInfo', async (ctx) => {
  const query = ctx.request.query
  console.log(query)
  if (query.code) {
    const res = await util.getUserInfo(query.code)
    if (res.errcode === 0) {
      const result = await User.getUserInfo(res.UserId)
      // 设置cookie，过期时间为7天
      if (result.code === 0) {
        if (result.data[0].level >= 2) {
          ctx.cookies.set('user_id', res.UserId, {
            expires: new Date(Date.now() + 604800000)
          })
          ctx.redirect(`/html/manage.html`)
        } else {
          ctx.body = '您暂无权限查看'
        }
      } else {
        ctx.body = result
      }
    } else {
      ctx.body = res
    }
  }
})

// 前端获取用户信息
router.get('/api/getUserInfo', async (ctx) => {
  const id = ctx.cookies.get('user_id')
  if (id) {
    const result = await User.getUserInfo(id)
    console.log(result)
    if (result.code === 0) {
      ctx.body = {
        code: 0,
        data: {
          name: result.data[0].name
        }
      }
    } else {
      ctx.body = result
    }
  } else {
    ctx.body = {
      code: 403
    }
  }
})

// 管理界面获取列表
router.post('/api/getCommentList', async (ctx) => {
  ctx.body = await Manage.getCommentList(ctx.request.body)
})

// 管理界面退出
router.get('/api/logout', async (ctx) => {
  ctx.cookies.set('user_id', '', {
    expires: new Date(Date.now() - 3600000)
  })
  ctx.body = {
    code: 0
  }
})

// 管理界面删除单个评论
router.post('/delComment', async (ctx) => {
  console.log(ctx.request.body)
  ctx.body = await Manage.delComment(ctx.request.body)
})

// 查课表页面
router.get('/course', (ctx) => {
  ctx.redirect('/html/course.html')
})

// 获取课程表信息
router.get('/getCourses', async (ctx) => {
  let res = {}
  const query = ctx.request.query
  const result = util.isParamsOk(query, paramsConfig.getCourses)
  if (result.code === 0) {
    res = await Course.getCourses(result.data)
  } else {
    res = result
  }
  ctx.body = res
})

// 获取单个课程信息
router.get('/api/getCourse/:id', async (ctx) => {
  let res = {}
  const params = ctx.params
  const result = util.isParamsOk(params, paramsConfig.getCourse)
  console.log(result)
  if (result.code === 0) {
    res = await Course.getCourse(result.data)
  } else {
    res = result
  }
  ctx.body = res
})

// 评论课程
router.post('/api/commentCourse', async (ctx) => {
  let res = {}
  const user_id = ctx.cookies.get('user_id')
  if (user_id) {
    const body = ctx.request.body
    const result = util.isParamsOk(body, paramsConfig.commentCourse, '[object Object]')
    if (result.code === 0) {
      // const userInfo = await User.getUserInfo('1405020315')
      const userInfo = await User.getUserInfo(user_id)
      if (userInfo.code === 0) {
        res = await Course.commentCourse(result.data, userInfo.data[0])
        // res = await Course.commentCourse(result.data, {
        //   teacher_id: 1405020315,
        //   name: '陈天赋'
        // })
      } else {
        res = userInfo
      }
    } else {
      res = result
    }
  } else {
    res = {
      code: 401,
      msg: '请您登录后再评论'
    }
  }
  ctx.body = res
})

// 获取页面的签名算法
router.get('/api/getSnConfig', async (ctx) => {
  const query = ctx.request.query
  const data = await util.getSnConfig(query.url)
  ctx.body = {
    code: 0,
    data
  }
})

// 获取图片地址
router.post('/api/getImgUrl', async (ctx) => {
  const body = ctx.request.body
  console.log(body)
  const url = await util.getImgUrl(body.serverId)
  ctx.body = {
    code: 0,
    data: url
  }
})

// 其他页面就404
router.get('*', async (ctx) => {
  ctx.body = '404'
})

router.post('*', (ctx) => {
  ctx.body = {
    code: 404,
    msg: '未找到该请求'
  }
})

module.exports = router