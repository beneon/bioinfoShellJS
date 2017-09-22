const dataRootPath = "/home/ben/download/bioinfo1"
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
shell.cd(dataRootPath)
console.log("begin");
function noThenMkdir(dirname){
  var filelist = Array.from(shell.ls())
  if(filelist.indexOf(dirname)<0){
    shell.mkdir(dirname)
  }
}
function unduplicate(arr){
  return Array.from(new Set(arr))
}
function getCommonName(prefix){
  var commonName = shell.ls(prefix+"*").map(e=>e.replace(/\d\.fq\.gz/,""))
  commonName = unduplicate(commonName)
  return commonName
}
function batchProcess(prefix,cmd){
  var commonName = getCommonName(prefix)
  commonName.forEach(e=>{
    var coreFName = e.replace(new RegExp("^"+prefix),"")
    cmd(e,coreFName)
  })
}
noThenMkdir('fastqc_result')
noThenMkdir('trimmer_result')
noThenMkdir('tophat_result')
// fastqc
// =====
// shell.cd('raw_data')
// shell.exec('fastqc -q -t 8 -o ../fastqc_result/ *.fq.gz')
// shell.cd(dataRootPath)

// fastx_trimmer
// =====
// shell.cd('raw_data')
// var raw_files = shell.ls('*.gz')
// var from = 11
// var length = 150 - from
// raw_files.forEach((e)=>{
//   // console.log(`${e} | fastx_trimmer -f ${from} -l ${length} -z -o `+path.join(dataRootPath,"trimmer_result","trim_"+e));
//   shell.exec(`zcat ${e} | fastx_trimmer -f ${from} -l ${length} -z -o `+path.join(dataRootPath,"trimmer_result","trim_"+e))
// })
// shell.cd(dataRootPath)

// cutadapt
// =====
// shell.cd('trimmer_result')
// batchProcess('trim',(e,coreFName)=>{
//   shell.exec(`nohup cutadapt --times 1 -e 0.1 -O 3 --quality-cutoff 6 -m 50 -a AGATCGGAAGAGC -A AGATCGGAAGAGC -o ${coreFName}1.fq.gz -p ${coreFName}2.fq.gz ${e}1.fq.gz ${e}2.fq.gz > log_cutadapt{e}.txt 2>&1`)
// })
// shell.cd(dataRootPath)

// bowtie2
// stay in cutadapt folder
// =====
// shell.cd('trimmer_result')
// var bowtieFile = path.join(dataRootPath,"bowtie2_hg19","hg19_only_chromosome")
// batchProcess('cutadapt',(e,coreFName)=>{
//   shell.exec(`nohup bowtie2 -x ${bowtieFile} -1 ${e}1.fq.gz -2 ${e}2.fq.gz -S sam${coreFName}.fq.gz -p 4 --un-conc-gz unmap${coreFName}.fq.gz > log_bowtie_${e}.txt 2>&1 &`)
// })
// var unmapRst = shell.ls("unmap*")
// unmapRst.forEach(e=>{
//   console.log("rename to "+e.replace(/(unmap.*)\.fq\.([1,2])\.gz/,"$1$2.fq.gz"));
//   shell.mv(e,e.replace(/(unmap.*)\.fq\.([1,2])\.gz/,"$1$2.fq.gz"))
// })
// shell.cd(dataRootPath)

// tophat2
// ======
shell.cd('trimmer_result')
var hg19Index = path.join(dataRootPath,"bowtie2_hg19","hg19_only_chromosome")
var outputDir = path.join(dataRootPath,"tophat_result")
var cmd = getCommonName('unmap').map(
  e=>{
    return `nohup tophat2 -p 6 -o ${e}_${outputDir} ${hg19Index} ${e}1.fq.gz ${e}2.fq.gz > log_${e} 2>&1`
  }
).join('\n')
console.log(cmd);
shell.exec(cmd)
