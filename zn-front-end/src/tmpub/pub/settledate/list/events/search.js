/*w/8iNiAH+zj8WJF4+Br6+hKdGDAof9HPKN2+vymi+iI3tF0G8PLm4teGOaiBQKxH*/
import { ajax, toast } from "nc-lightapp-front";
import { list, baseReqUrl, javaUrl } from "../../cons/constant.js";

/**
 * 点击查询，获取查询区数据
 * @param {*} props           页面内置对象
 * @param {*} condition       大家查一下文档，没细看
 * @param {*} props           ...
 * @param {*} condition       ...
 * @param {*} callback        请求成功回调函数
 */
export function searchBtnClick(
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
    pagecode: list.pageCode,
    queryAreaCode: this.searchId, //查询区编码
    oid: list.searchOid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
    querytype: "tree"
  };
  getListData.call(this, javaUrl.list, searchdata, callback);
}

/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function(groupKey) {
  let groupCondition;
  switch (groupKey) {
    //待提交
    case 0:
      groupCondition = {
        field: "billstatus",
        value: {
          firstvalue: 1,
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //待经办
    case 1:
      groupCondition = {
        field: "billstatus",
        value: {
          firstvalue: 0,
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //待审批
    case 2:
      groupCondition = {
        field: "vbillstatus",
        value: {
          firstvalue: 2,
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //待支付
    case 3:
      groupCondition = {
        field: "billstatus",
        value: {
          firstvalue: 3,
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //支付中
    case 4:
      groupCondition = {
        field: "billstatus",
        value: {
          firstvalue: 4,
          secondvalue: null
        },
        oprtype: "="
      };
      break;
    //全部
    case 5:
      groupCondition = {};
      break;
    //默认作为全部处理
    default:
      groupCondition = {};
      break;
  }
  return groupCondition;
};

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
  this.setState({ showToast: false });
  ajax({
    url: `${baseReqUrl}${javaUrl.pks}.do`,
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
    url: `${baseReqUrl}${path}.do`,
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
    this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
    if (this.state.showToast) {
      toast({
        color: "success",
        content: `查询成功，共有${
          data.grid[this.tableId].pageInfo.total
        }条数据。`
      });
    }
  } else {
    this.props.table.setAllTableData(this.tableId, { rows: [] });
  }
}

/*w/8iNiAH+zj8WJF4+Br6+hKdGDAof9HPKN2+vymi+iI3tF0G8PLm4teGOaiBQKxH*/