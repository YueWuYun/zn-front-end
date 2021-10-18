/**
 * 头部按钮状态规则
 * 控制按钮的可不可用 即按钮的 disable 属性 true 为不可用 fasle 为可用
 */
export const state4headBtns = function() {
  let { TableConfig, table: tableUtil } = this.props;
  let checkedRows = tableUtil.getCheckedRows(TableConfig.tableId);
  // 信用证状态  ----这种写法拿不到值
  let lcstatus =
    checkedRows[0] && checkedRows[0].data.values.lcno.lcstatus && checkedRows[0].data.values.lcno.lcstatus.value;
  // 信用证状态 -----这种写法从上游参照带过来的显示的value是汉字，跟display相同，例如“待承付”，不是字母
  let lcstatus2 =
    checkedRows[0] && checkedRows[0].data.values["lcno.lcstatus"] && checkedRows[0].data.values["lcno.lcstatus"].value;
    // 待交单
    let isNoArrival = lcstatus === "2";
    // 待承付
    let isNoPc = lcstatus === "3";
    // 待付款
    let isNoPay = lcstatus === "4";

    
    // 审批状态
    let isvoucher =
    checkedRows[0] && checkedRows[0].data.values.voucherflag.value;
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
    checkedRows[0] && checkedRows[0].data.values.isinvoicedeliver 
    && checkedRows[0].data.values.isinvoicedeliver.value;
  return [
    {
      key: "Delete",
      disable: init || (onlyOne && (!isNoState || isNoPc || isNoPay) )
    },
    {
      key: "Commit",
      disable: init || (onlyOne && (!isNoState || isNoPc || isNoPay) )
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
      key: "Copy", // 复制
      disable: init || onlyOne 
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
      key: "Attachment", // 附件
      disable: init
    },
    {
      key: "PrintList", // 打印清单
      disable: init
    },
    {
      key: "PushCollectionNotice", // 通知收款
      disable: init || (onlyOne && !isPassing)
    },
    {
      key: "PushDocumentaryApply", // 押汇申请
      disable: init || (onlyOne && !isPassing)
    },
    {
      key: "PushDocumentaryContract", // 押汇合同
      disable: init || (onlyOne && !isPassing)
    },
    {
      key: "LinkReceiveRegister", // 联查收证登记
      disable: init
    },
    {
      key: "RLinkCollectionNotice", // 联查通知收款
      disable: init || (onlyOne && !isPassing)
    },
    {
      key: "RLinkApplyDocuBills", // 联查 押汇申请
      disable: init || (onlyOne && !isPassing)
    },
    {
      key: "RLinkContractDocuBills", // 联查押汇合同
      disable: init || (onlyOne && !isPassing)
    },
    {
      key: "Voucher", // 联查凭证
      disable: init || (onlyOne && !isvoucher)
    },
    {
      key: "ApproveDetail", // 审批详情
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
  // 当前行是否是开证登记生成的，如果是登记单生成的，不能点击承付按钮
  let srcbillcode = record.srcbillcode && record.srcbillcode.value;
  // 当前行数据信用证状态
  let lcstatus = record.lcstatus && record.lcstatus.value;
  // 待交单
  let isNoArrival = lcstatus === "2";
  // 待承付
  let isNoPc = lcstatus === "3";
  // 待付款
  let isNoPay = lcstatus === "4";
   
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

  // 是否已经制证
  let isvoucher = record.voucherflag && record.voucherflag.value ;

  return [
    {
      key: "CommitInner", // 提交
      visible: isNoState && !isNoPc && !isNoPay // 待提交
    },
    {
      key: "EditInner", // 修改
      visible: isNoState && !isNoPc && !isNoPay// 待提交
    },
    {
      key: "DelInner", // 删除
      visible: isNoState && !isNoPc && !isNoPay// 待提交
    },
    {
      key: "HonourInner", // 承付
      visible: isNoPc  // 审批状态为自由并且承付类型为空才可承付
    },
    {
      key: "CancelHonourInner", // 取消承付
      visible: isNoPay // 审批状态为自由并且承付类型不为空才可取消承付
    },
    {
      key: "MakeVoucherInner", // 制证
      visible: isPassing && !isvoucher // 审批状态为通过并且没有制证
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
