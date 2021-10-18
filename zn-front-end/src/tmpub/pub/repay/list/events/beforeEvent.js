/*mgBVjmwkvoNAq04L4PpN6TwuBaoKUn1hLCHElOQLvKhO6qU9zi8EQcHh0cADsKog*/
/**
 * 卡片编辑前事件
 * @param {*} moduleId
 * @param {*} key
 * @param {*} value
 * @param {*} data
 */
export default function beforeEvent(
  props,
  moduleId,
  data,
  arg1,
  value,
  record
) {
  if (
    data &&
    (data.attrcode === "repay_prcpl_method" ||
      data.attrcode === "repay_intst_method")
  ) {
    // 如果编辑还本方式 或 付息方式
    if (value.value) {
      // 该标志位判断是否走编辑后事件
      this.runAfterEvent = false;
      return resetRepayAndIntstOptions.call(
        this,
        moduleId,
        data.attrcode,
        value.value,
        "options",
        record
      );
    } else {
      this.runAfterEvent = true;
      return resetRepayAndIntstOptions.call(
        this,
        moduleId,
        data.attrcode,
        value.value,
        "options",
        record
      );
    }
  }

  return true;
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
async function resetRepayAndIntstOptions(areacode, key, value, attr, record) {
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
    // 如果key为还本方式 设置本字段options
    // 获取当前数据付息方式
    let intst_method = record.values.repay_intst_method;
    intst_method = intst_method && intst_method.value;
    if (intst_method === "5" || intst_method === "6") {
      // 如果为到期一次付息 去除还本方式为 6 即 不规则还本 的数据
      targetOptions = this.repayOptions.filter(item => item.value !== "6");
    } else {
      targetOptions = this.repayOptions;
    }
    targetKey = "repay_prcpl_method";
  } else if (key === "repay_intst_method") {
    // 如果key为付息方式 设置本字段options

    // 获取当前数据还本方式
    let repay_method = record.values.repay_prcpl_method;
    repay_method = repay_method && repay_method.value;
    if (repay_method === "6") {
      // 如果为不规则还本 去除付息方式为 5 即 到期一次付息 的数据
      targetOptions = this.intstOptions.filter(
        item => item.value !== "5" && item.value !== "6"
      );
    } else {
      targetOptions = this.intstOptions;
    }
    targetKey = "repay_intst_method";
  }

  targetKey &&
    targetOptions &&
    (await resetMetaValue.call(this, areacode, targetKey, attr, targetOptions));

  return true;
}

/*mgBVjmwkvoNAq04L4PpN6TwuBaoKUn1hLCHElOQLvKhO6qU9zi8EQcHh0cADsKog*/