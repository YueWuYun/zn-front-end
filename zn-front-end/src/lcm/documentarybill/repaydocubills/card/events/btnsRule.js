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
    isVoucher
  } = btnRule.call(this);
  return [
    {
      key: "Add",
      visible: isBrowseNoID || isBrowse,
      // primary: !isNoState // 非 未提交 状态 主要按钮
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
      visible: (isNoPass || isPassing || isCommit) && !isVoucher
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
    key: "MakeVoucher",
    visible: isBrowse && !isNoState && !isVoucher && isPassing
    },
    {
    key: "CancelVoucher",
    visible: isBrowse && !isNoState && isVoucher
     },
     
    {
      key: "Union",
      visible: isBrowse
    },
    {
    key: "Voucher",
    visible: isBrowse && isVoucher
    },
    {
      key: "ApproveDetail",
      visible: isBrowse && !isNoState
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
    }
  ];
}


// 卡片子表肩部按钮
export function state4tableBtns() {
  let { isEdit, isAdd } = btnRule.call(this);
  return [
    {
      key: "AddRow", // 增行
      visible: true,
      //isAdd || isEdit,
      disable: (activeKey, checkedRows) => {
        return false;
      },
    },
    {
      key: "DeleteRow", // 删行
      visible: true, 
      //isAdd || isEdit,
      disable: (activeKey, checkedRows) => {
        return !checkedRows || checkedRows.length === 0;
      },
    },
    {
      key: "CopyRow", // 复制行
      visible: !this.state.isPaste,
      disable: (activeKey, checkedRows) => {
        console.log(checkedRows);
        return checkedRows.length === 0;
      },
    },
    {
      key: "CancelRow", // 取消
      visible: this.state.isPaste,
    },
    {
      key: "CopyLastLine", // 粘贴至末行
      visible: this.state.isPaste,
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
    isBrowse,
    isBrowseNoID,
  } = btnRule.call(this);
  let { status } = record;
  return [
    {
      key: "InsertRow", // 插入
      visible:
        (isAdd || isEdit) ,
    },
    {
      key: "DelRow", // 删除
      visible: () => {
        if (isBrowse) {
          // 如果是浏览态
          return false;
        }else{
          return true;
        }
      },
    },
    {
      key: "CopyAtLine", // 粘贴至此
      visible: this.state.isPaste ,
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

  //制证状态
  let voucherflag = formUtil.getFormItemsValue(
    FormConfig.formId,
    "voucherflag"
  );
  let isVoucher = voucherflag.value ;
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
    isVoucher
  };
}
