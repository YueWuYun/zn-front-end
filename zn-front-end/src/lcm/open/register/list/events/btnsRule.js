/**
 * 头部按钮状态规则
 * 控制按钮的可不可用 即按钮的 disable 属性 true 为不可用 fasle 为可用
 */
export const state4headBtns = function() {
  let { TableConfig, table: tableUtil } = this.props;
  let checkedRows = tableUtil.getCheckedRows(TableConfig.tableId);
  // 审批状态
  let vbillstatus =
    checkedRows[0] && checkedRows[0].data.values.vbillstatus.value;
  // 浏览 自由态
  let isNoState = vbillstatus === "-1";
  // 浏览 未通过态
  let isNoPass = vbillstatus === "0";
  // 浏览 通过态
  let isPassing = vbillstatus === "1";
  // 浏览 进行中
  let isGoingOn = vbillstatus === "2";
  // 浏览 提交态
  let isCommit = vbillstatus === "3";
  //列表选中某一条时页面按钮可用规则
  let onlyOne = checkedRows.length === 1 && checkedRows[0];
  // 列表初始态或者没有勾选时页面按钮可用规则
  let init = checkedRows.length === 0;
  // 注销状态
  let isstop = checkedRows[0] && checkedRows[0].data.values.isstop.value;
  // 到单承付状态 审批通过 待交单 
  let lcStatus = checkedRows[0] && checkedRows[0].data.values.lcstatus.value;
  let isNoarrival = lcStatus === "2"; // 待交单
  let isClosed = lcStatus === "6"; // 注销
  // 批改状态 是否符合批改条件 一条 
  // 担保方式 不等于票据池7 
  let guaranteetype = checkedRows[0] && checkedRows[0].data.values.guaranteetype.value;
  //保证金账号为空  
  let pk_acc_pledge = checkedRows[0] && checkedRows[0].data.values.pk_acc_pledge.value;
  //授信信息为空
  let pk_ccterm  =  checkedRows[0] && checkedRows[0].data.values.pk_ccterm.value;
  //担保协议为空
  let pk_guaprotocol  = checkedRows[0] && checkedRows[0].data.values.pk_guaprotocol.value;
  let isBatchEdit =
              !(guaranteetype == 7 ||  !pk_acc_pledge  
                ||  !pk_ccterm  ||  !pk_guaprotocol ); //有一个条件成立都不允许批改
  return [
    {
      key: "Delete",
      disable: init || (onlyOne && (!isNoState))
    },
    {
      key: "Commit",
      disable: init || (onlyOne && (!isNoState))
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交 数据来源为手工
      disable:
        init ||
        (onlyOne &&
            (isstop || !(isCommit || isPassing || isNoPass))
            )
    },
    {
      key: "BatchEdit", // 批改
      disable: init  ||
      (onlyOne &&
        isBatchEdit)
    },
    {
      key: "LogOut", // 注销 初始化不显示
      disable: init || (onlyOne &&
       !(!isstop  && isPassing)) // 审批通过 未注销
    },
    {
      key: "ArrivalBill", // 到单承付
      disable: init ||
      (onlyOne &&
        !(isPassing  && isNoarrival))
    },
    {
      key: "OpenModify", // 开征修改
      disable: init ||
      (onlyOne &&
        !(!isClosed  && isPassing)) // 审批通过 未注销
    },
    {
      key: "Copy", // 复制
      disable: init || (!onlyOne)
    },
    {
      key: "Union", // 联查
      disable: init
    },
    {
      key: "Credit", // 授信额度
      disable: init
    },
    {
      key: "LinkPlan", // 计划预算
      disable: init
    },
    {
      key: "LinkGuarantyContract", // 担保合同
      disable: init
    },
    {
      key: "RLinkArrivalBill", // 到单承付
      disable: init
    },
    {
      key: "RLinkOpenModify", // 开证修改
      disable: init
    },
    {
      key: "RLinkPayRegister", // 付款登记
      disable: init
    },
    {
      key: "RLinkApplyDocuBills", // 押汇申请
      disable: init
    },
    {
      key: "RLinkContractDocuBills", // 押汇合同
      disable: init
    },
    {
      key: "LinkOpenApply", // 联查来源单据
      disable: init
    },
    {
      key: "Output", // 输出
      disable: init
    },
    {
      key: "Print", // 打印
      disable: init
    },
    {
      key: "PrintList", // 打印清单
      disable: init
    },
    {
      key: "Attachment", // 附件
      disable: init
    },
    {
      key: "ApproveDetail", // 审批详情
      disable: init || (onlyOne && vbillstatus !== "1")
    },
  ];
};
/**
 * 列表行内按钮可用状态
 * 控制按钮的显示不显示 即按钮的 visible 属性 true 为显示 false 为不显示
 * @param {*} record 列表每行的行数据
 *
 */
export const state4innerBtns = function(record) {
  // 当前行数据审批状态
  let vbillstatus = record.vbillstatus && record.vbillstatus.value;
  // 浏览 自由态
  let isNoCommit = vbillstatus === "-1";
  // 浏览 未通过态
  let isNoPass = vbillstatus === "0";
  // 浏览 通过态
  let isPassing = vbillstatus === "1";
  // 浏览 进行中
  let isGoingOn = vbillstatus === "2";
  // 浏览 提交态
  let isCommit = vbillstatus === "3";
  // 注销状态
  let isstop = record.isstop && record.isstop.value;
  return [
    {
      key: "CommitInner", // 提交
      visible: isNoCommit // 待提交
    },
    {
      key: "EditInner", // 修改
      visible: isNoCommit // 待提交
    },
    {
      key: "DelInner", // 删除
      visible: isNoCommit // 待提交
    },
    {
      key: "UncommitInner", // 收回 审批状态为未通过、通过、提交  非注销
      visible: !isstop &&
        (isNoPass || isPassing || isCommit) 
    },
    {
      key: "LogOutInner", // 注销
      visible: !isstop  && isPassing  //审批通过 非注销
    }
  ];
};
