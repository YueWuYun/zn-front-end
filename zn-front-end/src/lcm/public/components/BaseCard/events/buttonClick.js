/* 卡片页头部按钮操作 */
import {
  promptBox,
  toast
} from "nc-lightapp-front";
import {
  card,
  common
} from "../../../container";
import {
  linkCMP
} from "src/tmpub/pub/util/linkCMP";
export default function (props, key) {
  let {
    BillConfig,
    FormConfig,
    form: formUtil,
    cardTable: cardTableUtil,
    button: buttonUtil,
  } = this.props;
  let pk = formUtil.getFormItemsValue(FormConfig.formId, BillConfig.primaryId);
  pk = this.props.getUrlParam("id") || (pk && pk.value);
  // 检查按钮权限
  if(!(common.checkBtnPermission.call(this, key, pk))) return;
  // 主组织
  let pk_org = formUtil.getFormItemsValue(FormConfig.formId, "pk_org");
  pk_org = pk_org && pk_org.value;

  switch (key) {
    // 头部 新增
    case "Add":
      card.cardAdd.call(this);
      break;
      // 头部 保存
    case "Save":
      card.cardSave.call(this);
      break;
      // 头部 保存新增
    case "SaveAdd":
      card.cardSaveAdd.call(this);
      break;
      // 头部 保存提交
    case "SaveCommit":
      card.cardSaveCommit.call(this);
      break;
      // 头部 修改
    case "Edit":
      card.cardEdit.call(this);
      break;
      // 头部 删除
    case "Delete":
      promptBox({
        color: "warning",
        title: this.state.baseMultiLangData[
          "3617PUB-000011"
        ] /* 国际化处理 删除 */ ,
        content: this.state.baseMultiLangData[
          "3617PUB-000012"
        ] /* 国际化处理 确定要删除吗？*/ ,
        beSureBtnClick: () => {
          card.cardDelete.call(this);
        },
      });
      break;
      // 复制
    case "Copy":
      card.cardCopy.call(this);
      break;
      // 头部 提交
    case "Commit":
      card.cardCommit.call(this);
      break;
      // 头部 收回
    case "Uncommit":
      card.cardUncommit.call(this);
      break;
      // 头部 终止
    case "Terminate":
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
          card.cardTerminate.call(this,true);
        },
        cancelBtnClick: () => {
          card.cardTerminate.call(this,false);
        },
      });
      break;
      // 头部 取消终止
    case "Unterminate":
      card.cardUnterminate.call(this);
      break;
      // 头部 展期
    case "Extension":
      card.cardExtension.call(this);
      break;
      // 头部 变更
    case "Change":
      card.cardChange.call(this);
      break;
      // 头部 查看版本
    case "ViewVersion":
      card.cardViewVersion.call(this);
      break;
      // 头部 删除版本
    case "DeleteVersion":
      promptBox({
        color: "warning",
        title: this.state.baseMultiLangData[
          "3617PUB-000011"
        ] /* 国际化处理 删除 */ ,
        content: this.state.baseMultiLangData[
          "3617PUB-000068"
        ] /* 国际化处理 确定要删除版本吗？*/ ,
        beSureBtnClick: () => {
          card.cardDeleteVersion.call(this);
        },
      });
      break;
      // 头部 记账
    case "Bookkeeping":
      card.cardBookkeeping.call(this);
      break;
      // 头部 取消记账
    case "Unbookkeeping":
      card.cardUnbookkeeping.call(this);
      break;
      // 头部 制证
    case "MakeVoucher":
      card.cardMakeVoucher.call(this);
      break;
      // 头部 取消制证
    case "CancelVoucher":
      card.cardCancelVoucher.call(this);
      break;
      // 头部 确认收款
    case "ConfirmCollect":
      card.cardConfirmCollect.call(this);
      break;
      // 头部 取消确认收款
    case "CancelConfirmCollect":
      card.cardCancelConfirmCollect.call(this);
      break;
      // 头部 承付（到单承付）
    case "Honour":
      card.cardHonour.call(this);
      break;
      // 头部 取消承付（到单承付）
    case "CancelHonour":
      card.cardCancelHonour.call(this);
      break;
      // 头部 发票登记（到单承付，交单登记）
    case "NoteRegister":
      card.NoteRegister.call(this);
      break;
      // 头部 取消
    case "Cancel":
      promptBox({
        color: "warning",
        title: this.state.baseMultiLangData[
          "3617PUB-000028"
        ] /* 国际化处理： 取消 */ ,
        content: this.state.baseMultiLangData[
          "3617PUB-000029"
        ] /* 国际化处理： 是否确认要取消？*/ ,
        beSureBtnClick: () => {
          card.cardCancel.call(this);
        },
      });
      break;
      // 头部 关闭申请
    case "CloseApply":
      promptBox({
        color: "warning",
        title: this.state.baseMultiLangData[
          "3617PUB-000008"
        ] /* 国际化处理 关闭 */ ,
        content: this.state.baseMultiLangData[
          "3617PUB-000027"
        ] /* 国际化处理 确定要关闭吗？*/ ,
        beSureBtnClick: () => {
          card.cardClose.call(this);
        },
      });
      break;
      // 头部 打印
    case "Print":
      card.cardPrint.call(this, [pk]);
      break;
      // 头部 输出
    case "Output":
      card.cardOutput.call(this, [pk]);
      break;
      // 头部 附件
    case "Attachment":
      let billNo = formUtil.getFormItemsValue(
        FormConfig.formId,
        BillConfig.billNo
      ).value;
      card.cardFileMgr.call(this, pk, billNo);
      break;
      // 头部 刷新
    case "Refresh":
      card.cardRefresh.call(this);
      break;
      // 开证登记 注销
    case "LogOut":
      this.setState({
        registerCancleShow: true
      });
      break;
    case "ConfirmModal":
      card.cardLogoutConfirm.call(this, {
        successAfter: () => {
          this.setState({
            registerCancleShow: false
          });
        },
      });
      break;
      // 拉单
    case "Pull":
      // 押汇申请生成押汇合同
    case "ApplyBills":
      // 进口合同到单承付
    case "Arrival":
      // 出口合同交单登记
    case "Submission":
      common.handlePullBill.call(this, key);
      break;
      // 退出拉单
    case "CancelPull":
      card.cardHandleCancelPullBill.call(this, key);
      break;
      /*********** 联查 ************/

      // 联查 审批详情
    case "ApproveDetail":
      common.linkApproveDetail.call(this);
      break;
      // 联查 计划预算
    case "FundPlan":
      common.linkFundPlan.call(this);
      break;
      //联查 凭证
    case "Voucher":
      common.linkVoucher.call(this);
      break;
      //联查 账户余额
    case "Balance":
      //校验是否安装cmp模块
      linkCMP.call(this, {
        data: {
          pk_group: this.props.form.getFormItemsValue(this.formId, "pk_group")
            .value,
        },
        success: (res) => {
          common.linkBalance.call(this);
        },
      });
      break;
      // 联查授信
    case "Credit":
      common.linkCredit.call(this);
      break;
      // 联查 历史版本
    case "HistoryVersion":
      common.linkHistoryVersion.call(this);
      break;
      // 联查 担保合同
    case "GuarantyContract":
      common.linkGuarantyContract.call(this);
      break;
      // 联查 利率
    case "Interestrate":
      common.linkInterestrate.call(this);
      break;
      /************************ 推单 **********************/
    case "OpenModify":
    case "ArrivalBill":
    case "SubmissionRegister":
    case "ReceiveModify":
      //手续费
    case "RefCharge":
    case "PushPayRegister":// 付款登记
    // 交单登记 关联操作 begin
    case "PushCollectionNotice":// 通知收款
    case "PushDocumentaryApply":// 押汇申请
    case "PushDocumentaryContract":// 押
      common.handlePushBill.call(this, key);
      break;
      /*********** 根据当前单据中目标单据的pk 联查目标单据 ************/

      // 联查 结息日
    case "Interestday":
      // 联查 开证申请
    case "LinkOpenApply":
      // 联查 开证登记
    case "LinkOpenRegister":
      // 联查 到单承付
    case "LinkOpenArrival":
      // 联查 开证申请
    case "LinkOpenArrival":
      common.linkBillWithTargetPk.call(this, key);
      break;
      //联查 收证登记
    case "LinkReceiveRegister":
      //联查 通知收款
    case "LinkCollectionNotice":
      //联查 交单登记
    case "LinkSubmitRegister":
    //联查 押汇合同
    case "LinkContractDocuBills":
    common.linkBillWithTargetPk.call(this, key);
    break;

      /*********** 根据当前单据pk 发送请求反联查目标单据 ************/
      // 联查到单承付
    case "RLinkArrivalBill":
      // 联查付款登记
    case "RLinkPayRegister":
      // 联查开证修改
    case "RLinkOpenModify":
      // 联查押汇申请
    case "RLinkApplyDocuBills":
      // 联查押汇合同
    case "RLinkContractDocuBills":
      /*********** 收证登记联查 begin************/
      // 联查收证修改
    case "RLinkReceivemodifyBill":
      // 联查通知收款
    case "RLinkCollectionNotice":
      // 联查交单登记
    case "RLinkSubmissionregisterBill":
      /*********** 收证登记联查 end************/
      /*********** 押汇合同联查 begin************/
      //联查押汇放款
    case "RLinkPayDocuBills": 
      //联查押汇还款
    case "RLinkRepayDocuBills": 
      common.linkBillWithoutTargetPk.call(this, key);
      break;
      //押汇申请多联查
    case "DocuBill":
      let inlcno = formUtil.getFormItemsValue(FormConfig.formId, "inlcno").value;
      let srcBill = "Submission";
      if (inlcno) {
        srcBill = "Arrival"
      }
      common.linkDocuBillWithTargetPk.call(this, key, srcBill);
      break;
      // 联查手续费
    case "LinkServiceFee":
      break;
      // 联查进口合同
    case "LinkContract":
      break;
    default:
      break;
  }
}