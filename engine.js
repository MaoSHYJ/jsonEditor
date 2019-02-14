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

  printChilds(nodeRef, obj = this.obj){
    if(!this.loaded){
      let child = null;
      let keys = [];
      let temp = null;
      let subkeys = [];
      if(typeof obj !== "object"){
        keys.push(obj);
      }else if(typeof obj === "object" && obj){
        keys = Object.keys(obj);
      }
      keys.forEach( key => {
        if(typeof obj[key] === "object"){
          if( Object.prototype.toString.call(obj[key]) === "[object Array]" ){
            child = document.createElement("div");
            obj[key].forEach(subKey =>{
              let grandChild = document.createElement("div");
              grandChild = this.printChilds(grandChild, subKey);
              child.appendChild(grandChild);
            });
          }else{
            child = document.createElement("div");
            child.appendChild(document.createTextNode(key));
            if(typeof obj[key] === "object" && obj[key]){
              subkeys = Object.keys(obj[key]);
            }
            subkeys.forEach(subKey =>{
              temp = document.createElement("div");
              temp.appendChild(document.createTextNode(subKey));
              temp = this.printChilds(temp, obj[key][subKey]);
              child.appendChild(temp);
            });
            child.setAttribute("data-type",typeof obj[key]);
          }
        }else{
          temp = obj[key] || obj;
          child = document.createElement("span");
          child.setAttribute("contenteditable",true);
          child.appendChild(document.createTextNode(key+": "+temp));
        }
        nodeRef.appendChild(child);
        nodeRef.appendChild(document.createElement("br"));
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
  console.time("loadFIle");

  input = document.querySelector('#file_name');
  file = input.files[0];
  fr = new FileReader();
  fr.readAsText(file);
  fr.onload = function() {
    editor.setFile(fr.result);
    editor.printChilds(document.querySelector('#list'));
    console.timeEnd("loadFIle");
  }
}

