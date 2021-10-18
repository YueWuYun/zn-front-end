/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { promptBox, toast } from "nc-lightapp-front";
import { CARD_PAGE_CODE, LIST_DISABLENOTE_CODE, LIST_PAGE_CODE, LIST_TABLE_CODE, URL_LIST } from "./../../cons/constant";
import { doAjax } from "./../../utils/commonUtil";

export function bodyButtonClick(props, key, text, record, index) {
  switch (key) {
    // 修改
    case "InnerEdit":
      doInnerEidt.call(this, props, record, index);
      break;
    //删除
    case "InnerDelete":
      doInnerDelete.call(this, props, record, index);
      break;
    // 提交
    case "InnerCommit":
      doInnerCommit.call(this, props, record, index);
      break;
    // 收回
    case "InnerUnCommit":
      doListInnerAjaxAndReturn.call(
        this,
        props,
        record,
        index,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000006'),/* 国际化处理： 收回成功！*/
        URL_LIST.UN_COMMIT
      );
      break;
    // 制证
    case "InnerMakeVoucher":
      doListInnerAjaxAndReturn.call(
        this,
        props,
        record,
        index,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000007'),/* 国际化处理： 制证成功！*/
        URL_LIST.VOUCHER
      );
      break;
    //取消制证
    case "InnerCancelVoucher":
      doListInnerAjaxAndReturn.call(
        this,
        props,
        record,
        index,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000008'),/* 国际化处理： 取消制证成功！*/
        URL_LIST.VOUCHER_CANCEL
      );
      break;
    // 作废
    case "InnerDisable":
      this.setState({ record: record, index: index, operateType: "listInner" });
      //设置作废输入框可见并可编辑
      this.setState({ disabledComShow: true }, () => {
        this.props.form.setFormStatus(LIST_DISABLENOTE_CODE, "edit");
      });
      break;
    // 取消作废
    case "InnerCancelDisable":
      doListInnerAjaxAndReturn.call(
        this,
        props,
        record,
        index,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000011'),/* 国际化处理： 取消作废成功！*/
        URL_LIST.CANCEL_DISABLE
      );
      break;
    // 发送指令
    case "InnerSendCmd":
      doListInnerAjaxAndReturn.call(
        this,
        props,
        record,
        index,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000009'),/* 国际化处理： 发送指令成功！*/
        URL_LIST.SEND_CMD
      );
      break;
    // 撤回指令
    case "InnerWithdrawCmd":
      doListInnerAjaxAndReturn.call(
        this,
        props,
        record,
        index,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000023'),/* 国际化处理： 撤回指令成功！*/
        URL_LIST.WITHDRAW_CMD
      );
      break;
    default:
      break;
  }
}

/**
 * 列表内按钮执行ajax方法并返回刷新页面
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doListInnerAjaxAndReturn(props, record, index, toastContent, url) {
  let pk = record.pk_paybill.value;
  let ts = record.ts.value;

  let sendData = {
    pageid: LIST_PAGE_CODE,
    pks: [pk],
    tss: [ts],
    isCardOpt: false,
    pageid: LIST_PAGE_CODE
  };

  //成功回调
  let successCallback = function(res) {
    if (res.data.grid) {
      handleReturnData(props, record, res.data.grid, index);
    }
    if (res.data.errMsg) {
      toast({
        color: "error",
        content: res.data.errMsg
      });
    } else {
      toast({
        color: "success",
        content: toastContent
      });
    }
  };

  doAjax.call(this, sendData, url, successCallback);
}

/**
 * 编辑
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doInnerEidt(props, record, index) {
  props.pushTo("/card", {
    status: "edit",
    id: record.pk_paybill && record.pk_paybill.value,
    pagecode: CARD_PAGE_CODE
  });
}


/**
 * 删除
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doInnerDelete(props, record, index) {
  let pks = [record.pk_paybill.value];

  // 发送数据
  let sendData = {
    pks: pks
  };

  //成功回调
  let successCallback = function(res) {
    if (res.data.errMsg) {
      toast({
        color: "error",
        content: res.data.errMsg
      });
    } else {
      toast({
        color: "success",
        content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000024')/* 国际化处理： 删除成功！*/
      });
      this.props.table.deleteCacheId(LIST_TABLE_CODE, record.pk_paybill.value);
      this.props.table.deleteTableRowsByIndex(LIST_TABLE_CODE, index);
    }
  };

  doAjax.call(this, sendData, URL_LIST.DELETE, successCallback);
}
/**
 * 提交
 * @param {*} props
 * @param {*} record
 * @param {*} index
 */
function doInnerCommit(props, record, index) {
  let pk = record.pk_paybill.value;
  let ts = record.ts.value;

  let sendData = {
    pageid: LIST_PAGE_CODE,
    pks: [pk],
    tss: [ts],
    isCardOpt: false,
    pageid: LIST_PAGE_CODE
  };

  let successCallback = function(res) {
    if (res.data.grid) {
      handleReturnData(props, record, res.data.grid, index);
      // props.table.updateDataByIndexs(LIST_TABLE_CODE, res.data.grid[LIST_TABLE_CODE].rows[0].values);
    }
    if (
      res.data.workflow &&
      (res.data.workflow == "approveflow" || res.data.workflow == "workflow")
    ) {
      this.setState({
        compositedata: res.data,
        compositedisplay: true
      });
      this.index = index;
      this.record = record;
    } else {
      this.setState({
        compositedata: res.data,
        compositedisplay: false
      });
      let successIndexs = 0;
      if (res.data.successpks) {
        successIndexs = res.data.successpks.length;
      }

      // 全部成功
      if (successIndexs == 1) {
        toast({
          color: "success",
          content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000015')/* 国际化处理： 提交成功！*/
        });
      } else {
        toast({
          color: "error",
          content: res.data.errMsg && res.data.errMsg.split("\n")
        });
      }
    }
  };

  doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback);
}
// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(props, record, data, index) {
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

/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/