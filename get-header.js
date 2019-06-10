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
var combineStream = combine.obj([
  new BlobParser(),
  new BlobDecompressor(),
  primitive
]);

fs.createReadStream(process.argv[2])
  .pipe(combineStream)
  .pipe(through.obj(write, end))

function write (items, enc, next) {
  console.log(JSON.stringify(primitive._osmheader))
}

function end (next) {
  return
}
