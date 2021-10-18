/*MOqCXBmgfmJ9wbsFjtC2u/FUa2ZJoiLsyUm4UO21h5CUksWFtE6XOrdvYK+rmqz5*/
/**
 * 清空表单中单独的某一区域公共方法
 * @param {*} props 页面内置对象
 * @param {*} areaCode 要清空值的区域编码
 * @param {*} formCode 整个表单的区域编码
 * @param {*} containsAttrcode 包含的字符串判断条件 (不传值就直接清空此区域全部内容)
 */
export const EmptyAreaValue = function(areaCode, formCode, containsAttrcode) {
  let meta = this.props.meta.getMeta();
  let attrcodes = {};
  meta[areaCode].items.forEach(item => {
    let attrcode = item.attrcode;
    if (
      containsAttrcode != undefined &&
      containsAttrcode != "" &&
      containsAttrcode.length > 0
    ) {
      if (attrcode.indexOf(containsAttrcode) >= 0) {
        attrcodes[attrcode] = { value: "" };
      }
    } else {
      attrcodes[attrcode] = { value: "" };
    }
  });
  this.props.form.setFormItemsValue(formCode, attrcodes);
};

/*MOqCXBmgfmJ9wbsFjtC2u/FUa2ZJoiLsyUm4UO21h5CUksWFtE6XOrdvYK+rmqz5*/