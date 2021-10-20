/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { ajax, toast } from "nc-lightapp-front";
import { baseReqUrl, card, javaUrl,sagaCheck,PK_CODE,TABLE_CODE } from "../../cons/constant.js";
import { searchBtnClick } from "./search";
import { sagaApi } from "../../../../public/utils";

/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 * @param {*} index   当前单据的行下标
 */
export function bodyButtonClick(key, record, index) {
  let list = [
    {
      data: {
        values: record
      },
      index
    }
  ];
  switch (key) {
    case "edit": //修改
      editOperation.call(this,{pk:record[this.primaryId].value,
                status:"edit"});
      break;
    case "change": //变更
      editOperation.call(this,{pk:record[this.primaryId].value,
            status:"change"});
      break;
    case "delversion": //删除历史版本
      bodyBtnOperation.call(
        this,
        list,
        javaUrl.delversion,
        this.state.json["36620GP-000038"]
      ); /* 国际化处理： 删除历史版本成功!*/
      break;
    case "delete": //删除
      let version = record.version && record.version.value;
      bodyBtnOperation.call(
        this,
        list,
        javaUrl[version > 1 ? "delversion" : "delete"],
        version > 1
          ? this.state.json["36620GP-000006"]
          : this.state.json["36620GP-000011"]
      ); /* 国际化处理： 删除历史版本,删除成功!*/
      break;
    case "commit": //提交
      bodyBtnOperation.call(
        this,
        list,
        javaUrl.commit,
        this.state.json["36620GP-000002"]
      ); /* 国际化处理： 提交成功!*/

      break;
    case "uncommit": //收回
      bodyBtnOperation.call(
        this,
        list,
        javaUrl.uncommit,
        this.state.json["36620GP-000014"]
      ); /* 国际化处理： 收回成功!*/
      break;
    case "start": //启用
      bodyBtnOperation.call(
        this,
        list,
        javaUrl.start,
        this.state.json["36620GP-000015"]
      ); /* 国际化处理： 启用成功!*/
      break;
    case "stop": //停用
      bodyBtnOperation.call(
        this,
        list,
        javaUrl.stop,
        this.state.json["36620GP-000016"]
      ); /* 国际化处理： 停用成功!*/
      break;
    default:
      break;
  }
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
 *修改 变更逻辑厝里
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
export function editOperation(params) {
    let { pk, status } = params;
    let data = { pk:pk, fieldPK: PK_CODE, tableName:TABLE_CODE};
    sagaApi.call(this, {
        data: data,
        success: res => {
            this.props.pushTo("/card", {
                status: status,
                id: pk,
                pagecode: card.pageCode
            });
        }
    })  
}

/**
 * 按钮交互
 * @param {*} data         数据
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 * @param {*} isBatch      是否是批量操作
 * @param {*} userObj      提交即指派使用
 * @param {*} opername     为批量操作提示语准备
 */
export function bodyBtnOperation(
  list,
  path,
  content,
  isBatch = false,
  userObj = null,
  opername
) {
  if (isBatch && !list.length) {
    toast({
      color: "warning",
      content: this.state.json[
        "36620GP-000039"
      ] /* 国际化处理： 请选择至少一条数据!*/
    });
    return;
  }
  let data = {
    pageCode: this.pageId,
    pks: [],
    pkMapTs: new Map()
  };
  let indexArr = [],
    pkMapRowIndex = new Map();
  for (let item of list) {
    let pk =
      item.data.values[this.primaryId] &&
      item.data.values[this.primaryId].value;
    let ts = item.data.values.ts && item.data.values.ts.value;
    let index = item.index && item.index.value;
    indexArr.push(index);
    data.pks.push(pk);
    if (pk && ts) {
      data.pkMapTs.set(pk, ts);
      pkMapRowIndex.set(pk, index);
    }
  }

  if (userObj) {
    data.userObj = userObj;
  }
  ajax({
    url: `${baseReqUrl}${path}.do`,
    data,
    success: res => {
      if (res.success) {
        if (path === javaUrl.delete) {
          let deleteRowIndexArr = [];
          let deleteRowPksArr = [];
          let {
            msg, // 返回的信息
            failNum, // 失败的数量
            successNum, // 成功的数量
            total, // 总条数
            status, // 状态
            msgDetail, 
            errormessages,
            billCards
          } = res.data;
          if (status == "0") {
            deleteRowPksArr = data.pks;
            deleteRowIndexArr = indexArr;
          } else if (status == "2") {
            if (billCards) {
              res.data.billCards.forEach(value => {
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
                  "36620GP-000011"
                ] /* 国际化处理： 删除成功！*/
              });
            } else {
              toast({
                color: "danger",
                content: (errormessages && errormessages[0]) || (msgDetail && msgDetail[0])
              });
            }
          } else {
            multiToast.call(
              this,
              this.state.json["36620GP-000007"],
              res.data
            ); /* 国际化处理： 删除*/
          }
          this.props.table.deleteCacheId(this.tableId, deleteRowPksArr);
          this.props.table.deleteTableRowsByIndex(
            this.tableId,
            deleteRowIndexArr
          );
        } else if (path === javaUrl.commit && !isBatch) {
          if (
            res.data.workflow &&
            ["approveflow", "workflow"].includes(res.data.workflow)
          ) {
            this.setState({
              compositedisplay: true, //是否显示指派弹窗
              compositedata: res.data, //指派信息
              selectDatas: [list[0]]
            });
          } else {
            this.setState({
              compositedisplay: false, //是否显示指派弹窗
              compositedata: null, //指派信息
              selectDatas: []
            });
            toast({
              color: "success",
              content: this.state.json[
                "36620GP-000002"
              ] /* 国际化处理： 提交成功!*/
            });
            let row = res.data.head[this.tableId].rows[0];
            let updateDataArr = [
              {
                index: list[0].index,
                data: { values: row.values }
              }
            ];
            this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
          }
        } else if (path === javaUrl.uncommit && !isBatch) {
          this.setState({
            compositedisplay: false, //是否显示指派弹窗
            compositedata: null, //指派信息
            selectDatas: []
          });
          toast({
            color: "success",
            content: this.state.json[
              "36620GP-000014"
            ] /* 国际化处理： 收回成功!*/
          });
          let row =
            path === javaUrl.delversion
              ? res.data.billCards[0].head[this.tableId].rows[0]
              : res.data.head[this.tableId].rows[0];
          let updateDataArr = [
            {
              index: list[0].index,
              data: { values: row.values }
            }
          ];
          this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
        } else {
          toast({
            color: "success",
            content: this.state.json["36620GP-000055"] /* 国际化处理： 成功!*/
          });
          let row =
            path === javaUrl.delversion
              ? res.data.billCards[0].head[this.tableId].rows[0]
              : res.data.head[this.tableId].rows[0];
          let updateDataArr = [
            {
              index: list[0].index,
              data: { values: row.values }
            }
          ];
          this.props.table.updateDataByIndexs(this.tableId, updateDataArr);
        }
        // 删除之后 触发重新查询操作
        searchBtnClick.call(this, this.props, null, null, undefined, false);
      }
    }
  });
}

/**
 * 接口返回批量提示
 *
 * @param {*} name - 操作名称 提交、收回、删除
 * @param {*} data - 接口返回数据
 */
function multiToast(name, data = {}) {
  //这里换成自己接口返回的字段名
  let { successNum, failNum, total, msg, msgDetail,errormessages} = data;
  let content = `${this.state.json["36620GP-000053"]}${name}${total}${
    this.state.json["36620GP-000054"]
  }，${this.state.json["36620GP-000055"]}${successNum}${
    this.state.json["36620GP-000056"]
  }，${this.state.json["36620GP-000057"]}${failNum}${
    this.state.json["36620GP-000058"]
  }`; /* 国际化处理： 共,条,成功,条,失败,条*/
  if (successNum == total) {
    //全部成功
    toast({
      duration: 5,
      color: "success",
      title: `${name}${
        this.state.json["36620GP-000052"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true
    });
  } else if (failNum == total) {
    //全部失败
    toast({
      duration: "infinity",
      color: "danger",
      title: `${name}${
        this.state.json["36620GP-000052"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.json["36620GP-000049"],
        this.state.json["36620GP-000050"],
        this.state.json["36620GP-000051"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail || errormessages //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  } else if (successNum < total) {
    //部分失败
    toast({
      duration: "infinity",
      color: "danger",
      title: `${name}${
        this.state.json["36620GP-000052"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.json["36620GP-000049"],
        this.state.json["36620GP-000050"],
        this.state.json["36620GP-000051"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail || errormessages  //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  }
}

/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/