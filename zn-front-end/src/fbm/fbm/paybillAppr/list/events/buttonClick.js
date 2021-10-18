/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { cacheTools, output, print, promptBox, toast } from "nc-lightapp-front";
import { BILL_TYPE, BTN_GROUP, CARD_PAGE_CODE, FULL_AGGCLASSNAME, LIST_DISABLENOTE_CODE, LIST_PAGE_CODE, LIST_TABLE_CODE, NODE_KEY, URL_LIST } from "./../../cons/constant";
import { doAjax } from "./../../utils/commonUtil";
import { BatchToast } from "./../../utils/messageUtil";
import { searchButtonClick } from "./searchButtonClick";

export function buttonClick(props, id) {
  switch (id) {
    // 新增
    case BTN_GROUP.ADD:
      doAdd.call(this, props);
      break;

    // 删除
    case BTN_GROUP.DELETE:
      doDelete.call(this, props);
      break;

    // 复制
    case BTN_GROUP.COPY:
      doCopy.call(this, props);
      break;

    //提交
    case BTN_GROUP.COMMIT:
      doCommit.call(this, props);
      break;

    //收回
    case BTN_GROUP.UN_COMMIT:
      doManyAjaxAndReturn(this, props, "uncommit", URL_LIST.UN_COMMIT);
      break;

    // 作废
    case BTN_GROUP.DISABLE:
      this.setState({ operateType: "listHeader" });
      //设置作废输入框可见并可编辑
      this.setState({ disabledComShow: true }, () => {
        this.props.form.setFormStatus(LIST_DISABLENOTE_CODE, "edit");
      });
      break;

    // 取消作废
    case BTN_GROUP.CANCEL_DISABLE:
      doManyAjaxAndReturn(
        this,
        props,
        "canceldisable",
        URL_LIST.CANCEL_DISABLE
      );
      break;

    // 联查 审批详情
    case BTN_GROUP.LINK_APPROVE:
      doLinkApprove.call(this, props);
      break;

    // 联查 付款单据
    case BTN_GROUP.LINK_BILL:
      doLinkBill.call(this, props);
      break;

    // 联查 票据台账
    case BTN_GROUP.LINK_BOOK:
      doLinkBook.call(this, props);
      break;

    // 联查 计划预算
    case BTN_GROUP.LINK_PLAN:
      doLinkPlan.call(this, props);
      break;

    // 联查 凭证
    case BTN_GROUP.LINK_VOUCHER:
      doLinkVoucher.call(this, props);
      break;

    // 打印
    case BTN_GROUP.PRINT:
      doPrint.call(this, props);
      break;

    // 输出
    case BTN_GROUP.OUTPUT:
      doOutput.call(this, props);
      break;

    // 刷新
    case BTN_GROUP.REFRESH:
      doRefresh.call(this);
      break;

    // 附件
    case BTN_GROUP.FILED:
      doField.call(this, props);
      break;

    // 发送指令
    case BTN_GROUP.SEND_CMD:
      doManyAjaxAndReturn(this, props, "sendcmd", URL_LIST.SEND_CMD);
      break;

    //撤回指令
    case BTN_GROUP.WITHDRAW_CMD:
      doManyAjaxAndReturn(this, props, "withdrawcmd", URL_LIST.WITHDRAW_CMD);
      break;
    default:
      break;
  }
}

/**
 * 确认作废
 * @param {*} value
 */
export function disableListConfirm(value) {
  //如果是列表操作列的作废
  if (this.state.operateType == "listInner") {
    let pks = this.state.record.pk_paybill.value;
    let tss = this.state.record.ts.value;
    // 发送数据
    let sendData = {
      pks: [pks],
      tss: [tss],
      pageid: LIST_PAGE_CODE,
      isCardOpt: false,
      disablenote: value[LIST_DISABLENOTE_CODE]
    };

    //成功回调
    let successCallback = function(res) {
      if (res.data.grid) {
        handleOneReturnData(
          this.props,
          this.state.record,
          res.data.grid,
          this.state.index
        );
      }
      if (res.data.errMsg) {
        toast({
          color: "error",
          content: res.data.errMsg
        });
      } else {
        toast({
          color: "success",
          content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000016')/* 国际化处理： 作废成功！*/
        });
      }
    };

    doAjax.call(this, sendData, URL_LIST.DISABLE, successCallback);
  } else {
    let operation = "disable";
    let selectDatas = this.props.table.getCheckedRows(LIST_TABLE_CODE);
    let pks = [];
    let tss = [];
    selectDatas.forEach(val => {
      pks.push(val.data.values.pk_paybill.value);
      tss.push(val.data.values.ts.value);
    });

    if (pks.length == 0) {
      toast({
        color: "error",
        content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000025')/* 国际化处理： 请选择至少一条数据！！*/
      });
      return;
    }

    let sendData = {
      pks: pks,
      disablenote: value[LIST_DISABLENOTE_CODE],
      pageid: LIST_PAGE_CODE,
      tss: tss,
      isCardOpt: false
    };

    let successCallback = function(res) {
      if (res.data.grid) {
        handleReturnData(this.props, selectDatas, res.data.grid);
      }
      let successIndexs = 0,
        failIndexs = 0;
      if (res.data.successpks) {
        successIndexs = res.data.successpks.length;
      }

      failIndexs = selectDatas.length - successIndexs;
      // 全部成功
      if (failIndexs == 0) {
        BatchToast(
          operation,
          1,
          selectDatas.length,
          successIndexs,
          failIndexs,
          null,
          null,
          this.props
        );
      }
      // 全部失败
      else if (selectDatas.length == failIndexs) {
        BatchToast(
          operation,
          0,
          selectDatas.length,
          successIndexs,
          failIndexs,
          res.data.errMsg && res.data.errMsg.split("\n"),
          null,
          this.props
        );
      }
      // 部分成功
      else if (failIndexs > 0) {
        BatchToast(
          operation,
          2,
          selectDatas.length,
          successIndexs,
          failIndexs,
          res.data.errMsg && res.data.errMsg.split("\n"),
          null,
          this.props
        );
      }
    };

    doAjax.call(this, sendData, URL_LIST.DISABLE, successCallback);
  }
}
/**
 * 批量执行ajax并返回提示
 * @param {*} selectDatas
 * @param {*} operation
 * @param {*} url
 */
function doManyAjaxAndReturn(aa, props, operation, url) {
  let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);
  if (!selectDatas || selectDatas.length == 0) {
    toast({
      color: "warning",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000026')/* 国际化处理： 请选择至少一条数据！*/
    });
    return;
  }

  let pkMapTs = new Map();
  let pks = [];
  let tss = [];
  selectDatas.forEach(val => {
    let pk = val.data.values.pk_paybill.value;
    let ts = val.data.values.ts.value;
    pks.push(pk);
    tss.push(ts);
    //主键与tsMap
    if (pk && ts) {
      pkMapTs.set(pk, ts);
    }
  });
  let sendData = {
    pageid: LIST_PAGE_CODE,
    pageCode: LIST_PAGE_CODE,
    pkMapTs: pkMapTs,
    pks: pks,
    tss: tss,
    isCardOpt: false
  };

  let successCallback = function(res) {
    if (res.data.grid) {
      handleReturnData(props, selectDatas, res.data.grid);
    }
    let successIndexs = 0,
      failIndexs = 0;
    if (res.data.successpks) {
      successIndexs = res.data.successpks.length;
    }
    failIndexs = selectDatas.length - successIndexs;
    // 全部成功
    if (failIndexs == 0) {
      BatchToast(
        operation,
        1,
        selectDatas.length,
        successIndexs,
        failIndexs,
        null,
        null,
        props
      );
    }
    // 全部失败
    else if (selectDatas.length == failIndexs) {
      BatchToast(
        operation,
        0,
        selectDatas.length,
        successIndexs,
        failIndexs,
        res.data.errMsg && res.data.errMsg.split("\n"),
        null,
        props
      );
    }
    // 部分成功
    else if (failIndexs > 0) {
      BatchToast(
        operation,
        2,
        selectDatas.length,
        successIndexs,
        failIndexs,
        res.data.errMsg && res.data.errMsg.split("\n"),
        null,
        props
      );
    }
  };

  doAjax.call(this, sendData, url, successCallback);
}
/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
  let selectDatas = props.table.getCheckedRows(LIST_TABLE_CODE);

  if (!selectDatas || selectDatas.length == 0) {
    toast({
      color: "warning",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000026')/* 国际化处理： 请选择至少一条数据！*/
    });
    return;
  }

  let pks = [];
  let tss = [];
  selectDatas.forEach(val => {
    pks.push(val.data.values.pk_paybill.value);
    tss.push(val.data.values.ts.value);
  });

  let sendData = {
    pageid: LIST_PAGE_CODE,
    pks: pks,
    tss: tss,
    isCardOpt: false
  };

  let successCallback = function(res) {
    if (res.data.grid) {
      handleReturnData(props, selectDatas, res.data.grid);
    }
    if (
      res.data.workflow &&
      (res.data.workflow == "approveflow" || res.data.workflow == "workflow")
    ) {
      this.setState({
        compositedata: res.data,
        compositedisplay: true
      });
    } else {
      this.setState({
        compositedata: res.data,
        compositedisplay: false
      });
      let successIndexs = 0,
        failIndexs = 0;
      if (res.data.successpks) {
        successIndexs = res.data.successpks.length;
      }
      failIndexs = selectDatas.length - successIndexs;
      // 全部成功
      if (failIndexs == 0) {
        BatchToast(
          "commit",
          1,
          selectDatas.length,
          successIndexs,
          failIndexs,
          null,
          null,
          props
        );
      }
      // 全部失败
      else if (selectDatas.length == failIndexs) {
        BatchToast(
          "commit",
          0,
          selectDatas.length,
          successIndexs,
          failIndexs,
          res.data.errMsg && res.data.errMsg.split("\n"),
          null,
          props
        );
      }
      // 部分成功
      else if (failIndexs > 0) {
        BatchToast(
          "commit",
          2,
          selectDatas.length,
          successIndexs,
          failIndexs,
          res.data.errMsg && res.data.errMsg.split("\n"),
          null,
          props
        );
      }
    }
  };

  doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback);
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(props, selectDatas, data) {
  let returnData = data[LIST_TABLE_CODE].rows;
  //处理选择数据
  selectDatas.forEach(val => {
    let pk_paybill_h_check = val.data.values.pk_paybill.value;
    returnData.forEach(retrunval => {
      if (pk_paybill_h_check === retrunval.values.pk_paybill.value) {
        let updateDataArr = [
          {
            index: val.index,
            data: { values: retrunval.values }
          }
        ];
        props.table.updateDataByIndexs(LIST_TABLE_CODE, updateDataArr);
      }
    });
  });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleOneReturnData(props, record, data, index) {
  let returnData = data[LIST_TABLE_CODE].rows;
  //处理选择数据
  let pk_paybill_h_check = record.pk_paybill.value;
  returnData.forEach(retrunval => {
    if (pk_paybill_h_check === retrunval.values.pk_paybill.value) {
      let updateDataArr = [
        {
          index: index,
          data: { values: retrunval.values }
        }
      ];
      props.table.updateDataByIndexs(LIST_TABLE_CODE, updateDataArr);
    }
  });
}

/**
 * 复制
 * @param {} props
 */
function doCopy(props) {
  let copyid;
  let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
  //数据校验
  if (selectedRows.length < 1) {
    toast({
      color: "warning",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000027')/* 国际化处理： 请选择一条数据！*/
    });
    return;
  }
  // 当选中条数大于 1 条数据时 复制下标最小的一条数据
  if (selectedRows.length > 1) {
    let minIndex = getMinIndex(selectedRows);
    copyid = selectedRows[minIndex].data.values.pk_paybill.value;
  }
  // 选中一条时直接跳转卡片页并传递选中行pk
  if (selectedRows.length == 1) {
    copyid = selectedRows[0].data.values.pk_paybill.value;
  }

  props.pushTo("/card", {
    status: "copy",
    id: copyid,
    pagecode: CARD_PAGE_CODE
  });
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
  props.pushTo("/card", {
    status: "add",
    id: "",
    pagecode: CARD_PAGE_CODE
  });
}

/**
 * 删除
 * @param {} props
 */
function doDelete(props) {
  let selectedData = props.table.getCheckedRows(LIST_TABLE_CODE);
  let deleteContent;
  if (selectedData.length == 0) {
    toast({ color: "warning", content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000026') });/* 国际化处理： 请选择至少一条数据！*/
    return;
  } else if (selectedData.length > 1) {
    deleteContent = this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000028');/* 国际化处理： 您确定要删除所选数据吗?*/
  } else {
    deleteContent = this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000029');/* 国际化处理： 确定要删除吗?*/
  }
  promptBox({
    /* 国际化处理：删除*/
    title: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000004'),/* 国际化处理： 删除*/
    color: "warning",
    content: deleteContent,
    beSureBtnClick: delConfirm.bind(this)
  });
}

/**
 * 确认删除
 * @param {*} props
 */
function delConfirm() {
  doManyAjaxAndReturn(this, this.props, "delete", URL_LIST.DELETE);
  doRefresh.call(this);
}

/**
 * 联查 付款单据
 * @param {*} props
 */
function doLinkBill(props) {
  let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
  let pk_register;
  let pk_paybill;
  // 当选中条数大于 1 条数据时 取下标最小的一条数据
  if (selectedRows.length > 1) {
    pk_register = selectedRows[minIndex].data.values.pk_register.value;
    pk_paybill = selectedRows[minIndex].data.values.pk_paybill.value;
    syscode = selectedRows[minIndex].data.values.syscode.value;
  }
  // 选中一条时
  if (selectedRows.length == 1) {
    pk_register = selectedRows[0].data.values.pk_register.value;
    pk_paybill = selectedRows[0].data.values.pk_paybill.value;
    syscode = selectedRows[0].data.values.syscode.value;
  }
  //手工录入 则不联查付款单据
  if (syscode == "INPUT") {
    toast({
      color: "warning",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000030')/* 国际化处理： 手工录入，不能联查付款单据！*/
    });
    return;
  }
  //手工录入 则不联查付款单据
  let successaCallback = function(res) {
    let { linkinfo } = res.data;
    if (linkinfo) {
      this.props.openTo(linkinfo.url, {
        appcode: linkinfo.appCode,
        pagecode: linkinfo.linkPageCode,
        status: "browse",
        scene: "linksce",
        id: linkinfo.pks
      });
    }
  };

  let sendData = {
    pk_register: pk_register,
    pk_billhead: pk_paybill
  };

  doAjax.call(this, sendData, URL_LIST.PAYBILL_Link_BILL, successaCallback);
}

/**
 * 联查 计划预算
 * @param {*} props
 */
function doLinkPlan(props) {
  let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
  let pk;
  let paybillplanitem;
  // 当选中条数大于 1 条数据时 取下标最小的一条数据
  if (selectedRows.length > 1) {
    let minIndex = getMinIndex(selectedRows);
    pk = selectedRows[minIndex].data.values.pk_paybill.value;
    paybillplanitem = selectedRows[minIndex].data.values.paybillplanitem.value;
  }
  // 选中一条时
  if (selectedRows.length == 1) {
    pk = selectedRows[0].data.values.pk_paybill.value;
    paybillplanitem = selectedRows[0].data.values.paybillplanitem.value;
  }
  // 没有付票计划项目 则不联查计划预算
  if (paybillplanitem == "" || paybillplanitem == undefined) {
    toast({
      color: "warning",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000031')/* 国际化处理： 没有选择付票计划项目，不能联查计划预算！*/
    });
    return;
  }
 
  let successCallback = function(res) {
    let { data } = res;
    if (data.hint) {
      toast({ color: "warning", content: res.data.hint });
    } else {
      this.setState({
        showNtbDetail: true,
        ntbdata: data
      });
    }
  };
  let sendData = {
    pk,
    className: FULL_AGGCLASSNAME,
    modulecode:'3618'
  };
  doAjax.call(this, sendData, URL_LIST.PAYBILL_Link_PLAN, successCallback);
}

/**
 * 联查 票据台账
 * @param {*} props
 */
function doLinkBook(props) {
  let pk_register;
  let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
  // 当选中条数大于 1 条数据时 取下标最小的一条数据
  if (selectedRows.length > 1) {
    let minIndex = getMinIndex(selectedRows);
    pk_register = selectedRows[minIndex].data.values.pk_register.value;
  }
  // 选中一条时
  if (selectedRows.length == 1) {
    pk_register = selectedRows[0].data.values.pk_register.value;
  }
  this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
    appcode: "36181BL",
    status: "browse",
    id: pk_register,// 联查中需要传递的其他参数
    billtype: "36HM", // 单据类型管理中的 (目标应用)类型代码 
    pagecode: "36181BL_C01", // 联查目标应用的页面编码
    scene: "linksce", // 前端代码控制时需要的 场景参数
    sence: "4", // 公共处理是需要的应用跳转参数 4-联查 3-审批 1-默认
  });
}

/**
 * 联查 凭证
 * @param {*} props
 */
function doLinkVoucher(props) {
  let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
  let index;
  // 当选中条数大于 1 条数据时 取下标最小的一条数据
  if (selectedRows.length > 1) {
    index = getMinIndex(selectedRows);
  }
  // 选中一条时
  if (selectedRows.length == 1) {
    index = 0;
  }
  let voucher = selectedRows[index].data.values.voucher.value;
  if (!voucher) {
    toast({
      color: "warning",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000032')/* 国际化处理： 未制证，不能联查凭证！*/
    });
    return;
  }
  //拼接联查数据,
  let querydata = [
    {
      pk_billtype: BILL_TYPE,
      pk_group: selectedRows[index].data.values.pk_group.value,
      pk_org: selectedRows[index].data.values.pk_org.value,
      relationID: selectedRows[index].data.values.pk_paybill.value
    }
  ];
  let successCallback = function(res) {
    if (res.success) {
      let srcCode = res.data.src;
      if ("_LinkVouchar2019" == srcCode) {
        //走联查
        if (res.data.des) {
          //跳转到凭证界面
          if (res.data.pklist) {
            if (res.data.pklist.length == 1) {
              //单笔联查
              this.props.openTo(res.data.url, {
                status: "browse",
                appcode: res.data.appcode,
                pagecode: res.data.pagecode,
                id: res.data.pklist[0],
                n: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000017'), //'联查凭证'/* 国际化处理： 联查凭证*/
                backflag: "noback"
              });
              return;
            } else {
              //多笔联查
              cacheTools.set("checkedData", res.data.pklist);
              this.props.openTo(res.data.url, {
                status: "browse",
                appcode: res.data.appcode,
                pagecode: res.data.pagecode,
                n: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000017') //'联查凭证'/* 国际化处理： 联查凭证*/
              });
              return;
            }
          }
        }
      } else {
        toast({ color: "warning", content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000018') });/* 国际化处理： 未查到凭证*/
        return;
      }
    }
  };
  doAjax.call(this, querydata, URL_LIST.PAYBILL_Link_Voucher, successCallback);
}

/**
 * 联查 审批详情
 * @param {*} props
 */
function doLinkApprove(props) {
  let id;
  let vbillstatus;
  let selectedRows = this.props.table.getCheckedRows(LIST_TABLE_CODE);
  // 当选中条数大于 1 条数据时 复制下标最小的一条数据
  if (selectedRows.length > 1) {
    let minIndex = getMinIndex(selectedRows);
    id = selectedRows[minIndex].data.values.pk_paybill.value;
    vbillstatus = selectedRows[minIndex].data.values.vbillstatus.value;
  }
  // 选中一条时直接跳转卡片页并传递选中行pk
  if (selectedRows.length == 1) {
    id = selectedRows[0].data.values.pk_paybill.value;
    vbillstatus = selectedRows[0].data.values.vbillstatus.value;
  }
  // 自由 则不能联查审批详情按钮
  if ((vbillstatus = -1)) {
    toast({
      color: "warning",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000033')/* 国际化处理： 单据状态是自由态，不能联查审批详情！*/
    });
    return;
  }
  this.setState({
    showApproveDetail: true,
    billId: id
  });
}

/**
 * 刷新
 * @param {*} props
 */
function doRefresh() {
  searchButtonClick.call(this, this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000019'));/* 国际化处理： 刷新成功！*/
}

/**
 * 输出
 * @param {} props
 */
function doOutput(props) {
  let outputData = props.table.getCheckedRows(LIST_TABLE_CODE);
  if (!outputData || outputData.length == 0) {
    toast({ color: "warning", content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000026') });/* 国际化处理： 请选择至少一条数据！*/
    return;
  }
  let outputpks = [];
  outputData.forEach(item => {
    outputpks.push(item.data.values.pk_paybill.value);
  });
  output({
    url: URL_LIST.PRINT,
    data: {
      funcode: props.getSearchParam("c") || props.getUrlParam("c"), //小应用编码
      oids: outputpks,
      outputType: "output",
      nodekey: NODE_KEY
    }
  });
}

/**
 * 打印
 * @param {*} props
 */
function doPrint(props) {
  let printData = props.table.getCheckedRows(LIST_TABLE_CODE);
  if (!printData || printData.length == 0) {
    toast({ color: "warning", content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000026') });/* 国际化处理： 请选择至少一条数据！*/
    return;
  }
  let printpks = [];
  printData.forEach(item => {
    printpks.push(item.data.values.pk_paybill.value);
  });
  print(
    //支持两类: 'html'为模板打印, 'pdf'为pdf打印
    "pdf",
    URL_LIST.PRINT,
    {
      funcode: props.getSearchParam("c") || props.getUrlParam("c"), //小应用编码
      nodekey: NODE_KEY,
      oids: printpks
    }
  );
}

/**
 * 附件
 * @param {*} props
 */
function doField(props) {
  let selectedRows = props.table.getCheckedRows(LIST_TABLE_CODE);
  if (selectedRows && selectedRows.length < 1) {
    toast({
      color: "warning",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000027')/* 国际化处理： 请选择一条数据！*/
    });
    return;
  }

  // 当选中条数大于 1 条数据时 复制下标最小的一条数据
  if (selectedRows.length > 1) {
    let minIndex = getMinIndex(selectedRows);
    let billno = selectedRows[minIndex].data.values.vbillno.value;
    let pk_paybill = selectedRows[minIndex].data.values.pk_paybill.value;

    this.setState({
      showUploader: !this.state.showUploader,
      target: null,
      billId: pk_paybill,
      billno: billno
    });
  }
  // 选中一条时直接跳转卡片页并传递选中行pk
  if (selectedRows.length == 1) {
    let billno = selectedRows[0].data.values.vbillno.value;
    let pk_paybill = selectedRows[0].data.values.pk_paybill.value;

    this.setState({
      showUploader: !this.state.showUploader,
      target: null,
      billId: pk_paybill,
      billno: billno
    });
  }
}

/**
 * 返回最小序号选中行
 * @param {*} selectedRows
 */
function getMinIndex(selectedRows) {
  if (selectedRows.length < 1) {
    return null;
  }
  let minIndex = selectedRows[0].index;
  selectedRows.forEach(element => {
    if (element.index < minIndex) {
      minIndex = element.index;
    }
  });
  return minIndex;
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/