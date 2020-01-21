import React , {Component} from 'react'
import AceEditor from 'react-ace';
import Button from 'muicss/lib/react/button';
import brace from 'brace'
import 'brace/mode/java';
import 'brace/mode/c_cpp'
import 'brace/mode/python'
import 'brace/theme/dracula';
import 'brace/theme/monokai'
import 'brace/theme/chrome'
import 'brace/theme/github'
import  './button.css'
import './select.css'

class compiler extends Component{

 constructor(props){
   super(props)
   this.state={
     input:'',
     code:'#include<stdio.h>\nint main()\n{\n printf("hello navi");\n return 0;\n}',
     output:'',
     arr:[],
     mode:'c_cpp',
     theme:'chrome',
     filetype:'c',
     loading:false,
     exeTime:''
   }
   this.customRef=React.createRef()
 }

 sendData=()=>{
    var array=[]
    this.setState({
    input:this.customRef.current.value,
    loading:true,
    },async ()=>{
    const rawResponse = await fetch('https://onlinewebcompiler.herokuapp.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({codearea: this.state.code,input:this.state.input,filetype:this.state.filetype})
  })
  const content = await rawResponse.json()
  let stderr=''
  let stdout=''
  let exe=''
  stderr=content.stderr
  stdout=content.stdout
  exe=content.exetime
  let exetime=exe.toString()
  if(exetime.length>5)
  exetime = exetime.substring(0,5)
  exetime+='s'
  if(stderr!='')
  {
    array=stderr.split('\n')
    this.setState({
      output:stderr,
      arr:array,
      loading:false,
      exeTime:exetime,
    })
  }
  else{
    array=stdout.split('\n')
    this.setState({
      output:stdout,
      arr:array,
      loading:false,
      exeTime:exetime,
    })
   }
  })
}

onChange=(newValue)=>{
  this.setState({
    code:newValue
  })
}

themeChange=(e)=>{
  let {name,value}=e.target
  this.setState({
    theme:value
  })
}

fileChange=(e)=>{
  let {name,value}=e.target
  this.setState({
    filetype:value
  },()=>{
    if(this.state.filetype=='c' || this.state.filetype=='cpp')
    {
      if(this.state.filetype=='cpp')
      {
      this.setState({
        mode:'c_cpp',
        code:'#include<iostream>\nusing namespace std;\nint main()\n{\n cout<<"hello navi !";\n return 0;\n}'
      })
      }
      else
      {
        this.setState({
          mode:'c_cpp',
          code:'#include<stdio.h>\nint main()\n{\n printf("hello navi");\n return 0;\n}',
        })
      }
    }
    else
    {
      if(this.state.filetype=='java')
      {
      this.setState({
        mode:this.state.filetype,
        code:'import java.io.*;\nclass Main\n{\n  public static void main(String[] args)\n  {\n   System.out.println("hello navi !");\n  }\n}'
      })
      }
      else
      {
        this.setState({
          mode:this.state.filetype,
          code:'print("hello navi !")'
        })
      }
    }
  })
}



  render(){
  const results = this.state.arr.map((prop,ind)=><div style={{paddingTop:"8px", paddingBottom:'20px'}}
  key={ind} style={{backgroundColor:'black',color:'white',paddingLeft:'10px',fontSize:'1.1em'}}>{this.state.arr[ind]}
  </div>)

  const options = {
        selectOnLineNumbers: true
      }

    return(
      <div>
      <div style={{height:'100%',marginTop:'10px',marginBottom:'50px',textAlign:'center'}}>
      <h2>Online Compiler For C Cpp Java and Python</h2>
      </div>
      <div style={{marginBottom:'50px',height:'10px',width:'100%'}}>
      <select className="select-css" onChange={this.themeChange} style={{float:'left',width:'150px',marginLeft:'250px'}}>
      <option value="chrome">Chrome</option>
      <option value="dracula">Dracula</option>
      <option value="monokai">Monokai</option>
      <option value="github">Github</option>
      </select>
      <select className="select-css" onChange={this.fileChange} style={{float:'left',width:'150px',marginLeft:'590px'}}>
      <option value="c">C</option>
      <option value="cpp">C++</option>
      <option value="java">Java</option>
      <option value="python">Python</option>
      </select>
       </div>
      <div style={{marginLeft:'250px',}}>
      <div style={{width:'890px', border:'1px solid grey'}}>
      <AceEditor
        width="890px"
        height="550px"
        fontSize="1.2em"
        value={this.state.code}
         mode={this.state.mode}
         theme={this.state.theme}
         name="UNIQUE_ID_OF_DIV"
         onChange={this.onChange}
        editorProps={{
            $blockScrolling: true
        }}
      />
      </div>
      <div style={{overflow:'hidden',width:"600px", height:'300px'}}>
      <textarea className="inputarea" ref={this.customRef} placeholder="Type Input Here !" style={{outline:'0px',marginTop:'10px',paddingLeft:'8px',paddingTop:'9px',width:'550px', height:'200px', fontSize:'1.2em',color:'black'}}></textarea>
      <button style={{marginTop:'5px'}}className="button" onClick={this.sendData}
      variant="primary"
      disabled={this.state.loading}>{this.state.loading ? 'Compiling…' : 'Compile & Run'}</button>
      </div>
      <h3 style={{marginTop:'40px'}}>Execution Time:- {this.state.exeTime}</h3>
      <div style={{backgroundColor:'black',color:'white',borderRadius:'6px', width:'900px', height:'200px', marginTop:'2px', marginBottom:'20px',overflow:'auto'}}>
      {results}
      </div>
      </div>
      </div>
    )
  }
}
export default compiler
