/*cmiYx0pAPEwnseRzxuPOzh+A78ww0eLRUOaUbcn2wu9o1KS2zudsx1dxjJVQIffy*/
import { toast, ajax, cardCache } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant.js";
import { searchBtnClick } from "./search";
let { getNextId, deleteCacheById } = cardCache;

/**
 * 列表头部按钮业务操作
 * @param {*} opername 操作名称
 * @param {*} opercode 操作编码
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格编码
 * @param {*} pkName 主键字段名
 * @param {*} url 请求地址
 * @param {*} successMess 成功提示语
 * @param {*} datasource 区域缓存标识
 * @param {*} showTBB 是否提示预算信息
 * @param {*} extParam 拓展参数
 * @param {*} callback 回调
 *
 */
export function BusinessHeadOperator(
  opername,
  opercode,
  props,
  pageCode,
  tableCode,
  url,
  successMess,
  datasource,
  showTBB,
  extParam,
  callback,
  submitdata
) {
  let selectDatas = props.table.getCheckedRows(tableCode);
  let pkName = "pk_guacontractquote";
  let pkMapTs = new Map();
  let pkMapRowIndex = new Map();
  let pk, ts, vbillno;
  let pks = [];
  if (!extParam) {
    extParam = {};
  }
  let index = 0;
  while (index < selectDatas.length) {
    //获取行主键值
    pk =
      selectDatas[index] &&
      selectDatas[index].data &&
      selectDatas[index].data.values &&
      selectDatas[index].data.values[pkName] &&
      selectDatas[index].data.values[pkName].value;
    //获取行ts时间戳
    ts =
      selectDatas[index] &&
      selectDatas[index].data &&
      selectDatas[index].data.values &&
      selectDatas[index].data.values.ts &&
      selectDatas[index].data.values.ts.value;
    //主键与行号Map
    pkMapRowIndex.set(pk, selectDatas[index].index);
    //主键与tsMap
    if (pk && ts) {
      pkMapTs.set(pk, ts);
    }
    pks.push(pk);
    index++;
  }
  let data;
  if (selectDatas.length == 0) {
    pkMapTs.set(this.pk, new Date());
    data = {
      pks,
      pkMapTs,
      pageCode,
      extParam
    };
  } else {
    data = {
      pks,
      pkMapTs,
      pageCode,
      extParam
    };
  }
  ajax({
    url: `${baseReqUrl}${url}.do`,
    data,
    success: res => {
      let result;
      if (res.data && res.data.billCards && res.data.billCards) {
        result = res.data.billCards;
      }
      if (opercode == "Delete") {
        // 删除操作
        let deleteRowIndexArr = [];
        let deleteRowPksArr = [];
        let {
          msg, // 返回的信息
          failNum, // 失败的数量
          successNum, // 成功的数量
          total, // 总条数
          status, // 状态
          billCards
        } = res.data;
        if (status == "0") {
          deleteRowPksArr = data.pks;
          for (let value of pkMapRowIndex.values()) {
            deleteRowIndexArr.push(value);
          }
        } else if (status == "2") {
          if (billCards) {
            billCards.forEach(value => {
              let pk =
                value.head[this.tableId].rows[0].values[this.primaryId].value;
              deleteRowPksArr.push(pk);
              deleteRowIndexArr.push(pkMapRowIndex.get(pk));
            });
          }
        }
        if (total === "1") {
          if (status == "0") {
            toast({
              color: "success",
              content: this.state.json[
                "36620GC-000032"
              ] /* 国际化处理： 删除成功！*/
            });
          } else {
            toast({
              color: "danger",
              content: this.state.json[
                "36620GC-000092"
              ] /* 国际化处理： 删除失败！*/
            });
          }
        }
        this.props.table.deleteCacheId(this.tableId, deleteRowPksArr);
        this.props.table.deleteTableRowsByIndex(
          this.tableId,
          deleteRowIndexArr
        );
      } else {
        if (res.data.status == "0" || res.data.status == "2") {
          if (result) {
            result.forEach(vale => {
              let pk =
                vale.head[tableCode].rows[0].values.pk_guacontractquote.value;
              let updateDataArr = [
                {
                  index: pkMapRowIndex.get(pk),
                  data: { values: vale.head[tableCode].rows[0].values }
                }
              ];
              props.table.updateDataByIndexs(tableCode, updateDataArr);
            });
          }
        }
      }
      PromptMessage.call(this, res, opername);
    }
  });
}

/**
 * 按钮接口操作 需要使用call调用。调用的接口需要在constant.js中定义
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
export function api(params) {
  let { name, data, success, error } = params;
  let path = javaUrl[name];
  ajax({
    url: `${baseReqUrl}${path}.do`,
    data,
    success: res => {
      success && success(res);
    }
  });
}

/**
 * 列表内部按钮业务操作
 * @param {*} opername 操作名称
 * @param {*} opercode 操作编码
 * @param {*} props 页面内置对象
 * @param {*} pageCode 页面编码
 * @param {*} tableCode 表格编码
 * @param {*} url 请求地址
 * @param {*} successMess 成功提示语
 * @param {*} datasource 区域缓存标识
 *
 */
export function BusinessInnerOperator(
  opercode,
  props,
  record,
  index,
  tableCode,
  pageCode,
  url,
  successMess,
  userObj = null
) {
  let pk = record.pk_guacontractquote.value;
  let ts = record.ts.value;
  let pkMapTs = new Map();
  pkMapTs.set(pk, ts);
  this.submitpk = pk;
  this.submitindex = index;
  this.operarea = "inner";
  let data = {
    ts,
    pks: [pk],
    pageCode
  };
  if (userObj) {
    data.userObj = userObj;
  }
  ajax({
    url: `${baseReqUrl}${url}.do`,
    data,
    success: res => {
      if (opercode === "commit") {
        if (
          res.data.workflow &&
          ["approveflow", "workflow"].includes(res.data.workflow)
        ) {
          this.setState({
            compositedisplay: true, //是否显示指派弹窗
            compositedata: res.data, //指派信息
            pks: [pk],
            record,
            index
          });
        } else {
          this.setState({
            compositedisplay: false,
            compositedata: null,
            pks: [],
            record: null,
            index: null
          });
          let updateDataArr = [
            {
              index: index,
              data: { values: res.data.head[tableCode].rows[0].values }
            }
          ];
          props.table.updateDataByIndexs(tableCode, updateDataArr);
          toast({ color: "success", content: successMess });
          searchBtnClick.call(
            this,
            props,
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            true
          );
        }
      } else if (opercode == "delete") {
        toast({ color: "success", content: successMess });
        //删除时，删除前台数据
        props.table.deleteCacheId(tableCode, pk);
        props.table.deleteTableRowsByIndex(tableCode, index);
      } else {
        toast({ color: "success", content: successMess });
        let updateDataArr = [
          {
            index: index,
            data: { values: res.data.head[tableCode].rows[0].values }
          }
        ];
        props.table.updateDataByIndexs(tableCode, updateDataArr);
        searchBtnClick.call(
          this,
          props,
          undefined,
          undefined,
          undefined,
          undefined,
          true,
          true
        );
      }
    }
  });
}

function PromptMessage(res, opername) {
  let { status, msg } = res.data;
  let content;
  let total = res.data.total;
  let successNum = res.data.successNum;
  let failNum = res.data.failNum;
  content =
    this.state.json["36620GBM-000030"] +
    opername +
    total +
    this.state.json["36620GBM-000031"]; /* 国际化处理： 共,条，*/
  content =
    content +
    this.state.json["36620GBM-000032"] +
    successNum +
    this.state.json["36620GBM-000033"]; /* 国际化处理： 成功,条 ,*/
  content =
    content +
    this.state.json["36620GBM-000034"] +
    failNum +
    this.state.json["36620GBM-000035"]; /* 国际化处理： 失败,条*/
  let errMsgArr = res.data.errormessages;
  //全部成功
  if (status == 0) {
    toast({
      color: "success",
      title: opername + msg,
      content: content,
      TextArr: [
        this.state.json["36620GBM-000036"],
        this.state.json["36620GBM-000037"],
        this.state.json["36620GBM-000038"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperation: true
    });
  }
  //全部失败
  else if (status == 1) {
    toast({
      color: "danger",
      title: opername + msg,
      content: content,
      TextArr: [
        this.state.json["36620GBM-000036"],
        this.state.json["36620GBM-000037"],
        this.state.json["36620GBM-000038"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperation: true,
      groupOperationMsg: errMsgArr
    });
  }
  //部分成功
  else if (status == 2) {
    toast({
      color: "danger",
      title: opername + msg,
      content: content,
      TextArr: [
        this.state.json["36620GBM-000036"],
        this.state.json["36620GBM-000037"],
        this.state.json["36620GBM-000038"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperation: true,
      groupOperationMsg: errMsgArr
    });
  }
}

/*cmiYx0pAPEwnseRzxuPOzh+A78ww0eLRUOaUbcn2wu9o1KS2zudsx1dxjJVQIffy*/