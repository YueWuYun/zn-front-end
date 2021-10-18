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
    isNoArrival,
    isNoPc,
    isNoPay,
    isInvoice,
    isVoucher,
    committype,
    isPull,
    isPush
  } = btnRule.call(this);

  return [
    {
      key: "Pull",
      visible: isBrowseNoID || isBrowse, // 浏览态
      primary: !isNoState, // 非 自由态 状态 主要按钮
    },
    {
      key: "Edit",
      visible: isNoState , // 单据状态为待提交 且审批状态为自由态 
    },
    {
      key: "Delete",
      visible: isNoState , // 自由态 
    },
    {
      key: "Copy",
      visible: isBrowse , // 浏览态 
    },
    {
      key: "Commit",
      visible: (isNoState || isNoPass) , // 未提交 
      primary: isNoState, // 未提交 主要按钮
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 单据状态为审批中、未执行 
      visible:
        (isNoPass || isPassing || isCommit) ,
    },
    {
      key: "Save",
      visible: isAdd || isEdit , // 新增和编辑态
    },
    {
      key: "SaveCommit",
      visible: isAdd || isEdit , // 新增和编辑态
    },
    {
      key: "Cancel",
      visible: isAdd || isEdit , // 新增和编辑态
    },
    {
      key: "NoteRegister",//发票登记
      visible: !isPull && !isAdd && !isPush && !isInvoice , // 发票已到
    },
    {
      key: "Honour",//承付
      visible: isNoPc , // 待承付
    },
    {
      key: "CancelHonour",//取消承付
      visible: isNoPay , // 待付款
    },
    {
      key: "MakeVoucher",//制证
      visible: isPassing && !isVoucher && committype!="4", // 审批通过并且没有制证,并且承付类型不是拒付
    },
    {
      key: "CancelVoucher",//取消制证
      visible: isPassing && isVoucher , // 审批通过并且已经制证
    },
    {
      key: "Union", // 联查
      visible: isBrowse, // 浏览态
    },
    {
      key: "Union_n", // 联查
      visible: isBrowse, // 浏览态
    },
    {
      key: "ApproveDetail", // 审批详情
      visible: isPassing || isCommit || isGoingOn, // 审批中
    },
    {
      key: "LinkReceiveRegister", // 联查收证登记
      visible: isBrowse, // 浏览态
    },
    {
      key: "RLinkCollectionNotice", // 联查通知收款
      visible: isBrowse && isPassing, // 浏览态
    },
    {
      key: "RLinkApplyDocuBills", // 联查押汇申请
      visible: isBrowse && isPassing, // 浏览态
    },
    {
      key: "RLinkContractDocuBills", // 联查押汇合同
      visible: isBrowse && isPassing, // 浏览态
    },
    {
      key: "Voucher", // 联查凭证
      visible: isBrowse && isPassing && isVoucher, // 浏览态
    },
    {
      key: "Print", // 打印
      visible: isBrowse, // 浏览态
    },
    {
      key: "Print_n", // 输出
      visible: isBrowse, // 浏览态
    },
    {
      key: "Output", // 输出
      visible: isBrowse, // 浏览态
    },
    {
      key: "Refresh", // 刷新
      visible: isBrowse, // 浏览态
    },
    {
      key: "Attachment", // 附件
      visible: isBrowse, // 浏览态
    },
    {
      key: "Reference", // 关联操作
      visible: isBrowse && isPassing
    },
    {
      key: "PushCollectionNotice", // 通知收款
      visible: isBrowse && isPassing, // 浏览态
    },
    {
      key: "PushDocumentaryApply", // 押汇申请
      visible: isBrowse && isPassing, // 浏览态
    },
    {
      key: "PushDocumentaryContract", // 押汇合同
      visible: isBrowse && isPassing, // 浏览态
    },
    {
      key: "CancelPull", // 退出转单
      visible: isPull && isAdd && !isPush, // 拉单
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
      visible: false ,
      // visible: (isAdd || isEdit) ,
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
      key: "CancelRow",
      visible: false,
      disable: true,
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
      visible: isAdd || isEdit,
    },
    {
      key: "DelRow", // 删除
      visible: () => {
        if (isBrowse) {
          // 如果是浏览态
          return false;
        }
      },
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
  let {
    FormConfig,
    getUrlParam,
    form: formUtil,
    cardTable: cardTableUtil,
  } = this.props;
  let status = getUrlParam("status");
  let id = getUrlParam("id");
  let curTabKey = cardTableUtil.getCurTabKey("curTabKey");
  // 无单据浏览态
  let isBrowseNoID = status === "browse" && !id;
  // 单据浏览态
  let isBrowse = status === "browse" && id;
  // 编辑或复制态
  let isEdit = status === "edit" && id;
  // 新增态
  let isAdd = status === "add" || status === "copy";
  // 是否为拉单
  let isPull = this.props.getUrlParam("isPull");
  // 是否为推单
  let isPush = this.props.getUrlParam("isPush");

  // 信用证状态
  let lcstatus = formUtil.getFormItemsValue(
    FormConfig.formId,
    "lcstatus"
  );
  lcstatus = lcstatus && lcstatus.value;
  // 待交单
  let isNoArrival = isBrowse && lcstatus === "2";
  // 待承付
  let isNoPc = isBrowse && lcstatus === "3";
  // 待付款
  let isNoPay = isBrowse && lcstatus === "4";



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


  // 发票已到
  let isInvoice = formUtil.getFormItemsValue(
    FormConfig.formId,
    "isinvoicedeliver"
  );
  isInvoice = isInvoice && isInvoice.value  ;

  // 承付类型
  let committype = formUtil.getFormItemsValue(
    FormConfig.formId,
    "committype"
  );
  committype = committype && committype.value ;

  // 已经制证
  let isVoucher = formUtil.getFormItemsValue(
    FormConfig.formId,
    "voucherflag"
  );
  isVoucher = isVoucher && isVoucher.value ;

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
    isNoArrival,
    isNoPc,
    isNoPay,
    isInvoice,
    isVoucher,
    committype,
    isPull,
    isPush
  };
}
