/*YuO8szH0cVixePu/Bt+mGy/a9mCJvO6wjPMZzNenbQKYYnyHEsxKrIFJORaMvOg6*/
import { ajax, toast, cardCache } from "nc-lightapp-front";
import { LIST, API_URL, searchCache } from "../../cons/constant.js";
let { setDefData, getDefData } = cardCache;
//点击查询，获取查询区数据
export function searchBtnClick(props, condition, type, querycondition) {
  //查询区域查询条件
  let pageInfo = this.props.table.getTablePageInfo(this.tableId);
  let searchdata = this.props.search.getQueryInfo(this.searchId);
  let rateclass = 0;
  if (this.pageType === "group") {
    rateclass = 1;
  } else if (this.pageType === "global") {
    rateclass = 2;
  }
  pageInfo.pageIndex = 0;
  searchdata.pageCode = this.pageId;
  searchdata.pageInfo = pageInfo;
  condition.conditions.push({
    field: "rateclass",
    value: {
      firstvalue: rateclass,
      secondvalue: null
    },
    oprtype: "=",
    display: null
  });
  searchdata.querycondition = condition;
  //将查询条件放入缓存中
  setDefData(searchCache.key, searchCache.dataSource, condition);
  ajax({
    url: API_URL.queryList,
    data: searchdata,
    success: res => {
      let { success, data } = res;
      if (success) {
        if (data && data.grid && data.grid[this.tableId].pageInfo.total > 0) {
          data.grid &&
            toast({
              color: "success",
              content: `${this.state.json["36010IR-000066"]}，${
                this.state.json["36010IR-000067"]
              }${data.grid[this.tableId].pageInfo.total}${
                this.state.json["36010IR-000068"]
              }。`
            }); /* 国际化处理： 查询成功,共有,条数据*/
          listRender.call(this, res);
        } else {
          toast({
            color: "warning",
            content: this.state.json["36010IR-000065"]
          }); /* 国际化处理： 未查询出符合条件的数据！*/
          this.props.table.setAllTableData(this.tableId, { rows: [] });
        }
      }
    }
  });
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
  ajax({
    url: API_URL.queryListPks,
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
 * @param {*} condition  自定义查询条件
 * @param {*} callback   请求成功毁掉函数
 */
export function getListData(path, condition, callback) {
  let cacheCondition = getDefData(searchCache.key, searchCache.dataSource);
  let pageInfo = this.props.table.getTablePageInfo(this.tableId);
  let searchdata = this.props.search.getQueryInfo(this.searchId);
  searchdata.querycondition = cacheCondition;
  searchdata.pageCode = this.pageId;
  searchdata.pageInfo = pageInfo;
  if (condition) {
    searchdata.custcondition = {
      logic: "and", //逻辑操作符，and、or
      conditions: condition
    };
  }
  ajax({
    url: path,
    data: searchdata,
    success: res => {
      listRender.call(this, res);
      callback && callback();
    },
    error: res => {
      toast({ color: "danger", content: res.message });
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
    this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
  }
}

/*YuO8szH0cVixePu/Bt+mGy/a9mCJvO6wjPMZzNenbQKYYnyHEsxKrIFJORaMvOg6*/