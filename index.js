var combine = require('stream-combiner2')
var through = require('through2')
var {Readable} = require('readable-stream')
var BlobParser = require('osm-pbf-parser/lib/blob_parser')
var BlobEncoder = require('osm-pbf-parser/lib/blob_encoder')
var BlobDecompressor = require('osm-pbf-parser/lib/decompress')
var PrimitivesParser = require('osm-pbf-parser/lib/primitives')

var dataType = Buffer.from([0x07, 0x4f, 0x53, 0x4d, 0x44, 0x61, 0x74, 0x61])

module.exports = function (opts) {
  var primitive =  new PrimitivesParser()
  if (opts.header) {
    primitive._osmheader = opts.header
    find()
  } else {
    getHeader(opts.read, function (err, header) {
      if (err) return console.error(err)
      primitive._osmheader = header
      find()
    })
  }
  var combineStream = combine.obj([
    new BlobParser(),
    new BlobDecompressor(),
    primitive
  ])
  return combineStream
  function find () {
    var start, end, pending = 2
    findAlignment(opts.read, opts.start, opts.size, function (err, offset) {
      if (err) return combineStream.emit('error', err)
      start = offset
      if (--pending === 0) parse(start, end)
    })
    findAlignment(opts.read, opts.end, opts.size, function (err, offset) {
      if (err) return combineStream.emit('error', err)
      end = offset
      if (--pending === 0) parse(start, end)
    })
  }
  function parse (start, end) {
    var offset = start
    var len = 4096 
    var r = new Readable({ 
      read: function (size) {
        if (offset >= end) return r.push(null)
        opts.read(offset, Math.min(len, opts.size - offset), function (err, buf) {
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

function findAlignment (read, offset, size, cb) {
  var len = 4096
  if (offset + len >= size) return cb(null, size)
  read(offset, len, function onRead (err, buf) {
    if (err) return cb(err)
    var index = buf.indexOf(dataType)
    if (index < 5) {
      offset += len - dataType.length
      if (offset + len >= size) return cb(null, size)
      return read(offset, len, onRead)
    }
    cb(null, offset + index - 5)
  })
}
