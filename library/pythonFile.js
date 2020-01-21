const { exec,execFile,spawn } = require('child_process');


var executePythonProgram = function(stdin,callback,exetime)
{
  let flag=1
  let time = new Date().getTime()/1000
  var process1=spawn('python', ['python.py'])
  var stderror1=''
  var stdoutput1=''
  var chk=false
  var timeout = setTimeout(function(){
    process1.stdin.pause();
    process1.kill()
    chk = true
    flag=0
  },20000)
  if(stdin!='')
  {
    process1.stdin.write(stdin+" \n")
    process1.stdin.end()
  }
  else
  {
    process1.stdin.write(stdin+" \n")
    process1.stdin.end()
  }
  process1.stdout.on('data',(data)=>{
    stdoutput1+=data
  })
  process1.stdout.on('end',()=>{
    process1.kill()
    chk=true
  })
  process1.stderr.on('data',(data)=>{
    stderror1+=data.toString()
  })
  process1.stderr.on('end',()=>{
    process1.kill()
    chk=true
  })
  process1.on('close',(code)=>{
    if(code==0)
    {
    output=stdoutput1+""
    console.log(stdoutput1)
    callback("",output,new Date().getTime()/1000-time)
    }
    else
    {
    output=stderror1+""
    process1.kill()
    chk=true
    console.log(stderror1)
    if(flag==0)
    output='Time limit exceeded !'
    callback(output,"",new Date().getTime()/1000-time)
    }
  })
  if(chk)
  clearInterval(timeout)
}

module.exports = {
     executePythonProgram: executePythonProgram
}
