// 卡片主表区域按钮显示规则
export function state4headBtns() {
  let {
    isAdd,
    isEdit,
    isChange,
    isCopy,
    isBrowseNoID,
    isBrowse,
    isNoState,
    isNoPass,
    isPassing,
    isCommit,
    isNoCommit,
    isApproveing,
    isNoExecute,
    isExecuting,
    isTerminated,
    isFinished,
    isMulVersion,
    isNewVersion,
    isExtension,
    isPull
  } = btnRule.call(this);
  return [
    {
      key: "Add",
      visible: isBrowseNoID || isBrowse,
      primary: !isNoState, // 非 自由态 状态 主要按钮
    },
    {
      key: "Edit",
      visible: isNoCommit && isNoState //待提交 自由态
    },
    {
      key: "Copy",
      visible: isBrowse
    },
    {
      key: "Delete",
      visible: isNoCommit && isNoState
    },
    {
      key: "Commit",
      visible: isNoState, // 自由态单据
      primary: isNoState // 未提交 主要按钮
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible: (isNoPass || isPassing || isCommit) &&
      (isApproveing || isNoExecute)
    },
    {
      key: "Save",
      visible: isAdd || isEdit || isChange || isExtension // 新增和编辑态和变更态
    },
    {
      key: "SaveAdd",
      visible: isAdd || isEdit || isChange || isExtension 
    },
    {
      key: "SaveCommit",
      visible: isAdd || isEdit || isChange || isExtension
    },
    {
      key: "Cancel",
      visible: isAdd || isEdit || isChange || isExtension
    },
    {
      key: "Change", // 变更
      visible: isPassing && isExecuting  // 在执行 审批通过 
    },
    {
      key: "Extension", // 展期
      visible: isPassing && isExecuting  // 在执行 审批通过 
    },
    {
      key: "Terminate", // 终止
      visible: isExecuting && isPassing  // 在执行 且 审批通过 
    },
    {
      key: "Unterminate", // 取消终止
      visible: isTerminated || isFinished // 已终止 或者已结束 
    },
    {
      key: "HistoryVersion", // 历史版本
      visible: isBrowse, // 浏览态 自由态单据也能联查
    },
    {
      key: "DeleteVersion", // 删除版本
      visible:
        isBrowse &&
        isMulVersion &&
        !isNewVersion &&
        isNoState, // 浏览态 且版本号>1 非新版本 且 自由态单据
    },
    {
      key: "Union",
      visible: isBrowse
    },
    {
      key: "Union_n", // 联查
      visible: isBrowse, // 浏览态
    },
    {
      key: "Print",
      visible: isBrowse
    },
    {
      key: "Print_n", // 输出
      visible: isBrowse, // 浏览态
    },
    {
      key: "Interestrate", // 利率
      visible: isBrowse, // 浏览态
    },
    {
      key: "RLinkPayDocuBills", // 押汇放款 审批通过
      visible: isPassing,
    },
    {
      key: "RLinkRepayDocuBills", // 押汇还款 
      visible: isPassing,
    },
    {
      key: "LinkSrcBill", // 来源单据
      visible: isBrowse, // 浏览态
    },
    {
      key: "Credit", // 授信额度
      visible: isBrowse, // 浏览态
    },
    {
      key: "ApproveDetail", // 审批详情 
      visible: isApproveing || isNoExecute || isExecuting || isFinished || isTerminated, // 审批中 未执行 在执行 已结束  已终止
    },
    {
      key: "RelationFunGroup", // 关联功能
      visible:  isBrowse, // 浏览态
    },
    {
      key: "RelationFunLine", // 关联功能
      visible: isBrowse, // 浏览态
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
      visible: isPull, // 拉单
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
  let { isAdd, isEdit, isBrowse, isBrowseNoID, isCopy ,isExtension,isChange} = btnRule.call(this);
  let { status } = record;
  let { cardTable: cardTableUtil } = this.props;
  // 当前活动页签
  let curTabKey = cardTableUtil.getCurTabKey();
    // 是否合同执行页签
  let isExeTab = curTabKey === "contractexeinfo";
  return [
    {
      key: "InsertRow", // 插入
      visible: () => {
        if (isBrowse || isExeTab) {
           // 如果是浏览态
           return false;
         } 
         return true;
         
       }, 
     },
    {
      key: "DelRow", // 删除
      visible: () => {
       if (isBrowse || isExeTab) {
          // 如果是浏览态
          return false;
        } 
        return true;
        
      },
    },
    {
      key: "CopyAtLine", // 粘贴至此
      visible:  !isBrowse && this.state.isPaste ,
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
      visible: isBrowse  && !record.expandRowStatus,
    },
  ];
}
// 卡片子表肩部按钮
export function state4tableBtns() {
  let { isEdit, isAdd,isExtension ,isChange} = btnRule.call(
    this
  );
  let { cardTable: cardTableUtil } = this.props;
  // 当前活动页签
  let curTabKey = cardTableUtil.getCurTabKey();
  // 是否合同执行页签
  let isExeTab = curTabKey === "contractexeinfo";
  return [
    {
      key: "AddRow", // 增行
      visible:
        !isExeTab && (isAdd || isEdit || isExtension || isChange) ,
      disable: (activeKey, checkedRows) => {
        return false;
      },
    },
    {
      key: "DeleteRow", // 删行
      visible:
      !isExeTab && (isAdd || isEdit || isExtension || isChange) ,
      disable: (activeKey, checkedRows) => {
        return !checkedRows || checkedRows.length === 0;
      },
    },
    {
      key: "CopyRow", // 复制行
      visible:  !isExeTab && (isAdd || isEdit || isExtension || isChange) && !this.state.isPaste,
      disable: (activeKey, checkedRows) => {
        console.log(checkedRows);
        return checkedRows.length === 0;
      },
    },
    {
      key: "CancelRow", // 取消
      visible: !isExeTab && this.state.isPaste,
    },
    {
      key: "CopyLastLine", // 粘贴至末行
      visible: !isExeTab && this.state.isPaste,
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
    isChange,
    isGuarantee,
    isOpenpayplan,
    isBrowse,
    isBrowseNoID,
  } = btnRule.call(this);
  
  let { cardTable: cardTableUtil } = this.props;
  // 当前活动页签
  let curTabKey = cardTableUtil.getCurTabKey();
  // 是否合同执行页签
  let isExeTab = curTabKey === "contractexeinfo";
  if (!record) {
    return [];
  }
  let { status } = record;
  return [
    {
      key: "modalAdd", // 侧拉弹框插入按钮
      visible: true,
    },
    {
      key: "modalDel", // 侧拉弹框删除按钮
      visible: true
    },
    {
      key: "modalSave", // 侧拉弹框保存按钮
      visible: !isExeTab,
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
  // 变更态
  let isChange = status === "change";
   // 展期态
   let isExtension = status === "extension" && id;
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
  // 合同状态
  let contstatus = formUtil.getFormItemsValue(FormConfig.formId, "contstatus");
  contstatus = contstatus && contstatus.value;
  // 浏览 待提交
  let isNoCommit = isBrowse && contstatus === "NOCOMMIT";
  // 浏览 待审批
  let isApproveing = isBrowse && contstatus === "NOAUDIT";
  // 浏览 未执行
  let isNoExecute = isBrowse && contstatus === "NOEXECUTE";
  // 浏览 在执行
  let isExecuting = isBrowse && contstatus === "EXECUTING";
  // 浏览 已结束
  let isFinished = isBrowse && contstatus === "FINISHED";
  // 浏览 已终止
  let isTerminated = isBrowse && contstatus === "OVERED";
   // 版本号
   let versionno = formUtil.getFormItemsValue(FormConfig.formId, "versionno");
   versionno = versionno && versionno.value;
  // 有版本号 且版本号大于1
  let isMulVersion = versionno && +versionno > 1;
  // 原始版本
  let versionorgin = formUtil.getFormItemsValue(FormConfig.formId, "versionorgin");
  versionorgin = versionorgin && versionorgin.value;
  // 新版本
  let isNewVersion = isBrowse &&  versionorgin === "NEW";
  return {
    isBrowseNoID,
    isBrowse,
    isEdit,
    isAdd,
    isChange,
    isCopy,
    isNoState,
    isNoPass,
    isPassing,
    isGoingOn,
    isCommit,
    isPull,
    isNoCommit,
    isApproveing,
    isNoExecute,
    isExecuting,
    isFinished,
    isTerminated,
    isMulVersion,
    isNewVersion,
    isExtension
  };
}
