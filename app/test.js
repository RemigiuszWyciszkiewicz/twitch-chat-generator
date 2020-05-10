const Stream = require('stream')
const fs = require('fs');



let readeableStream = fs.createReadStream(__dirname + '/data.txt', {encoding: 'utf8'} );
let writableStream = fs.createWriteStream(__dirname +  '/data2.txt');


//readeableStream.pipe(writableStream)

readeableStream.on('data', function(dataChunk) {
    
console.log('chunk recived')
writableStream.write(dataChunk);
})



//from doc

// let readableTest = new Stream.Readable({
//     read() {}
// });

// let writableTest = new Stream.Writable();

// writableTest._write = (chunk, encoding, next) => {
//     console.log(chunk.toString())
//     console.log(encoding)
//     next();

//   }

// readableTest.pipe(writableTest);

// readableTest.push('hello');
// readableTest.push('world');
