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
  // 列表选中某一条时页面按钮可用规则
  let onlyOne = checkedRows.length === 1 && checkedRows[0];
  // 列表初始态或者没有勾选时页面按钮可用规则
  let init = checkedRows.length === 0;
  return [
    {
      key: "Delete",
      disable: init || (onlyOne && (!isNoState))
    },
    {
      key: "Commit",
      disable: init || (onlyOne && (!isNoState))
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、未执行 数据来源为手工
      disable:
        init ||
        (onlyOne && isNoState)
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
    {
      key: "ApproveDetail", // 审批详情
      disable: init
    },
    {
      key: "LinkOpenRegister", // 开证登记
      disable: init
    },
    {
      key: "LinkOpenArrival", // 通知承付
      disable: init
    },
    {
      key: "FundPlan", // 计划预算
      disable: init
    },
    {
      key: "Voucher", // 总帐凭证
      disable: init || !isPassing
    }
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
  // 是否制证
  let isVoucher = record.isvoucher && record.isvoucher.value;

  return [
    {
      key: "CommitInner", // 提交
      visible: isNoState // 待提交
    },
    {
      key: "EditInner", // 修改
      visible: isNoState // 待提交
    },
    {
      key: "DelInner", // 删除
      visible: isNoState // 待提交
    },
    {
      key: "UncommitInner", // 收回
      visible: !isNoState
    },
    {
      key: "MakeVoucherInner", // 制证
      visible: isPassing && !isVoucher
    },
    {
      key: "CancelVoucherInner", // 取消制证
      visible: isPassing && isVoucher
    },
  ];
};
