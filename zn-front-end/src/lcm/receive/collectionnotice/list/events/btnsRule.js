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
  let isvoucher = checkedRows[0] && checkedRows[0].data.values.voucherflag.value; 
  let actualcollectdate = checkedRows[0] && checkedRows[0].data.values.actualcollectdate.value; 
  let sumcollectamount = checkedRows[0] && checkedRows[0].data.values.sumcollectamount.value; 
  let committype = checkedRows[0] && checkedRows[0].data.values.committype.value;
  let confirmcollect = ! actualcollectdate && !sumcollectamount || committype == "4";
    // 浏览 未通过态
    let isNoPass = vbillstatus === "0";
    // 浏览 通过态
    let isPassing = vbillstatus === "1";

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
          !(vbillstatus === "0" || vbillstatus === "1" || vbillstatus === "3")  || isvoucher ),
    },
    {
      key: "CreditLimit", // 授信额度
      disable: init,
    },
    // {
    //   key: "Union", // 联查
    //   disable: init,
    // },
    {
      key: "Attachment", // 附件
      disable: init,
    },
    {
      key: "Voucher", // 总账凭证
      disable: init || (onlyOne && !isvoucher),
    },
    {
      key: "LinkReceiveRegister" , // 收证登记
      disable: init ,
    },
    {
      key: "RLinkSubmissionregisterBill", // 交单登记
      disable: init ,
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
      key: "Copy", // 复制
      disable: init,
    },
    {
      key: "Output", // 输出
      disable: init,
    },
    {
      key: "ApproveDetail", // 审批详情
      disable: init || vbillstatus == "-1",
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
  let { getUrlParam} = this.props;
  // 当前行数据单据状态
  //let busistatus = record.busistatus && record.busistatus.value;
  let vbillstatus = record.vbillstatus && record.vbillstatus.value;
  let isvoucher = record.voucherflag && record.voucherflag.value;
  let actualcollectdate = record.actualcollectdate && record.actualcollectdate.value;
  let sumcollectamount = record.sumcollectamount && record.sumcollectamount.value;
  let committype = record.committype && record.committype.value;
  let confirmcollect = ! actualcollectdate && !sumcollectamount || committype == "4";

  return [
    {
      key: "CommitInner", // 提交
      visible: vbillstatus === "-1" && ! confirmcollect, // 待提交
    },
    {
      key: "EditInner", // 修改
      visible: vbillstatus === "-1" && confirmcollect, // 待提交
    },
    {
      key: "DelInner", // 删除
      visible: vbillstatus === "-1" && confirmcollect, // 待提交
    },
    {
      key: "UncommitInner", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible:
        (vbillstatus === "0" || vbillstatus === "1" || vbillstatus === "3") && !isvoucher,
    },

    {
      key: "ConfirmCollectInner", // 确认收款
      visible:
        vbillstatus === "-1" && confirmcollect,
    },
    {
      key: "CancelConfirmCollectInner", // 确认收款
      visible:
        vbillstatus === "-1" && ! confirmcollect,
    },
    {
      key: "MakeVoucherInner", // 制证
      visible:
      vbillstatus === "0" || vbillstatus === "1" && !isvoucher,
    },
    {
      key: "CancelVoucherInner", // 取消制证
      visible:
      isvoucher,
    },
    //  ConfirmCollectInner   CancelConfirmCollectInner   MakeVoucherInner   CancelVoucherInner   
  ];
};
 