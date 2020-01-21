var out=document.getElementById('out')
function getData()
{
    console.log('getData runs')
  var codearea=document.getElementById('codearea').value
  var xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange=()=>{
    if(this.readyState == 4 && this.status == 200)
    {

    }
  }
  xhttp.open("POST", "/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("codearea="+codearea);
}

function getResult(){
  var xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange=()=>{
    if(this.readyState == 4 && this.status == 200)
    {
      console.log(this.responseText)
    }
  }
  xhttp.open("GET", "/getData", true);
  xhttp.send();
}
