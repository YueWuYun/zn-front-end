/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
export default function(
  props,
  moduleId,
  key,
  value,
  changedrows,
  index,
  record,
  type,
  method
) {
  let {
    setValByKeyAndIndex,
    setEditableRowKeyByIndex,
    getValByKeyAndIndex
  } = this.props.editTable;
  let oldValue = changedrows[0] && changedrows[0].oldvalue.value;
  let currentItem = { moduleId, key, value, oldValue, index };
  let categoryAry = [
    "TRUST",
    "BANK",
    "BOND",
    "FINANCIAL_COMPANY",
    "OTHER_FINANCIAL_COMPANIES",
    "FBM",
    "INNER_LOAN",
    "DELEGATION_LOAN"
  ];
  if (value !== oldValue) {
    if (key == "type") {
      //品种分类
      if (value == "2") {
        setValByKeyAndIndex(moduleId, index, "financetype", {
          value: "",
          display: ""
        });
        setEditableRowKeyByIndex(moduleId, index, "financetype", false);
      } else if (value == "1") {
        setEditableRowKeyByIndex(moduleId, index, "financetype", true);
        setValByKeyAndIndex(moduleId, index, "financetype", {
          value: "2",
          display: this.state.json["36010IFV-000017"] /* 国际化处理： 间接融资*/
        });
      }
      // 清空品种大类字段
      setValByKeyAndIndex(moduleId, index, "variety_category", {
        value: null,
        display: null
      });
    } else if (key == "variety_category") {
      //品种大类
      if (value == "BOND") {
        setValByKeyAndIndex(moduleId, index, "financetype", {
          value: "1",
          display: this.state.json["36010IFV-000016"] /* 国际化处理： 直接融资*/
        });
        setEditableRowKeyByIndex(moduleId, index, "financetype", true);
      } else if (categoryAry.includes(value)) {
        setValByKeyAndIndex(moduleId, index, "financetype", {
          value: "2",
          display: this.state.json["36010IFV-000017"] /* 国际化处理： 间接融资*/
        });
        setEditableRowKeyByIndex(moduleId, index, "financetype", true);
      } else {
        setValByKeyAndIndex(moduleId, index, "financetype", {
          value: "",
          display: ""
        });
        setEditableRowKeyByIndex(moduleId, index, "financetype", false);
      }
    }
  }
}

/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/