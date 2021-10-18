/**
 * 卡片子表编辑前事件
 * @param {*} moduleId
 * @param {*} key
 * @param {*} value
 * @param {*} data
 */
export function beforeTableEvent(moduleId, key, value, data) {

  // let returnFlag = true;
  // let { FormConfig, form: formUtil, meta: metaUtil } = this.props;
  // let metaData = metaUtil.getMeta();
  //表头字段
  if (moduleId == "contractinfo") {
    // 组织本币汇率、集团本币汇率、全局本币汇率、保证金本币汇率、卖汇本币汇率
    const currType = [
      "olcrate",
      "glcrate",
      "gllcrate",
    ];
      if (currType.includes(key)) {
        if (value.value == 1) {
          return false;
        } else {
          return true;
        }
      } else{
        return true;
      }
  }
}
