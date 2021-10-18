/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/
import { createPage, ajax, base, toast, deepClone } from "nc-lightapp-front";
import { buttonVisible } from "./buttonVisible";
import { CARD } from "../../cons/constant";

/**
 * tab-table按钮点击
 * @param {*} props          页面内置对象
 * @param {*} key            注册按钮编码
 * @param {*} text           table组件三参数第一个
 * @param {*} record         table组件三参数第二个
 * @param {*} index          table组件三参数第三个
 */
export function bodyButtonClick(props, key, text, record, index) {
  let currTableId = CARD.tab_code;
  switch (key) {
    //行 新增
    case "addRow":
      addRow.call(this, props, index);
      break;
    //行 删除
    case "deleteRow":
      deleteRow.call(this, props);
      break;
    //展开
    case "expand":
      props.cardTable.toggleRowView(currTableId, record);
      break;
    default:
      break;
  }
  props.cardTable.setStatus(currTableId, "edit");
}

//增行
function addRow(props, index) {
  let curTabKey = props.cardTable.getCurTabKey();
  let currTableId = CARD.tab_code;
  let endamountColData = props.cardTable.getTabColValue(curTabKey, "endamount");
  let enddayColData = props.cardTable.getTabColValue(curTabKey, "enddays");
  let endamountColArr =
    endamountColData && endamountColData.map(item => item && item.value); //終點金額
  let enddayColArr =
    enddayColData && enddayColData.map(item => item && item.value); //终点天数

  let nums = props.cardTable.getNumberOfRows(currTableId);
  let rowData = {};
  //定额利率
  if (curTabKey === "rationrate") {
    let meta = props.meta.getMeta();
    for (let item of meta[curTabKey].items) {
      // 定额利率月日年利率不必输
      if (["yrate", "mrate", "rate"].includes(item.attrcode)) {
        item.required = false;
      }
    }
    props.meta.setMeta(meta);

    rowData.endsign = { value: "<=" };
    if (nums > 0) {
      rowData.beginsign = { value: ">" };
      rowData.beginamount = {
        value: props.cardTable.getValByKeyAndIndex(
          currTableId,
          nums - 1,
          "endamount"
        ).value
      };
    } else if (nums === 0) {
      rowData.beginsign = { value: "" };
    }
    if (
      endamountColData &&
      endamountColArr.some(item => item === "" || item === null)
    ) {
      toast({
        color: "warning",
        content: this.state.json["36010IR-000014"]
      }); /* 国际化处理： 终止值为空不能增行！*/
      return;
    }
  } else if (curTabKey === "overduerate") {
    //逾期利率
    rowData.endsign = { value: "<" };
    if (nums > 0) {
      rowData.beginsign = { value: ">=" };
      rowData.begindays = {
        value: props.cardTable.getValByKeyAndIndex(
          currTableId,
          nums - 1,
          "enddays"
        ).value
      };
    }
    if (
      enddayColData &&
      enddayColArr.some(item => item === "" || item === null)
    ) {
      toast({
        color: "warning",
        content: this.state.json["36010IR-000014"]
      }); /* 国际化处理： 终止值为空不能增行！*/
      return;
    }
  } else {
    rowData.enddays = { value: "999" };
    if (nums == 1) {
      toast({
        color: "warning",
        content: this.state.json["36010IR-000017"]
      }); /* 国际化处理： 利率性质为融资利率时，提前利率只有一条记录*/
      return;
    }
  }
  props.cardTable.addRow(currTableId, undefined, rowData, false);
  // 这里控制表体字段编辑性，其他地方考虑删除
  props.cardTable.setEditableByIndex(
    currTableId,
    index === undefined ? nums : index,
    [
      "endamount",
      "yrate",
      "mrate",
      "rate",
      "yoverrate",
      "moverrate",
      "overrate"
    ],
    true
  );
}

//删行
function deleteRow(props) {
  let currTableId = CARD.tab_code;
  let rowNums = props.cardTable.getNumberOfRows(currTableId); //总行数
  let checkedRows = props.cardTable.getCheckedRows(currTableId);
  if (checkedRows.length === 1) {
    if (checkedRows[0].index == rowNums - 1) {
      props.cardTable.delRowsByIndex(currTableId, checkedRows[0].index);
    } else {
      toast({
        color: "warning",
        content: this.state.json["36010IR-000018"]
      }); /* 国际化处理： 只能删除最后一行*/
    }
  } else if (checkedRows.length > 1) {
    toast({
      color: "warning",
      content: this.state.json["36010IR-000018"]
    }); /* 国际化处理： 只能删除最后一行*/
  }
  if (
    props.cardTable.getNumberOfRows(currTableId) == 0 ||
    props.cardTable.getCheckedRows(currTableId).length == 0
  ) {
    props.button.setButtonDisabled("deleteRow", true);
  }
}

/*zPpBovT29EyoCeGjE4sa1a1RJNXdseKmRhRBJIPh2h6/r7PdcTEnZ4DjdtJsGNhP*/