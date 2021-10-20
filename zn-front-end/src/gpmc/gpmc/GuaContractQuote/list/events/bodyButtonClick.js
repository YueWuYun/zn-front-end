/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { card, javaUrl } from "../../cons/constant.js";
import { BusinessInnerOperator } from "./BusinessOperator";
/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 * @param {*} index   当前单据的行下标
 */
export default function tableButtonClick(props, key, text, record, index) {
  let pk = record[this.primaryId] && record[this.primaryId].value;
  switch (key) {
    case "edit": //修改
      props.pushTo("/card", {
        status: "edit",
        id: pk,
        pagecode: this.card.pageCode
      });
      break;
    case "change": //变更
      props.pushTo("/card", {
        status: "change",
        id: pk,
        pagecode: this.card.pageCode
      });
      break;
    case "changelist": //历史版本
      props.pushTo("/card", {
        status: "changeRecord",
        id: pk,
        pagecode: this.card.pageCode
      });
      break;
    case "delete": //删除
      BusinessInnerOperator.call(
        this,
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        javaUrl.delete,
        this.state.json["36620GBM-000039"]
      ); /* 国际化处理： 删除成功！*/
      break;
    case "commit": //提交
      BusinessInnerOperator.call(
        this,
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        javaUrl.commit,
        this.state.json["36620GBM-000040"]
      ); /* 国际化处理： 提交成功！*/
      break;
    case "uncommit": //收回
      BusinessInnerOperator.call(
        this,
        key,
        props,
        record,
        index,
        this.tableId,
        this.pageId,
        javaUrl.uncommit,
        this.state.json["36620GBM-000041"]
      ); /* 国际化处理： 收回成功！*/
      break;
    default:
      break;
  }
}

/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/