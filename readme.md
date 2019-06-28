# random access osm pbf

gives you random access reads into an [osm pbf
file](https://wiki.openstreetmap.org/wiki/PBF_Format).

[planet.osm](https://wiki.openstreetmap.org/wiki/Planet.osm) is a single pbf file of the entire planet, but you can also get
[extracts](https://www.interline.io/osm/extracts/) (pbfs at the city or regional
level).

this module expects binary data from an osm pbf file as input and
returns an object stream. the objects in the output stream are in the form described in [osm-pbf-parser](https://www.npmjs.com/package/osm-pbf-parser).


# api

``` js
var raOSM = require('random-access-osm-pbf')
```

## var OSM = raOSM(opts)

creates a new stream which gets processed by [osm-pbf-parser](https://www.npmjs.com/package/osm-pbf-parser).

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
