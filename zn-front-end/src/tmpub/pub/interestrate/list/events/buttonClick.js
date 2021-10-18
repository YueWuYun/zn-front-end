/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { ajax, toast, promptBox, print, cardCache } from "nc-lightapp-front";
import { LIST, API_URL, searchCache } from "../../cons/constant.js";
import { getListData } from "./searchBtnClick";
import { selectedEvent } from "./selectedEvent.js";
const { getDefData } = cardCache;
export default function buttonClick(props, id) {
  let selectDatas = props.table.getCheckedRows(LIST.table_id);
  let pks =
    selectDatas &&
    selectDatas.map(
      item => item.data.values && item.data.values[LIST.primary_id].value
    );
  let pkMapTs = new Map();
  selectDatas &&
    selectDatas.map(item => {
      let pk = item.data.values[LIST.primary_id].value;
      let ts = item.data.values["ts"] && item.data.values["ts"].value;
      //主键与tsMap
      if (pk && ts) {
        pkMapTs.set(pk, ts);
      }
    });
  switch (id) {
    //头部 新增
    case "Add":
      addBill.call(this, props);
      break;
    //头部 删除
    case "Delete":
      delBill.call(this, pks, pkMapTs, selectDatas);
      break;
    //复制
    case "Copy":
      copyBill.call(this, props, pks);
      break;
    //头部 打印
    case "Print":
      printBill.call(this, pks);
      break;
    //头部 输出
    case "Output":
      outPutBill.call(this, pks);
      break;
    //头部 预览
    case "Preview":
      toast({
        color: "warning",
        content: this.state.json["36010IR-000021"]
      }); /* 国际化处理： 功能待开发*/
      break;
    //头部 刷新
    case "Refresh":
      let searchCondition = getDefData(searchCache.key, searchCache.dataSource);
      searchCondition &&
        getListData.call(this, API_URL.queryList, null, () => {
          toast({
            color: "success",
            content: this.state.json[
              "36010IR-000072"
            ] /* 国际化处理： 刷新成功 */
          });
        });
      break;
    default:
      break;
  }
}

/**
 * 新增
 * @param {*} props  页面内置对象
 */
function addBill(props) {
  props.pushTo("/card", {
    status: "add",
    pagecode: this.pageId,
    id: ""
  });
}

/**
 * 删除
 * @param {*} props  页面内置对象
 */
function delBill(pks, pkMapTs, selectDatas) {
  promptBox({
    color: "danger", // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
    title: this.state.json["36010IR-000025"], // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 删除*/
    content: this.state.json["36010IR-000055"], // 提示内容,非必输/* 国际化处理： 将删除选中利率的所有版本，是否确定？*/
    beSureBtnClick: () => {
      headBtnOperation.call(
        this,
        { pks, pkMapTs },
        "delete",
        this.state.json["36010IR-000027"],
        "batch",
        selectDatas
      ); /* 国际化处理： 删除成功!*/
    } // 确定按钮点击调用函数,非必输
  });
}

/**
 * 复制
 * @param {*} props  页面内置对象
 */
function copyBill(props, pks) {
  props.pushTo("/card", {
    status: "copy",
    id: pks[0],
    pagecode: this.pageId
  });
}

/**
 * 打印
 * @param {*} props  页面内置对象
 */
function printBill(pks) {
  print("pdf", API_URL.print, {
    appcode: this.appcode,
    nodekey: this.nodekey,
    oids: pks
  });
}

/**
 * 输出
 * @param {*} props  页面内置对象
 */
function outPutBill(pks) {
  this.setState(
    {
      outputData: {
        nodekey: this.nodekey,
        oids: pks,
        outputType: "output"
      }
    },
    () => {
      this.refs.printOutput.open();
    }
  );
}

function headBtnOperation(pdata, path, content, type, selectDatas) {
  ajax({
    url: API_URL[path],
    data: {
      pks: pdata.pks,
      pkMapTs: pdata.pkMapTs,
      pageCode: this.pageId
    },
    success: res => {
      let { success, data } = res;
      if (success) {
        multiToast.call(this, path, data); //批量提示
        if (path === "delete") {
          let deletePks =
            data.data && data.data.filter(item => item.state === "0"); //删除成功
          deletePks = deletePks && deletePks.map(item => item.pk); //删除成功的pk
          if (deletePks.length > 0) {
            this.props.table.deleteCacheId(this.tableId, deletePks);
            selectedEvent.call(this);
          }
          let succPks = res.data.data.map(item => {
            if (item.msg === this.state.json["36010IR-000056"]) {
              /* 国际化处理： 成功*/
              return item.pk;
            }
          });
          let succIndex = querySuccData.call(this, succPks, selectDatas);
          this.props.table.deleteTableRowsByIndex(this.tableId, succIndex);
        } else {
          getListData.call(this, API_URL.queryList);
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
function multiToast(name, data) {
  const OPR_NAME = {
    delete: this.state.json["36010IR-000025"] /* 国际化处理： 删除*/,
    deleteVersion: this.state.json["36010IR-000028"] /* 国际化处理： 删除版本*/
  };
  //这里换成自己接口返回的字段名
  let { successNum, errorNum, total, msg, msgDetail } = data;
  let content = `${this.state.json["36010IR-000060"]}${OPR_NAME[name]}${total}${this.state.json["36010IR-000061"]}，${this.state.json["36010IR-000056"]}${successNum}${this.state.json["36010IR-000061"]}，${this.state.json["36010IR-000054"]}${errorNum}${this.state.json["36010IR-000061"]}`; /* 国际化处理： 共,条,成功,条,失败,条*/
  if (successNum == total) {
    //全部成功
    toast({
      duration: 5,
      color: "success",
      title: `${OPR_NAME[name]}${this.state.json["36010IR-000062"]}，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true
    });
  } else if (errorNum == total) {
    //全部失败
    toast({
      duration: "infinity",
      color: "danger",
      title: `${OPR_NAME[name]}${this.state.json["36010IR-000062"]}，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.json["36010IR-000057"],
        this.state.json["36010IR-000058"],
        this.state.json["36010IR-000059"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  } else if (successNum < total) {
    //部分失败
    toast({
      duration: "infinity",
      color: "warning",
      title: `${OPR_NAME[name]}${this.state.json["36010IR-000062"]}，${msg}` /* 国际化处理： 完毕*/,
      content: content,
      groupOperation: true, //批量操作，默认值是false，批量操作是true，非批量操作是false,非必输
      TextArr: [
        this.state.json["36010IR-000057"],
        this.state.json["36010IR-000058"],
        this.state.json["36010IR-000059"]
      ] /* 国际化处理： 展开,收起,关闭*/,
      groupOperationMsg: msgDetail //数组的每一项，需要点击展开按钮显示的内容描述，非必输
    });
  }
}

function querySuccData(succPk, selectDatas) {
  let succIndex = selectDatas.map(e => {
    for (let i = 0; i < succPk.length; i++) {
      if (e.data.values[this.primaryId].value === succPk[i]) {
        return e.index;
      }
    }
  });
  return succIndex;
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/