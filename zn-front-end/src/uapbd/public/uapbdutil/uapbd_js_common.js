//WMsJoKYnOwewWfpvysdhB8CtaEsZO7Pa0/qp12GS0I7zuxSBeJ/U0ZempXo1JKcW
/**
 * 本文件只要是拓展 js 的各种基础方法的拓展
 */

//  数组的删除指定元素
Array.prototype.arrRemoveAppoint=function(item){
  if(!this.includes(item)){
      return;
  }
  let thatIndex = this.indexOf(item);
  return this.splice(thatIndex,1);
}
//WMsJoKYnOwewWfpvysdhB8CtaEsZO7Pa0/qp12GS0I7zuxSBeJ/U0ZempXo1JKcW