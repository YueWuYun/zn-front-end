import { isEqualedKeyVal } from "../../../../public/container/list.js";
/**
 * 头部按钮状态规则
 * 控制按钮的可不可用 即按钮的 disable 属性 true 为不可用 fasle 为可用
 */
export const state4headBtns = function () {
  let { TableConfig, table: tableUtil } = this.props;
  let checkedRows = tableUtil.getCheckedRows(TableConfig.tableId);
 
  // 列表初始态或者没有勾选时页面按钮可用规则
  let init = checkedRows.length === 0;
  // 审批状态
  let vbillstatus =
    checkedRows[0] && checkedRows[0].data.values.vbillstatus.value;

  // 浏览 通过态
  let isPassing = vbillstatus === "1";
  // 列表选中某一条时页面按钮可用规则 onlyOne 为当前选中行数据
  let onlyOne = checkedRows.length === 1 && checkedRows[0];
  //信用证状态
  let lcStatus = checkedRows[0] && checkedRows[0].data.values.lcstatus.value;
  let isClosed = lcStatus === "cancelled"; // 注销
  // 提交态
  let isCommit = lcStatus === "registering";
  // 待注销
  let preCancel = lcStatus === "precancel";
  // 待交单
  let presubmission = lcStatus === "presubmission";

  return [
    {
      key: "Delete", // 删除
      disable: init || (onlyOne && vbillstatus !== "-1"),
    },
    {
      key: "Commit", // 提交
      disable: init || (onlyOne && vbillstatus !== "-1"),
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交
      disable:
        init ||
        (onlyOne &&
          !(vbillstatus === "0" || vbillstatus === "1" || vbillstatus === "3")),
    },
    {
      key: "Attachment", // 附件
      disable: init,
    },
    {
      key: "Print", // 打印
      disable: init,
    },
    {
      key: "PrintList", // 打印清单
      disable: init,
    },
    {
      key: "LogOut", // 注销
      disable: init  ||
      (onlyOne &&
        !(!(isClosed || isCommit) && isPassing)) // 审批通过 未注销
    },
    {
      key: "SubmissionRegister", // 关联 交单登记
      disable: init ||
      (onlyOne &&
        !(isPassing  && presubmission))
    },
    {
      key: "ReceiveModify", // 关联 收征修改
      disable: init ||
      (onlyOne &&
        !(isPassing && !(isClosed || isCommit || preCancel))) // 审批通过 未注销
    },
    {
      key: "RLinkCollectionNotice", // 联查 通知收款
      disable: init,
    },
    {
      key: "RLinkSubmissionregisterBill", // 联查 交单登记
      disable: init,
    },
    {
      key: "RLinkReceivemodifyBill", // 联查 收证修改
      disable: init,
    },
    {
      key: "RLinkApplyDocuBills", // 联查 押汇申请
      disable: init,
    },
    {
      key: "RLinkContractDocuBills", // 联查 押汇合同
      disable: init,
    },
    {
      key: "FundPlan", // 联查 计划预算
      disable: init,
    },
    {
      key: "Copy", // 复制
      disable: init ,
    },
    {
      key: "Output", // 输出
      disable: init,
    },
    {
      key: "ApproveDetail", // 审批详情
      disable: init,
    },
  ];
};
/**
 * 列表行内按钮可用状态
 * 控制按钮的显示不显示 即按钮的 visible 属性 true 为显示 false 为不显示
 * @param {*} record 列表每行的行数据
 *
 */
export const state4innerBtns = function (record) {
  // 当前行数据单据状态
  let busistatus = record.lcstatus && record.lcstatus.value;
  let vbillstatus = record.vbillstatus && record.vbillstatus.value;

  let isClosed = busistatus === "cancelled"; // 注销
  // 提交态
  let isCommit = busistatus === "registering";
  // 待注销
  let preCancel = busistatus === "precancel";
  // 待交单
  let presubmission = busistatus === "presubmission";
  //待收款
  let precollection = busistatus === "precollection"
  // 待承付
  let precommit = busistatus === "precommit"

  //审批状态
  // 自由态
  let isNoState = vbillstatus === "-1";
  // 未通过态
  let isNoPass = vbillstatus === "0";
  // 通过态
  let isPassing = vbillstatus === "1";
  // 进行中
  let isGoingOn = vbillstatus === "2";
  // 提交态
  let isVbCommit = vbillstatus === "3";

  // 待提交态按钮组合
  let commitInner = (isCommit && isNoState) || (isCommit && isNoPass) ;

  return [
    {
      key: "CommitInner", // 提交
      visible: commitInner, // 待提交
    },
    {
      key: "EditInner", // 修改
      visible: commitInner, // 修改
    },
    {
      key: "DelInner", // 删除
      visible: commitInner, // 删除
    },
    {
      key: "UncommitInner", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible:
        (isNoPass && isCommit) || (isVbCommit && isCommit) || (presubmission && isPassing),
    },
    {
      key: "LogOutInner", // 注销
      visible: presubmission || precommit || precollection || preCancel, // 注销
    },
  ];
};
