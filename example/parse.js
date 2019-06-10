var raOSM = require('../')
var through = require('through2')
var raf = require('random-access-file')

var store = raf(process.argv[2])
var osm = raOSM({
  start: Number(process.argv[3]),
  end: Number(process.argv[4]),
  read: store.read.bind(store)
})
osm.pipe(through.obj(function write (items, enc, next) {
  console.log(items)
  next()
}))
