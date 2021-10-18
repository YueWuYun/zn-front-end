import { ajax, print } from "nc-lightapp-front";
import { btnRuleHandle } from "./utils";

/**
 * 按钮接口操作 需要使用call调用。调用的接口需要在constant.js中定义
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
export function api(params) {
  let { name, data, success, error } = params;
  let { BillConfig } = this.props;
  ajax({
    url: BillConfig.API_URL[name],
    data,
    success: res => {
      success && success(res);
    }
  });
}

/**
 * 设置头部按钮启用状态
 */
export function toggleListHeadBtnDisabled() {
  let { button: buttonUtil, BtnConfig } = this.props;
  let btnsRule = BtnConfig.btnsRule.call(this);
  let { btnsVisible, btnsDisable } = btnRuleHandle.call(this, btnsRule);
  // 设置按钮启用和禁用
  buttonUtil.setButtonDisabled(btnsDisable);
  // 设置按钮显示和隐藏
  buttonUtil.setButtonVisible(btnsVisible);
}

/**
 * 设置行内按钮显示状态
 */
export function toggleListInnerBtnVisible(record, index) {
  let { TableConfig } = this.props;
  // 执行列表行内按钮可用规则
  let btnsRule = TableConfig.btnsRule.call(this, record, index);
  // 根据按钮规则返回所要显示的按钮
  let { btnsVisible } = btnRuleHandle.call(this, btnsRule, record, index);
  let btnsVisibleArray = [];
  for (const key in btnsVisible) {
    if (btnsVisible.hasOwnProperty(key)) {
      const element = btnsVisible[key];
      element && btnsVisibleArray.push(key);
    }
  }
  return btnsVisibleArray;
}

/**
 * 打印
 * @param {*} pks - 数组类型pk
 */
export function printFn(pks) {
  let { BillConfig, getSearchParam, getUrlParam } = this.props;
  let appCode = getSearchParam("c") || getUrlParam("c");
  print("pdf", BillConfig.API_URL.print, {
    appcode: appCode,
    nodekey: null,
    oids: pks
  });
}
export function printListAll(pks) {
  let { BillConfig, getSearchParam, getUrlParam } = this.props;
  let appCode = getSearchParam("c") || getUrlParam("c");
  print("pdf", BillConfig.API_URL.printlist, {
    appcode: appCode,
    nodekey: BillConfig.nodekey,
    oids: pks
  });
}

/**
 * 输出
 * @param {*} pks - 数据主键
 */
export function output(pks) {
  let { BillConfig } = this.props;
  this.setState(
    {
      outputData: {
        nodekey: BillConfig.nodekey, // 打印节点key
        oids: pks, // 要打印的pks
        outputType: "output" // 输出类型
      }
    },
    () => {
      this.refs.printOutput.open();
    }
  );
}
