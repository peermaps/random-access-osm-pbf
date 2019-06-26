var raOSM = require('../')
var through = require('through2')
var raf = require('random-access-file')
var test = require('tape')
var path = require('path')

test('parse aligned', function (t) {
  t.plan(5)
  var store = raf(path.resolve(__dirname, 'fixtures/kharkiv_ukraine.osm.pbf'))
  var osm = raOSM({
    start: 1042708,
    end: 1345615,
    size: 8212140,
    read: store.read.bind(store)
  })
  var expectedLength = [8000, 8000, 8000, 8000, 8000]
  osm.pipe(through.obj(function write (items, enc, next) {
    t.equals(items.length, expectedLength.shift())
    next()
  }))
})

test('parse start unaligned', function (t) {
  t.plan(5)
  var store = raf(path.resolve(__dirname, 'fixtures/kharkiv_ukraine.osm.pbf'))
  var osm = raOSM({
    start: 1042608, //unaligned
    end: 1345615, //aligned
    size: 8212140,
    read: store.read.bind(store)
  })
  var expectedLength = [8000, 8000, 8000, 8000, 8000]
  osm.pipe(through.obj(function write (items, enc, next) {
    t.equals(items.length, expectedLength.shift())
    next()
  }))
})

test('parse start unaligned forward', function (t) {
  t.plan(4)
  var store = raf(path.resolve(__dirname, 'fixtures/kharkiv_ukraine.osm.pbf'))
  var osm = raOSM({
    start: 1042709, //unaligned
    end: 1345615, //aligned
    size: 8212140,
    read: store.read.bind(store)
  })
  var expectedLength = [8000, 8000, 8000, 8000]
  osm.pipe(through.obj(function write (items, enc, next) {
    t.equals(items.length, expectedLength.shift())
    next()
  }))
})

test('parse whole file', function (t) {
  t.plan(108)
  var store = raf(path.resolve(__dirname, 'fixtures/kharkiv_ukraine.osm.pbf'))
  var osm = raOSM({
    start: 0,
    end: 8212140,
    size: 8212140,
    read: store.read.bind(store)
  })
  var expectedLength = [8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000,
    8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000,
    8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000,
    8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000,
    8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000,
    8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000,
    8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000,
    8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 1211, 8000, 8000, 8000,
    8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000,
    8000, 7338, 3468]
  osm.pipe(through.obj(function write (items, enc, next) {
    t.equals(items.length, expectedLength.shift())
    next()
  }))
})
test('parse end unaligned', function (t) {
  t.plan(5)
  var store = raf(path.resolve(__dirname, 'fixtures/kharkiv_ukraine.osm.pbf'))
  var osm = raOSM({
    start: 1042608, //aligned
    end: 1345610, //aligned
    size: 8212140,
    read: store.read.bind(store)
  })
  var expectedLength = [8000, 8000, 8000, 8000, 8000]
  osm.pipe(through.obj(function write (items, enc, next) {
    t.equals(items.length, expectedLength.shift())
    next()
  }))
})
