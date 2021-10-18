/*9k43NIHQ9Q7ex8VdWjYvNqbaAPq/VXvvE+Ct1sMrV2lgsDrFcKMEafDr9+fPhteR*/
/**
 * 基础档案列表卡片 列表页头部按钮事件
 * @author dongyue7
 */

import { print, promptBox, toast } from "nc-lightapp-front";
import { btnOperation } from "./btnOperation.js";
import { searchBtnOperation } from "./search.js";

/**
 * 按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export default function listHeadBtnClick(props, id) {
  let selectDatas = props.table.getCheckedRows(this.tableId); // 获取已勾选数据
  let pks =
    selectDatas &&
    selectDatas.map(item => item.data.values[this.primaryId].value);
  let checkDelDataLen = props.table.getCheckedRows(this.list.tableCode).length; // 获取勾选的行数量
  let pkMapTs = new Map(); // 主键与ts
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
      addBill.call(this, props);
      break;
    //头部 删除
    case "Delete":
      delBill.call(this, pks, checkDelDataLen, pkMapTs);
      break;
    //头部 打印
    case "Print":
      printBill.call(this, pks, selectDatas);
      break;
    //头部 输出
    case "Output":
      OutputBill.call(this, pks);
      break;
    //头部 刷新
    case "Refresh":
      this.setState({ showToast: false });
      searchBtnOperation.call(this, props, null, null, null, () => {
        toast({
          color: "success",
          content: this.state.json[
            "36010PUBLIC-000033"
          ] /* 国际化处理： 刷新成功 */
        });
      });
      break;
    default:
      break;
  }
}

function addBill(props) {
  props.pushTo("/card", {
    status: "add",
    pagecode: this.card.pageCode
  });
}

function delBill(pks, checkDelDataLen, pkMapTs) {
  let lenFlag = checkDelDataLen === 1 ? true : false;
  promptBox({
    color: "warning",
    title: this.state.json["36010PUBLIC-000006"] /* 国际化处理： 删除*/,
    content: lenFlag
      ? this.state.json["36010PUBLIC-000015"]
      : this.state.json[
          "36010PUBLIC-000016"
        ] /* 国际化处理： 确定要删除吗?,确定要删除所选数据吗?*/,
    beSureBtnClick: () => {
      btnOperation.call(
        this,
        { pks: pks, pkMapTs: pkMapTs },
        this.javaUrl.delete,
        this.state.json["36010PUBLIC-000010"],
        lenFlag ? false : "Batch"
      ); /* 国际化处理： 删除成功!*/
    }
  });
}

function printBill(pks, selectDatas) {
  this.printData.oids = pks;
  print("pdf", `${this.baseUrl}${this.javaUrl.print}.do`, {
    ...this.printData,
    userjson: JSON.stringify(selectDatas)
  });
}

function OutputBill(pks) {
  this.printData.oids = pks;
  this.setState(
    {
      printOut: {
        appcode: "36010ISDC",
        nodekey: "", //模板节点标识
        outputType: "output",
        oids: pks
      }
    },
    () => {
      this.refs.printOutput.open();
    }
  );
}

/*9k43NIHQ9Q7ex8VdWjYvNqbaAPq/VXvvE+Ct1sMrV2lgsDrFcKMEafDr9+fPhteR*/