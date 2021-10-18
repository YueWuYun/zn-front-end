// 卡片主表区域按钮显示规则
export function state4headBtns() {
  let {
    isAdd,
    isEdit,
    isCopy,
    isBrowseNoID,
    isBrowse,
    isNoCommit,
    isApproveing,
    isApproved,
    isNoState,
    isNoPass,
    isPassing,
    isGoingOn,
    isCommit,
    isClosed,
    preCancel,
    presubmission
  } = btnRule.call(this);
  return [
    {
      key: "Add",
      visible: isBrowseNoID || isBrowse,
      primary: !isNoCommit || isCommit || isGoingOn// 非 未提交 状态 主要按钮
    },
    {
      key: "Edit",
      visible: isNoState && !(isClosed || preCancel)
    },
    {
      key: "Copy",
      visible: isBrowse
    },
    {
      key: "Delete",
      visible: isNoState  && !(isClosed || preCancel)
    },
    {
      key: "Commit",
      visible: isNoState && !(isClosed || preCancel),
      primary: isNoState && !(isClosed || preCancel)// 未提交 主要按钮
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible: (isNoPass || isPassing || isCommit) && !(isClosed || preCancel)      
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
      key: "LinkOperate",
      visible: isBrowse
    },
    {
      key: "Refresh",
      visible: isBrowse
    },
    {
      key: "SubmissionRegister", // 交单登记
      visible: isBrowse && isPassing && presubmission, // 浏览态
    },
    {
      key: "ReceiveModify", // 收证修改
      visible: isBrowse && isPassing && !(isClosed || preCancel), // 浏览态
    },
    {
      key: "LogOut", // 注销
      visible: isApproved, // 浏览态
    },
  ];
}
// 卡片子表肩部按钮
export function state4tableBtns() {
  let { isEdit, isAdd, isCopy} = btnRule.call(
    this
  );
  let { cardTable: cardTableUtil } = this.props;
  return [
    {
      key: "AddRow", // 增行
      visible:
        (isAdd || isEdit || isCopy) ,
      disable: (activeKey, checkedRows) => {
        return false;
      },
    },
    {
      key: "DeleteRow", // 删行
      visible:
        (isAdd || isEdit || isCopy) 
        ,
      disable: (activeKey, checkedRows) => {
        return false;
      },
    },
    {
      key: "CopyRow", // 复制行             
      visible: (isAdd || isEdit || isCopy) && !this.state.isPaste,
      disable: (activeKey, checkedRows) => {
        //获取子表数据
        let tableValues = cardTableUtil.getTabData("contractinfo").rows;        
        if(tableValues.length === 0){
          return true ;
        } else{             
          return checkedRows.length === 0 ;
        }
      },
    },
    {
      key: "CancelRow", // 取消
      visible: (isAdd || isEdit || isCopy) && this.state.isPaste,
    },
    {
      key: "CopyLastLine", // 粘贴至末行
      visible: (isAdd || isEdit || isCopy) && this.state.isPaste,
    },
  ];
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
    isCopy,
    isBrowse,
    isBrowseNoID,
  } = btnRule.call(this);
  let { status } = record;
  return [
    {
      key: "InsertRow", // 插入
      visible:
        (isAdd || isEdit || isCopy) 
    },
    {
      key: "DelRow", // 删除
      visible: (isAdd || isEdit || isCopy) ,
    },    
    {
      key: "CopyAtLine", // 粘贴至此
      visible: !isBrowse && this.state.isPaste ,
    },
    {
      key: "Expand", // 编辑态 - 展开
      visible: !(isBrowse || isBrowseNoID), // 非浏览态
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

/**
 * 卡片子表侧拉弹框按钮规则
 * @param {String} key - 页签key值
 * @param {Object} record - 某行数据
 * @param {Number} index - 该行数据索引
 */
export function state4sideModalBtns(key, record, index) {
  let {
    isAdd,
    isEdit,
    isBrowse,
    isBrowseNoID,
  } = btnRule.call(this);
  if (!record) {
    return [];
  }
  let { status } = record;
  return [
    {
      key: "modalAdd", // 侧拉弹框插入按钮
      visible:
        (isAdd || isEdit) ,
    },
    {
      key: "modalDel", // 侧拉弹框删除按钮
      visible: () => {
        if (isBrowse) {
          // 如果是浏览态
          return false;
        }
      },
    },
    {
      key: "modalSave", // 侧拉弹框保存按钮
      visible: true,
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

  // 单据状态
  let busistatus = formUtil.getFormItemsValue(FormConfig.formId, "lcstatus");
  busistatus = busistatus && busistatus.value;
  // 浏览 待提交 状态
  let isNoCommit = isBrowse && busistatus === "registering";
  // 浏览 审批中 状态
  let isApproveing = isBrowse && busistatus === "registering";
  // 浏览 审批完成 状态
  let isApproved = isBrowse && (busistatus === "presubmission" || busistatus === "precommit" || busistatus === "precollection" || busistatus === "precancel" ) ;
  let isClosed = busistatus === "cancelled"; // 注销
  // 待注销
  let preCancel = busistatus === "precancel";
  // 待交单
  let presubmission = busistatus === "presubmission";

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
    isNoCommit,
    isApproveing,
    isApproved,
    isNoState,
    isNoPass,
    isPassing,
    isGoingOn,
    isCommit,
    isClosed,
    preCancel,
    presubmission
  };
}
