import {
  btnRuleHandle,
  handleRule
} from "./utils";
/**
 * 设置头部按钮状态
 */
export function toggleCardHeadBtn() {
  let {
    button: buttonUtil,
    BtnConfig
  } = this.props;
  // 执行主表头部按钮可用规则
  let btnsRule = BtnConfig.btnsRule.call(this);
  let {
    btnsVisible,
    btnsDisable,
    btnsPrimary
  } = btnRuleHandle.call(
    this,
    btnsRule
  );
  // 设置按钮启用和禁用
  buttonUtil.setButtonDisabled(btnsDisable);
  // 设置按钮可见和隐藏
  buttonUtil.setButtonVisible(btnsVisible);
  // 设置按钮为主要或次要
  buttonUtil.setMainButton(btnsPrimary);
}

/**
 * 设置子表肩部按钮状态
 * @param {*} checkedRows 勾选的行数
 */
export function toggleCardTableTabsBtn(checkedRows = []) {
  let {
    button: buttonUtil,
    TabsConfig,
    cardTable: cardTableUtil
  } = this.props;
  let activeKey = cardTableUtil.getCurTabKey();
  if (!TabsConfig || !TabsConfig.btnsRule) return;
  let btnsRule;
  // 没有勾选行时，应该取消复制状态
  if (checkedRows.length === 0) {
    this.setState({
      isPaste: false
    }, () => {
      // 执行子表肩部按钮可用规则
      btnsRule = TabsConfig.btnsRule.call(this);
      if (!btnsRule) return;
      // 根据按钮规则返回所要显示的按钮
      let {
        btnsVisible,
        btnsDisable
      } = btnRuleHandle.call(
        this,
        btnsRule,
        activeKey,
        checkedRows
      );
      // 设置按钮启用和禁用
      buttonUtil.setButtonDisabled(btnsDisable);
      // 设置按钮启用和禁用
      buttonUtil.setButtonVisible(btnsVisible);
    });
    return;
  } else {
    // 执行子表肩部按钮可用规则
    btnsRule = TabsConfig.btnsRule.call(this);
    if (!btnsRule) return;
    // 根据按钮规则返回所要显示的按钮
    let {
      btnsVisible,
      btnsDisable
    } = btnRuleHandle.call(
      this,
      btnsRule,
      activeKey,
      checkedRows
    );
    // 设置按钮启用和禁用
    buttonUtil.setButtonDisabled(btnsDisable);
    // 设置按钮启用和禁用
    buttonUtil.setButtonVisible(btnsVisible);
  }
}

/**
 * 设置行内按钮显示状态
 * @param {String} key - 页签key值
 * @param {Object} record - 当前行数据
 * @param {Number} index - 当前行索引
 */
export function toggleCardTableInnerBtnVisible(key, record, index) {
  let {
    TableConfig
  } = this.props;
  if (!TableConfig) return;
  // 执行列表行内按钮可用规则
  let btnsRule = TableConfig.btnsRule.call(this, key, record, index);
  // 根据按钮规则返回所要显示的按钮
  let {
    btnsVisible
  } = btnRuleHandle.call(this, btnsRule, record, index);
  let btnsVisibleArray = [];
  for (let ele in btnsVisible) {
    if (btnsVisible.hasOwnProperty(ele)) {
      let isVisible = btnsVisible[ele];
      isVisible && btnsVisibleArray.push(ele);
    }
  }
  return btnsVisibleArray;
}
/**
 *   侧拉弹框按钮控制函数
 * @param {Object} record 操作行数据
 * @param {Object} index 操作行索引
 */
export function toogleSideModalBtns(record, index) {
  let {
    SideModalConfig, // 侧拉弹框配置信息
    TableConfig,
    cardTable: cardTableUtil
  } = this.props;

  let curTabKey = TableConfig && cardTableUtil.getCurTabKey(); // 当前子表活动页签
  let sideModalBtns =
    SideModalConfig &&
    SideModalConfig.btnsRule &&
    SideModalConfig.btnsRule.call(this, curTabKey, record, index); // 侧拉弹框按钮显示控制函数
  let sideModalAdd = true,
    sideModalDel = true,
    sideModalSave = true;
  sideModalBtns &&
    sideModalBtns.map(item => {
      let visible = true;
      if (item.visible instanceof Boolean) {
        // 如果是布尔值
        visible = item.visible;
      } else if (item.visible instanceof Function) {
        // 如果是函数
        visible = item.visible.call(this);
      } else {
        visible = Boolean(item.visible);
      }
      switch (item.key) {
        case "modalAdd":
          sideModalAdd = visible;
          break;
        case "modalDel":
          sideModalDel = visible;
          break;
        case "modalSave":
          sideModalSave = visible;
          break;
        default:
          break;
      }
    });
  this.setState({
    sideModalAdd,
    sideModalDel,
    sideModalSave
  });
}

/**
 * 页签规则处理
 */
let TabsRuleObj = null;
export function handleTabsRule(newVal, oldVal, cardData) {
  let {
    TabsConfig,
    cardTable: cardTableUtil,
    getUrlParam
  } = this.props;
  // 当前单据状态
  let isAdd = getUrlParam("status") === "add";
  if (!TabsConfig) return;
  // 如果页签规则存在 则执行页签规则
  if (!TabsConfig.tabsRule) return;
  // 获取页签规则
  TabsRuleObj = TabsConfig.tabsRule.call(this, newVal, oldVal, cardData);
  // 需要设置的页签对象
  let TabsRuleData = {};
  // 当前激活页签
  let curTabKey = cardTableUtil.getCurTabKey();
  TabsConfig.tabOrder.forEach(tabKey => {
    if (TabsRuleObj[tabKey]) {
      // 显隐性，是否激活状态，是否需要清空
      let {
        show,
        isCur,
        isClear
      } = handleTabsRuleData.call(
        this,
        TabsRuleObj[tabKey]
      );
      if (!curTabKey) {
        // 如果curTabKey不存在 ，默认激活页签为第一个
        isCur = tabKey === TabsConfig.tabOrder[0];
      } else {
        isCur = show ? curTabKey === tabKey : tabKey === TabsConfig.tabOrder[0];
      }
      // 将页签规则转换为 正常页签配置属性
      TabsRuleData[tabKey] = {
        show,
        isCur,
        isClear
      };
    }
  });
  for (let tabKey in TabsRuleData) {
    if (TabsRuleData[tabKey] && TabsRuleData[tabKey].isClear) {
      // 如果要清空
      delTabData.call(this, this.props, tabKey);
      TabsRuleData[tabKey].isClear = false;
    }
  }

  // 当前单据如果是新增态时，直接移除数据，非新增状态是会将子表数据进行状态改写
  cardTableUtil.tabKeyShowSwitch(TabsRuleData, isAdd);
}

/**
 * 处理每个页签的规则
 * @param {*} tabRule 某一项页签规则
 */
function handleTabsRuleData(tabRule) {
  // 页签指定规则 显示规则、激活规则、清除规则
  let {
    show: showRlue,
    active: activeRule,
    clear: clearRule
  } = tabRule;
  // 显示规则 - 控制对应页签是否显示
  showRlue = handleRule.call(this, showRlue, true);
  // 激活规则 - 控制对应页签是否激活状态
  activeRule = handleRule.call(this, activeRule, false);
  // 清除规则 - 控制对应页签是否需要清空
  clearRule = handleRule.call(this, clearRule, false);
  return {
    show: showRlue,
    isCur: activeRule,
    isClear: clearRule
  };
}

/**
 * 删除子表数据
 * @param {*} props 父组件传入参数集合
 * @param {*} key 子表页签key值
 */
export function delTabData(props, key) {
  // 获取子表数据
  let data = props.cardTable.getTabData(key);
  // 删除后数据
  let result = [];
  for (let item of data.rows) {
    if (item.status !== "2") {
      // 不是新增数据
      if (["0", "1"].includes(item.status)) {
        //原有数据修改状态并保留
        item.status = "3";
      }
      result.push(item);
    }
  }
  // 重新赋值子表数据
  data.rows = result;
  props.cardTable.setTabData(key, data);
}

/*
* 获取某个元素下标
* arr: 传入的数组
* obj: 需要获取下标的元素
* */
export function getArrayIndex(arr, obj) {
  var i = arr.length;
  while (i--) {
      if (arr[i] === obj) {
          return i;
      }
  }
  return -1;
}