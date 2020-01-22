var express=require('express')
var app=express()
var cors=require('cors')
var bodyParser=require('body-parser')
var fs=require('fs')
var urlencodedParser=bodyParser.urlencoded({extended:true});
var path=require('path')
var cFile=require('./library/cFile.js')
var cppFile=require('./library/cppFile.js')
var javaFile=require('./library/javaFile.js')
var pythonFile=require('./library/pythonFile.js')
const { exec,execFile,spawn } = require('child_process')
const port = process.env.PORT|| 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors())
app.use(express.static(path.join(__dirname, 'CompilerReact','build')));


app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'/CompilerReact/build/index.html'));
})

app.post('/',(req,res)=>{
  console.log(req.body)
  let code=req.body.codearea
  let input=req.body.input
  let filetype=req.body.filetype
  code=code.toString()
  code.replace("\r\n"," ")
  if(filetype=='c')
  {
  fs.writeFile('cprogram.c',code,(err)=>{
    if(err)
    console.log(err)
    else
    {
     cFile.executeCProgram(input , (stderror,stdoutput,exetime)=>{
     res.send({stderr:stderror,stdout:stdoutput,exetime:exetime})
     })
    }
  })
  }
  else if(filetype=='cpp')
  {
    fs.writeFile('cpp_program.cpp',code,(err)=>{
      if(err)
      console.log(err)
      else
      {
        cppFile.executeCppProgram(input,(stderr,stdout,exetime)=>{
        res.send({stderr:stderr,stdout:stdout,exetime:exetime})
        })
      }
    })
  }
  else if(filetype=='java')
  {
    fs.writeFile('Main.java',code,(err)=>{
      if(err)
      console.log(err)
      else
      {
        javaFile.executeJavaProgram(input,(stderr,stdout,exetime)=>{
        res.send({stderr:stderr,stdout:stdout,exetime:exetime})
        fs.unlink('Main.class',()=>{
          console.log("main class deleted")
        })
        })
      }
    })
  }
  else
  {
    fs.writeFile('python.py',code,(err)=>{
      if(err)
      console.log(err)
      else
      {
        pythonFile.executePythonProgram(input,(stderr,stdout,exetime)=>{
        res.send({stderr:stderr,stdout:stdout,exetime:exetime})
        })
      }
    })
  }
})


app.listen(port)
console.log(`listeing to port ${port}`)
