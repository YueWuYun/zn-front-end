/**
 * 头部按钮状态规则
 * 控制按钮的可不可用 即按钮的 disable 属性 true 为不可用 fasle 为可用
 */
export const state4headBtns = function() {
  let { TableConfig, table: tableUtil } = this.props;
  let checkedRows = tableUtil.getCheckedRows(TableConfig.tableId);
  // 信用证状态
  let lcstatus =
    checkedRows[0] && checkedRows[0].data.values.lcstatus.value;
    // 待交单
    let isNoArrival = lcstatus === "2";
    // 待承付
    let isNoPc = lcstatus === "3";
    // 待付款
    let isNoPay = lcstatus === "4";
    
    
    // 审批状态
    let isvoucher =
    checkedRows[0] && checkedRows[0].data.values.isvoucher.value;
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
  // 发票已到
  let isInvoice =
  checkedRows[0] && checkedRows[0].data.values.isinvoice 
  && checkedRows[0].data.values.isinvoice.value;
  //到单信息（前台校验简单使用到单日期一个字段，后台需要增加到单类型和金额字段来校验）
  let isArrival = checkedRows[0] 
  && checkedRows[0].data 
  && checkedRows[0].data.values
  && checkedRows[0].data.values.arrivaldate 
  && checkedRows[0].data.values.arrivaldate.value;
  //承付信息（前台校验简单使用承付日期一个字段，后台需要增加承付类型和金额字段来校验）
  let isPayFor = checkedRows[0] 
  && checkedRows[0].data 
  && checkedRows[0].data.values
  && checkedRows[0].data.values.commitdate 
  && checkedRows[0].data.values.commitdate.value;
  //承付类型
  let committype = checkedRows[0] 
  && checkedRows[0].data 
  && checkedRows[0].data.values
  && checkedRows[0].data.values.committype
  && checkedRows[0].data.values.committype.value;
  // 是否拒付
  let isRefuse = committype && committype == 4;
  // 是否已被下游付款单拉单
  let ispay = checkedRows[0] 
  && checkedRows[0].data 
  && checkedRows[0].data.values
  && checkedRows[0].data.values.ispay 
  && checkedRows[0].data.values.ispay.value;

  // 是否已被下游押汇单拉单
  let isdocubills = checkedRows[0] 
  && checkedRows[0].data 
  && checkedRows[0].data.values
  && checkedRows[0].data.values.isdocubills 
  && checkedRows[0].data.values.isdocubills.value;

  return [
    {
      key: "Delete",
      disable: init || (onlyOne && (!isNoState || isPayFor) )
    },
    {
      key: "Commit",
      disable: init || (onlyOne && (!isNoState || !isPayFor) )
    },
    {
      key: "Uncommit", // 收回 审批状态为未通过、通过、提交  
      disable:
        init ||
        (onlyOne &&
          (isNoPc || isNoPay ||
            !(isCommit || isPassing || isNoPass)
          ))
    },
    {
      key: "NoteRegister", // 发票登记
      disable: init || (onlyOne && isInvoice)
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
      key: "PushPayRegister", // 付款登记
      disable: init || (onlyOne && (!isPassing || isRefuse || !ispay))
    },
    {
      key: "PushDocumentaryApply", // 押汇申请
      disable: init || (onlyOne && (!isPassing || isRefuse || !isdocubills))
    },
    {
      key: "PushDocumentaryContract", // 押汇合同
      disable: init || (onlyOne && (!isPassing || isRefuse || !isdocubills))
    },
    {
      key: "LinkOpenRegister", // 联查开证登记
      disable: init
    },
    {
      key: "RLinkPayRegister", // 联查付款登记
      disable: init || (onlyOne && (!isPassing || isRefuse))
    },
    {
      key: "RLinkApplyDocuBills", // 联查 押汇申请
      disable: init || (onlyOne && (!isPassing || isRefuse))
    },
    {
      key: "RLinkContractDocuBills", // 联查押汇合同
      disable: init || (onlyOne && (!isPassing || isRefuse))
    },
    {
      key: "Voucher", // 联查凭证
      disable: init || (onlyOne && (!isvoucher || isRefuse))
    },
    {
      key: "ApproveDetail", // 联查审批详情
      disable: init
    }
  ];
};
/**
 * 列表行内按钮可用状态
 * 控制按钮的显示不显示 即按钮的 visible 属性 true 为显示 false 为不显示
 * @param {*} record 列表每行的行数据
 *
 */
export const state4innerBtns = function(record) {
  // 当前行承付类型
  let committype = record.committype && record.committype.value;

  // 当前行数据审批状态
  let vbillstatus = record.vbillstatus && record.vbillstatus.value;
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
  // 是否已经承付
  let isChengfu = isNoState && !committype ;
  // 是否拒付
  let isRefuse = committype && committype == 4;

  // 是否已经制证
  let isvoucher = record.isvoucher && record.isvoucher.value ;
  //承付信息（前台校验简单使用承付日期一个字段，后台需要增加承付类型和金额字段来校验）
  let isPayFor = record.commitdate && record.commitdate.value;

  return [
    {
      key: "CommitInner", // 提交
      visible: isNoState && isPayFor // 自由+已承付
    },
    {
      key: "EditInner", // 修改
      visible: isNoState && !isPayFor // 自由+未承付
    },
    {
      key: "DelInner", // 删除
      visible: isNoState && !isPayFor // 自由+未承付
    },
    {
      key: "HonourInner", // 承付
      visible: isNoState && !isPayFor // 自由+未承付
    },
    {
      key: "CancelHonourInner", // 取消承付
      visible: isNoState && isPayFor // 自由+已承付
    },
    {
      key: "MakeVoucherInner", // 制证
      visible: isPassing && !isvoucher && isPayFor // 审批状态为通过并且没有制证
    },
    {
      key: "CancelVoucherInner", // 取消制证
      visible: isPassing && isvoucher // 审批状态为通过并且已经制证
    },
    {
      key: "UncommitInner", // 收回 审批状态为未通过、通过、提交  数据来源为手工
      visible:
        (isNoPass || (isPassing && !isvoucher) || isCommit) 
    }
  ];
};
