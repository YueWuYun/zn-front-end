import {deepClone} from "nc-lightapp-front";
const nodeExistById = (arr, list=[]) => {
  if(!list.length) return arr;
  list.map( (item) => {
    if(arr.includes(item.refpk)) {
      let index = arr.indexOf(item.refpk);
      index > -1 && arr.splice(index, 1);
    }
  })
  return arr;
}

const generateLfListArr = (idArr, treeData) => {
  let arr = [];
  let data = deepClone(treeData);
  const loop = (data) => {
    data.map( (item) => {
      if(idArr.includes(item.refpk)) {
        arr.push({...item, children:null})
      }else if(item.children) {
        loop(item.children);
      }
    })
  }
  loop(data);
  
  return arr;
}

export {
  nodeExistById,
  generateLfListArr
}
