/**
 * 头部按钮状态规则
 * 控制按钮的可不可用 即按钮的 disable 属性 true 为不可用 fasle 为可用
 */
export const state4headBtns = function() {
  let { TableConfig, table: tableUtil } = this.props;
  let checkedRows = tableUtil.getCheckedRows(TableConfig.tableId);
  // 审批状态
  let vbillstatus =
    checkedRows[0] && checkedRows[0].data.values.vbillstatus.value;
  // 浏览 自由态
  let isNoState = vbillstatus === "-1";
  // 浏览 未通过态
  let isNoPass = vbillstatus === "0";
  // 浏览 通过态
  let isPassing = vbillstatus === "1";
  // 浏览 进行中
  let isGoingOn = vbillstatus === "2";
  // 浏览 提交态
  let isCommit = vbillstatus === "3";
  // 列表初始态或者没有勾选时页面按钮可用规则
  let init = checkedRows.length === 0;
  return [
    {
      key: "Credit", // 授信额度
      disable: init
    },
    {
      key: "FundPlan", // 计划预算
      disable: init
    },
    {
      key: "GuarantyContract", // 担保合同
      disable: init
    },
    {
      key: "RLinkOpenModify", // 开证修改
      disable: init
    },
    {
      key: "RLinkArrivalBill", // 到单承付
      disable: init
    },
    {
      key: "RLinkPayRegister", // 付款登记
      disable: init
    },
    {
      key: "RLinkApplyDocuBills", // 押汇申请
      disable: init
    },
    {
      key: "RLinkContractDocuBills", // 押汇合同
      disable: init
    },
    {
      key: "Output", // 输出
      disable: init
    },
    {
      key: "Print", // 打印
      disable: init
    },
    {
      key: "PrintList", // 打印清单
      disable: init
    },
    {
      key: "Attachment", // 附件
      disable: init
    },
  ];
};
/**
 * 列表行内按钮可用状态
 * 控制按钮的显示不显示 即按钮的 visible 属性 true 为显示 false 为不显示
 * @param {*} record 列表每行的行数据
 *
 */
export const state4innerBtns = function(record) {
  // 当前行数据审批状态
  let vbillstatus = record.vbillstatus && record.vbillstatus.value;
  // 浏览 自由态
  let isNoState = vbillstatus === "-1";
  // 浏览 未通过态
  let isNoPass = vbillstatus === "0";
  // 浏览 通过态
  let isPassing = vbillstatus === "1";
  // 浏览 进行中
  let isGoingOn = vbillstatus === "2";
  // 浏览 提交态
  let isCommit = vbillstatus === "3";

  return [
  ];
};
