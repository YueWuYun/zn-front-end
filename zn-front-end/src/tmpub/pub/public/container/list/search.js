/*w/8iNiAH+zj8WJF4+Br6+hKdGDAof9HPKN2+vymi+iI3tF0G8PLm4teGOaiBQKxH*/
/**
 * 基础档案列表卡片 查询按钮事件
 * @author dongyue7
 */

import { ajax, toast } from "nc-lightapp-front";

/**
 * 点击查询，获取查询区数据
 * @param {*} props           页面内置对象
 * @param {*} condition       查询条件
 */
export function searchBtnOperation(
  props,
  condition,
  type,
  querycondition,
  callback
) {
  //查询区域查询条件
  if (!condition) {
    condition = props.search.getAllSearchData(this.searchId);
    if (!condition) {
      return;
    }
  }
  let pageInfo = props.table.getTablePageInfo(this.tableId);
  let searchdata = {
    querycondition: condition,
    custcondition: {},
    pageInfo: pageInfo,
    pagecode: this.list.pageCode,
    queryAreaCode: this.searchId, //查询区编码
    oid: this.list.searchOid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
    querytype: "tree"
  };
  getListData.call(this, this.javaUrl.list, searchdata, callback);
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
  this.setState({ showToast: false });
  ajax({
    url: `${this.baseUrl}${this.javaUrl.pks}.do`,
    data: { pks, pageCode: this.pageId },
    success: res => {
      listRender.call(this, res);
    },
    error: res => {
      toast({ color: "danger", content: res.message });
      listRender.call(this, { success: false });
    }
  });
}

/**
 * 请求列表接口
 * @param {*} path       接口地址
 * @param {*} data       数据
 * @param {*} callback   请求成功回调函数
 */
function getListData(path, data, callback) {
  ajax({
    url: `${this.baseUrl}${path}.do`,
    data,
    success: res => {
      listRender.call(this, res);
      callback && callback();
    },
    error: () => {
      listRender.call(this, { success: false });
    }
  });
}

/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 */
function listRender(res) {
  let { success, data } = res;
  if (success && data && data.grid && data.grid[this.tableId]) {
    let preSysRows = data.grid[this.tableId].rows.map(
      e => e.values.advanceddata.value
    );
    let sysIndex = [];
    for (let i = 0; i < preSysRows.length; i++) {
      if (preSysRows[i] === true) {
        sysIndex.push(i);
      }
    }
    this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
    this.selectedEvent.call(this, this.props);
    if (this.state.showToast) {
      toast({
        color: "success",
        content: `${this.state.json["36010PUBLIC-000012"]}，${
          this.state.json["36010PUBLIC-000013"]
        }${data.grid[this.tableId].pageInfo.total}${
          this.state.json["36010PUBLIC-000014"]
        }。`
      }); /* 国际化处理： 查询成功,共有,条数据*/
    }
  } else {
    this.props.table.setAllTableData(this.tableId, { rows: [] });
  }
}

/*w/8iNiAH+zj8WJF4+Br6+hKdGDAof9HPKN2+vymi+iI3tF0G8PLm4teGOaiBQKxH*/