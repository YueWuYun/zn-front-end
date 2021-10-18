// 卡片主表区域按钮显示规则
export function state4headBtns() {
  let {
    isAdd,
    isEdit,
    isCopy,
    isBrowseNoID,
    isBrowse,
    isNoState,
    isNoPass,
    isPassing,
    isGoingOn,
    isCommit,
    isPull,
    isdeal,
    isPush
  } = btnRule.call(this);
  return [
    {
      key: "Pull",
      visible: isBrowseNoID || isBrowse,
      primary: !isNoState // 非 未提交 状态 主要按钮
    },
    {
      key: "Edit",
      visible:!isBrowseNoID &&  isNoState
    },
    {
      key: "Delete",
      visible: !isBrowseNoID &&  isNoState
    },
    {
      key: "Commit",
      visible: isNoState,
      primary: isNoState // 未提交 主要按钮
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible: (isNoPass || isPassing || isCommit) && (!isdeal)
    },
    {
      key: "Save",
      visible: isAdd || isEdit || isCopy
    },
    {
      key: "SaveAdd",
      visible: isAdd || isEdit || isCopy
    },
    {
      key: "SaveCommit",
      visible: isAdd || isEdit || isCopy
    },
    {
      key: "Cancel",
      visible: isAdd || isEdit || isCopy
    },
    {
      key: "Union",
      visible: isBrowse
    },
    {
      key: "Print",
      visible: isBrowse
    },
    {
      key: "Output",
      visible: isBrowse
    },
    {
      key: "Attachment",
      visible: isBrowse
    },
    {
      key: "Refresh",
      visible: isBrowse
    },
    {
      key: "CancelPull", // 退出转单
      visible: isPull && isAdd, // 拉单
    },
    {
      key: "RLinkContractDocuBills", // 押汇合同
      visible: isdeal, // 是否有下游单据
    },
    {
      key: "ApproveDetail",
      visible: isBrowse && !isNoState
    },
  ];
}

/**
 * 按钮规则 通用
 */
function btnRule() {
  let { FormConfig, getUrlParam, form: formUtil } = this.props;
  let status = getUrlParam("status");
  let id = getUrlParam("id");
  let isPull = this.props.getUrlParam("isPull");
  let isPush = this.props.getUrlParam("isPush");
  // 无单据浏览态
  let isBrowseNoID = !id && status === "browse";
  // 单据浏览态
  let isBrowse = id && status === "browse";
  // 新增态
  let isAdd = status === "add";
  // 编辑态
  let isEdit = id && status === "edit";
  // 复制态
  let isCopy = status === "copy";


  // 审批状态
  let vbillstatus = formUtil.getFormItemsValue(
    FormConfig.formId,
    "vbillstatus"
  );
   // 是否有下游单据
   let isdeal = formUtil.getFormItemsValue(
    FormConfig.formId,
    "isdeal"
  );
  vbillstatus = vbillstatus && vbillstatus.value;
  isdeal = isdeal && isdeal.value;
  // 浏览 自由态
  let isNoState = isBrowse && vbillstatus === "-1";
  // 浏览 未通过态
  let isNoPass = isBrowse && vbillstatus === "0";
  // 浏览 通过态
  let isPassing = isBrowse && vbillstatus === "1";
  // 浏览 进行中
  let isGoingOn = isBrowse && vbillstatus === "2";
  // 浏览 提交态
  let isCommit = isBrowse && vbillstatus === "3";

  return {
    isAdd,
    isEdit,
    isCopy,
    isBrowseNoID,
    isBrowse,
    isNoState,
    isNoPass,
    isPassing,
    isGoingOn,
    isCommit,
    isPull,
    isdeal,
    isPush
  };
}
