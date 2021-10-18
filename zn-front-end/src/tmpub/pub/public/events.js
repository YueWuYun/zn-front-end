/*GKsT8Jv7ysLQ2bKlu6b9T1mHstRNJnHB4ouMERTAM2FhjYzJ4XYpdHBlz9rcn43S*/
/**
 * 基础档案公共事件函数
 * @author：dongyue7
 */

import { ajax, toast } from "nc-lightapp-front";
import { selectedEvent } from "./components/BaseEditList/event";

//操作列按钮显隐性控制（单页）
export function oprBtnVisible(sys_mark, enable_status) {
  let buttonAry = [];
  if (!sys_mark) {
    if (enable_status === "1") {
      buttonAry = ["DelLine", "StopLine"];
    } else {
      buttonAry = ["DelLine", "StartLine"];
    }
  }
  return buttonAry;
}

//点击查询，获取查询区数据 props, data, type, queryInfo
export function searchButtonClick(props, data, type, queryInfo) {
  // 分页信息
  let pageInfo = props.editTable.getTablePageInfo(this.pageId);
  let querycondition = props.search.getAllSearchData(this.searchId);
  let searchdata = {
    querycondition: querycondition,
    pageInfo: pageInfo,
    pagecode: this.pageId,
    queryAreaCode: this.searchId,
    oid: this.searchOid,
    querytype: "tree"
  };
  queryAjax.call(this, this.queryInterface, searchdata);
}

//查询ajax
export function queryAjax(url, sendData) {
  ajax({
    url: url,
    data: sendData,
    success: res => {
      let { success, data } = res;
      if (success && data && data.grid) {
        this.props.editTable.setTableData(
          this.tableId,
          data.grid[this.tableId]
        );
        HandelResData.call(this, this.props, data);
        // 第一次进入页面不显示toast
        if (this.state.showToast) {
          // 控制toast是否显示
          toast({
            color: "success",
            content: `查询成功，共有${
              data.grid[this.tableId].pageInfo.total
            }条数据。`
          });
        }
        selectedEvent.call(this, this.props);
      } else {
        this.props.editTable.setTableData(this.tableId, { rows: [] });
      }
    }
  });
}

// 查询处理返回的数据
export function HandelResData(props, data) {
  // 预置数据不可操作
  let preSysRows = data.grid[this.tableId].rows.map(
    e => e.values.sys_mark.value
  );
  let sysRowId = [];
  let sysIndex = [];
  for (let i = 0; i < preSysRows.length; i++) {
    if (preSysRows[i]) {
      sysRowId.push(data.grid[this.tableId].rows[i].rowid);
      sysIndex.push(i);
    }
  }
  if (sysRowId != []) {
    props.editTable.setEditableRowByRowId(this.tableId, sysRowId, false);
  }
  props.editTable.setCheckboxDisabled(this.tableId, sysIndex, false);
}

/**
 * 接口返回批量提示
 *
 * @param {*} name - 操作名称（与OPR_NAME的键对应）
 * @param {*} OPR_NAME - 操作名称对应的文本 
 * OPR_NAME示例
 * {
        commit: '提交',
        uncommit: '收回',
        delete: '删除'
    }
 * @param {*} data - 接口返回数据
 */
export function multiToast(name, OPR_NAME, data) {
  //这里换成自己接口返回的字段名
  let { successNum, failNum, total, msg, errormessages } = data;
  let content = `共${OPR_NAME[name]}${total}条，成功${successNum}条，失败${failNum}条`;
  if (successNum == total) {
    //全部成功
    toast({
      duration: 5,
      color: "success",
      title: `${OPR_NAME[name]}完毕，${msg}`,
      content: content,
      groupOperation: true
    });
  } else if (failNum == total) {
    //全部失败
    toast({
      duration: "infinity",
      color: "danger",
      title: `${OPR_NAME[name]}完毕，${msg}`,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: ["展开", "收起", "关闭"],
      groupOperationMsg: errormessages //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  } else if (successNum < total) {
    //部分失败
    toast({
      duration: "infinity",
      color: "warning",
      title: `${OPR_NAME[name]}完毕，${msg}`,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: ["展开", "收起", "关闭"],
      groupOperationMsg: errormessages //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  }
}

// 去前后空格
export function trimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/*GKsT8Jv7ysLQ2bKlu6b9T1mHstRNJnHB4ouMERTAM2FhjYzJ4XYpdHBlz9rcn43S*/