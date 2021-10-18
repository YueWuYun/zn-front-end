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
    isPull
  } = btnRule.call(this);
  return [
    {
      key: "Pull",
      visible: isBrowseNoID || isBrowse,
      primary: !isNoState // 非 未提交 状态 主要按钮
    },
    {
      key: "Edit",
      visible: isNoState
    },
    {
      key: "Copy",
      visible: isBrowse
    },
    {
      key: "Delete",
      visible: isNoState
    },
    {
      key: "Commit",
      visible: isNoState,
      primary: isNoState // 未提交 主要按钮
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible: (isNoPass || isPassing || isCommit)
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
      key: "Reference",
      visible: isBrowse
    },
    {
      key: "RefCharge",
      visible: isBrowse && isPassing
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
    }
  ];
}

// 卡片子表肩部按钮
export function state4tableBtns() {
  let { isEdit, isAdd, isOpenpayplan, isGuarantee, isChange } = btnRule.call(
    this
  );
  return [];
}

/**
 * 卡片子表区域行内按钮规则
 * @param {String} key - 页签key值
 * @param {Object} record - 某行数据
 * @param {Number} index - 该行数据索引
 */
export function state4innerBtns(key, record, index) {
  let {
    isAdd,
    isEdit,
    isBrowse,
    isBrowseNoID
  } = btnRule.call(this);
  let { status } = record;
  return [
    {
      key: "Expand", // 编辑态 - 展开
      visible: !(isBrowse || isBrowseNoID) // 非浏览态
    },
    {
      key: "Fold", // 浏览态 - 展开
      visible: isBrowse && !!record.expandRowStatus
    },
    {
      key: "Unfold", // 浏览态 - 收起
      visible: isBrowse && !record.expandRowStatus
    }
  ];
}


/**
 * 卡片子表侧拉弹框按钮规则
 * @param {String} key - 页签key值
 * @param {Object} record - 某行数据
 * @param {Number} index - 该行数据索引
 */
export function state4sideModalBtns(key, record, index) {
  if (!record) {
    return [];
  }
  return [
    {
      key: "modalAdd", // 增行
      visible: false
    },
    {
      key: "modalDel", // 删行
      visible: false
    }
  ];
}

/**
 * 按钮规则 通用
 */
function btnRule() {
  let { FormConfig, getUrlParam, form: formUtil } = this.props;
  let status = getUrlParam("status");
  let id = getUrlParam("id");
  // 是否为拉单
  let isPull = this.props.getUrlParam("isPull");
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
  vbillstatus = vbillstatus && vbillstatus.value;
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
    isPull
  };
}
