/**
 * 卡片编辑前事件
 * @param {*} moduleId
 * @param {*} key
 * @param {*} value
 * @param {*} data
 */
export function beforeEvent(moduleId, key, value, data) {
//  组织本币汇率、集团本币汇率、全局本币汇率、保证金本币汇率、卖汇本币汇率
  // const currType = [
  //   "olcrate",
  //   "glcrate",
  //   "gllcrate",
  // ];
  // //表头字段
  // if (moduleId == "header") {
  //   if (currType.includes(key)) {
  //     if (value.value == 1) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   } else {
  //     return true;
  //   }
  // } 
//   else if (moduleId == "contractInfo") {
//     //表体字段
//     return true;
//   }
}
