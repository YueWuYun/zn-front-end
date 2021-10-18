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
  // 列表选中某一条时页面按钮可用规则 onlyOne 为当前选中行数据
  let onlyOne = checkedRows.length === 1 && checkedRows[0];
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
      key: "Copy", // 复制
      disable: init,
    },
    {
      key: "Output", // 输出
      disable: init,
    },
    {
      key: "LinkContractDocuBills", // 联查押汇合同
      disable: init
    },
    {
      key: "HistoryVersion", // 联查历史版本
      disable: init
    },
    {
      key: "Voucher", // 联查凭证
      disable: init
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

  // 是否已经制证
  let isvoucher = record.voucherflag && record.voucherflag.value ;

   // 版本号
   let versionno = record.versionno && record.versionno.value;
   // 原始版本状态
   let versionorgin = record.versionorgin && record.versionorgin.value;
   // 新版本
   let isNewVersion =  versionorgin === "NEW";
  return [
    {
      key: "CommitInner", // 提交
      visible: isNoState, // 待提交
    },
    {
      key: "EditInner", // 修改
      visible: isNoState && versionno == 1, // 待提交
    },
    {
      key: "DelInner", // 删除
      visible: isNoState && versionno == 1, // 待提交
    },
    {
      key: "UncommitInner", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible:
      (isNoPass || (isPassing && !isvoucher) || isCommit) 
    },
    {
      key: "MakeVoucherInner", // 制证
      visible: isPassing && !isvoucher // 审批状态为通过并且没有制证
    },
    {
      key: "CancelVoucherInner", // 取消制证
      visible: isPassing && isvoucher // 审批状态为通过并且已经制证
    },
    {
      key: "ExtendsInner", // 展期  
      visible: isPassing , // 审批通过
    },
    {
      key: "DeleteVersionInner", // 删除版本
      visible: versionno > 1 && !isNewVersion && isNoState // 有版本号且版本号大于1
    },
  ];
};
