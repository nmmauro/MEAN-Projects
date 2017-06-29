const express = require('express')
const router = express.Router()
const request = require('request-promise-lite');
const vibrant = require('node-vibrant')
const path = require('path')
const async = require('async')
const fs = require('fs')
const mongoose = require('mongoose')
    , albums = mongoose.model('albums')

rgbArr = []         //Rgb values for each album
rgbSorted = []    //Sorted rgb values in rainbow spectrum
rainbowList = []    //Sorted album names in rainbow spectrum
theArt = []         //Artwork with rgb values
theSpectrum = []    //Final rainbow sorted list of album art

router.get('/', function(req, res) {
    async.waterfall([getRgbs, sortRgbs, matchRgbs, getSpectrum],
        function (err, result, spectrum) {
            var json = JSON.stringify(theSpectrum)
            fs.writeFile('myjsonfile.json', json, 'utf8')
            res.sendFile(path.join(__dirname + '/../public/collage.html'))
        })
})

const getRgbs = function () {
    albums.find({}, function (err, results) {           //Gets rgb values for each album
        results.forEach(function (item) {
            var v = new vibrant(item['art'])
            v.getSwatches(function (err, swatch) {
                if (err) {
                    console.log(err)
                } else {
                    if (swatch['LightVibrant'] != null) {
                        rgbArr[item.name] = swatch['LightVibrant']['rgb']
                        console.log(rgbArr)
                    }
                }
            })
        })
    })
}

const sortRgbs = function () {
    unsorted = []                           //Sorts rgb values in rainbow spectrum
    for (var key in rgbArr) {
        unsorted.push(rgbArr[key])
    }
    function rgbToHsl(c) {
        var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return new Array(h * 360, s * 100, l * 100);
    }
    var sortedRgbArr = unsorted.map(function (c, i) {
        // Convert to HSL and keep track of original indices
        return {color: rgbToHsl(c), index: i};
    }).sort(function (c1, c2) {
        // Sort by hue
        return c1.color[0] - c2.color[0];
    }).map(function (data) {
        // Retrieve original RGB color
        return unsorted[data.index]
    });
    rgbSorted = sortedRgbArr
    console.log(rgbArr)
    console.log(rgbSorted)
}

const matchRgbs = function () {
    rgbFinal = [rgbSorted.length]                   //Matches sorted rgb values back to albums
    for (var key in rgbArr) {
        for (i = 0; i < rgbSorted.length; i++) {
            if (rgbArr[key] == rgbSorted[i]) {
                rgbFinal[i] = key
            }
        }
    }
    rainbowList = rgbFinal
    for (var key in rainbowList) {
        albums.findOne({name: rainbowList[key]}, function (err, obj) {
            theArt[obj['name']] = obj['art']
        })
    }
}

const getSpectrum = function () {
    console.log(theArt)                             //Assembles sorted list of album art links
    console.log(rainbowList)
    for (i = 0; i < rainbowList.length; i++) {
        theSpectrum[i] = theArt[rainbowList[i]]
    }
    console.log(theSpectrum)
}

module.exports = router;