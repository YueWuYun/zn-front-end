/**
 * 卡片编辑前事件
 * @param {*} moduleId
 * @param {*} key
 * @param {*} value
 * @param {*} data
 */
export function beforeEvent(moduleId, key, value, data) {

  let returnFlag = true;
  let { FormConfig, form: formUtil, meta: metaUtil } = this.props;
  let metaData = metaUtil.getMeta();
    // 组织本币汇率、集团本币汇率、全局本币汇率、保证金本币汇率、卖汇本币汇率
    // const currType = [
    //   "olcrate",
    //   "glcrate",
    //   "gllcrate",
    // ];
    //表头字段
    if (moduleId == "header" || moduleId == "contractinfo") {

      // if (currType.includes(key)) {
      //   if (value.value == 1) {
      //     returnFlag = false;
      //   } 
      // } 
      if (key === "committype") {
        // 主表meta设置
        metaData["commitInfo"].items.map((item, key) => {
          // 承付类型设置下拉选项
          // 0: {display: "付款", value: "1"}
          // 1: {display: "承诺", value: "2"}
          // 2: {display: "承兑", value: "3"}
          // 3: {display: "拒付", value: "4"}
          if (item.attrcode == "committype") {
            // 兑付方式
            let paytype = formUtil.getFormItemsValue(FormConfig.formId, "paytype");
            //兑付方式 即期付款=1,承兑=2,议付=3,延期付款=4
            paytype = paytype && paytype.value;
    
            if (!this.committypeOptions) {
              // 如果为首次加载meta数据
              this.committypeOptions = item.options;
            }
            let resultOptions;
            if (paytype === "1") {
              // 兑付方式为【即期付款】则只能选择付款，拒付
              resultOptions = this.committypeOptions.filter(
                item => item.value == "1" || item.value == "4"
              );
              item.options = resultOptions;
            } else if (paytype === "2") {
              // 兑付方式为承兑，则只能选择付款，承兑，拒付
              resultOptions = this.committypeOptions.filter(
                item => item.value == "1" || item.value == "3" || item.value == "4"
              );
              item.options = resultOptions;
            } else if (paytype === "3") {
              // 兑付方式为议付时默认为付款
              // 兑付方式为议付，则能选择承兑、承诺、付款、拒付
              resultOptions = this.committypeOptions.filter(
                item =>
                  item.value == "1" ||
                  item.value == "2" ||
                  item.value == "3" ||
                  item.value == "4"
              );
              item.options = resultOptions;
            } else if (paytype === "4") {
              // 兑付方式为【延期付款】时默认为承诺；
              // 兑付方式为延期付款，则只能选择承诺，付款，拒付
              resultOptions = this.committypeOptions.filter(
                item => item.value == "1" || item.value == "2" || item.value == "4"
              );
              item.options = resultOptions;
            } else {
              item.options = this.committypeOptions;
            }
          }
          return item;
        });
        metaUtil.setMeta(metaData);
    } 
    return returnFlag;
    
  }
}
