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
import { bodyBtnOperation, api } from "./bodyButtonClick";
import { searchBtnClick } from "./search";

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function buttonClick(props, id) {
  let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
  if (
    ["ApproveDetail", "Version", "Attachment"].includes(id) &&
    selectDatas.length > 1
  ) {
    toast({
      color: "warning",
      content: this.state.json["36620GC-000072"]
    }); /* 国际化处理： 请选中单条数据进行操作!*/
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
    case "Copy": //复制
      this.props.pushTo("/card", {
        status: "copy",
        id: pks[0],
        pagecode: this.card.pageCode
      });
      break;
    //头部 删除
    case "Delete":
      promptBox({
        color: "warning",
        title: this.state.json["36620GC-000028"] /* 国际化处理： 删除*/,
        content:
          pks.length > 1
            ? this.state.json["36620GC-000073"]
            : this.state.json[
                "36620GC-000030"
              ] /* 国际化处理： 确定要删除所选数据吗?,确定要删除吗?*/,
        beSureBtnClick: bodyBtnOperation.bind(
          this,
          selectDatas,
          javaUrl.delete,
          null,
          true,
          null,
          this.state.json["36620GC-000028"]
        ) /* 国际化处理： 删除*/
      });
      break;
    //头部 提交
    case "Commit_group":
      // bodyBtnOperation.call(this, selectDatas, javaUrl.commit, null, pks.length>1, null, this.state.json['36620GC-000074']);/* 国际化处理： 提交*/
      // break;

      if (!IsChecked.call(this, selectDatas)) {
        //未选中数据就结束
        break;
      } else if (selectDatas.length === 1) {
        //单条数据执行
        bodyBtnOperation.call(
          this,
          selectDatas,
          javaUrl.commit,
          this.state.json["36620GC-000002"]
        ); /* 国际化处理： 提交成功!*/
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
      // bodyBtnOperation.call(this, selectDatas, javaUrl.uncommit, null, true, null, this.state.json['36620GC-000075']);/* 国际化处理： 收回*/
      // break;
      if (!IsChecked.call(this, selectDatas)) {
        //未选中数据就结束
        break;
      } else if (selectDatas.length === 1) {
        //单条数据执行
        bodyBtnOperation.call(
          this,
          selectDatas,
          javaUrl.uncommit,
          this.state.json["36620GC-000035"]
        ); /* 国际化处理： 收回成功!*/
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
    //头部 终止
    case "Terminal_group":
      bodyBtnOperation.call(
        this,
        selectDatas,
        javaUrl.terminal,
        null,
        true,
        null,
        this.state.json["36620GC-000076"]
      ); /* 国际化处理： 终止*/
      break;
    //头部 取消终止
    case "UnTerminal":
      bodyBtnOperation.call(
        this,
        selectDatas,
        javaUrl.unterminal,
        null,
        true,
        null,
        this.state.json["36620GC-000077"]
      ); /* 国际化处理： 取消终止*/
      break;
    //头部 附件
    case "Attachment":
      fileMgr.call(this, props, selectDatas);
      break;
    //头部 审批详情
    case "ApproveDetail":
      this.billInfo = { billId: pks[0] };
      this.setState({ showApproveDetail: true });
      break;
    //头部 历史版本
    case "Version":
      props.pushTo("/card", {
        status: "version",
        id: pks[0],
        pagecode: this.card.pageCode,
        signal: "list"
      });
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
          outputType: "output",
          oids: pks
        }
      });
      break;
    //头部 刷新
    case "Refresh":
      searchBtnClick.call(this, props);
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
                  this.state.json["36620GC-0000845"]
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
  let content = `${this.state.json["36620GC-000082"]}${
    this.state.json[OPR_NAME[name]]
  }${total}${this.state.json["36620GC-000083"]}${
    this.state.json["36620GC-000084"]
  }${successNum}${this.state.json["36620GC-000085"]}${
    this.state.json["36620GC-000086"]
  }${errorNum}${
    this.state.json["36620GC-000087"]
  }`; /* 国际化处理： 共,条,成功,条,失败,条*/
  if (successNum == total) {
    //全部成功
    toast({
      color: "success",
      title: `${this.state.json[OPR_NAME[name]]}${
        this.state.json["36620GC-000091"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true
    });
  } else if (errorNum == total) {
    //全部失败
    toast({
      color: "danger",
      title: `${this.state.json[OPR_NAME[name]]}${
        this.state.json["36620GC-000091"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.json["36620GC-000088"],
        this.state.json["36620GC-000089"],
        this.state.json["36620GC-000090"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  } else if (successNum < total) {
    //部分失败
    toast({
      color: "danger",
      title: `${this.state.json[OPR_NAME[name]]}${
        this.state.json["36620GC-000091"]
      }，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.json["36620GC-000088"],
        this.state.json["36620GC-000089"],
        this.state.json["36620GC-000090"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  }
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
      content: this.state.json["36620GC-000071"]
    }); /* 国际化处理： 请选中一行数据！*/
    return false;
  } else {
    return true;
  }
}

/**
 * 附件管理
 * @param {*} props 页面内置对象
 */
function fileMgr(props, selectDatas) {
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
  this.showUploader = !this.showUploader;
  this.billInfo = { billId, billNo };
  this.forceUpdate();
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
    "Terminal_group",
    "UnTerminal",
    "Print",
    "Output",
    "Attachment",
    "ApproveDetail",
    "Version"
  ];
  let btnObj = {};
  for (let item of btnArray) {
    btnObj[item] = !selected.length;
  }
  if (selected.length) {
    let version =
      selected[0] &&
      selected[0].data &&
      selected[0].data.values.versionno.value;
    let vbillstatus =
      selected[0] &&
      selected[0].data &&
      selected[0].data.values.vbillstatus.value;
    let busistatus =
      selected[0] &&
      selected[0].data &&
      selected[0].data.values.busistatus.value;
    if (selected.length === 1) {
      btnObj.Delete = vbillstatus !== "-1";
      btnObj.Commit_group = !["-1", "0"].includes(vbillstatus);
      btnObj.UnCommit = !["1", "3"].includes(vbillstatus);
      btnObj.Terminal_group = busistatus !== "1";
      btnObj.UnTerminal = busistatus !== "4";
      if (busistatus === "4") {
        // 终止状态 收回按钮不可用
        btnObj.UnCommit = true;
      }
    }
    btnObj.Version = version <= 1;
    btnObj.ApproveDetail = vbillstatus === "-1";
  }
  this.props.button.setButtonDisabled(btnObj);
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/