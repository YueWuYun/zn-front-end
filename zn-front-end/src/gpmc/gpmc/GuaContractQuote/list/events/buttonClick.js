/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { promptBox, toast, print, output } from "nc-lightapp-front";
import {
  card,
  printData,
  baseReqUrl,
  javaUrl,
  moduleId,
  OPR_NAME
} from "../../cons/constant.js";
import { BusinessHeadOperator, api } from "./BusinessOperator";
import { searchBtnClick } from "./search";
import { BusinessInnerOperator } from "./BusinessOperator";
/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function buttonClick(props, id) {
  let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
  if (!["Add", "Refresh", "Copy"].includes(id) && !selectDatas.length) {
    //非新增刷新按钮时要判断是否已勾选数据
    toast({
      color: "warning",
      content: this.state.json["36620GBM-000042"]
    }); /* 国际化处理： 请勾选数据!*/
    return;
  }
  let pks =
    selectDatas &&
    selectDatas.map(
      item =>
        item.data.values &&
        item.data.values[this.primaryId] &&
        item.data.values[this.primaryId].value
    );
  let pkMapTs = new Map();
  selectDatas &&
    selectDatas.map(item => {
      let pk = item.data.values[this.primaryId].value;
      let ts = item.data.values["ts"] && item.data.values["ts"].value;
      //主键与tsMap
      if (pk && ts) {
        pkMapTs.set(pk, ts);
      }
    });
  switch (id) {
    //头部 新增
    case "Add":
      props.pushTo("/card", {
        status: "add",
        pagecode: this.card.pageCode
      });
      break;
    //头部 删除
    case "Delete":
      promptBox({
        color: "warning",
        title: this.state.json["36620GBM-000006"] /* 国际化处理： 删除*/,
        content:
          pks.length > 1
            ? this.state.json["36620GBM-000043"]
            : this.state.json[
                "36620GBM-000007"
              ] /* 国际化处理： 确定要删除所选数据吗?,确定要删除吗?*/,
        beSureBtnClick: 
          BusinessHeadOperator.bind(
            this,
            this.state.json["36620GBM-000006"],
            id,
            props,
            this.pageId,
            this.tableId,
            javaUrl.delete
          )/* 国际化处理： 删除：,删除成功！*/
        
      });
      break;
    //头部 附件
    case "File":
      fileMgr.call(this, props, selectDatas);
      break;
    case "Copy":
      if (!CopyMgr.call(this, selectDatas)) {
        break;
      }
      props.pushTo("/card", {
        status: "copy",
        id: pks[0],
        pagecode: this.card.pageCode
      });
      break;
    case "Commit_group":
      if (!IsChecked.call(this, selectDatas)) {
        //未选中数据就结束
        break;
      } else if (selectDatas.length === 1) {
        //单条数据执行
        BusinessInnerOperator.call(
          this,
          id,
          props,
          selectDatas[0].data.values,
          selectDatas[0].index,
          this.tableId,
          this.pageId,
          javaUrl.commit,
          this.state.json["36620GBM-000040"]
        ); /* 国际化处理： 提交成功！*/
      } else {
        //多选情况下执行的方法
        listOperation.call(
          this,
          Object.assign(
            {
              name: "commit",
              composite: true //提交即指派
            },
            {
              isMulti: true,
              data: { pks, pkMapTs }
            }
          )
        );
      }
      break;
    //头部 收回
    case "UnCommit":
      if (!IsChecked.call(this, selectDatas)) {
        //未选中数据就结束
        break;
      } else if (selectDatas.length === 1) {
        //单条数据执行
        BusinessInnerOperator.call(
          this,
          id,
          props,
          selectDatas[0].data.values,
          selectDatas[0].index,
          this.tableId,
          this.pageId,
          javaUrl.uncommit,
          this.state.json["36620GBM-000041"]
        ); /* 国际化处理： 收回成功！*/
      } else {
        //多选情况下执行的方法
        listOperation.call(
          this,
          Object.assign(
            {
              name: "uncommit",
              composite: true //提交即指派
            },
            {
              isMulti: true,
              data: { pks, pkMapTs }
            }
          )
        );
      }
      break;
    //头部 打印
    case "Print":
      print("pdf", `${baseReqUrl}${javaUrl.print}.do`, {
        ...printData,
        oids: pks
      });
      break;
    //头部 输出
    case "Output":
      output({
        url: `${baseReqUrl}${javaUrl.print}.do`,
        data: {
          ...printData,
          oids: pks,
          outputType: "output"
        }
      });
      break;
    //头部 刷新
    case "Refresh":
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
      break;
    //联查担保合同
    case "Linkdbht":
    //联查外贷合同
    case "Linkwdht":
    //联查发债契约
    case "Linkfzqy":
    //联查授信协议
    case "Linksxxy":
      linkcommon.call(this, props, id);
      break;
    //联查审批详情
    case "linkaprv":
      linkApproveMessage.call(this, props);
      break;
    default:
      break;
  }
}

/**
 * 列表头部按钮操作
 *
 * @param {*} name - 操作名称
 * @param {*} data - 请求数据
 * @param {*} params - 自定义参数
 */
function listHeadBtnOper(name, data, params) {
  let pdata = data;
  let { successBefore, successAfter } = params;
  const langData = this.props.MultiInit.getLangData(moduleId);
  api.call(this, {
    name,
    data: pdata,
    success: res => {
      let { success, data } = res;
      if (success) {
        if (successBefore) {
          successBefore(res);
        } else if (data) {
          //提交即指派
          if (
            params.composite &&
            res.data.workflow &&
            (res.data.workflow == "approveflow" ||
              res.data.workflow == "workflow")
          ) {
            this.setState({
              compositedata: res.data,
              compositedisplay: true,
              curPk: pdata.pks
            });
          } else {
            if (typeof data.successNum === "undefined") {
              toast({
                color: "success",
                content: `${this.state.json[OPR_NAME[name]]}${
                  this.state.json["36620GBM-000032"]
                }`
              }); /* 国际化处理： 成功*/
              getListData.call(this);
            } else {
              multiToast.call(this, name, OPR_NAME, data); //批量提示
              //批量删除缓存中数据
              if (name === "delete") {
                let deletePks =
                  data.data && data.data.filter(item => item.state === "0"); //删除成功
                deletePks = deletePks && deletePks.map(item => item.pk);
                if (deletePks.length > 0) {
                  let allTableData = this.props.table.getAllTableData(
                    this.tableId
                  );
                  let allPks =
                    allTableData.rows[0] &&
                    allTableData.rows.map(
                      item => item.values[this.primaryId].value
                    );
                  let deleteRowIndexArr = deletePks
                    .map(item => allPks.findIndex(v => v == item))
                    .filter(item => item != -1);
                  this.props.table.deleteCacheId(this.tableId, deletePks);
                  this.props.table.deleteTableRowsByIndex(
                    this.tableId,
                    deleteRowIndexArr
                  );
                }
              } else {
                searchBtnClick.call(this, this.props, null, null, null, false);
              }
            }
          }
          successAfter && successAfter(res);
        }
      }
    }
  });
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
function multiToast(name, OPR_NAME, data = {}) {
  //这里换成自己接口返回的字段名
  const langData = this.props.MultiInit.getLangData(this.appCode);
  let { successNum, errorNum, total, msg, msgDetail } = data;
  let content = `${this.state.json["36620GBM-000030"]}${
    this.state.json[OPR_NAME[name]]
  }${total}${this.state.json["36620GBM-000031"]}，${
    this.state.json["36620GBM-000032"]
  }${successNum}${this.state.json["36620GBM-000033"]}，${
    this.state.json["36620GBM-000034"]
  }${errorNum}${
    this.state.json["36620GBM-000035"]
  }`; /* 国际化处理： 共,条,成功,条,失败,条*/
  if (successNum == total) {
    //全部成功
    toast({
      color: "success",
      title: `${this.state.json[OPR_NAME[name]]}${
        this.state.json["36620GBM-000049"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true
    });
  } else if (errorNum == total) {
    //全部失败
    toast({
      color: "danger",
      title: `${this.state.json[OPR_NAME[name]]}${
        this.state.json["36620GBM-000049"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.json["36620GBM-000036"],
        this.state.json["36620GBM-000037"],
        this.state.json["36620GBM-000038"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  } else if (successNum < total) {
    //部分失败
    toast({
      color: "danger",
      title: `${this.state.json[OPR_NAME[name]]}${
        this.state.json["36620GBM-000049"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.json["36620GBM-000036"],
        this.state.json["36620GBM-000037"],
        this.state.json["36620GBM-000038"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  }
}

export function listOperation({
  name,
  isMulti = false,
  data,
  checkOne = false,
  ...other
}) {
  data = { pageCode: this.pageId, ...data };
  //批量操作
  listHeadBtnOper.call(this, name, data, other);
}

export function buttonDisabled() {
  let selected = this.props.table.getCheckedRows(this.tableId);
  let btnArray = [
    "Copy",
    "Delete",
    "Commit_group",
    "UnCommit",
    "File",
    "Print",
    "Output",
    "Linkdbht",
    "Linkwdht",
    "Linkfzqy",
    "Linksxxy",
    "linkaprv"
  ];
  let btnObj = {};
  for (let item of btnArray) {
    btnObj[item] = !selected.length;
  }
  if (selected.length) {
    let vbillstatus =
      selected[0] &&
      selected[0].data &&
      selected[0].data.values.vbillstatus.value;
    let datasource =
      selected[0] &&
      selected[0].data &&
      selected[0].data.values.datasource.value;
    let guacontractid =
      selected[0] &&
      selected[0].data &&
      selected[0].data.values.guacontractid.value;
    let sourcesystypecode =
      selected[0] &&
      selected[0].data &&
      selected[0].data.values.sourcesystypecode.value;
    (btnObj.Linkdbht = !guacontractid), //联查担保合同
      (btnObj.Linkwdht = sourcesystypecode !== "3663"), //联查外贷合同
      (btnObj.Linkfzqy = sourcesystypecode !== "3665"), //联查发债契约
      (btnObj.Linksxxy = sourcesystypecode !== "3661"), //联查授信协议
      (btnObj.linkaprv = vbillstatus === "-1");
    btnObj.Delete = datasource === "2"; //融资生成的不可以删除操作
  }
  this.props.button.setButtonDisabled(btnObj);
}

/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
function fileMgr(props, selectDatas) {
  //判断是否有选中行
  if (!selectDatas || !selectDatas.length || selectDatas.length > 1) {
    toast({
      color: "warning",
      content: this.state.json["36620GBM-000044"]
    }); /* 国际化处理： 请选中一行数据！*/
    return;
  }
  let billNo =
    selectDatas[0] &&
    selectDatas[0].data &&
    selectDatas[0].data.values &&
    selectDatas[0].data.values["vbillno"] &&
    selectDatas[0].data.values["vbillno"].value;
  let billId =
    selectDatas[0] &&
    selectDatas[0].data &&
    selectDatas[0].data.values &&
    selectDatas[0].data.values[this.primaryId] &&
    selectDatas[0].data.values[this.primaryId].value;
  this.setState({
    showUploader: !this.state.showUploader,
    billInfo: { billId, billNo }
  });
}
function CopyMgr(selectDatas) {
  //判断是否有选中行
  if (!selectDatas || !selectDatas.length) {
    toast({
      color: "warning",
      content: this.state.json["36620GBM-000044"]
    }); /* 国际化处理： 请选中一行数据！*/
    return false;
  } else {
    return true;
  }
}

function checkSelectedData(selectData) {
  if (selectData.length == 0) {
    toast({
      content: this.state.json["36620GBM-000045"],
      color: "warning"
    }); /* 国际化处理： 请选择数据！*/
    return false;
  } else {
    return true;
  }
}

/**
 * 联查担保合同
 * @param {*} props
 */
function linkcommon(props, linktype) {
  let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
  let guacontractid =
    selectDatas[0] &&
    selectDatas[0].data &&
    selectDatas[0].data.values &&
    selectDatas[0].data.values["guacontractid"] &&
    selectDatas[0].data.values["guacontractid"].value;
  let pk_srcbill =
    selectDatas[0] &&
    selectDatas[0].data &&
    selectDatas[0].data.values &&
    selectDatas[0].data.values["pk_srcbill"] &&
    selectDatas[0].data.values["pk_srcbill"].value;
    let variety_category =
    selectDatas[0] &&
    selectDatas[0].data &&
    selectDatas[0].data.values &&
    selectDatas[0].data.values["variety_category"] &&
    selectDatas[0].data.values["variety_category"].value;

  switch (linktype) {
    case "Linkdbht": //联查担保合同
      props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/card", {
        appcode: "36620GC",
        pagecode: "36620GCL_CARD",
        scene: "linksce_card",
        status: "browse",
        id: guacontractid,
        signal: "GuaContractQuote"
      });
      break;
    case "Linkwdht": //联查外贷合同
      if(variety_category == 'DELEGATION_LOAN'){
        props.openTo("/cdmc/ccm/debitcontract/main/index.html#/card", {
            status: "browse",
            appcode: "366305CDC",
            pagecode: "366305CDCL_CARD",
            scene: "linksce",
            id: pk_srcbill
        });
      }else{
          props.openTo("/cdmc/cdm/contract/main/index.html#/card", {
              status: "browse",
              appcode: "36630BLC",
              pagecode: "36630BLCL_CARD",
              scene: "linksce",
              id: pk_srcbill
          });
      }
      break;
    case "Linkfzqy": //联查发债契约
      props.openTo("/bond/bond/contract/main/index.html#/card", {
        status: "browse",
        appcode: "36650BC",
        pagecode: "36650BCL_CARD",
        scene: "linksce",
        id: pk_srcbill
      });
      break;
    case "Linksxxy": //联查授信协议
      props.openTo("/ccc/ccc/bankprotocol/main/index.html#/list", {
        status: "browse",
        appcode: "36610CC",
        pagecode: "36610CC_Link",
        scene: "linksce",
        id: pk_srcbill
      });
      break;
  }
  return;
}

/**
 * 判断是否有选中行
 * @param {*} selectDatas
 */
function IsChecked(selectDatas) {
  //判断是否有选中行
  if (!selectDatas || !selectDatas.length) {
    toast({
      color: "warning",
      content: this.state.json["36620GBM-000044"]
    }); /* 国际化处理： 请选中一行数据！*/
    return false;
  } else {
    return true;
  }
}

/**
 * 联查审批详情
 * @param {*} props
 */
function linkApproveMessage(props) {
  let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
  let billId =
    selectDatas[0] &&
    selectDatas[0].data &&
    selectDatas[0].data.values &&
    selectDatas[0].data.values[this.primaryId] &&
    selectDatas[0].data.values[this.primaryId].value;
  this.setState({
    billId: billId, //单据pk
    showAppr: true
  });
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/