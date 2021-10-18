/**
 * 头部按钮状态规则
 * 控制按钮的可不可用 即按钮的 disable 属性 true 为不可用 fasle 为可用
 */
export const state4headBtns = function() {
  let { TableConfig, table: tableUtil } = this.props;
  let checkedRows = tableUtil.getCheckedRows(TableConfig.tableId);
  // 列表初始态或者没有勾选时页面按钮可用规则
  let init = checkedRows.length === 0;
   //担保合同
   let pk_guaprotocol = checkedRows[0] && checkedRows[0].data.values.pk_guaprotocol.value;
   
  let isGuaprotocol = pk_guaprotocol == null ? true : false;
  // 审批状态
  let vbillstatus =
    checkedRows[0] && checkedRows[0].data.values.vbillstatus.value;
  // 列表选中某一条时页面按钮可用规则 onlyOne 为当前选中行数据
  let onlyOne = checkedRows.length === 1 && checkedRows[0];
  return [
    {
      key: "Delete", // 删除
      disable: init || (onlyOne && vbillstatus !== "-1")
    },
    {
      key: "Commit", // 提交
      disable: init || (onlyOne && vbillstatus !== "-1")
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交
      disable:
        init ||
        (onlyOne &&
          !(vbillstatus === "0" || vbillstatus === "1" || vbillstatus === "3"))
    },
    {
      key: "Attachment", // 附件
      disable: init
    },
    {
      key: "Print", // 打印
      disable: init
    },
    {
      key: "Copy", // 复制
      disable: init
    },
    {
      key: "Output", // 输出
      disable: init
    },
    {
      key: "PrintList",
      disable: init
    },
    {
      key: "ApproveDetail", // 审批详情
      disable: init
    },
    {
      key: "GuarantyContract", // 担保合同
      disable: init || vbillstatus !== "1" || isGuaprotocol
    },
    {
      key: "Credit", // 授信额度
      disable: init
    },
    {
      key: "LinkOpenRegister", // 开证登记
      disable: init
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
  // 当前行数据单据状态
  let vbillstatus = record.vbillstatus && record.vbillstatus.value;
  return [
    {
      key: "CommitInner", // 提交
      visible: vbillstatus === "-1" // 待提交
    },
    {
      key: "EditInner", // 修改
      visible: vbillstatus === "-1" // 待提交
    },
    {
      key: "DelInner", // 删除
      visible: vbillstatus === "-1" // 待提交
    },
    {
      key: "UncommitInner", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible: vbillstatus === "0" || vbillstatus === "1" || vbillstatus === "3"
    }
  ];
};
