const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const db = mongoose.connection

db.once('open', function() {
    console.log('Connected to database!')
})

const Schema = mongoose.Schema
const strSchema = new Schema({
    string: String,
    length: String
})

const data = mongoose.model('data', strSchema)

/*
  If a string is passed into the URI, check if it is in the database.
  If no, add it to the database, then return the string and its length.
  If yes, return the string and its length.
 */
router.get('/:name', function(req, res, next) {
    data.findOne({ string: req.params.name }, function(err, results) {
        if (results == null) {
            let entry = new data({
                string: req.params.name,
                length: req.params.name.length
            })
            entry.save(function(err) {
                if (err) { res.send(err) }
                else {
                    res.json(entry)
                    console.log("String added to database!")
                }
            })
        }
        else {
            console.log("String already in database!")
            res.json(results)
        }
    })
})

/*
  If no string is passed into the URI, return all strings in the database and their lengths.
 */
router.get('/', function(req, res, next) {
    data.find({}, function(err, results) {
        res.json(results)
    })
})

/*
 If the test body is empty, return a JSON message promting the user to provide a string.
 If a string is passed into the test body, check if it is in the database.
 If no, add it to the database, then return the string and its length.
 If yes, return the string and its length.
 */
router.post('/', function(req, res, next) {
    if (req.body.test.length == 0) {
        res.json("Please provide a string in the test body.")
    }
    else {
        data.findOne({ string: req.body.test }, function(err, results) {
            if (results == null) {
                let entry = new data({
                    string: req.body.test,
                    length: req.body.test.length
                })
                entry.save(function(err) {
                    if (err) { res.send(err) }
                    else {
                        res.json(entry)
                        console.log("String added to database!")
                    }
                })
            }
            else {
                console.log("String already in database!")
                res.json(results)
            }
        })
    }
})

/*
  If a string is passed into the URI, check if it is in the database.
  If no, return a 'string not found' JSON message.
  If yes, delete the string from the database, and return a JSON message indicating success.
 */
router.delete('/:name', function(req, res, next) {
    data.findOne({ string: req.params.name }, function(err, results) {
        if (results == null) {
            res.json("String not found!")
        }
        else {
            data.findOneAndRemove({ string: req.params.name }, function(err, results) {
                if (err) { res.send(err) }
                else {
                    res.json("String deleted!")
                }
            })
        }
    })
})

module.exports = router
