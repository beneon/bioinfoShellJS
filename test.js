// const shell = require('shelljs');
// var exec = shell.exec
var typeArr = ['js','md']
var typeIter = typeArr[Symbol.iterator]()
const fs = require('fs');
function asyncIter (iter,asyncFunc){
  console.log(iter);
  console.log(asyncFunc);
  var e = iter.next()
  if(!e.done){
    asyncFunc(e.value,arguments.callee)
  }else{
    return
  }
}
function asyncFunction (val,callback){
  fs.readdir('.',(e,data)=>{
    callback(typeIter,asyncFunction)
  })
}
asyncIter(typeIter,asyncFunction)

// asyncIter:iteration; async? in asyncFunc
// iter -- val => async ---- done => iter, give me another
