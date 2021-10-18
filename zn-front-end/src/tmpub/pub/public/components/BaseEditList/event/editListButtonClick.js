/*2/Ru8wmeRvQHNpr2A6LIsfnW4K3GUIG7LddzNXxGE3BreNKpmRIjUZIuayKeoK+K*/
import { ajax, toast, promptBox } from "nc-lightapp-front";
import {
  listButtonVisible,
  getSendData,
  regRequired,
  oprFlag,
  delEditData,
  multiToast,
  editDel,
  browseDel,
  selectedEvent
} from "./events";
import { searchButtonClick } from "./editListSearch";

/**
 * 基础档案整表编辑页面肩部按钮事件
 * @author dongyue7
 */

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export function buttonClick(props, id) {
  let { setStatus } = props.editTable;
  switch (id) {
    //头部 新增
    case "Add":
      addBill.call(this, props);
      setEditableRow.call(this, props, this.primaryId);
      break;
    //头部 修改
    case "Edit":
      setStatus(this.tableId, "edit", () => {
        listButtonVisible.call(this, props);
        setEditableRow.call(this, props, this.primaryId);
      });
      break;
    //头部 删除
    case "Delete":
      this.setState({ showToast: false });
      deleteBill.call(this, props);
      break;
    //头部 保存
    case "Save":
      saveBill.call(this, props);
      break;
    //头部 取消
    case "Cancel":
      cancel.call(this, props);
      break;
    case "Refresh":
      this.setState({ showToast: true });
      searchButtonClick.call(this, props, true);
      break;
    default:
      break;
  }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
export function addBill(props) {
  let number = props.editTable.getNumberOfRows(this.tableId);
  props.editTable.addRow(this.tableId, number);
  listButtonVisible.call(this, props);
  // 焦点放在code上
  props.editTable.setValByKeyAndIndex(this.tableId, number, "code", {
    value: "",
    display: "",
    scale: 0,
    isEdit: true
  });
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
  promptBox({
    color: "warning",
    title: this.state.json["36010PUBLIC-000000"] /* 国际化处理： 取消*/,
    content: this.state.json[
      "36010PUBLIC-000001"
    ] /* 国际化处理： 确定要取消吗?*/,
    beSureBtnClick: () => {
      cancelCallBack.call(this, props);
    }
  });
}

/**
 * 取消确定回调
 * @param {*} props  页面内置对象
 */
export function cancelCallBack(props) {
  props.editTable.cancelEdit(this.tableId, () => {
    this.setState({ showToast: false });
    searchButtonClick.call(this, props);
    listButtonVisible.call(this, props);
    selectedEvent.call(this, props);
    this.state.editDelData.model.rows.length = 0; // 清空编辑态暂存删除数据
  });
}

/**
 * 保存
 * @param {*} props  页面内置对象
 */
export function saveBill(props) {
  let saveRows = props.editTable.getChangedRows(this.tableId); // 获取修改或新增的行
  let sendData = getSendData.call(this, props, "save", saveRows); // 获取传参
  if (this.appId !== "36010RPM") {
    let reqFlag = regRequired.call(this, props, saveRows); // 必输项校验
    let operaFlag = oprFlag.call(this, props, this.appId); // 是否有操作校验
    if (!reqFlag || !operaFlag) {
      return;
    }
  } else {
    let operaFlag = oprFlag.call(this, props, this.appId); // 是否有操作校验
    if (!operaFlag) {
      return;
    }
  }
  delEditData.call(this, this.state.editDelData, this.delUrl).then(() => {
    // 删除编辑态删除的数据
    this.setState({ showToast: false });
    // 保存前事件
    let beforeSendData =
      this.props._beforeSave && this.props._beforeSave.call(this, sendData);
    if (beforeSendData === "no") {
      // 还款方式负数校验
      return;
    }
    sendData = beforeSendData ? beforeSendData : sendData;
    let batchFlag = this.appId === "36010RPM" ? true : false;
    let repFlag = bodyBtnOperation.call(
      this,
      sendData,
      this.saveUrl,
      this.state.json["36010PUBLIC-000002"],
      batchFlag
    ); /* 国际化处理： 保存成功!*/
    // 调用接口报错时，不退出编辑态
    if (!repFlag) {
      props.editTable.setStatus(this.tableId, "browse"); //将表格置为浏览态
      listButtonVisible.call(this, props);
      props.editTable.selectAllRows(this.tableId, false); // 全不选
      selectedEvent.call(this, props);
    }
  });
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
export function deleteBill(props) {
  let { getCheckedRows, getStatus } = props.editTable;

  let oprName = {
    commit: this.state.json["36010PUBLIC-000004"] /* 国际化处理： 提交*/,
    uncommit: this.state.json["36010PUBLIC-000005"] /* 国际化处理： 收回*/,
    del: this.state.json["36010PUBLIC-000006"] /* 国际化处理： 删除*/
  };
  let delRows = getCheckedRows(this.tableId).map(e => e.data); // 得到勾选行的数据
  let checkDelDataLen = delRows.length;
  let tableStatus = getStatus(this.tableId);
  let delData = getSendData.call(this, props, "del");
  let handeledDelData =
    this.props._beforeBatch && this.props._beforeBatch.call(this, delData);
  if (checkDelDataLen === 0) {
    toast({
      color: "warning",
      content: this.state.json[
        "36010PUBLIC-000034"
      ] /* 国际化处理： 请先选择数据 */
    });
    return;
  }
  if (tableStatus === "edit") {
    // 编辑态删除
    editDel.call(this, props, checkDelDataLen, delRows, this.checkUrl, oprName);
  } else {
    // 浏览态删除
    browseDel.call(this, checkDelDataLen, handeledDelData || delData);
  }
}

/**
 * 按钮ajax
 * @param {*} data          传参
 * @param {*} path          路径
 * @param {*} content       toast内容
 * @param {*} isBatch       是否批量（默认为否）
 */
export function bodyBtnOperation(data, path, content, isBatch = false, index) {
  let errFlag; // 用于判断是否操作成功
  ajax({
    url: path,
    data,
    async: false,
    success: res => {
      if (res.success) {
        if (!isBatch) {
          // 非批量
          if (
            res.data &&
            res.data.errormessages &&
            res.data.errormessages.length != 0
          ) {
            // 走的是删除接口
            toast({
              color: "danger",
              content: this.state.json["36010PUBLIC-000003"]
            }); /* 国际化处理： 该条数据已被引用，删除失败！*/
          } else {
            // 走的是其他接口
            toast({ color: "success", content });
            this.props.button.setButtonDisabled("Delete", true);
          }
        } else {
          // 目前批量有删除和修改保存，以后可能会有启用停用。
          let oprName = {
            commit: this.state.json[
              "36010PUBLIC-000004"
            ] /* 国际化处理： 提交*/,
            uncommit: this.state.json[
              "36010PUBLIC-000005"
            ] /* 国际化处理： 收回*/,
            del: this.state.json["36010PUBLIC-000006"] /* 国际化处理： 删除*/,
            editSave: "保存" /* 国际化处理： 保存*/
          };
          let opr = path === this.delUrl ? "del" : "editSave";
          multiToast.call(this, opr, oprName, res.data);
        }
        if (path === this.enableUrl || path === this.disEnableUrl) {
          let newRecord = res.data && res.data.grid[this.tableId].rows;
          this.props.editTable.updateTableData(this.tableId, {
            rows: newRecord
          });
          if (!isBatch) {
            // 预置数据不可操作
            let preSysItem = newRecord[0].values[this.sysMark];
            this.props.editTable.setCheckboxDisabled(
              this.tableId,
              index,
              !preSysItem.value
            );
          }
        } else if (path === this.delUrl) {
          let deletePks =
            res.data &&
            res.data.billCards &&
            res.data.billCards.filter(item => item.state === "0"); //删除成功
          deletePks = deletePks && deletePks.map(item => item.pk);
          if (deletePks.length > 0) {
            let allTableData = this.props.editTable.getAllRows(this.tableId);
            let allPks =
              allTableData[0] &&
              allTableData.map(item => item.values[this.primaryId].value);
            let deleteRowIndexArr = deletePks
              .map(item => allPks.findIndex(v => v == item))
              .filter(item => item != -1);
            this.props.editTable.deleteTableRowsByIndex(
              this.tableId,
              deleteRowIndexArr
            );
          }
          // 删除成功之后，清空缓存下来的数据
          this.setState({
            editDelData: {
              // 编辑态删除暂存数据结构
              pageid: this.pageId,
              templetid: this.tableOid,
              model: {
                areaType: "table",
                areacode: this.tableId,
                rows: []
              }
            }
          });
        } else if (path === this.saveUrl) {
          // 报错时不需要查询及修改当前单据状态
          if (res.data.status === "1") {
            errFlag = true;
          } else {
            searchButtonClick.call(this, this.props);
          }
        }
      }
    },
    error: err => {
      toast({ color: "danger", content: err.message });
      errFlag = err;
    }
  });
  return errFlag;
}

function setEditableRow(props, primaryId) {
  if (primaryId && primaryId === "pk_repaymentmethod") {
    let { setEditableRowKeyByIndex, updateTableHeight } = props.editTable;
    // 触发表格高度更新
    updateTableHeight();
    props.editTable.getAllRows(this.tableId).map((item, index) => {
      let repay_intst_method =
        item && item.values && item.values.repay_intst_method.value;
      let repay_prcpl_method =
        item && item.values && item.values.repay_prcpl_method.value;
      if (repay_intst_method || repay_prcpl_method) {
        //还本
        if (
          repay_prcpl_method == "1" ||
          repay_prcpl_method == "2" ||
          repay_prcpl_method == "3" ||
          repay_prcpl_method == "4"
        ) {
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "repay_prcpl_period",
            true
          );
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "startrepprcplmth",
            true
          );
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "repay_prcpl_date",
            true
          );
          //付息
        } else if (repay_prcpl_method == "5" || repay_prcpl_method == "6") {
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "repay_prcpl_period",
            false
          );
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "startrepprcplmth",
            false
          );
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "repay_prcpl_date",
            false
          );
        }
        //付息
        if (
          repay_intst_method == "1" ||
          repay_intst_method == "2" ||
          repay_intst_method == "3" ||
          repay_intst_method == "4"
        ) {
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "repay_intst_date",
            true
          );
          //计息开始月
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "startrepintstmth",
            true
          );
          //计息周期
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "repay_intst_period",
            true
          );
        } else if (repay_intst_method == "5" || repay_intst_method == "6") {
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "repay_intst_date",
            false
          );
          //计息开始月
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "startrepintstmth",
            false
          );
          //计息周期
          setEditableRowKeyByIndex(
            this.tableId,
            index,
            "repay_intst_period",
            false
          );
        }
      }
    });
  }
}

/*2/Ru8wmeRvQHNpr2A6LIsfnW4K3GUIG7LddzNXxGE3BreNKpmRIjUZIuayKeoK+K*/