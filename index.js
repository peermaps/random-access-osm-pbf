var buf = Buffer.alloc(20)
buf.writeUInt8(1)
buf.writeUInt32LE(45, 1)
var n = 123456789012345
var [low,high] = Uint32Array.from([n,n/2**32]) 
buf.writeUInt32LE(low, 5)
buf.writeUInt32LE(high, 9)
console.log(buf)
