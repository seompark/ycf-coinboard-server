const express = require('express')
const bodyParser = require('body-parser')
const jsonfile = require('jsonfile')

const postsPath = './data/posts.json'
const prizesPath = './data/prizes.json'
const posts = jsonfile.readFileSync(postsPath)
const prizes = jsonfile.readFileSync(prizesPath)

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/posts', (req, res) => {
  res.json(posts)
})

app.post('/posts', (req, res) => {
  if (!req.body.content || !req.body.name) {
    return res.json({
      error: true,
      message: 'Invalid data received'
    })
  }

  posts.push({
    content: req.body.content,
    date: new Date(),
    name: req.body.name
  })
  jsonfile.writeFileSync(postsPath, posts)

  const result = (() => {
    const random = Math.random()
    let offset = 0

    return prizes.reduce((pv, cv) => {
      offset += cv.lotteryPercentage
      if (random < offset) {
        if (cv.stock > 0) {
          cv.stock--
          jsonfile.writeFileSync(prizesPath, prizes)
          return cv
        }
      }
    }, null)
  })()
  

  res.json({
    result: !!result,
    name: result && result.name
  })
})

app.listen(8081, () => console.log('http://localhost:8081'))
