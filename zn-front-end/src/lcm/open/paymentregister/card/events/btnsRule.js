// 卡片主表区域按钮显示规则
export function state4headBtns() {
  let {
    isBrowseNoID,
    isBrowse,
    isEdit,
    isAdd,
    isNoState,
    isNoPass,
    isPassing,
    isGoingOn,
    isCommit,
    isinitflag,
    isvoucher,
    isPull
  } = btnRule.call(this);

  return [
    {
      key: "Pull",
      visible: isBrowseNoID || isBrowse, // 浏览态
      primary: !isNoState // 非 自由态 状态 主要按钮
    },
    {
      key: "Edit",
      visible: isNoState || isNoPass // 审批状态为自由态
    },
    {
      key: "Delete",
      visible: isNoState || isNoPass // 审批状态为自由态
    },
    {
      key: "Copy",
      visible: isBrowse // 浏览态
    },
    {
      key: "Commit",
      visible: isNoState || isNoPass, // 审批状态为自由态
      primary: isNoState // 未提交 主要按钮
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、未执行 数据来源为手工
      visible:
        (isNoPass || isPassing || isCommit)
    },
    {
      key: "Save",
      visible: isAdd || isEdit // 新增和编辑态
    },
    {
      key: "SaveCommit",
      visible: isAdd || isEdit // 新增和编辑态
    },
    {
      key: "Cancel",
      visible: isAdd || isEdit // 新增和编辑态
    },
    {
      key: "MakeVoucher",
      visible: !isinitflag && isPassing && !isvoucher
    },
    {
      key: "CancelVoucher",
      visible: !isinitflag && isPassing && isvoucher
    },
    {
      key: "Union", // 联查
      visible: isBrowse
    },
    {
      key: "ApproveDetail", // 审批详情
      visible: isBrowse
    },
    {
      key: "LinkOpenRegister", // 开证登记
      visible: isBrowse
    },
    {
      key: "LinkOpenArrival", // 通知承付
      visible: isBrowse
    },
    {
      key: "FundPlan", // 计划预算
      visible: isBrowse
    },
    {
      key: "Voucher", // 凭证
      visible: isBrowse && isPassing
    },
    {
      key: "Print", // 打印
      visible: isBrowse // 浏览态
    },
    {
      key: "Output", // 输出
      visible: isBrowse // 浏览态
    },
    {
      key: "Refresh", // 刷新
      visible: isBrowse // 浏览态
    },
    {
      key: "Attachment", // 附件
      visible: isBrowse // 浏览态
    },
    {
      key: "CancelPull", // 退出转单
      visible: isPull && isAdd, // 拉单
    },
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
  let {
    FormConfig,
    getUrlParam,
    form: formUtil,
  } = this.props;
  let status = getUrlParam("status");
  let id = getUrlParam("id");
  // 无单据浏览态
  let isBrowseNoID = status === "browse" && !id;
  // 单据浏览态
  let isBrowse = status === "browse" && id;
  // 编辑或复制态
  let isEdit = status === "edit" && id;
  // 新增态
  let isAdd = status === "add";
  // 是否为拉单
  let isPull = this.props.getUrlParam("isPull");

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
  // 期初
  let isinitflag = formUtil.getFormItemsValue(FormConfig.formId, "isinitial");
  isinitflag = !!(isinitflag && isinitflag.value);
  // 制证
  let isvoucher = formUtil.getFormItemsValue(FormConfig.formId, "isvoucher");
  isvoucher = !!(isvoucher && isvoucher.value);

  return {
    isBrowseNoID,
    isBrowse,
    isEdit,
    isAdd,
    isNoState,
    isNoPass,
    isPassing,
    isGoingOn,
    isCommit,
    isinitflag,
    isvoucher,
    isPull
  };
}
