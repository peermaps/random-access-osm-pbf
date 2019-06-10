var fs = require('fs')
var through = require('through2')
var entriesObj = {}
var buf = Buffer.alloc(10000)
var osm = require('osm-pbf-parser')
var combine = require('stream-combiner2');
var BlobParser = require('osm-pbf-parser/lib/blob_parser');
var BlobEncoder = require('osm-pbf-parser/lib/blob_encoder');
var BlobDecompressor = require('osm-pbf-parser/lib/decompress');
var PrimitivesParser = require('osm-pbf-parser/lib/primitives');

var primitive =  new PrimitivesParser()
primitive._osmheader = require('./header.json')

var combineStream = combine.obj([
  new BlobParser(),
  new BlobDecompressor(),
  primitive
]);

var start = Number(process.argv[3])
var end = Number(process.argv[4])

fs.createReadStream(process.argv[2], {start, end})
  .pipe(combineStream)
  .pipe(through.obj(write, end))

function write (items, enc, next) {
  console.log(items)
  next()
}

function end (next) {
  return
}
