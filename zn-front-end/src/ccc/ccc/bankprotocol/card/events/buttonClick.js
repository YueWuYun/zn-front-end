/*Hm9gUKDDwtNjV7Mk8onAzke+VAsA0RKBBjtMDGkHwYJaPDmcTSV8ncvKSGANmfrP*/
import { ajax, toast, cardCache, promptBox } from "nc-lightapp-front";
import { BusinessOperator } from "./BusinessOperator";
import initTemplate from "./initTemplate";
import {
  TEMPLATE,
  ACTION_URL,
  PK_CODE,
  TABLE_CODE,
} from "../../constant/constant";
import {
  printClick,
  cancelClick,
  linkNtbClick,
  linkApprClick,
  versionClick,
} from "../../action";
import { toggleShow, getData } from "./page";
import { sagaApi } from "../../Util";
let { updateCache, addCache } = cardCache;

export default function (props, id, tableId) {
  let pk =
    props.form.getFormItemsValue(this.formId, this.billPK).value ||
    props.getUrlParam("id");
  let billno = props.form.getFormItemsValue(this.formId, this.billNO).value;
  debugger;
  switch (id) {
    case "save": //保存
      saveAction(this, props, tableId, id, ACTION_URL.SAVE);
      break;
    case "add": //新增
      addAction.call(this, props, tableId);
      initTemplate.call(this, props);
      break;
    case "saveadd": //保存新增
      saveAction(this, props, tableId, id, ACTION_URL.SAVE);
      break;
    case "copy": //复制
      this.props.setUrlParam({
        status: "copy",
        id: pk,
      });
      getData.call(this);
      break;
    case "cancel": //取消
      cancelClick.call(this, props, pk);
      break;
    case "edit": //修改
      editAction.call(this, props, tableId);
      break;
    case "submit": //提交
      BusinessOperator.call(
        this,
        props,
        id,
        ACTION_URL.SUBMIT,
        this.state.json["36610CC-000002"]
      ); /* 国际化处理： 提交成功！*/
      break;
    case "savesubmit": //保存提交
      saveAction(this, props, tableId, id, ACTION_URL.SAVE);
      break;
    case "withdraw": //收回
      BusinessOperator.call(
        this,
        props,
        id,
        ACTION_URL.WITHDRAW,
        this.state.json["36610CC-000006"]
      ); /* 国际化处理： 收回成功！*/
      break;
    case "frozen": //冻结
      BusinessOperator.call(
        this,
        props,
        id,
        ACTION_URL.FRONZEN,
        this.state.json["36610CC-000007"]
      ); /* 国际化处理： 冻结成功！*/
      break;
    case "unfrozen": //取消
      BusinessOperator.call(
        this,
        props,
        id,
        ACTION_URL.UNFRONZEN,
        this.state.json["36610CC-000008"]
      ); /* 国际化处理： 取消冻结成功！*/
      break;
    case "terminate": //结束
      BusinessOperator.call(
        this,
        props,
        id,
        ACTION_URL.TERMINATE,
        this.state.json["36610CC-000009"]
      ); /* 国际化处理： 结束成功！*/
      break;
    case "unterminate": //取消结束
      let isinherit = props.form.getFormItemsValue(this.formId, "isinherit")
        .value;
      if (isinherit) {
        toast({
          color: "warning",
          content: this.state.json["36610CC-000005"],
        }); /* 国际化处理： 该协议有子授信协议，不能取消结束！*/
        return;
      }
      BusinessOperator.call(
        this,
        props,
        id,
        ACTION_URL.UNTERMINATE,
        this.state.json["36610CC-000010"]
      ); /* 国际化处理： 取消结束成功！*/
      break;
    case "delversion": //删除版本
      BusinessOperator.call(
        this,
        props,
        id,
        ACTION_URL.DELVERSION,
        this.state.json["36610CC-000011"]
      ); /* 国际化处理： 删除版本成功！*/
      break;
    case "linkaprv": //联查审批详情
      linkApprClick.call(this, props, "card");
      break;
    case "refresh": //刷新
      getData.call(this, () => {
        toast({
          color: "success",
          content: this.state.json["36610CC-000063"] /* 国际化处理 刷新成功 */,
        });
      });
      break;
    case "print": //打印
      printClick.call(this, id, [pk]);
      break;
    case "printout": //输出
      printClick.call(this, id, [pk]);
      break;
    case "linkntb": //联查预算
      linkNtbClick.call(this, props, "card");
      break;
    case "linkver": //联查版本
      versionClick.call(this, "card");
      break;
    case "file": //附件管理
      this.setState({
        billID: pk,
        billNO: billno,
        showUploader: !this.state.showUploader,
      });
      break;
    case "change": //变更
      props.setUrlParam({ status: "edit", operate: "change", id: pk });
      toggleShow.call(this);
      break;
    case "delete": //删除
      delBill.call(this, props, id);
      break;
  }
}

/**
 * 删除
 * @param {*} props 	页面内置对象
 * @param {*} operate	操作
 */
function delBill(props, operate) {
  promptBox({
    color: "warning",
    title: this.state.json["36610CC-000021"] /* 国际化处理： 删除*/,
    content: this.state.json["36610CC-000022"],
    beSureBtnClick: () => {
      BusinessOperator.call(
        this,
        props,
        operate,
        ACTION_URL.DELETE,
        this.state.json["36610CC-000012"]
      ); /* 国际化处理： 删除成功！*/
    },
  });
}

/**
 * 编辑
 * @param {*} props
 */
const editAction = function (props) {
  let id = props.getUrlParam("id");
  let data = { pk: id, fieldPK: PK_CODE, tableName: TABLE_CODE };
  sagaApi.call(this, {
    data: data,
    success: (res) => {
      if (this.props.form.getFormItemsValue(this.formId, "saga_frozen")) {
        this.props.form.setFormItemsValue(this.formId, {
          saga_frozen: { value: "0" },
        });
      }
      if (this.props.form.getFormItemsValue(this.formId, "saga_status")) {
        this.props.form.setFormItemsValue(this.formId, {
          saga_status: { value: "0" },
        });
      }
      this.props.pushTo("/card", {
        status: "edit",
        id: id,
        pagecode: this.pageId,
      });
      toggleShow.call(this);
    },
  });
};

/**
 * 新增
 * @param {*} props
 * @param {*} tableId
 */
const addAction = function (props, tableId) {
  this.props.pushTo("/card", {
    status: "add",
    id: null,
    pagecode: this.pageId,
  });
  toggleShow.call(this);
  getData.call(this);
};

/**
 * setData后操作
 * @param {*} props
 * @param {*} keys
 */
export function afterSetData(props, keys) {
  if (!keys.length) return;
  let key = keys.includes(this.tabCode) ? this.tabCode : keys[0];
  props.cardTable.setCurrTabKey(key);
}

/**
 * 保存or保存提交
 * @param {*} props
 * @param {*} tableId
 */
debugger;
function saveAction(that, props, tableId, id, url) {
  //处理分授信三个按钮的编辑后事件
  setColBySth.call(that, props, TEMPLATE.TABLE_DETAIL);
  let status = props.getUrlParam("status");
  let CardData = props.createTabsCardData(
    that.pageId,
    that.formId,
    that.tabOrder
  );
  if (!props.form.isCheckNow(that.formId)) {
    return;
  }
  if (CardData.bodys[that.tableId1].rows.length > 0) {
    if (!props.cardTable.checkTabRequired(that.tableId1, [that.tableId1])) {
      return;
    }
  }
  if (CardData.bodys[that.tableId2].rows.length > 0) {
    if (!props.cardTable.checkTabRequired(that.tableId2, [that.tableId2])) {
      return;
    }
  }
  debugger;
  let guaTabFlag = checkTabByGua.call(that, props); //根据担保信息校验表体
  if (!guaTabFlag) return;
  let pk_protocol;
  let billno;
  let saveObj = {};
  saveObj[TEMPLATE.TABLE_DETAIL] = "cardTable";
  saveObj[TEMPLATE.TABLE_GUARANTEE] = "cardTable";
  props.validateToSave(
    CardData,
    () => {
      saveAjax.call(that, url, CardData).then((res) => {
        if (res.data.head && res.data.head[that.formId]) {
          props.form.setAllFormValue({
            [that.formId]: res.data.head[that.formId],
          });
          pk_protocol =
            res.data.head[that.formId].rows[0].values.pk_protocol.value;
          billno = res.data.head[that.formId].rows[0].values.protocolcode.value;
          let tbbmessage =
            res.data.head[that.formId].rows[0].values.tbbmessage.value;
          if (tbbmessage && tbbmessage !== null) {
            toast({ color: "warning", content: tbbmessage });
          }
        }
        if (res.data.bodys) {
          props.cardTable.setAllTabsData(res.data.bodys, that.tabOrder);
        }
        if (status == "add") {
          //新增缓存
          addCache(
            pk_protocol,
            res.data,
            that.formId,
            that.dataSource,
            res.data.head[that.formId].rows[0].values
          );
        } else {
          //更新缓存
          updateCache(
            that.billPK,
            pk_protocol,
            res.data,
            that.formId,
            that.dataSource,
            res.data.head[that.formId].rows[0].values
          );
        }
        that.props.BillHeadInfo.setBillHeadInfoVisible({
          billCode: billno,
        });
        //保存,保存提交
        if (id == "save") {
          toast({
            color: "success",
            content: that.state.json["36610CC-000001"],
          }); /* 国际化处理： 保存成功*/
          that.props.setUrlParam({
            status: "browse",
            id: pk_protocol,
          });
          toggleShow.call(that);
        } else if (id == "savesubmit") {
          that.props.setUrlParam({
            status: "browse",
            id: pk_protocol,
          });
          toggleShow.call(that);
          BusinessOperator.call(
            that,
            props,
            "submit",
            "/nccloud/ccc/bankprotocol/submit.do",
            that.state.json["36610CC-000002"]
          ); /* 国际化处理： 提交成功！*/
        } else if (id == "saveadd") {
          toast({
            color: "success",
            content: that.state.json["36610CC-000001"],
          }); /* 国际化处理： 保存成功*/
          //保存新增
          that.props.pushTo("/card", {
            status: "add",
            id: null,
            pagecode: that.pageId,
          });
          toggleShow.call(that);
          getData.call(that);
        }
      });
    },
    saveObj,
    ""
  );
}

/**
 * 设置列数据
 * @param {*} props
 * @param {*} tableId
 */
function setColBySth(props, tableId) {
  let isTypeContral = props.form.getFormItemsValue(
    this.formId,
    "credittypecontral"
  ); //分授信类别credittype
  let isBankContral = props.form.getFormItemsValue(
    this.formId,
    "creditbankcontral"
  ); //分贷款银行pk_bankdoc
  let isUnitControl = props.form.getFormItemsValue(
    this.formId,
    "creditunitcontral"
  ); //分授信单位pk_org_v
  let isArr = [
    {
      value: isTypeContral.value,
      key: "credittype",
      display: this.state.json["36610CC-000013"],
    } /* 国际化处理： 授信类别*/,
    {
      value: isBankContral.value,
      key: "pk_bankdoc",
      display: this.state.json["36610CC-000014"],
    } /* 国际化处理： 贷款银行*/,
    {
      value: isUnitControl.value,
      key: "pk_org_v",
      display: this.state.json["36610CC-000015"],
    } /* 国际化处理： 授信使用单位*/,
  ];
  for (let item in isArr) {
    if (!isArr[item].value) {
      props.cardTable.setColValue(tableId, isArr[item].key, {
        display: "",
        value: "",
      });
    }
  }
}

/**
 * 根据担保信息校验
 * @param {*} props
 * @param {*} tableId
 */
function checkTabByGua(props) {
  debugger;
  let flag = true;
  let guaranteeMode = props.form.getFormItemsValue(this.formId, "guaranteetype")
    .value; // 担保方式
  if (
    guaranteeMode === "warrant" ||
    guaranteeMode === "guaranty" ||
    guaranteeMode === "pledge" ||
    guaranteeMode === "mixed"
  ) {
    /**ZTH**/
    // if (!props.cardTable.checkTabRequired(this.tableId2)) {
    //   flag = false;
    // }  
    

  }
  return flag;
}

function saveAjax(url, data) {
  return new Promise((resolve) => {
    ajax({
      url,
      data,
      success: (res) => {
        if (res.success) {
          if (res.data) {
            resolve(res);
          }
        }
      },
    });
  });
}

/*Hm9gUKDDwtNjV7Mk8onAzke+VAsA0RKBBjtMDGkHwYJaPDmcTSV8ncvKSGANmfrP*/