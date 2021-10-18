/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { ajax, toast, cardCache, print, promptBox } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, insPrintData } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import {
  getCardData,
  billHeadVisible,
  getLangSettleName,
  handleSysDatas,
} from "./page";
let { updateCache, addCache } = cardCache;

/**
 * 新增
 * @param {*} props    页面内置对象
 * @param {*} id       注册按钮编码
 */
export function buttonClick(props, id) {
  // 当前单据状态
  let pk = props.getUrlParam("id");
  // 当前单据的全部数据
  let cardData = this.props.createExtCardData(this.pageId, this.formId, [
    this.tableId,
  ]);
  let pkMapTs = new Map();
  let ts =
    this.props.form.getFormItemsValue(this.formId, "ts") &&
    this.props.form.getFormItemsValue(this.formId, "ts").value;
  //主键与tsMap
  if (pk && ts) {
    pkMapTs.set(pk, ts);
  }
  switch (id) {
    //头部 新增
    case "Add":
      add.call(this, props);
      break;
    //头部 新增浏览态新增
    case "Add_addBrowse":
      add.call(this, props);
      break;
    //头部 保存
    case "Save":
      saveBill.call(this, props, pkMapTs);
      break;
    //头部 修改
    case "Edit":
      editCheckRef.call(this, props, pk, cardData);
      break;
    //头部 删除
    case "Delete":
      delModal.call(this, pkMapTs);
      break;
    // 头部 取消
    case "Cancel":
      cancelModal.call(this, props);
      break;
    //头部 启用
    case "Start":
      this.btnOperation(
        javaUrl.start,
        this.state.json["36010ISDC-000004"]
      ); /* 国际化处理： 启用成功!*/
      buttonVisible.call(this, props);
      break;
    //头部 停用
    case "Stop":
      this.btnOperation(
        javaUrl.stop,
        this.state.json["36010ISDC-000005"]
      ); /* 国际化处理： 停用成功!*/
      buttonVisible.call(this, props);
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
      getCardData.call(this, this.props.getUrlParam("id"), true, true, () => {
        toast({
          color: "success",
          content: this.state.json[
            "36010ISDC-000022"
          ] /* 国际化处理： 刷新成功 */,
        });
      });
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
  props.form.setFormItemsDisabled(this.formId, {
    code: false,
    settleway: false,
    endsettledate: false,
  });
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
function delModal(pkMapTs) {
  promptBox({
    color: "warning",
    title: this.state.json["36010ISDC-000006"] /* 国际化处理： 删除*/,
    content: this.state.json[
      "36010ISDC-000007"
    ] /* 国际化处理： 确定要删除吗?*/,
    beSureBtnClick: () => {
      this.btnOperation(
        javaUrl.delete,
        this.state.json["36010ISDC-000008"],
        pkMapTs
      ); /* 国际化处理： 删除成功!*/
    },
  });
}

/**
 * 修改前检查引用
 * @param {*} props  页面内置对象
 */
function editCheckRef(props, pk, cardData) {
  ajax({
    url: `${baseReqUrl}${javaUrl.checkRef}.do`,
    data: { pks: [pk] },
    success: (res) => {
      if (res.data[0]) {
        promptBox({
          color: "warning",
          title: this.state.json["36010ISDC-000009"] /* 国际化处理： 修改*/,
          content: this.state.json[
            "36010ISDC-000010"
          ] /* 国际化处理： 该条数据已被引用，是否继续修改?*/,
          beSureBtnClick: () => {
            edit.call(this, props, cardData);
          },
        });
      } else {
        edit.call(this, props, cardData);
      }
    },
  });
}

/**
 * 修改
 * @param {*} props  页面内置对象
 */
function edit(props, cardData) {
  // 结息方式
  let settleway = props.form.getFormItemsValue(this.formId, "settleway");
  // 子表区域数据
  let tableValues = props.cardTable.getVisibleRows(this.tableId);
  props.setUrlParam({ status: "edit" });
  buttonVisible.call(this, props);
  setEditStatus.call(this, "edit");
  // 当结息方式为月时 设置 月 列不可以编辑
  props.cardTable.setColEditableByKey(
    this.tableId,
    "settlemonth",
    settleway.value === "1"
  );
  tableValues.map((item, index) => {
    let { values } = item;
    // 月
    let { settlemonth } = values;
    settlemonth = settlemonth && settlemonth.value;
    props.cardTable.setEditableByIndex(
      this.tableId,
      index,
      "settleleapday",
      settlemonth === "2"
    ); //设置闰年日是否可编辑
  });

  billHeadVisible.call(
    this,
    false,
    true,
    cardData.head[this.formId].rows[0].values[getLangSettleName.call(this)]
      .value
  );
  props.form.setFormItemsDisabled(this.formId, {
    settlecycle: true,
    cycleunit: true,
    endsettledate: false,
  });
  handleSysDatas.call(this);
}

/**
 * 取消弹框
 * @param {*} props  页面内置对象
 */
function cancelModal(props) {
  promptBox({
    color: "warning",
    title: this.state.json["36010ISDC-000011"] /* 国际化处理： 取消*/,
    content: this.state.json[
      "36010ISDC-000012"
    ] /* 国际化处理： 确定要取消吗?*/,
    beSureBtnClick: () => {
      cancel.call(this, props);
    },
  });
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
function cancel(props) {
  let id = props.getUrlParam("id");
  props.setUrlParam({ status: "browse" });
  if (id) {
    getCardData.call(this, id);
    setEditStatus.call(this, "browse");
  } else {
    clearAll.call(this, props);
    setEditStatus.call(this, "browse");
    billHeadVisible.call(this, true, false);
  }
}

/**
 * 打印
 * @param {*} props  页面内置对象
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
 * 去空格
 * @param {*} props  页面内置对象
 */
function spliceSpace(props) {
  let code = props.form.getFormItemsValue(this.formId, "code").value;
  let name = props.form.getFormItemsValue(this.formId, "settlename");
  // 名称和编码校验前去空格
  props.form.setFormItemsValue(this.formId, {
    code: {
      display: null,
      value: code ? trimStr(code) : null,
    },
    settlename: {
      display: null,
      value:
        name.settlename &&
        name.settlename.value &&
        trimStr(name.settlename.value),
    },
    settlename2: {
      display: null,
      value:
        name.settlename2 &&
        name.settlename2.value &&
        trimStr(name.settlename2.value),
    },
    settlename3: {
      display: null,
      value:
        name.settlename3 &&
        name.settlename3.value &&
        trimStr(name.settlename3.value),
    },
  });
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
function saveBill(props, pkMapTs) {
  spliceSpace.call(this, props);
  let flagForm = this.props.form.isCheckNow(this.formId); //form表单是否校验通过，必输项等
  let flagTable = this.props.cardTable.checkTableRequired(this.tableId); //table是否校验通过，必输项等
  let flagEmpty = checkEmpty.call(this, props);
  if (!(flagForm && flagTable && flagEmpty)) {
    return;
  }
  let data = this.props.createExtCardData(this.pageId, this.formId, [
    this.tableId,
  ]);

  let callback = () => {
    data.pkMapTs = pkMapTs;
    let isAdd = this.props.getUrlParam("status") === "add";
    ajax({
      url: `${baseReqUrl}${javaUrl.save}.do`,
      data,
      success: (res) => {
        if (res.success) {
          if (res.data) {
            let id =
              res.data.head[this.formId].rows[0].values[this.primaryId].value;
            props.setUrlParam({
              id,
              status: "browse",
            });
            toast({
              color: "success",
              content: this.state.json["36010ISDC-000013"],
            }); /* 国际化处理： 保存成功*/
            buttonVisible.call(this, this.props);
            setEditStatus.call(this, "browse");
            billHeadVisible.call(
              this,
              true,
              true,
              res.data.head[this.formId].rows[0].values[
                getLangSettleName.call(this)
              ].value
            );
            // 缓存
            if (isAdd) {
              addCache(id, res.data, this.formId, this.cache);
            } else {
              updateCache(
                this.primaryId,
                id,
                res.data,
                this.formId,
                this.cache
              );
            }
            this.props.form.setAllFormValue({
              [this.formId]: res.data.head[this.formId],
            });
            this.props.cardTable.setTableData(
              this.tableId,
              res.data.bodys[this.tableId] || {
                areacode: "settleDateDetail",
                rows: [],
              }
            );
          }
        }
      },
    });
  };

  this.props.validateToTabSave
    ? this.props.validateToTabSave(data, callback, "cardTable", "")
    : this.props.validateToSave(data, callback, "cardTable", "");
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
  this.props.setUrlParam({
    status: status,
  });
}

/**
 * 设置闰年日的编辑性
 * @param {*} tableData  表体数据
 */

export function setSettleleapdayEdit(tableData) {
  tableData = tableData || this.props.cardTable.getAllData(this.tableId);
  for (let item of tableData.rows) {
    let rowId = item.rowid;
    let settlemonth = item.values.settlemonth.value;
    this.props.cardTable.setEditableByRowId(
      this.tableId,
      rowId,
      "settleleapday",
      settlemonth === "2"
    );
  }
}

/**
 * 判断子表是否有数据
 * @param {*} tableData  表体数据
 */

function checkEmpty(props) {
  let rowsNum = props.cardTable.getNumberOfRows(this.tableId);
  if (rowsNum == 0) {
    toast({
      color: "warning",
      content: this.state.json["36010ISDC-000014"],
    }); /* 国际化处理： 结息日明细中至少要有一条数据！*/
    return false;
  }
  return true;
}

// 去前后空格
function trimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/