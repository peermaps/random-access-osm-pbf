# random-access-osm-pbf

Provides random access reads into an [osm pbf
file](https://wiki.openstreetmap.org/wiki/PBF_Format).

Usually when parsing pbf files, you have to start at the beginning and if the
files are really large, then this can take a really long time. it's also not
parellelizable.

With this module, you can provide `start` and `end` offsets into a pbf file and
receive complete items as output. the `start` and `end` values don't have to
match exact alignments in the pbf file. this module scans forward from those
offsets to find the nearest correct alignment point.


# api

``` js
var raOSM = require('random-access-osm-pbf')
```

## var osm = raOSM(opts)

creates a new stream which gets processed by [osm-pbf-parser](https://www.npmjs.com/package/osm-pbf-parser).

this module expects binary data from an osm pbf file as input and
returns an object stream. the objects in the output stream are in the form described in [osm-pbf-parser](https://www.npmjs.com/package/osm-pbf-parser).

each item in the input can have properties:

* header
* start (block position start integer)
* end (block position end integer)
* size (in blocks)
* read 


# examples

in this example, we pass in the pbf file as the first argument, and a start and
end offset as the second and third arguments.


``` js
var raOSM = require('random-access-osm-pbf')
var through = require('through2')
var raf = require('random-access-file')
var fs = require('fs')

var store = raf(process.argv[2])
var osm = raOSM({
  start: Number(process.argv[3]),
  end: Number(process.argv[4]),
  read: store.read.bind(store),
  size: fs.statSync(process.argv[2]).size
})
osm.pipe(through.obj(function write (items, enc, next) {
  console.log(items)
  next()
}))
```

the output comes out in this form:

``` js
{
  { type: 'node',
    id: 3705065232,
    lat: 50.0699066,
    lon: 36.177443600000004,
    tags: {},
    info:
     { version: 1,
       timestamp: 1440001911000,
       changeset: 33443945,
       uid: 719573,
       user: 'dimonster' } },
  { type: 'node',
    id: 3705065233,
    lat: 50.0699133,
    lon: 36.1576718,
    tags: {},
    info:
     { version: 1,
       timestamp: 1440001911000,
       changeset: 33443945,
       uid: 719573,
       user: 'dimonster' } }
}
```
