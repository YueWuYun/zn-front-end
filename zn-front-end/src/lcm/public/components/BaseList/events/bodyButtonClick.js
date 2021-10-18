//列表操作列按钮操作
import { list, common } from "../../../container";
import {
  promptBox,
  toast
} from "nc-lightapp-front";

export function bodyButtonClick(key, record, index) {
  let { BillConfig } = this.props;
  let pk = record[BillConfig.primaryId] && record[BillConfig.primaryId].value;
  let ts = record["ts"] && record["ts"].value;
  let pkMapTs = new Map();
  // pk和index的map
  let pkMapRowIndex = new Map();
   // 检查按钮权限
   if (!common.checkBtnPermission.call(this, key, pk)) return;
  //主键与tsMap
  pk && ts && pkMapTs.set(pk, ts);
  pk && pkMapRowIndex.set(pk, index);
  switch (key) {
    // 修改
    case "EditInner":
      list.listEdit.call(this, pk);
      break;
    // 删除
    case "DelInner":
      list.listDelete.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 提交
    case "CommitInner":
      list.listCommit.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 收回
    case "UncommitInner":
      list.listUncommit.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 制证
    case "MakeVoucherInner":
      list.listMakeVoucher.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 取消制证
    case "CancelVoucherInner":
      list.listCancelVoucher.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 承付
    case "HonourInner":
      list.listHonour.call(this, pk);
      break;
    // 取消承付
    case "CancelHonourInner":
      list.listCancelHonour.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 注销
    case "LogOutInner":
      list.listLogout.call(this, {
        data: record
      });
      break; 
    case "ConfirmModal":
      list.listLogoutConfirm.call(this, {
        isMulti: false,
        pkMapRowIndex,
        data: { pks: [pk], pkMapTs },
        successAfter: () => {
          this.setState({ registerCancleShow: false,record: null });
        },
      });
      break;
    // 关闭申请
    case "CloseApplyInner":
      list.listCloseApply.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 确认收款
    case "ConfirmCollectInner":
      list.listConfirmCollect.call(this, pk);
      break;
    // 取消确认收款
    case "CancelConfirmCollectInner":
    list.listCancelConfirmCollect.call(this, {
      data: { pks: [pk], pkMapTs },
      pkMapRowIndex,
      index
    });
    break;
    // 行内变更
    case "ChangeInner":
      list.listChange.call(this, pk);
      break;
    break;
     // 行内展期
    case "ExtendsInner":
      list.listExtension.call(this,pk);
      break;
    // 行内删除版本
    case "DeleteVersionInner":
      list.listDeleteVersion.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 关闭
    case "CloseInner":
      promptBox({
        color: "warning",
        beSureBtnName: this.state.baseMultiLangData[
          "3617PUB-000073"
        ] /* 国际化处理： 是*/ ,          
        cancelBtnName: this.state.baseMultiLangData[
          "3617PUB-000074"
        ] /* 国际化处理： 否*/ ,         
        title: this.state.baseMultiLangData[
          "3617PUB-000014"
        ] /* 国际化处理： 终止*/ ,
        content: this.state.baseMultiLangData[
          "3617PUB-000070"
        ] /* 国际化处理： 押汇合同是否正常结束？*/ ,
        beSureBtnClick: () => {
          let extParam = new Map();
          extParam.set("confirmFlag", true);
          //let data = { extParam};
          list.listClose.call(this, {
            data: { pks: [pk], pkMapTs, extParam:extParam},
            pkMapRowIndex,
            index
          });
        //  card.cardTerminate.call(this,true);
        },
        cancelBtnClick: () => {
          let extParam = new Map();
          extParam.set("confirmFlag", false);
          //let data = { extParam};
          list.listClose.call(this, {
            data: { pks: [pk], pkMapTs, extParam:extParam},
            pkMapRowIndex,
            index
          });
         // card.cardTerminate.call(this,false);
        },
      });
      
      break;
    // 取消关闭
    case "CancleCloseInner":
      list.listCancleClose.call(this, {
        data: { pks: [pk], pkMapTs },
        pkMapRowIndex,
        index
      });
      break;
    // 联查 审批详情
    case "ApproveDetailInner":
      common.linkApproveDetail.call(this, { data: { values: record } });
      break;
    default:
      break;
  }
}
