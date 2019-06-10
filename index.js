var combine = require('stream-combiner2')
var through = require('through2')
var {Readable} = require('readable-stream')
var BlobParser = require('osm-pbf-parser/lib/blob_parser')
var BlobEncoder = require('osm-pbf-parser/lib/blob_encoder')
var BlobDecompressor = require('osm-pbf-parser/lib/decompress')
var PrimitivesParser = require('osm-pbf-parser/lib/primitives')

module.exports = function (opts) {
  var primitive =  new PrimitivesParser()
  if (opts.header) {
    primitive._osmheader = opts.header
    parse()
  } else {
    getHeader(opts.read, function (err, header) {
      if (err) return console.error(err)
      primitive._osmheader = header
      parse()
    })
  }
  var combineStream = combine.obj([
    new BlobParser(),
    new BlobDecompressor(),
    primitive
  ])
  return combineStream
  function parse () {
    var offset = opts.start
    var len = 4096
    var r = new Readable({ 
      read: function (size) {
        if (offset > opts.end) return r.push(null)
        opts.read(offset, len, function (err, buf) {
          if (err) return combineStream.emit('error', err)
          offset += len
          r.push(buf)
        })
      }
    })
    r.pipe(combineStream)
  }
}

function getHeader (read, cb) {
  var primitive =  new PrimitivesParser()
  var combineStream = combine.obj([
    new BlobParser(),
    new BlobDecompressor(),
    primitive
  ])
  var stop = false
  combineStream.once('error', function (err) {
    stop = true
    cb(err)
  })
  combineStream.pipe(through.obj(function (items, enc, next) {
    stop = true
    cb(null, primitive._osmheader) 
  }))
  var offset = 0
  var len = 4096
  read(offset, len, function onRead (err, buf) {
    if (stop) return
    if (err) return cb(err)
    combineStream.write(buf)
    offset += len
    read(offset, len, onRead)
  })
}
