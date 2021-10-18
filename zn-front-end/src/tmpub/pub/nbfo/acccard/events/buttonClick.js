/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { ajax, toast, print, cardCache, promptBox } from "nc-lightapp-front";
import {
  baseReqUrl,
  javaUrl,
  accPrintData,
  accCard
} from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { getCardData, billHeadVisible, btnOperation } from "./page";
import {
  trimStr,
  dedupe
} from "../../../public/components/BaseEditList/event/utils.js";
let { updateCache, addCache } = cardCache;

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
  // 当前单据的全部数据
  let cardData = this.props.createExtCardData(this.pageId, this.formId, [
    this.tableId
  ]);
  let pk = props.getUrlParam("id");
  switch (id) {
    //头部 新增
    case "Add":
      this.setState({ bodyData: cardData.bodys[this.tableId] });
      add.call(this, props);
      break;
    //头部 新增浏览态新增
    case "AddBrowse":
      add.call(this, props);
      break;
    //头部 保存
    case "Save":
      saveBill.call(this, props);
      break;
    //头部 保存新增
    case "Saveadd":
      saveAdd.call(this, props);
      break;
    //头部 修改
    case "Revise":
      edit.call(this, props, cardData);
      break;
    //头部 删除
    case "Delete":
      delBill.call(this);
      break;
    // 头部 取消
    case "Cancel":
      cancelBill.call(this, props);
      break;
    //头部 启用
    case "Enable":
      btnOperation.call(
        this,
        javaUrl.accStart,
        this.state.json["36010NBFO-000002"]
      ); /* 国际化处理： 启用成功!*/
      break;
    //头部 停用
    case "Disenable":
      btnOperation.call(
        this,
        javaUrl.accStop,
        this.state.json["36010NBFO-000003"]
      ); /* 国际化处理： 停用成功!*/
      break;
    //头部 打印
    case "Print":
      printBill.call(this, pk, cardData);
      break;
    //头部 输出
    case "PrintOut":
      outPutBill.call(this, pk, cardData);
      break;
    //头部 刷新
    case "Refresh":
      getCardData.call(this, this.props.getUrlParam("id"), true, true);
      break;
    default:
      break;
  }
}

/**
 * 删除
 */
function delBill() {
  promptBox({
    color: "warning",
    title: this.state.json["36010NBFO-000004"] /* 国际化处理： 删除*/,
    content: this.state.json[
      "36010NBFO-000005"
    ] /* 国际化处理： 确定要删除吗?*/,
    beSureBtnClick: () => {
      btnOperation.call(
        this,
        javaUrl.accListDelete,
        this.state.json["36010NBFO-000006"]
      ); /* 国际化处理： 删除成功!*/
    }
  });
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
function cancelBill(props) {
  promptBox({
    color: "warning",
    title: this.state.json["36010NBFO-000007"] /* 国际化处理： 取消*/,
    content: this.state.json[
      "36010NBFO-000008"
    ] /* 国际化处理： 确定要取消吗?*/,
    beSureBtnClick: () => {
      handelCancel.call(this, props);
    }
  });
}

/**
 * 取消回调
 * @param {*} props  页面内置对象
 */
function handelCancel(props) {
  props.cardTable.setTableData(
    this.tableId,
    (this.state.bodyData && this.state.bodyData) || { rows: [] }
  );
  props.form.cancel(this.formId);
  props.form.setFormStatus(this.formId, "browse");
  props.setUrlParam({ status: "browse" });
  buttonVisible.call(this, this.props);
  let billName = props.getUrlParam("name");
  billHeadVisible.call(this, true, true, billName);
}

/**
 * 打印
 * @param {*} props  页面内置对象
 */
function printBill(pk, cardData) {
  accPrintData.oids = [pk];
  print("pdf", `${baseReqUrl}${javaUrl.accPrint}.do`, {
    ...accPrintData,
    nodekey: this.nodekey,
    userjson: JSON.stringify(cardData)
  });
}

/**
 * 输出
 * @param {*} props  页面内置对象
 */
function outPutBill(pk, cardData) {
  let { printOut } = this.state;
  printOut.oids = [pk];
  printOut.userjson = JSON.stringify(cardData);
  this.setState({ printOut }, () => {
    this.refs.printOutput.open();
  });
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function add(props) {
  props.setUrlParam({ status: "add" });
  let nonbankAddPk = props.form.getFormItemsValue(
    this.formId,
    "nonbankfininstitution"
  );
  let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
  let pk_org_v = props.form.getFormItemsValue(this.formId, "pk_org_v");
  clearAll.call(this, props);
  props.form.setFormItemsDisabled(this.formId, { code: false });
  props.cardTable.addRow(this.tableId);
  props.form.setFormItemsValue(accCard.headCode, {
    nonbankfininstitution: nonbankAddPk,
    accountproperty: {
      value: "0",
      display: this.state.json["36010NBFO-000009"] /* 国际化处理： 公司*/
    },
    pk_org,
    pk_org_v
  });
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props, cardData) {
  props.setUrlParam({ status: "edit" });
  buttonVisible.call(this, props);
  setEditStatus.call(this, "edit");
  props.form.setFormItemsDisabled(this.formId, { code: true });
  billHeadVisible.call(
    this,
    false,
    true,
    cardData.head[this.formId].rows[0].values.name.value
  );
  this.setState({ bodyData: cardData.bodys[this.tableId] });
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
function saveBill(props, type) {
  let data = props.createExtCardData(this.pageId, this.formId, [this.tableId]);
  let name = props.form.getFormItemsValue(this.formId, "name");
  // 名称和编码校验前去空格
  this.props.form.setFormItemsValue(this.formId, {
    code: {
      display: null,
      value: trimStr(props.form.getFormItemsValue(this.formId, "code").value)
    },
    name: {
      display: null,
      value: trimStr(name.name && name.name.value && name.name.value)
    },
    name2: {
      display: null,
      value: trimStr(name.name2 && name.name2.value && name.name2.value)
    },
    name3: {
      display: null,
      value: trimStr(name.name3 && name.name3.value && name.name3.value)
    }
  });
  let flagForm = this.props.form.isCheckNow(this.formId); // form表单是否校验通过，必输项等
  let flagTable = this.props.cardTable.checkTableRequired(this.tableId); // table是否校验通过，必输项等
  let telFlag = telCheck(data); // 电话校验
  let tableRepFlag = checkTableRef.call(this, data.bodys); // 子表币种重复校验
  if (!(flagForm && flagTable && telFlag && tableRepFlag)) {
    return;
  }
  let nonbankPk = this.props.getUrlParam("namePk");
  data.head.head.rows[0].values.nonbankfininstitution = {
    display: nonbankPk,
    value: nonbankPk
  };
  data.templetid = "1001Z6100000000149UK";
  //console.log(data, "save");
  let isAdd = this.props.getUrlParam("status") === "add";
  // 连续新增时，会出现上次新增的pk和ts，这里处理一下
  if (isAdd) {
    if (data.head.head.rows[0].values[this.primaryId]) {
      delete data.head.head.rows[0].values[this.primaryId];
      delete data.head.head.rows[0].values.ts;
    }
  }
  ajax({
    url: `${baseReqUrl}${javaUrl.accListSave}.do`,
    data,
    async: false,
    success: res => {
      if (res.success) {
        if (res.data) {
          let id =
            res.data.head[this.formId].rows[0].values[this.primaryId].value;
          toast({
            color: "success",
            content: this.state.json["36010NBFO-000010"]
          }); /* 国际化处理： 保存成功*/
          props.setUrlParam({
            id,
            status: "browse"
          });
          buttonVisible.call(this, this.props);
          props.form.setFormItemsValue(this.formId, {
            nonbankfininstitution: {
              value: this.props.getUrlParam("nonbankPk"),
              display: this.props.getUrlParam("nonbankName")
            }
          });
          setEditStatus.call(this, "browse");
          // 缓存
          if (isAdd) {
            addCache(id, res.data, this.formId, this.dataSource);
          } else {
            updateCache(
              this.primaryId,
              id,
              res.data,
              this.formId,
              this.dataSource
            );
          }
          getCardData.call(this, id, false, false, type);
        }
      }
    }
  });
}

/**
 * 保存新增
 * @param {*} props  页面内置对象
 */
function saveAdd(props) {
  saveBill.call(this, props, "saveAdd");
}

/**
 * 清空所有的数据
 * @param {*} props  页面内置对象
 */
export function clearAll(props) {
  props.form.EmptyAllFormValue(this.formId);
  props.cardTable.setTableData(this.tableId, { rows: [] });
  buttonVisible.call(this, props);
  billHeadVisible.call(this, false, false);
}

/**
 * 设置编辑性
 * @param {*} status  编辑状态，传入browse或者edit
 */
export function setEditStatus(status) {
  this.props.form.setFormStatus(this.formId, status);
  this.props.cardTable.setStatus(this.tableId, status);
}

// 电话数字校验
function telCheck(data) {
  let flag = true;
  let reg = /^\+?[0-9]*$/; // 数字校验
  if (
    data.head.head.rows[0].values.tel.value &&
    !reg.test(removeAllSpace(data.head.head.rows[0].values.tel.value))
  ) {
    toast({
      color: "warning",
      content: this.state.json["36010NBFO-000011"]
    }); /* 国际化处理： 电话只能是数字！*/
    flag = false;
  }
  return flag;
}

// 去掉所有空格
function removeAllSpace(str) {
  return str.replace(/\s+/g, "");
}

// 子表数据重复校验
function checkTableRef(data) {
  let flag = true;
  let len = data && data[this.tablePrimaryId].rows.length;
  let currtype =
    data &&
    data[this.tablePrimaryId].rows.map(item => item.values.pk_currtype.value);
  if (len > 1 && dedupe(currtype).length < len) {
    toast({
      color: "warning",
      content: this.state.json["36010NBFO-000012"]
    }); /* 国际化处理： 子户币种不能重复！*/
    flag = false;
  }
  return flag;
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/