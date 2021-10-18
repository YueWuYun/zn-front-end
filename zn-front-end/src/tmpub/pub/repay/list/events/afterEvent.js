/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/
/**
 * 表体编辑后事件
 * @param {*} props         页面内置对象
 * @param {*} moduleId      表体区域
 * @param {*} key           表头字段
 * @param {*} value         新值
 * @param {*} changedrows   旧值
 * @param {*} index         行序号
 * @param {*} record        行数据
 */
export default function afterEvent(
  props,
  moduleId,
  key,
  value,
  changedrows,
  index,
  record
) {
  let {
    setValByKeyAndIndex,
    setEditableRowKeyByIndex,
    getValByKeyAndIndex
  } = this.props.editTable;
  if (key === "repay_prcpl_method") {
    // 还本方式
    if (value == "1") {
      //按月
      //还本开始月
      setValByKeyAndIndex(this.tableId, index, "startrepprcplmth", {
        display: "1",
        value: "1"
      });
      //还本开始日期
      setValByKeyAndIndex(this.tableId, index, "repay_prcpl_date", {
        display: "21",
        value: "21"
      });
      //周期
    } else if (value == "2") {
      //按季度
      //还本开始月
      setValByKeyAndIndex(this.tableId, index, "startrepprcplmth", {
        display: "3",
        value: "3"
      });
      //还本开始日期
      setValByKeyAndIndex(this.tableId, index, "repay_prcpl_date", {
        display: "21",
        value: "21"
      });
    } else if (value == "3") {
      //按半年
      //还本开始月
      setValByKeyAndIndex(this.tableId, index, "startrepprcplmth", {
        display: "6",
        value: "6"
      });
      //还本开始日期
      setValByKeyAndIndex(this.tableId, index, "repay_prcpl_date", {
        display: "21",
        value: "21"
      });
    } else if (value == "4") {
      //按年
      //还本开始月
      setValByKeyAndIndex(this.tableId, index, "startrepprcplmth", {
        display: "12",
        value: "12"
      });
      //还本开始日期
      setValByKeyAndIndex(this.tableId, index, "repay_prcpl_date", {
        display: "21",
        value: "21"
      });
    } else if (value == "5" || value == "6") {
      //不规则和到期一次
      //还本开始月
      setValByKeyAndIndex(this.tableId, index, "startrepprcplmth", {
        display: null,
        value: null
      });
      //还本开始日期
      setValByKeyAndIndex(this.tableId, index, "repay_prcpl_date", {
        display: null,
        value: null
      });
      //还本周期
      setValByKeyAndIndex(this.tableId, index, "repay_prcpl_period", {
        display: null,
        value: null
      });
    }
    let isEditable, defaultPeriod;
    if (value === "1" || value === "2" || value === "3" || value === "4") {
      // 如果是按月 按季度 按半年 按年 设置还本日期 还本开始月 还本周期 字段可编辑
      isEditable = true;
      defaultPeriod = "1";
    } else {
      isEditable = false;
      defaultPeriod = null;
    }

    setEditableRowKeyByIndex(
      this.tableId,
      index,
      [
        "startrepprcplmth", // 还本日期
        "repay_prcpl_date", // 还本开始月
        "repay_prcpl_period" // 还本周期
      ],
      isEditable
    );
    // 设置还本周期默认值
    setValByKeyAndIndex(this.tableId, index, "repay_prcpl_period", {
      value: defaultPeriod,
      display: defaultPeriod
    });
  }
  if (key === "repay_intst_method") {
    if (value == "1") {
      // 付息开始月
      setValByKeyAndIndex(this.tableId, index, "startrepintstmth", {
        display: "1",
        value: "1"
      });
      // 付息开始日
      setValByKeyAndIndex(this.tableId, index, "repay_intst_date", {
        display: "21",
        value: "21"
      });
    } else if (value == "2") {
      // value给空格过校验，保存的时候value赋-1，查询的时候-1改成空格
      // 付息开始月
      setValByKeyAndIndex(this.tableId, index, "startrepintstmth", {
        display: "3",
        value: "3"
      });
      // 付息开始日
      setValByKeyAndIndex(this.tableId, index, "repay_intst_date", {
        display: "21",
        value: "21"
      });
    } else if (value == "3") {
      // value给空格过校验，保存的时候value赋-1，查询的时候-1改成空格
      // 付息开始月
      setValByKeyAndIndex(this.tableId, index, "startrepintstmth", {
        display: "6",
        value: "6"
      });
      // repay_intst_date 付息开始日
      setValByKeyAndIndex(this.tableId, index, "repay_intst_date", {
        display: "21",
        value: "21"
      });
    } else if (value == "4") {
      // 付息开始月
      setValByKeyAndIndex(this.tableId, index, "startrepintstmth", {
        display: "12",
        value: "12"
      });
      // repay_intst_date 付息开始日
      setValByKeyAndIndex(this.tableId, index, "repay_intst_date", {
        display: "21",
        value: "21"
      });
    } else if (value == "5" || value == "6") {
      // 不规则和到期一次
      // 付息开始日期
      setValByKeyAndIndex(this.tableId, index, "repay_intst_date", {
        display: null,
        value: null
      });
      // 付息开始月
      setValByKeyAndIndex(this.tableId, index, "startrepintstmth", {
        display: null,
        value: null
      });
      // 付息周期
      setValByKeyAndIndex(this.tableId, index, "repay_intst_period", {
        display: null,
        value: null
      });
    }
    let isEditable, defaultPeriod;
    if (value === "1" || value === "2" || value === "3" || value === "4") {
      // 如果是按月 按季度 按半年 按年 设置付息日期 付息开始月 付息周期 字段可编辑
      isEditable = true;
      defaultPeriod = "1";
    } else {
      isEditable = false;
      defaultPeriod = null;
    }
    setEditableRowKeyByIndex(
      this.tableId,
      index,
      [
        "repay_intst_date", // 计息开始日期
        "startrepintstmth", // 计息开始月
        "repay_intst_period" // 计息周期
      ],
      isEditable
    );
    // 设置付息周期默认值
    setValByKeyAndIndex(this.tableId, index, "repay_intst_period", {
      value: defaultPeriod,
      display: defaultPeriod
    });
  }
}

/**
 * 重置meta
 * @param {*} areacode - 区域
 * @param {*} key - 目标字段
 * @param {*} attr - 设置属性
 * @param {*} value - 值
 */
function resetMetaValue(areacode, key, attr, value) {
  if (!value) return;
  let { meta: metaUtil } = this.props;
  let meta = metaUtil.getMeta() || {};
  meta[areacode].items.map(item => {
    if (item.attrcode === key) {
      // 如果key值匹配 进行赋值
      item[attr] = value;
    }
  });
  metaUtil.setMeta(meta);
}

/**
 * 获取meta某key的属性attr值
 * @param {*} areacode - 区域
 * @param {*} key - 目标字段
 * @param {*} attr - 设置属性
 * @param {*} value - 值
 */
function getMetaValue(areacode, key, attr) {
  let { meta: metaUtil } = this.props;
  let meta = metaUtil.getMeta() || {};
  let result;
  meta[areacode] &&
    meta[areacode].items &&
    meta[areacode].items.map(item => {
      if (item.attrcode === key) {
        // 如果key值匹配 进行赋值
        result = item[attr];
      }
    });
  return result;
}

/**
 * 设置还本方式枚举值 或 付息方式枚举值
 * @param {String} areacode - 区域编码
 * @param {String} key - 字段值
 * @param {String} value - 当前该字段值
 * @param {String} attr - 要设置的属性
 */
function resetRepayAndIntstOptions(areacode, key, value, attr) {
  let targetOptions;
  let targetKey = "";
  // 获取还本方式
  let repayOptions = getMetaValue.call(
    this,
    areacode,
    "repay_prcpl_method",
    attr
  );
  if (!this.repayOptions) {
    // 并存储到this中 供恢复使用
    this.repayOptions = [...repayOptions];
  }

  // 获取付息方式
  let intstOptions = getMetaValue.call(
    this,
    areacode,
    "repay_intst_method",
    attr
  );
  if (!this.intstOptions) {
    // 并存储到this中 供恢复使用
    this.intstOptions = [...intstOptions];
  }

  if (key === "repay_prcpl_method") {
    // 如果key为还本方式 设置付息方式options
    if (value === "6") {
      // 如果为不规则还本 重置meta 过滤付息方式
      // 去除付息方式为 5 即 到期一次付息的数据
      targetOptions = this.intstOptions.filter(item => item.value !== "5");
    } else {
      targetOptions = this.intstOptions;
    }
    targetKey = "repay_intst_method";
  } else if (key === "repay_intst_method") {
    // 如果key为付息方式 设置还本方式options
    if (value === "5") {
      // 如果为到期一次付息 重置meta 过滤还本方式
      // 去除还本方式为 6 即 不规则还本的数据
      targetOptions = this.repayOptions.filter(item => item.value !== "6");
    } else {
      targetOptions = this.repayOptions;
    }
    targetKey = "repay_prcpl_method";
  }

  targetKey &&
    targetOptions &&
    resetMetaValue.call(this, areacode, targetKey, attr, targetOptions);
}

/*OWmq6Ugo6jPE4W7xoi1UXmCWYqlC69sXfcFlY2wAGxgRaOVRhw27VYjQJQXQrA8m*/