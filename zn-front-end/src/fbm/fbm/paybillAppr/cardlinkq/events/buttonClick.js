/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { cardCache, output, print, promptBox, toast } from "nc-lightapp-front";
import Sign from "../../../../../tmpub/pub/util/ca";
import { createSimpleBillData } from "../../../../../tmpub/pub/util/index";
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";
import { BILL_TYPE, BTN_CARD, CARD_DISABLENOTE_CODE, CARD_FORM_CODE, LINK_CARD_PAGE_CODE, CARD_TABLE_CODE1, CARD_TABLE_CODE2, CARD_TABLE_CODE3, DATASOURCE, FULL_AGGCLASSNAME, LIST_DISABLENOTE_CODE, NODE_KEY, PRIMARY_ID, URL_LIST } from "./../../cons/constant";
import { doAjax } from "./../../utils/commonUtil";
let {
  getNextId,
  getCurrentLastId,
  deleteCacheById,
  getCacheById,
  updateCache,
  addCache
} = cardCache;

export function buttonClick(props, id) {
  switch (id) {
    // 新增
    case BTN_CARD.ADD:
      doAdd.call(this, props);
      break;

    // 保存
    case BTN_CARD.SAVE:
      if (
        props.form.isCheckNow(
          [
            CARD_FORM_CODE,
            CARD_TABLE_CODE1,
            CARD_TABLE_CODE2,
            CARD_TABLE_CODE3
          ],
          "warning"
        )
      ) {
        let saveAllData = props.form.getAllFormValue(CARD_FORM_CODE);
        let savedata = {
          pageid: LINK_CARD_PAGE_CODE,
          model: {
            areacode: CARD_FORM_CODE,
            rows: saveAllData.rows,
            areaType: "form"
          }
        };

        // 验证公式
        props.validateToSave(
          savedata,
          doSave.bind(this, props, true, null, null),
          "",
          ""
        );
      }
      // doSave.call(this, props, true);
      break;

    // 保存新增
    case BTN_CARD.SAVE_ADD:
      if (props.form.isCheckNow(CARD_FORM_CODE)) {
        let saveadddata = props.createFormAfterEventData(
          LINK_CARD_PAGE_CODE,
          CARD_FORM_CODE
        );
        // 验证公式
        props.validateToSave(saveadddata, doSaveAdd.bind(this, props), "", "");
      }
      // doSaveAdd.call(this, props);
      break;

    // 保存提交
    case BTN_CARD.SAVE_COMMIT:
      if (props.form.isCheckNow(CARD_FORM_CODE)) {
        let saveadddata = props.createFormAfterEventData(
          LINK_CARD_PAGE_CODE,
          CARD_FORM_CODE
        );
        // 验证公式
        props.validateToSave(
          saveadddata,
          doSaveCommit.bind(this, props),
          "",
          ""
        );
      }
      // doSaveCommit.call(this, props);
      break;

    // 取消
    case BTN_CARD.CANCEL:
      promptBox({
        title: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000002'),/* 国际化处理： 取消*/
        color: "warning",
        content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000003'),/* 国际化处理： 是否确认要取消?*/
        beSureBtnClick: doCancel.bind(this, props)
      });
      break;

    // 复制
    case BTN_CARD.COPY:
      doCopy.call(this, props);
      break;

    // 编辑
    case BTN_CARD.EDIT:
      doEdit.call(this, props);
      break;

    // 删除
    case BTN_CARD.DELETE:
      promptBox({
        title: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000004'),/* 国际化处理： 删除*/
        color: "warning",
        content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000005'),/* 国际化处理： 是否确认要删除?*/
        beSureBtnClick: doDelete.bind(this, props)
      });
      break;

    // 提交
    case BTN_CARD.COMMIT:
      doCommit.call(this, props);
      break;

    // 收回
    case BTN_CARD.UN_COMMIT:
      // doUnCommit.call(this, props);
      doAjaxAndReturn.call(this, props, this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000006'), URL_LIST.UN_COMMIT);/* 国际化处理： 收回成功！*/
      break;

    //制证
    case BTN_CARD.MAKE_VOUCHER:
      doAjaxAndReturn.call(this, props, this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000007'), URL_LIST.VOUCHER);/* 国际化处理： 制证成功！*/
      break;

    //取消制证
    case BTN_CARD.VOUCHER_CANCEL:
      doAjaxAndReturn.call(
        this,
        props,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000008'),/* 国际化处理： 取消制证成功！*/
        URL_LIST.VOUCHER_CANCEL
      );
      break;

    //发送指令
    case BTN_CARD.SEND_CMD:
      doAjaxAndReturn.call(this, props, this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000009'), URL_LIST.SEND_CMD);/* 国际化处理： 发送指令成功！*/
      break;

    //撤回指令
    case BTN_CARD.WITHDRAW_CMD:
      doAjaxAndReturn.call(
        this,
        props,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000010'),/* 国际化处理： 撤销指令成功！*/
        URL_LIST.WITHDRAW_CMD
      );
      break;

    //作废
    case BTN_CARD.DISABLE:
      //设置作废输入框可见并可编辑
      this.setState({ disabledComShow: true }, () => {
        this.props.form.setFormStatus(CARD_DISABLENOTE_CODE, "edit");
      });
      break;

    //取消作废
    case BTN_CARD.CANCEL_DISABLE:
      doAjaxAndReturn.call(
        this,
        props,
        this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000011'),/* 国际化处理： 取消作废成功！*/
        URL_LIST.CANCEL_DISABLE
      );
      break;

    //联查 凭证
    case BTN_CARD.LINK_VOUCHER:
      doLinkVoucher.call(this, props);
      break;

    //联查 台账
    case BTN_CARD.LINK_BOOK:
      doLinkBook.call(this, props);
      break;

    //联查 付款单据
    case BTN_CARD.LINK_BILL:
      doLinkBill.call(this, props);
      break;

    //联查 计划项目
    case BTN_CARD.LINK_PLAN:
      doLinkPlan.call(this, props);
      break;

    //联查 审批详情
    case BTN_CARD.LINK_APPROVE:
      doLinkApprove.call(this, props);
      break;

    //附件
    case BTN_CARD.FILED:
      doFiled.call(this, props);
      break;

    //打印
    case BTN_CARD.PRINT:
      doPrint.call(this, props);
      break;

    //输出
    case BTN_CARD.OUTPUT:
      doOutPut.call(this, props);
      break;

    //刷新
    case BTN_CARD.REFRESH:
      doRefresh.call(this, props, true);
      break;

    default:
      break;
  }
}

/**
 * 保存
 * @param {*} props
 */
async function doSave(props, showToast, isAdd, isCommit) {
  // 保存前校验
  let toSave = beforeSave.call(this, props);
  if (toSave) {
    // 采用轻量级的api获取页面数据，去除scale,display
    let cardData = createSimpleBillData(
      props,
      LINK_CARD_PAGE_CODE,
      CARD_FORM_CODE,
      [],
      false
    );
    // let cardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    console.log(cardData, "sign before cardData");
    let result = await Sign({
      isSign: true,
      isKey: false,
      data: cardData,
      isSave: true,
      encryptVOClassName: "nccloud.itf.fbm.paybill.PaybillEncryptVO4NCC"
    });
    if (result.isStop) {
      return;
    }
    cardData = result.data;
    console.log(cardData, "sign after cardData");

    let saveBeforePk = this.props.form.getFormItemsValue(
      CARD_FORM_CODE,
      PRIMARY_ID
    );

    let saveCallback = function(res) {
      if (res.data.card.head) {
        this.props.form.setAllFormValue({
          [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
        });
        //页签赋值
        let pk_paybill =
          res.data.card.head[CARD_FORM_CODE].rows[0].values.pk_paybill;
        this.titleno =
          res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;
        let vbillno = res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno;
        this.setState({
          billno: vbillno && vbillno.value,
          isBlank: false
        });
        this.props.setUrlParam({
          status: "browse",
          id: pk_paybill && pk_paybill.value
        });
        if (saveBeforePk && saveBeforePk.value) {
          updateCache(
            PRIMARY_ID,
            res.data.card.head[CARD_FORM_CODE].rows[0].values.pk_paybill.value,
            res.data.card,
            CARD_FORM_CODE,
            DATASOURCE,
            res.data.card.head[CARD_FORM_CODE].rows[0].values
          );
        } else {
          addCache(
            res.data.card.head[CARD_FORM_CODE].rows[0].values.pk_paybill.value,
            res.data.card,
            CARD_FORM_CODE,
            DATASOURCE,
            res.data.card.head[CARD_FORM_CODE].rows[0].values
          );
        }

        if (isAdd) {
          doAdd.call(this, props);
          return;
        }
        if (isCommit) {
          doCommit.call(this, props);
          return;
        }

        this.toggleShow();

        if (showToast) {
          toast({
            color: "success",
            content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000012')/* 国际化处理： 保存成功*/
          });
        }
      }
    };

    doAjax.call(this, cardData, URL_LIST.SAVE, saveCallback);
  }
}

/**
 * 保存前校验
 * @param {*} props
 */
function beforeSave(props) {
  return props.form.isCheckNow(
    [CARD_FORM_CODE, CARD_TABLE_CODE1, CARD_TABLE_CODE2, CARD_TABLE_CODE3],
    "warning"
  );
}

/**
 * 新增
 * @param {*} props
 */
function doAdd(props) {
  this.props.setUrlParam({
    status: "add",
    id: ""
  });
  this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
  this.initTemplate.call(this, props);
  this.props.form.setFormStatus(CARD_FORM_CODE, "add");
}

/**
 * 删除
 * @param {*} props
 */
function doDelete(props) {
  let id = props.getUrlParam("id");
  let sendData = {
    pks: [id]
  };

  let successCallback = function(res) {
    toast({ color: "success", content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000013') });/* 国际化处理： 删除成功!*/

    let deleteid = this.props.getUrlParam("id");
    let deletenextId = getNextId(deleteid, DATASOURCE);
    deleteCacheById(PRIMARY_ID, deleteid, DATASOURCE);

    //注意：查询下条数据时，也同样需要先判断有没有缓存数据，没有缓存数据时，再发查询请求。
    this.props.setUrlParam({
      status: "browse",
      id: deletenextId ? deletenextId : ""
    });
    this.componentDidMount();
  };

  doAjax.call(this, sendData, URL_LIST.DELETE, successCallback);
}

/**
 * 取消
 * @param {*} props
 */
function doCancel(props) {
  let status = props.getUrlParam("status");
  let id = props.getUrlParam("id");
  if (status === "edit") {
    // 表格返回上一次的值
    this.props.pushTo("/card", {
      status: "browse",
      id: id,
      pagecode: LINK_CARD_PAGE_CODE
    });
    this.componentDidMount();
  }
  //保存中的取消操作
  else if (status === "add") {
    props.pushTo("/card", {
      id: id,
      status: "browse",
      pagecode: LINK_CARD_PAGE_CODE
    });

    this.componentDidMount();
  }
  //复制中的取消操作
  else if (status === "copy") {
    this.props.pushTo("/card", {
      id: id,
      status: "browse",
      pagecode: LINK_CARD_PAGE_CODE
    });
    this.componentDidMount();
  }
  //浏览查询详情
  else if (status === "browse") {
    this.props.pushTo("/card", {
      status: "browse",
      id: id,
      pagecode: LINK_CARD_PAGE_CODE
    });
    this.componentDidMount();
  }
}

/**
 * 保存新增
 * @param {*} props
 */
function doSaveAdd(props) {
  doSave.call(this, props, false, true, false);
}

/**
 * 保存提交
 * @param {*} props
 */
function doSaveCommit(props) {
  doSave.call(this, props, false, false, true);
}

/**
 * 复制
 * @param {*} props
 */
function doCopy(props) {
  let pk = props.getUrlParam("id");
  if (!pk) {
    toast({
      color: "error",
      content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000014')/* 国际化处理： URL中没有主键*/
    });
    return;
  }

  let sendData = {
    pk: pk
  };

  EmptyAreaValue.call(this, CARD_TABLE_CODE1, CARD_FORM_CODE, "pk_register.");

  let successCallback = function(res) {
    if (res.data) {
      this.props.form.setAllFormValue({
        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
      });
      this.titleno =
        res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;

      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        pk_org: true
      });
      this.props.form.setFormItemsDisabled(CARD_FORM_CODE, {
        vbillno: true
      });

      this.props.setUrlParam({
        status: "copy"
      });
      this.toggleShow();
    }
  };

  doAjax.call(this, sendData, URL_LIST.COPY, successCallback);
}

/**
 * 编辑
 * @param {*} props
 */
function doEdit(props) {
  props.pushTo("/card", {
    status: "edit",
    id: props.getUrlParam("id"),
    pagecode: LINK_CARD_PAGE_CODE
  });

  this.componentDidMount();
}

/**
 * 提交
 * @param {*} props
 */
function doCommit(props) {
  let pk = props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID);
  let ts = props.form.getFormItemsValue(CARD_FORM_CODE, "ts");

  let sendData = {
    pageid: LINK_CARD_PAGE_CODE,
    pks: [pk && pk.value],
    tss: [ts && ts.value],
    isCardOpt: true
  };

  let successCallback = function(res) {
    let that = this;
    if (res.data && res.data.errMsg) {
      toast({ color: "error", content: res.data.errMsg });
    } else {
      if (
        res.data.workflow &&
        (res.data.workflow == "approveflow" || res.data.workflow == "workflow")
      ) {
        that.setState({
          compositedata: res.data,
          compositedisplay: true
        });
      } else {
        that.setState({
          compositedata: res.data,
          compositedisplay: false
        });
        if (res.data.card.head) {
          that.props.form.setAllFormValue({
            [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
          });
          updateCache(
            PRIMARY_ID,
            pk && pk.value,
            res.data.card,
            CARD_FORM_CODE,
            DATASOURCE
          );
          toast({
            color: "success",
            content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000015')/* 国际化处理： 提交成功！*/
          });
        }
      }
    }
    doRefresh.call(this, this.props, false);
  };

  doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback);
}

/**
 * 调用ajax方法到后台执行相应操作并返回回调
 * @param {*} props
 * @param {*} successContent
 * @param {*} url
 */
function doAjaxAndReturn(props, successContent, url) {
  let pk = props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID);
  let ts = props.form.getFormItemsValue(CARD_FORM_CODE, "ts");

  let sendData = {
    pageid: LINK_CARD_PAGE_CODE,
    pks: [pk && pk.value],
    tss: [ts && ts.value],
    isCardOpt: true
  };

  let successCallback = function(res) {
    if (res.data && res.data.errMsg) {
      toast({ color: "error", content: res.data.errMsg });
    } else {
      if (res.data.card.head) {
        this.props.form.setAllFormValue({
          [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
        });
        updateCache(
          PRIMARY_ID,
          pk && pk.value,
          res.data.card,
          CARD_FORM_CODE,
          DATASOURCE
        );
        toast({
          color: "success",
          content: successContent
        });
      }
    }
    doRefresh.call(this, this.props, false);
  };

  doAjax.call(this, sendData, url, successCallback);
}

/**
 * 确认作废
 * @param {*} props
 * @param {*} successContent
 * @param {*} url
 */
export function disableCardConfirm(value) {
  let pk = this.props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID);
  let ts = this.props.form.getFormItemsValue(CARD_FORM_CODE, "ts");
  let disablenote = this.props.form.getFormItemsValue(
    LIST_DISABLENOTE_CODE,
    LIST_DISABLENOTE_CODE
  );

  let sendData = {
    pageid: LINK_CARD_PAGE_CODE,
    pks: [pk && pk.value],
    tss: [ts && ts.value],
    disablenote: disablenote && disablenote.value,
    isCardOpt: true
  };

  let successCallback = function(res) {
    if (res.data && res.data.errMsg) {
      toast({ color: "error", content: res.data.errMsg });
    } else {
      if (res.data.card.head) {
        this.props.form.setAllFormValue({
          [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
        });
        updateCache(
          PRIMARY_ID,
          pk && pk.value,
          res.data.card,
          CARD_FORM_CODE,
          DATASOURCE
        );
        toast({
          color: "success",
          content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000016')/* 国际化处理： 作废成功！*/
        });
      }
    }
    doRefresh.call(this, this.props, false);
  };

  doAjax.call(this, sendData, URL_LIST.DISABLE, successCallback);
}
/**
 * 联查 凭证
 * @param {*} props
 */
function doLinkVoucher(props) {
  //拼接联查数据,支持批量联查
  let pk_group =
    props.form.getFormItemsValue(CARD_FORM_CODE, "pk_group") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "pk_group").value;
  let pk_org =
    props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org") &&
    props.form.getFormItemsValue(CARD_FORM_CODE, "pk_org").value;
  let pk_paybill =
    props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID) &&
    props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID).value;
  let sendData = [
    {
      pk_group: pk_group, //集团主键
      pk_org: pk_org, //组织主键
      relationID: pk_paybill, //单据主键
      pk_billtype: BILL_TYPE //交易类型
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
  doAjax.call(this, sendData, URL_LIST.PAYBILL_Link_Voucher, successCallback);
}

/**
 * 联查 台账
 * @param {*} props
 */
function doLinkBook(props) {
  let pk_register = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register")
    .value;
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
 * 联查 付款单据
 * @param {*} props
 */
function doLinkBill(props) {
  let pk_paybill = props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID);
  pk_paybill = pk_paybill && pk_paybill.value;
  let pk_register = props.form.getFormItemsValue(CARD_FORM_CODE, "pk_register");
  pk_register = pk_register && pk_register.value;

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
  let pk = props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID).value;
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
 * 联查 审批详情
 * @param {*} props
 */
function doLinkApprove(props) {
  let billid = props.form.getFormItemsValue(CARD_FORM_CODE, PRIMARY_ID);
  this.setState({
    showApproveDetail: true,
    billId: billid && billid.value
  });
}

/**
 * 附件
 * @param {*} props
 */
function doFiled(props) {
  let billno = props.form.getFormItemsValue(CARD_FORM_CODE, "vbillno").value;
  let pk_paybill = props.getUrlParam("id");

  this.setState({
    showUploader: !this.state.showUploader,
    target: null,
    billId: pk_paybill,
    billno: billno
  });
}

/**
 * 打印
 * @param {*} props
 */
function doPrint(props) {
  let printpks = [props.getUrlParam("id")];

  print(
    //支持两类: 'html'为模板打印, 'pdf'为pdf打印
    "pdf",
    URL_LIST.PRINT,
    {
      nodekey: NODE_KEY,
      oids: printpks
    }
  );
}

/**
 * 输出
 * @param {*} props
 */
function doOutPut(props) {
  let outputpks = [props.getUrlParam("id")];

  output({
    url: URL_LIST.PRINT,
    data: {
      funcode: props.getSearchParam("c") || props.getUrlParam("c"), //小应用编码
      nodekey: NODE_KEY,
      oids: outputpks,
      outputType: "output"
    }
  });
}

/**
 * 刷新
 * @param {*} props
 */
function doRefresh(props, showToast) {
  let pk_paybill = props.getUrlParam("id");
  if (!pk_paybill) {
    this.props.form.EmptyAllFormValue(CARD_FORM_CODE);
    this.setState({
      isBlank: true
    });
    this.toggleShow();
    return;
  }
  let queryData = {
    pk: pk_paybill
  };

  // 成功回调
  let successCallback = function(res) {
    if (res.data) {
      this.props.form.setAllFormValue({
        [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE]
      });

      this.titleno =
        res.data.card.head[CARD_FORM_CODE].rows[0].values.vbillno.value;

      this.toggleShow();

      if (showToast) {
        toast({
          color: "success",
          content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000019')/* 国际化处理： 刷新成功！*/
        });
      }
    }
  };

  doAjax.call(this, queryData, URL_LIST.CARD_QUERY, successCallback);
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/