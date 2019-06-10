var fs = require('fs')
var through = require('through2')
var entriesObj = {}
var buf = Buffer.alloc(10000)
var osm = require('osm-pbf-parser')

//fs.createReadStream(process.argv[2], {start: 1042708, end: 1345615})
fs.createReadStream(process.argv[2])
  .pipe(osm())
  .pipe(through.obj(write, end))

function write (items, enc, next) {
  //seek into pbf file at a particular offset & have it be correct
  items.forEach(function (item) {
    entriesObj[item.id] = item
  })
  //console.log(items)
  next()
}

function end (next) {
  return
}
