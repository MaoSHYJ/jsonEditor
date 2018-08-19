class Editor{
  constructor(file){
    if(file){
      this.file = file;
      this.obj = JSON.parse(file);
      this.numChilds = Object.keys(this.obj).length;
    }
  }
  setFile(file){
    this.file = file;
    this.obj = JSON.parse(file);
    this.numChilds = Object.keys(this.obj).length;
  }

  printFirstChilds(nodeRef, obj = this.obj){
    if(!this.loaded){
      let child = null;
      let keys = [];
      let number= null;
      let text = null;
      let temp = null;
      console.log("type",typeof obj)
      if(typeof obj !== "object"){
        keys.push(obj);
      }else{
        keys = Object.keys(obj);
      }
      keys.forEach( key => {
        if(typeof obj[key] === "number" || typeof obj === "number"){
          console.log("number");
          number = obj[key] || obj;
          child = document.createElement("span");
          child.setAttribute("contenteditable",true);
          child.appendChild(document.createTextNode(number));
          debugger;
        }else if(typeof obj[key] === "string" || typeof obj === "string"){
          text = obj[key] || obj;
          child = document.createElement("span");
          child.setAttribute("contenteditable",true);
          child.appendChild(document.createTextNode(text));
        }else if( Object.prototype.toString.call(obj[key]) === "[object Array]" ){
          child = document.createElement("div");
          child.setAttribute("data-type","object");
          obj[key].forEach(subKey =>{
            let grandChild = document.createElement("div");
            grandChild = this.printFirstChilds(grandChild, subKey);
            child.appendChild(grandChild);
          });
        }else if( typeof obj[key] === "object" ){
          child = document.createElement("div");
          child.appendChild(document.createTextNode(key));
          child.setAttribute("data-type","object");
          child.setAttribute("contenteditable",true);
          temp = this.printFirstChilds(child, obj[key]);
          child.appendChild(temp);
        }
        nodeRef.appendChild(child);
      })
      return nodeRef;
    }
  }
  printRaw(){
    document.querySelector('#list').appendChild(document.createTextNode(this.file))
  }
}

document.querySelector("#file_name").addEventListener("change",handleFileSelect,false);
const editor = new Editor();

function handleFileSelect()
{
  input = document.querySelector('#file_name');
  file = input.files[0];
  fr = new FileReader();
  fr.readAsText(file);
  fr.onload = function() {
    editor.setFile(fr.result);
    editor.printFirstChilds(document.querySelector('#list'));
  }
}

