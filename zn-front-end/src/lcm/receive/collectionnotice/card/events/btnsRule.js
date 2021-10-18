// // 卡片主表区域按钮显示规则
// export function state4headBtns() {
//   let {
//     isAdd,
//     isEdit,
//     isCopy,
//     //isBrowseNoID,
//     isBrowse,
//     isNoCommit,
//     isApproveing,
//     isApproved,
//     isNoState,
//     isNoPass,
//     isPassing,
//     isGoingOn,
//     isCommit
//   } = btnRule.call(this);
//   return [
//     {
//       key: "Pull",
//       //visible: isBrowseNoID || isBrowse,
//       visible: isBrowse,
//       primary: !isNoCommit // 非 未提交 状态 主要按钮
//     },
//     {
//       key: "Edit",
//       visible: isNoState
//       //isNoState
//     },
//     {
//       key: "Copy",
//       visible: isBrowse
//     },
//     {
//       key: "Delete",
//       visible: isNoState
//     },
//     {
//       key: "Commit",
//       visible: isNoState,
//       primary: isNoState // 未提交 主要按钮
//     },
//     {
//       key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
//       visible: (isNoPass || isPassing || isCommit)
//     },
//     {
//       key: "Save",
//       visible: isAdd || isEdit || isCopy
//     },
//     {
//       key: "SaveAdd",
//       visible: isAdd || isEdit || isCopy
//     },
//     {
//       key: "SaveCommit",
//       visible: isAdd || isEdit || isCopy
//     },
//     {
//       key: "Cancel",
//       visible: isAdd || isEdit || isCopy
//     },
//     {
//       key: "Union",
//       visible: isBrowse
//     },
//     {
//       key: "Print",
//       visible: isBrowse
//     },
//     {
//       key: "Output",
//       visible: isBrowse
//     },
//     {
//       key: "Attachment",
//       visible: isBrowse
//     },
//     {
//       key: "Refresh",
//       visible: isBrowse
//     }
//   ];
// }


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
    //isBrowseNoID,
  } = btnRule.call(this);
  let { status } = record;
  return [
    // {
    //   key: "InsertRow", // 插入
    //   visible:
    //     (isAdd || isEdit) ,
    // },
    // {
    //   key: "DelRow", // 删除
    //   visible: () => {
    //     if (isBrowse) {
    //       // 如果是浏览态
    //       return false;
    //     }else{
    //       return true;
    //     }
    //   },
    // },
    // {
    //   key: "CopyAtLine", // 粘贴至此
    //   visible: this.state.isPaste ,
    // },
    {
      key: "Expand", // 编辑态 - 展开
      //visible: !(isBrowse || isBrowseNoID), // 非浏览态
      visible: !isBrowse, // 非浏览态
    },
    {
      key: "Fold", // 浏览态 - 展开
      visible: isBrowse && !!record.expandRowStatus,
    },
    {
      key: "Unfold", // 浏览态 - 收起
      visible: isBrowse && !record.expandRowStatus,
    },
  ];
}

// 卡片子表肩部按钮
export function state4tableBtns() {
  let { isEdit, isAdd } = btnRule.call(this);
  return [
    // {
    //   key: "AddRow", // 增行
    //   visible: isAdd || isEdit,
    //   disable: (activeKey, checkedRows) => {
    //     return false;
    //   },
    // },
    // {
    //   key: "DeleteRow", // 删行
    //   visible: isAdd || isEdit,
    //   disable: (activeKey, checkedRows) => {
    //     return !checkedRows || checkedRows.length === 0;
    //   },
    // },
    // {
    //   key: "CopyRow", // 复制行
    //   visible: !this.state.isPaste,
    //   disable: (activeKey, checkedRows) => {
    //     console.log(checkedRows);
    //     return checkedRows.length === 0;
    //   },
    // },
    // {
    //   key: "CancelRow", // 取消
    //   visible: this.state.isPaste,
    // },
    // {
    //   key: "CopyLastLine", // 粘贴至末行
    //   visible: this.state.isPaste,
    // },
  ];
}

// /**
//  * 按钮规则 通用
//  */
// function btnRule() {
//   let { FormConfig, getUrlParam, form: formUtil } = this.props;
//   let status = getUrlParam("status");
//   // let id = getUrlParam("id");
//   // 无单据浏览态
//   //let isBrowseNoID = !id && status === "browse";
//   // 单据浏览态
//   //let isBrowse = id && status === "browse";
//   let isBrowse = status === "browse";
//   // 新增态
//   let isAdd = status === "add";
//   // 编辑态
//   let isEdit = status === "edit";
//   //let isEdit = id && status === "edit";
//   // 复制态
//   let isCopy = status === "copy";

//   // 单据状态
//   let busistatus = formUtil.getFormItemsValue(FormConfig.formId, "busistatus");
//   busistatus = busistatus && busistatus.value;
//   // 浏览 待提交 状态
//   let isNoCommit = isBrowse && busistatus === "-1";
//   // 浏览 审批中 状态
//   let isApproveing = isBrowse && busistatus === "0";
//   // 浏览 审批完成 状态
//   let isApproved = isBrowse && busistatus === "1";

//   // 审批状态
//   let vbillstatus = formUtil.getFormItemsValue(
//     FormConfig.formId,
//     "vbillstatus"
//   );
//   vbillstatus = vbillstatus && vbillstatus.value;
//   // 浏览 自由态
//   let isNoState = isBrowse && vbillstatus === "-1";
//   // 浏览 未通过态
//   let isNoPass = isBrowse && vbillstatus === "0";
//   // 浏览 通过态
//   let isPassing = isBrowse && vbillstatus === "1";
//   // 浏览 进行中
//   let isGoingOn = isBrowse && vbillstatus === "2";
//   // 浏览 提交态
//   let isCommit = isBrowse && vbillstatus === "3";

//   return {
//     isAdd,
//     isEdit,
//     isCopy,
//     //isBrowseNoID,
//     isBrowse,
//     isNoCommit,
//     isApproveing,
//     isApproved,
//     isNoState,
//     isNoPass,
//     isPassing,
//     isGoingOn,
//     isCommit
//   };
// }
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
    isGoingOn,
    isPassing,
    isCommit,
    isConfirmCollect,
    isConfirm,
    isVoucher
  } = btnRule.call(this);
  return [
    {
      key: "Pull",
      visible: isBrowse,
      primary: !(isNoState && isConfirm)// 非 自由态 状态 主要按钮
      //isBrowseNoID ||
    },
    {
      key: "Edit",
      visible: isNoState && !isConfirm
    },
    {
      key: "Copy",
      visible: isBrowse 
    },
    {
      key: "Delete",
      visible: isNoState && !isConfirm
    },
    {
      key: "Commit",
      visible: isNoState && isConfirm
      //primary: isNoState // 未提交 主要按钮
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible: (isNoPass || isPassing || isCommit) && !isVoucher
    },
    {
      key: "Save",
      visible: isAdd || isEdit || isCopy || isConfirmCollect
    },
    {
      key: "SaveAdd",
      visible: isAdd || isEdit || isCopy || isConfirmCollect
    },
    {
      key: "SaveCommit",
      visible: isAdd || isEdit || isCopy || isConfirmCollect
    },
    {
      key: "Cancel",
      visible: isAdd || isEdit || isCopy || isConfirmCollect
    },
    {
      key: "Union",
      visible: isBrowse && !isNoState
    },
    {
      key: "ApproveDetail",
      visible: isBrowse && !isNoState
    },
    {
      key: "LinkReceiveRegister",
      visible: isBrowse 
    },
    {
      key: "LinkSubmitRegister",
      visible: isBrowse 
    },
    {
      key: "HandingFee_u",
      visible: isBrowse && (isPassing || isNoPass)
    },
    {
    key: "Voucher",
    visible: isBrowse && isVoucher
    },
    {
      key: "ConfirmCollect",
      visible: isBrowse && isNoState && !isConfirm
    },
    {
      key: "MakeVoucher",
      visible: isBrowse && !isNoState && !isVoucher  && isPassing
    },
    {
      key: "CancelVoucher",
      visible: isBrowse && !isNoState && isVoucher
    },
    {
      key: "CancelConfirmCollect",
      visible: isBrowse && isNoState && isConfirm
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
      key: "RelationFunction",
      visible: isBrowse && isPassing
    },
    {
      key: "HandingFee",
      visible: isBrowse && isPassing
    },
    {
      key: "CancelPull",
      visible: isAdd
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
  //确认收款状态,编辑界面状态
  let isConfirmCollect = status === "confirmcollect";

  // 收款日期
  let confirmdate = formUtil.getFormItemsValue(
    FormConfig.formId,
    "collectregdate"
  );
  
  //制证状态
  let voucherflag = formUtil.getFormItemsValue(
    FormConfig.formId,
    "voucherflag"
  );

  //实际收款日期
  let actualcollectdate = formUtil.getFormItemsValue(
    FormConfig.formId,
    "actualcollectdate"
  );

  //收款金额
  let sumcollectamount = formUtil.getFormItemsValue(
    FormConfig.formId,
    "sumcollectamount"
  );

    //承付类型
    let committype = formUtil.getFormItemsValue(
      FormConfig.formId,
      "committype"
    );


  let isVoucher = voucherflag.value ;
  let isConfirmdate =  confirmdate && confirmdate.value;
  let isConfirm = !(! actualcollectdate.value && !sumcollectamount.value || committype.value == "4");
 
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
    isConfirmCollect,
    isConfirm,
    isVoucher
  };
}

