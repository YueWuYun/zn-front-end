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
export const state4innerBtns = function (record) {
  // 当前行数据单据状态
  let busistatus = record.busistatus && record.busistatus.value;
  let vbillstatus = record.vbillstatus && record.vbillstatus.value;
  return [
    {
      key: "CommitInner", // 提交
      visible: busistatus === "-1", // 待提交
    },
    {
      key: "EditInner", // 修改
      visible: busistatus === "-1", // 待提交
    },
    {
      key: "DelInner", // 删除
      visible: busistatus === "-1", // 待提交
    },
    {
      key: "UncommitInner", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible:
        vbillstatus === "0" || vbillstatus === "1" || vbillstatus === "3",
    },
  ];
};
