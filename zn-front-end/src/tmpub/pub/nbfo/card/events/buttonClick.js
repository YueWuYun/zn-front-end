/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { ajax, toast, cardCache, print, promptBox } from "nc-lightapp-front";
import {
  baseReqUrl,
  javaUrl,
  insPrintData,
  card,
  accList,
  appCode,
} from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { getCardData, initForm } from "./page";
import {
  cardBtnOperation,
  billHeadVisible,
  cancel,
} from "../../public/event.js";
import { CARD, LIST } from "../../../interestrate/cons/constant.js";
let { updateCache, addCache } = cardCache;

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
  let pk = props.getUrlParam("id");
  // 当前单据的全部数据
  let cardData = this.props.createExtCardData(
    this.pageId,
    this.formId,
    card.tableCode
  );
  switch (id) {
    //头部 新增
    case "Add":
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
    //头部 修改
    case "Revise":
      edit.call(this, props, cardData);
      break;
    //头部 删除
    case "Delete":
      delBill.call(this, props);
      break;
    //头部 复制
    case "Copy":
      copy.call(this, props);
      break;
    //头部 启用
    case "Enable":
      cardBtnOperation.call(
        this,
        javaUrl.enable,
        this.state.json["36010NBFO-000002"]
      ); /* 国际化处理： 启用成功!*/
      break;
    //头部 停用
    case "Disenable":
      cardBtnOperation.call(
        this,
        javaUrl.disEnable,
        this.state.json["36010NBFO-000003"]
      ); /* 国际化处理： 停用成功!*/
      break;
    //头部 取消
    case "Cancel":
      cancelBill.call(this, props);
      break;
    //头部 打印
    case "Print":
      printBill.call(this, pk, cardData);
      break;
    //头部 输出
    case "Output":
      outPutBill.call(this, pk, cardData);
      break;
    //头部 刷新
    case "Refresh":
      toast({
        color: "success",
        content: this.state.json["36010NBFO-000047"],
      }); /* 国际化处理： 刷新成功!*/
      getCardData.call(this, this.props.getUrlParam("id"), true, true);
      break;
    //头部 银行账户
    case "Account":
      unionAccount.call(this, props, cardData);
      break;
    default:
      break;
  }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
function add(props) {
  props.setUrlParam({ status: "add" });
  clearAll.call(this, props);
  initForm.call(this, props);
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props, cardData) {
  props.setUrlParam({ status: "edit" });
  setEditStatus.call(this, "edit");
  buttonVisible.call(this, this.props);
  billHeadVisible.call(
    this,
    false,
    true,
    cardData.head[this.formId].rows[0].values.name.value
  );
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
function delBill() {
  promptBox({
    color: "warning",
    title: this.state.json["36010NBFO-000004"] /* 国际化处理： 删除*/,
    content: this.state.json[
      "36010NBFO-000005"
    ] /* 国际化处理： 确定要删除吗?*/,
    beSureBtnClick: () => {
      cardBtnOperation.call(
        this,
        javaUrl.delete,
        this.state.json["36010NBFO-000027"]
      ); /* 国际化处理： 删除成功！*/
    },
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
      cancel.call(this, props);
    },
  });
}

/**
 * 复制
 * @param {*} props  页面内置对象
 */
function copy(props) {
  props.pushTo("/card", {
    status: "add",
    id: pk,
    pagecode: CARD.page_id,
  });
  setEditStatus.call(this, "add");
  getCardData.call(this, pk, true, true);
}

/**
 * 打印
 * @param {*} pk  单据pk
 */
function printBill(pk, cardData) {
  insPrintData.oids = [pk];
  print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
    ...insPrintData,
    userjson: JSON.stringify(cardData),
  });
}

/**
 * 输出
 * @param {*} pk  单据pk
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
 * 联查银行账户
 * @param {*} pk  单据pk
 */
function unionAccount(props, cardData) {
  //若此条数据时刚刚新增的
  let newId;
  if (typeof cardData.head.head.rows[0].values.pk_nonbankfinins !== undefined) {
    newId = cardData.head.head.rows[0].values.pk_nonbankfinins.value;
  } else {
    newId = this.props.getUrlParam("id");
  }
  if (this.props.appcode === "36010NBFOO") {
    props.openTo("/tmpub/pub/nbfoAcc_org/main/index.html#/list", {
      status: "browse",
      namePk: newId,
      name: cardData.head.head.rows[0].values.name.value,
      pagecode: LIST.page_id,
    });
  } else if (this.props.appcode === "36010NBFOG") {
    props.openTo("/tmpub/pub/nbfoAcc_group/main/index.html#/list", {
      status: "browse",
      namePk: newId,
      name: cardData.head.head.rows[0].values.name.value,
      pagecode: LIST.page_id,
    });
  } else {
    props.openTo("/tmpub/pub/nbfoAcc_global/main/index.html#/list", {
      status: "browse",
      namePk: newId,
      name: cardData.head.head.rows[0].values.name.value,
      pagecode: LIST.page_id,
    });
  }
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
function saveBill(props) {
  let data = this.props.createExtCardData(this.pageId, this.formId);
  let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
  if (!flagForm) return;
  trimForm.call(this, props);
  let flagTable = this.props.cardTable.checkTableRequired(this.tableId); //table是否校验通过，必输项等
  let falgTel = telCheck.call(this, data); //电话校验
  if (!(flagTable && falgTel)) return;
  let callback = () => {
    let isAdd = this.props.getUrlParam("status") === "add";
    data.templetid = "1001Z61000000000PZ71";
    handParam.call(this, isAdd, data);
    savaAjax.call(this, props, data, isAdd);
  };
  this.props.validateToTabSave
    ? this.props.validateToTabSave(data, callback, "cardTable", "")
    : this.props.validateToSave(data, callback, "cardTable", "");
}

/**
 * 保存ajax
 * @param {*} props  页面内置对象
 */
function savaAjax(props, data, isAdd) {
  ajax({
    url: `${baseReqUrl}${javaUrl.save}.do`,
    data,
    success: (res) => {
      if (res.success) {
        if (res.data) {
          let id =
            res.data.head[this.formId].rows[0].values[this.primaryId].value;
          toast({
            color: "success",
            content: this.state.json["36010NBFO-000010"],
          }); /* 国际化处理： 保存成功*/
          props.setUrlParam({
            id,
            status: "browse",
          });
          buttonVisible.call(this, this.props);
          setEditStatus.call(this, "browse");
          // 缓存
          if (isAdd) {
            addCache(id, res.data, this.formId, this.cache);
          } else {
            updateCache(this.primaryId, id, res.data, this.formId, this.cache);
          }
          getCardData.call(this, id);
        }
      }
    },
  });
}

function handParam(isAdd, data) {
  if (isAdd) {
    //若是新增态，就进行传参处理
    let values = data.head.head.rows[0].values;
    let typePk = this.props.getUrlParam("typePk");
    let typeName = this.props.getUrlParam("typeName");
    if (values.pk_nonbankfinins) {
      //判断是否直接从列表页点击新增
      values.pk_nonbankfinins.value = null; //将pk置空
      values.type.value = typePk; //将type的value改成pk再保存
      values.type.display = typeName;
    } else {
      //从卡片页点击新增
      values.type.value = typePk; //将type的value改成pk再保存
      values.type.display = typeName;
    }
    data.head.head.rows[0].values = values;
  }
}

function trimForm(props) {
  let name = props.form.getFormItemsValue(this.formId, "name");
  // 名称和编码校验前去空格
  props.form.setFormItemsValue(this.formId, {
    code: {
      display: null,
      value: trimStr(props.form.getFormItemsValue(this.formId, "code").value),
    },
    name: {
      display: null,
      value: trimStr((name.name && name.name.value) || ""),
    },
    name2: {
      display: null,
      value: trimStr((name.name2 && name.name2.value) || ""),
    },
    name3: {
      display: null,
      value: trimStr((name.name3 && name.name3.value) || ""),
    },
  });
}

function telCheck(data) {
  let reg = /^\+?[0-9]*$/; // 数字校验
  if (
    data.head.head.rows[0].values.phone.value &&
    !reg.test(removeAllSpace(data.head.head.rows[0].values.phone.value))
  ) {
    toast({
      color: "warning",
      content: this.state.json["36010NBFO-000011"],
    }); /* 国际化处理： 电话只能是数字！*/
    return false;
  }
  return true;
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
  // this.props.cardTable.setStatus(tab1, status);
}

// 去掉所有空格
function removeAllSpace(str) {
  return str.replace(/\s+/g, "");
}

// 去前后空格
function trimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/