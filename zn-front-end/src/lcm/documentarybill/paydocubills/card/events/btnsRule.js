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
    isVoucher,
    isExtension,
    isMulVersion,
    isNewVersion
  } = btnRule.call(this);
  return [
    {
      key: "Add",
      visible: isBrowseNoID || isBrowse,
      primary: !isNoState // 非 未提交 状态 主要按钮
    },
    {
      key: "Edit",
      visible: isNoState && !isMulVersion
    },
    {
      key: "Copy",
      visible: isBrowse
    },
    {
      key: "Delete",
      visible: isNoState && !isMulVersion
    },
    {
      key: "Commit",
      visible: (isNoState || isNoPass),
      primary: isNoState // 未提交 主要按钮
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、审批完成
      visible: (isNoPass || (isPassing && !isVoucher) || isCommit)
    },
    {
      key: "Save",
      visible: isAdd || isEdit || isCopy || isExtension,
      primary: isAdd || isEdit || isCopy || isExtension
    },
    {
      key: "SaveAdd",
      visible: isAdd || isEdit || isCopy || isExtension
    },
    {
      key: "SaveCommit",
      visible: isAdd || isEdit || isCopy || isExtension
    },
    {
      key: "Cancel",
      visible: isAdd || isEdit || isCopy || isExtension
    },
    {
      key: "MakeVoucher",//制证
      visible: isPassing && !isVoucher , // 审批通过并且没有制证
    },
    {
      key: "CancelVoucher",//取消制证
      visible: isPassing && isVoucher , // 审批通过并且已经制证
    },
    {
      key: "Union",
      visible: isBrowse
    },
    {
      key: "ApproveDetail", // 审批详情
      visible: isPassing || isCommit || isGoingOn, // 审批中
    },
    {
      key: "LinkContractDocuBills", // 联查押汇合同
      visible: isBrowse
    },
    {
      key: "Voucher", // 联查凭证
      visible: isBrowse && isPassing && isVoucher
    },
    {
      key: "HistoryVersion", // 历史版本
      // visible: isBrowse && isMulVersion, // 浏览态 且版本号>1
      visible: isBrowse , // 何斌：历史版本按钮显示不区分单据状态 20200721
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
      key: "Extension", // 展期
      visible: isPassing   // 在执行 审批通过 
    },
    {
      key: "DeleteVersion", // 删除版本
      visible:
        isBrowse &&
        isMulVersion &&
        !isNewVersion &&
        isNoState, // 浏览态 且版本号>1 非新版本 且 自由态单据
    },
  ];
}
// 卡片子表肩部按钮
export function state4tableBtns() {
  let { isEdit, isAdd} = btnRule.call(
    this
  );
  return [
    {
      key: "AddRow", // 增行
      visible: (isAdd || isEdit) ,
      disable: (activeKey, checkedRows) => {
        return false;
      },
    },
    {
      key: "DeleteRow", // 删行
      visible: (isAdd || isEdit) ,
      disable: (activeKey, checkedRows) => {
        return !checkedRows || checkedRows.length === 0;
      },
    },
    {
      key: "CopyRow", // 复制行
      visible:  (isAdd || isEdit ) && !this.state.isPaste,
      disable: (activeKey, checkedRows) => {
        console.log(checkedRows);
        return !checkedRows || checkedRows.length === 0;
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
    isExtension,
    isBrowseNoID,
  } = btnRule.call(this);
  let { status } = record;
  return [
    {
      key: "InsertRow", // 插入
      visible: isAdd || isEdit,
    },
    {
      key: "DelRow", // 删除
      visible: () => {
        if (isBrowse || isExtension) {
          // 如果是浏览态
          return false;
        }else{
          return true;
        }
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
    isChange,
    isGuarantee,
    isOpenpayplan,
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
        ((isAdd || isEdit) && (isOpenpayplan || isGuarantee)) ||
        (isChange && isGuarantee),
    },
    {
      key: "modalDel", // 侧拉弹框删除按钮
      visible: () => {
        if (isBrowse) {
          // 如果是浏览态
          return false;
        }
        if (isGuarantee) {
          // 如果是担保页签
          if (status === "2") {
            // 如果是新增数据 显示
            return true;
          } else {
            // 如果是已有数据
            if (isChange) {
              // 如果是变更 不显示
              return false;
            } else {
              return true;
            }
          }
        } else if (isOpenpayplan) {
          // 放款计划页签时
          if (status === "2") {
            // 如果是新增数据 显示
            return true;
          } else {
            // 如果是已有数据
            if (isChange) {
              // 如果是变更 不显示
              return false;
            } else {
              return true;
            }
          }
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
  let busistatus = formUtil.getFormItemsValue(FormConfig.formId, "busistatus");
  busistatus = busistatus && busistatus.value;
  // 浏览 待提交 状态
  let isNoCommit = isBrowse && busistatus === "-1";
  // 浏览 审批中 状态
  let isApproveing = isBrowse && busistatus === "0";
  // 浏览 审批完成 状态
  let isApproved = isBrowse && busistatus === "1";

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

   // 版本号
   let versionno = formUtil.getFormItemsValue(FormConfig.formId, "versionno");
   versionno = versionno && versionno.value;
  // 有版本号 且版本号大于1
  let isMulVersion = versionno && +versionno > 1;
  // 原始版本
  let versionorgin = formUtil.getFormItemsValue(FormConfig.formId, "versionres");
  versionorgin = versionorgin && versionorgin.value;
  // 新版本
  let isNewVersion = isBrowse &&  versionorgin === "NEW";

  // 是否展期编辑态
  let isExtension = status === "extension";

  // 已经制证
  let isVoucher = formUtil.getFormItemsValue(
    FormConfig.formId,
    "voucherflag"
  );
  isVoucher = isVoucher && isVoucher.value ;
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
    isVoucher,
    isMulVersion,
    isNewVersion,
    isExtension
  };
}
