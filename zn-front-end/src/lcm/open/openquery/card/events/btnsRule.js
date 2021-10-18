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
    isCommit,
    isApproveing,
    isCancle,
    isstop,
    isBatchEdit,
    isPull,
    isNoarrival
  } = btnRule.call(this);

  return [
    {
      key: "Union", // 联查
      visible: isBrowse, // 浏览态
    },
    {
      key: "Union_n", // 联查
      visible: isBrowse, // 浏览态
    },
    {
      key: "Credit", // 授信额度
      visible: isBrowse
    },
    {
      key: "FundPlan", // 计划预算
      visible: isBrowse
    },
    {
      key: "GuarantyContract", // 担保合同
      visible: isBrowse
    },
    {
      key: "RLinkArrivalBill", // 到单承付
      visible: isBrowse
    },
    {
      key: "RlinkOpenModify", // 开证修改
      visible: isBrowse
    },
    {
      key: "RlinkPayRegister", // 付款登记
      visible: isBrowse
    },
    {
      key: "RlinkApplyDocuBills", // 押汇申请
      visible: isBrowse
    },
    {
      key: "RlinkContractDocuBills", // 押汇合同
      visible: isBrowse
    },
    {
      key: "ApproveDetail", // 审批详情
      visible: isPassing || isNoPass || isApproveing,
    },
    {
      key: "LinkOpenApply", // 联查来源单据
      visible: isBrowse
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
      key: "LogOut", // 注销
      visible: isCancle, // 浏览态
    },
    {
      key: "ArrivalBill", // 到单承付
      visible:!isstop && isPassing  && isNoarrival, // 浏览态 未注销 审批通过 待交单
    },
    {
      key: "OpenModify", // 开证修改
      visible:!isstop  && isPassing, // 浏览态
    },
    {
      key: "RelationFunGroup", // 关联功能
      visible: isBrowse, // 浏览态
    },
    {
      key: "RelationFunLine", // 关联功能
      visible: isBrowse, // 浏览态
    },
    {
      key: "LogOut", // 注销
      visible: isBrowse && isCancle, // 浏览态
    },
    {
      key: "CancelPull", // 退出转单
      visible: isPull, // 拉单
    },
  ];
}
// 卡片子表肩部按钮
export function state4tableBtns() {
  let { isEdit, isAdd, isOpenpayplan, isGuarantee, isChange } = btnRule.call(
    this
  );
  return [
    {
      key: "AddRow", // 增行
      visible:
      (isAdd || isEdit) ,
      disable: (activeKey, checkedRows) => {
        return false;
      },
    },
    {
      key: "DeleteRow", // 删行
      visible:
        (isAdd || isEdit) ,
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
      visible:
        (isAdd || isEdit) ,
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
  // 是否为拉单
  let isPull = this.props.getUrlParam("isPull");
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
  // 注销状态
  let isstop =  formUtil.getFormItemsValue(FormConfig.formId, "isstop");
  isstop =  isstop && isstop.value;
  let isCancle = !isstop  && isPassing ; //审批通过 非注销
  let lcStatus =  formUtil.getFormItemsValue(FormConfig.formId, "lcstatus");
  lcStatus =  lcStatus && lcStatus.value;
  let isNoarrival = lcStatus === "2"; // 待交单
  // 批改状态 是否符合批改条件 一条 
  // 担保方式 不等于票据池7 
  let guaranteetype = formUtil.getFormItemsValue(
      FormConfig.formId,
      "guaranteetype"
  );
  guaranteetype = guaranteetype && guaranteetype.value;
  //保证金账号为空 pk_acc_pledge 
  let pk_acc_pledge = formUtil.getFormItemsValue(
    FormConfig.formId,
    "pk_acc_pledge"
  );
  pk_acc_pledge = pk_acc_pledge && pk_acc_pledge.value;
  //授信信息为空pk_ccterm 
  let pk_ccterm  = formUtil.getFormItemsValue(
    FormConfig.formId,
    "pk_ccterm"
  );
  pk_ccterm  = pk_ccterm  && pk_ccterm.value;
  //担保协议为空pk_guaprotocol
  let pk_guaprotocol  = formUtil.getFormItemsValue(
    FormConfig.formId,
    "pk_guaprotocol"
  );
  pk_guaprotocol  = pk_guaprotocol  && pk_guaprotocol.value;
  let isBatchEdit =isBrowse &&
              !(guaranteetype == 7 ||  pk_acc_pledge != null 
                ||  pk_ccterm != null ||  pk_guaprotocol != null);
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
    isCancle,
    isstop,
    isBatchEdit,
    isNoarrival,
    isPull
  };
}
