const express = require('express')
const router = express.Router()
const qs = require('qs')

router.get('/', function(req, res, next) {
    res.render('index', { title: 'hw1' })
})

router.get('/:name', function(req, res, next) {
    res.json({
        string: req.params.name,
        length: req.params.name.length
    })
})

router.post('/', function(req, res, next) {
    res.json({
        string: qs.stringify(req.body).slice(0, -1),
        length: qs.stringify(req.body).length - 1
    })
})

module.exports = router