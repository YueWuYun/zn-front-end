const toggleType = (type = 'local') => {
  return 'local' ? window.localStorage : window.sessionStorage;
}

const getStorage = (key = "", type="local") => {
  return toggleType(type).getItem(key);
}

const setStorage = (key="", value="", type="local") => {
  try {
    if(getStorage("printClientHistory") && !getStorage("printClientHistory").includes(key)) {
      localStorage.setItem("printClientHistory", localStorage.getItem("printClientHistory") + "," + key);
    }else {
      localStorage.setItem("printClientHistory", key)
    }
    clear("local");
    return toggleType(type).setItem(key, value);
  }catch(e) {
    console.error("localStorage容量溢出");
    clear("local");
  }
}

const clearStorage = (key="", type="local") => {
  if(!getStorage(key, type)) return ;
  toggleType(type).removeItem(key);
}

const clear = (type="local") => {
  let printIdKeyArrStr = getStorage("printClientHistory");
  if(printIdKeyArrStr && printIdKeyArrStr.includes(",") && printIdKeyArrStr.split(",").length > 5) {
    let printArr = printIdKeyArrStr.split(",");
    let endStr = printArr.pop();
    localStorage.setItem("printClientHistory", printArr.join(","));
    clearStorage(endStr);
  }
}

export {
  getStorage,
  setStorage,
  clearStorage
}






