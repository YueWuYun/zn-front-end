/*JpD/xxUF7kRjUmMTnAwcgjYHE9fhMBwtiZKrHA0EmC8FckcWMIWPJZr7zzY6nB6t*/
/**
 * 基础档案整表编辑页面查询相关事件
 * @author dongyue7
 */

import { ajax, toast } from "nc-lightapp-front";
import { selectedEvent } from "./events";

// 查询按钮点击事件
export function onSearchClick() {
  let status = this.props.editTable.getStatus(this.tableId);
  // 编辑态查询按钮本应置灰，平台将在下版提供。
  if (status === "edit") {
    toast({
      color: "warning",
      content: this.state.json["36010PUBLIC-000011"]
    }); /* 国际化处理： 编辑态不允许查询，置灰功能将在下版提供！*/
    return;
  } else {
    this.setState({ showToast: true });
    searchButtonClick.call(this, this.props);
  }
}

/**
 * 查询
 * @param {*} props          页面内置对象
 * @param {*} isRefresh       刷新操作
 */
export function searchButtonClick(props, isRefresh = false) {
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
  queryAjax
    .call(this, this.queryInterface, searchdata, isRefresh)
    .then(data => {
      let afterGrid =
        this.props._afterSearch &&
        this.props._afterSearch.call(this, data.grid);
      this.props.editTable.setTableData(
        this.tableId,
        (afterGrid && afterGrid[this.tableId]) || data.grid[this.tableId]
      );
      handelResData.call(this, this.props, data);
    });
}

/**
 * 查询ajax
 * @param {*} url      请求url
 * @param {*} sendData 传输数据
 * @param {*} isRefresh 是否刷新操作
 */
export function queryAjax(url, sendData, isRefresh) {
  return new Promise(resolve => {
    ajax({
      url: url,
      data: sendData,
      success: res => {
        let { success, data } = res;
        if (success && data && data.grid) {
          resolve(res.data); // 这里setTable
          // 第一次进入页面不显示toast
          if (this.state.showToast) {
            // 控制toast是否显示
            if (isRefresh) {
              toast({
                color: "success",
                content: this.state.json["36010PUBLIC-000033"]
              }); /* 国际化处理： 刷新成功*/
            } else {
              toast({
                color: "success",
                content: `${this.state.json["36010PUBLIC-000012"]}，${
                  this.state.json["36010PUBLIC-000013"]
                }${data.grid[this.tableId].pageInfo.total}${
                  this.state.json["36010PUBLIC-000014"]
                }`
              }); /* 国际化处理： 查询成功,共有,条数据*/
            }
          }
        } else {
          this.props.editTable.setTableData(this.tableId, {
            rows: []
          });
        }
      }
    });
  });
}

/**
 * 查询处理返回的数据
 * @param {*} props     页面内置对象
 * @param {*} data      返回的res.data
 */
export function handelResData(props, data) {
  // 预置数据不可操作
  let preSysRows = data.grid[this.tableId].rows.map(
    e => e.values[this.sysMark].value
  );
  let sysIndex = [];
  for (let i = 0; i < preSysRows.length; i++) {
    if (preSysRows[i] === true) {
      sysIndex.push(i);
    }
  }
  if (sysIndex.length !== 0) {
    this.props.editTable.setEditableRowByIndex(this.tableId, sysIndex, false);
    this.props.editTable.setCheckboxDisabled(this.tableId, sysIndex, false);
  }
  this.props._afterSetTable && this.props._afterSetTable.call(this, data); // 渲染表格后事件

  selectedEvent.call(this, props);
}

/*JpD/xxUF7kRjUmMTnAwcgjYHE9fhMBwtiZKrHA0EmC8FckcWMIWPJZr7zzY6nB6t*/