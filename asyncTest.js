// const dataRootPath = "/home/ben/download/bioinfo1"
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const dataRootPath = "/home/ben/download/bioinfo1"
var hg19Index = path.join(dataRootPath,"bowtie2_hg19","hg19_only_chromosome")

var outputDir = path.join(dataRootPath,"tophat_result")

function unduplicate(arr){
  return Array.from(new Set(arr))
}
function getCommonName(prefix){
  var commonName = shell.ls(prefix+"*").map(e=>e.replace(/\d\.fq\.gz/,""))
  commonName = unduplicate(commonName)
  return commonName
}

var cmd = getCommonName('unmap').map(
  e=>{
    return `nohup tophat2 -p 6 -o ${outputDir} ${hg19Index} ${e}1.fq.gz ${e}2.fq.gz > prefix_${e} 2>&1`
  }
)
console.log(cmd);
