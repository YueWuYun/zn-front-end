/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
/* 卡片页头部按钮操作 */
import { toast, promptBox } from "nc-lightapp-front";
import { card, common } from "../../../container";
import { setEditStatus, getCardData } from "../../../container/page";
import { MODULE_ID } from "../../../container/common";
import moment from "moment";
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";
import { elecSignCardPrint } from "../../../../../tmpub/pub/util/index";

export default function (props, id, tableId) {
  // const langData = this.props.MultiInit.getLangData(MODULE_ID);
  let status = props.getUrlParam("status");
  let pk =
    props.form.getFormItemsValue(this.formId, this.primaryId) &&
    props.form.getFormItemsValue(this.formId, this.primaryId).value;
  if (!pk) {
    // 按说不能够从url中取id，删除的单据可能还在url上
    pk = props.getUrlParam("id");
  }
  switch (id) {
    //头部 新增
    case "Add":
      card.cardAdd.call(this);
      break;
    //头部 保存
    case "Save":
      card.cardSave.call(this);
      break;
    //头部 保存新增
    case "SaveAdd":
      card.cardSaveAdd.call(this);
      break;
    //头部 保存提交
    case "SaveCommit":
      card.cardSaveCommit.call(this);
      break;

    //头部 修改
    case "Edit":
      card.cardEdit.call(this);
      break;
    //头部 删除
    case "Delete":
      promptBox({
        color: "warning",
        title: this.state.json["fbmpublic-000000"] /* 国际化处理： 删除*/,
        content: this.state.json[
          "fbmpublic-000001"
        ] /* 国际化处理： 确定删除吗？*/,
        beSureBtnClick: () => {
          card.cardDelete.call(this);
        }
      });

      break;
    //复制
    case "Copy":
      props.pushTo("/card", {
        status: "copy",
        id: pk,
        pagecode: this.pageId
      });
      setEditStatus.call(this, "edit");
      getCardData.call(this, pk, true);
      EmptyAreaValue.call(this, this.billInfo, this.formId, "pk_register.");
      break;
    //头部 受理  2019-11-27 开票申请受理添加
    case "Accept":
      card.cardAccept.call(this);
      break;
    //头部 取消受理  2019-11-27 开票申请受理添加
    case "UnAccept":
      card.cardUnAccept.call(this);
      break;
    //头部 提交
    case "Commit":
      card.cardCommit.call(this);
      break;
    //头部 收回
    case "Uncommit":
      card.cardUncommit.call(this);
      break;
    //头部 终止
    case "Terminate":
      promptBox({
        color: "warning",
        title: this.state.json[
          "fbmpublic-000002"
        ] /* 国际化处理： 终止*/ /* 国际化处理： 终止*/,
        content: this.state.json[
          "fbmpublic-000003"
        ] /* 国际化处理： */ /* 国际化处理： 确定终止吗？*/,
        beSureBtnClick: () => {
          card.cardTerminate.call(this);
        }
      });
      break;
    //头部 取消终止
    case "Unterminate":
      card.cardUnterminate.call(this);
      break;
    //核销
    case "Destroy":
      promptBox({
        color: "warning",
        title: this.state.json["fbmpublic-000077"] /* 国际化处理： 核销*/,
        content: this.state.json[
          "fbmpublic-000078"
        ] /* 国际化处理： 核销为不可逆操作，是否核销？ */,
        beSureBtnClick: () => {
          card.cardDestroy.call(this);
        }
      });
      break;
    //制证
    case "MakeVoucher":
      card.cardMakeVoucher.call(this);
      break;
    //取消制证
    case "CancelVoucher":
      card.cardCancelVoucher.call(this);
      break;
    // 确认收妥
    case "Confirmreceipt":
      this.setState(
        {
          confirmreceiptComShow: !this.state.confirmreceiptComShow
        },
        () => {
          this.props.form.setFormStatus(this.confirmreceipt, "edit");
        }
      );
      break;
    // 取消确认
    case "Unconfirereceipt":
      card.cardUnconfirmreceipt.call(this);
      break;
    // 头部 取消
    case "Cancel":
      promptBox({
        color: "warning",
        title: this.state.json[
          "fbmpublic-000004"
        ] /* 国际化处理： 取消*/ /* 国际化处理： 取消*/,
        content: this.state.json[
          "fbmpublic-000005"
        ] /* 国际化处理： 是否确认要取消？*/ /* 国际化处理： 是否确认要取消？*/,
        beSureBtnClick: () => {
          card.cardCancel.call(this);
        }
      });
      break;
    //头部 打印
    case "Print":
      let pkarr = [];
      pkarr.push(pk);
      card.cardPrint.call(this, pkarr);
      break;
    //头部 输出
    case "Output":
    case "Out":
      card.cardOutput.call(this, [pk]);
      break;
    //头部 附件
    case "Attachment":
      let billNo = this.props.form.getFormItemsValue(this.formId, this.billNo)
        .value;
      card.cardFileMgr.call(this, pk, billNo);
      break;
    //头部 刷新
    case "Refresh":
      card.cardRefresh.call(this, pk, true);
      break;
    // 正式打印
    case 'OffiPrint':
      elecSignCardPrint(this.props, {
        url: this.props.constant.API_URL.elecsignprint,
        offical: true,
        appCode: this.props.constant.appcode,
        nodeKey: 'OFFICIAL',//打印模板
        headCode: 'head',//区域
        field_id: this.primaryId,//主键
        field_billno: 'vbillno',//由列表跳转到卡片的字段
        getOrgFunc: () => {
          return this.props.form.getFormItemsValue(this.formId, "pk_signorg").value;
        }
      });
      break;
    // 补充打印
    case 'InOffiPrint':
      elecSignCardPrint(this.props, {
        url: this.props.constant.API_URL.elecsignprint,
        offical: false,
        appCode: this.props.constant.appcode,
        nodeKey: 'INOFFICIAL',//打印模板
        headCode: 'head',//区域
        field_id: this.primaryId,//主键
        field_billno: 'vbillno',//由列表跳转到卡片的字段
        getOrgFunc: () => {
          return this.props.form.getFormItemsValue(this.formId, "pk_signorg").value;
        }
      });
      break;

    /* =============== 联查 =============== */

    //联查 授信额度
    case "CreditAmount":
      let balanceinfo = {
        pk_protocol:
          this.props.form.getFormItemsValue(this.formId, "ccno") &&
          this.props.form.getFormItemsValue(this.formId, "ccno").value,
        pk_currtype:
          this.props.form.getFormItemsValue(this.formId, "pk_cccurrtype") &&
          this.props.form.getFormItemsValue(this.formId, "pk_cccurrtype").value,
        pk_org:
          this.props.form.getFormItemsValue(this.formId, "pk_org") &&
          this.props.form.getFormItemsValue(this.formId, "pk_org").value,
        credittype:
          this.props.form.getFormItemsValue(this.formId, "pk_cctype") &&
          this.props.form.getFormItemsValue(this.formId, "pk_cctype").value,
        pk_bankdoc:
          this.props.form.getFormItemsValue(this.formId, "ccbank") &&
          this.props.form.getFormItemsValue(this.formId, "ccbank").value
      };
      common.linkCredit.call(this, balanceinfo);
      break;
    //联查 审批详情
    case "ApproveDetail":
      common.linkApproveDetail.call(this, pk);
      break;
    //联查 资金计划
    case "FundPlan":
      common.linkNtb.call(this, pk);
      break;
    //联查 凭证
    case "Voucher":
      let voucherArr = [
        {
          pk_billtype: this.billtype,
          pk_group:
            this.props.form.getFormItemsValue(this.formId, "pk_group") &&
            this.props.form.getFormItemsValue(this.formId, "pk_group").value,
          pk_org:
            this.props.form.getFormItemsValue(this.formId, "pk_org") &&
            this.props.form.getFormItemsValue(this.formId, "pk_org").value,
          relationID:
            this.props.form.getFormItemsValue(this.formId, this.primaryId) &&
            this.props.form.getFormItemsValue(this.formId, this.primaryId).value
        }
      ];
      if (this.pageId === "36200BR_LIST") {
        //出池
        voucherArr.billdate =
          this.props.form.getFormItemsValue(this.formId, "outputdate") &&
          this.props.form.getFormItemsValue(this.formId, "outputdate").value;
      } else if (this.pageId === "36200BT_LIST") {
        //票据入池
        voucherArr.billdate =
          this.props.form.getFormItemsValue(this.formId, "inputdate") &&
          this.props.form.getFormItemsValue(this.formId, "inputdate").value;
      } else if (this.pageId === "36180BRR_LIST") {
        //应收票据退票
        voucherArr.billdate =
          this.props.form.getFormItemsValue(this.formId, "dreturndate") &&
          this.props.form.getFormItemsValue(this.formId, "dreturndate").value;
      }
      common.linkVoucher.call(this, voucherArr);
      break;
    //联查 账户余额
    case "Balance":
      let balanceData = [
        {
          pk_org:
            this.props.form.getFormItemsValue(this.formId, "pk_org") &&
            this.props.form.getFormItemsValue(this.formId, "pk_org").value,
          pk_account:
            this.props.form.getFormItemsValue(
              this.formId,
              this.fields.issueAccount
            ) &&
            this.props.form.getFormItemsValue(
              this.formId,
              this.fields.issueAccount
            ).value
        }
      ];
      common.linkBankBalance.call(this, balanceData);
      break;
    // 联查计划预算
    case "LinkBudgetPlan":
      // let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId) && this.props.form.getFormItemsValue(this.formId, this.primaryId).value
      common.linkNtb.call(this, pk);
      break;
    //联查内部结算账户
    case "LinkInnerAccount":
      let accpk = this.props.form.getFormItemsValue(this.formId, this.pk_inbalaacc) && this.props.form.getFormItemsValue(this.formId, this.pk_inbalaacc).value
      common.linkInnerAccount.call(this, accpk);
      break;
    //联查内部结算账户
    case "LQueryInSecurityAcc":
      let pk_insecurityacc = this.props.form.getFormItemsValue(this.formId, this.pk_insecurityacc) && this.props.form.getFormItemsValue(this.formId, this.pk_insecurityacc).value
      common.linkInnerAccount.call(this, pk_insecurityacc);
      break;
    //跳转到票据签发
    case "SignLink":
      common.signLink.call(this, pk);
      break;
    // 联查开票申请单
    case "SignApplyLink":
      let signApplyPk = this.props.form.getFormItemsValue(this.formId, "pk_signapply") && this.props.form.getFormItemsValue(this.formId, "pk_signapply").value;
      common.signApplyLink.call(this, signApplyPk);
      break;
    // 联查票据签发单
    case "SignBillLink":
      common.SignBillLink.call(this, pk);
      break;
    // 联查票据付款单
    case "AcceptBillLink":
      let pk_accept = this.props.form.getFormItemsValue(this.formId, "pk_srcbill") && this.props.form.getFormItemsValue(this.formId, "pk_srcbill").value;
      common.acceptLink.call(this, pk_accept);
      break;
    // 联查应付票据贴现单
    case "BuyerDiscountBillLink":
      let pk_buyerdiscount = this.props.form.getFormItemsValue(this.formId, "pk_srcbill") && this.props.form.getFormItemsValue(this.formId, "pk_srcbill").value;
      common.buyerDiscountLink.call(this, pk_buyerdiscount);
      break;
    // 联查票据签发单（签发回单使用）
    case "RegisterBillLink":
      let registerPK = this.props.form.getFormItemsValue(this.formId, "pk_parent") && this.props.form.getFormItemsValue(this.formId, "pk_parent").value;
      common.registerLink.call(this, registerPK);
      break;
    // 联查 担保合同
    case "Guarantee":
      let changeRows = props.cardTable.getTabData("guarantee");
      let register =
        this.props.form.getFormItemsValue(this.formId, this.primaryId) &&
        this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
      if (changeRows.rows.length == 0) {
        toast({
          color: "warning",
          content: this.state.json["fbmpublic-000081"]
        }); /* 国际化处理：单据没有使用担保合同，无法联查担保*/
        return;
      }
      // props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/list", {
      //     appcode: "36620GC",
      //     pagecode: "36620GCL_LIST",
      //     scene: "linksce",
      //     id: register
      // });
      props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/list", {
        billtype: "36W2",
        pagecode: "36620GCL_LIST",
        scene: "linksce",
        sence: "4",
        id: register
      });
      break;
    // 取消作废
    case "CancelInvalid":
      card.cardCancelDisable.call(this);
      break;
    // 作废
    case "Invalid":
      this.setState(
        {
          disabledComShow: !this.state.disabledComShow
        },
        () => {
          this.props.form.setFormStatus(this.disableReason, "edit");
        }
      );
      break;
    case "Disabled":
    case "consignbankDisable":
      this.setState(
        {
          disabledComShow: !this.state.disabledComShow
        },
        () => {
          this.props.form.setFormStatus(this.disableReason, "edit");
        }
      );
      // card.cardInvalid.call(this);
      break;
    // 取消作废
    case "CancelDisabled":
    case "consignbankCancelDisable":
      card.cardCancelDisable.call(this);
      break;
    // 发送指令
    case "SendInstruction":
      card.cardSendCommand.call(this, pk);
      break;
    // 收回指令
    case "CancelInstruction":
      card.cardTakeCommand.call(this);
      break;
    //下面是应收票据退票的按钮
    // 冲销
    case "Transform":
      card.cardTransfrom.call(this);
      break;
    // 取消冲销
    case "CancelTransform":
      card.cardCancelTransform.call(this);
      break;
    // 记账
    case "Tally":
      this.setState(
        {
          tallyComShow: !this.state.tallyComShow
        },
        () => {
          this.props.form.setFormStatus(this.tallyPlan, "edit");
          // 获取 pk_org
          let pk_org = this.props.form.getFormItemsValue(
            this.formId,
            "pk_org"
          ).value;
          // 设置质押回收人参照按财务组织过滤
          let meta = this.props.meta.getMeta();
          meta[this.tallyPlan].items = meta[
            this.tallyPlan
          ].items.map(item => {
            if (item.attrcode === "invoiceplanitem") {
              item.queryCondition = () => {
                return {
                  pk_org: pk_org
                };
              };
            }
            //记账：利息计划项目，收入项目
            if (item.attrcode == 'interestplanitem') {
              item.queryCondition = () => {
                return {
                  pk_org: pk_org
                };
              }
            }
            //记账：手续费计划项目，收入项目
            if (item.attrcode == 'chargeplanitem') {
              item.queryCondition = () => {
                return {
                  pk_org: pk_org
                };
              }
            }
            //记账：承兑计划项目
            if (item.attrcode == 'acceptplanitem') {
              item.queryCondition = () => {
                return {
                  pk_org: pk_org
                };
              }
            }
            return item;
          });
          this.props.meta.setMeta(meta);
        }
      );
      break;
    // 取消记账
    case "CancelTally":
      card.cardCancelTally.call(this);
      break;
    //下面是额度管理的指令
    //维护
    case "Mainten":
      card.cardMainten.call(this);
      break;
    //头部 经办
    case "Handle":
      card.cardHandle.call(this);
      break;
    // 退回
    case "Return":
      this.setState(
        {
          returnComShow: !this.state.returnComShow
        },
        () => {
          this.props.form.setFormStatus(this.returnReason, "edit");
        }
      );
      break;
    // 额度申请
    case "RequestList":
      let pk_srcbill =
        props.form.getFormItemsValue(this.formId, "pk_srcbill") &&
        props.form.getFormItemsValue(this.formId, "pk_srcbill").value;
      common.linkQuotaApply.call(this, pk_srcbill);
      break;
    // 单位下拨可用额度
    case "UnitQuota":
      common.linkUnitQuota.call(this, pk);
      break;
    // 额度上收
    case "Upquota":
      common.linkUpquota.call(this, pk);
      break;
    // 额度下拨
    case "Downquota":
      card.cardDownquota.call(this);
      break;
    //联查收付单据
    case "LinkReceAndPaybill":
      let pk_register_rr = this.props.form.getFormItemsValue(this.formId, "pk_register");
      let vbillno = this.props.form.getFormItemsValue(this.formId, "vbillno");
      let pk_group = this.props.form.getFormItemsValue(this.formId, "pk_group");
      if (!pk_register_rr) {
        // 主表无票据信息，取子表的
        let selectDatas = this.props.cardTable.getCheckedRows(this.tabCode);
        if (selectDatas.length && selectDatas.length == 1) {
          pk_register_rr = selectDatas[0] && selectDatas[0].data.values["pk_register"];
        } else {
          toast({
            color: "danger",
            content: this.state.json[
              "fbmpublic-000006"
            ] /* 国际化处理： 请勾选一条票据数据*/
          });
          return;
        }
      }
      common.linkReceAndPaybill.call(this,
        pk,
        vbillno && vbillno.value,
        pk_register_rr && pk_register_rr.value,
        pk_group && pk_group.value);
      break;
    //下面是票据质押、池内质押的指令
    // 解除质押
    case "ImpawnBackInstr":
      promptBox({
        color: "warning",
        title: this.state.json[
          "fbmpublic-000082"
        ] /* 国际化处理： 确定要解除质押吗*/,
        beSureBtnClick: () => {
          this.setState(
            {
              impawnbackComShow: !this.state.impawnbackComShow
            },
            () => {
              this.props.form.setFormStatus(this.impawnbackAreaCode, "edit");
              // 获取 pk_org
              let pk_org = this.props.form.getFormItemsValue(
                this.formId,
                "pk_org"
              ).value;
              // 设置质押回收人参照按财务组织过滤
              let meta = this.props.meta.getMeta();
              meta[this.impawnbackAreaCode].items = meta[
                this.impawnbackAreaCode
              ].items.map(item => {
                if (item.attrcode === "impawnbackpersonid") {
                  item.queryCondition = () => {
                    return {
                      pk_org: pk_org
                    };
                  };
                }
                return item;
              });
              this.props.meta.setMeta(meta);
            }
          );
        }
      });
      break;
    // 取消收回
    case "CancelImpawnBack":
      card.cancelImpawnBack.call(this);
      break;
    //质押/质押收回撤回
    case "WithdrawImpawn":
      card.withdrawImpawn.call(this);
      break;
    //质押/质押收回撤回
    case "ImpawnBackSign":
      card.impawnBackSign.call(this);
      break;
    case "LinkSDBook":
      let pk_register =
        this.props.form.getFormItemsValue(this.formId, "pk_register") &&
        this.props.form.getFormItemsValue(this.formId, "pk_register").value;

      if (!pk_register) {
        // 主表无票据信息，取子表的
        let selectDatas = this.props.cardTable.getCheckedRows(this.tabCode);
        if (!selectDatas.length || selectDatas.length !== 1) {
          toast({
            color: "danger",
            content: this.state.json[
              "fbmpublic-000006"
            ] /* 国际化处理： 请勾选一条票据数据*/
          });
          return;
        }
        if (!selectDatas[0].data.values["pk_register"]) {
          toast({
            color: "danger",
            content: this.state.json[
              "fbmpublic-000006"
            ] /* 国际化处理： 请勾选一条票据数据*/
          });
          return;
        }
        pk_register =
          selectDatas[0] &&
          selectDatas[0].data.values["pk_register"] &&
          selectDatas[0].data.values["pk_register"].value;
      }
      if (!pk_register) {
        toast({
          color: "danger",
          content: this.state.json[
            "fbmpublic-000007"
          ] /* 国际化处理： 请选择一条票据数据*/
        });
        return;
      }
      common.linkLinkSDBook.call(this, pk_register);
      break;
    // 委托办理
    case "Commission":
      // common.doCommission.call(this,props);
      card.cardCommission.call(this);
      break;
    // 取消委托办理
    case "CommissionCancel":
      // common.doUnCommission.call(this,props);
      card.cardUnCommission.call(this);
      break;
    // 取消转单 
    case 'CancelTransfer':
      let status = this.props.form.getFormStatus(this.formId);
      if (status != "browse") {
        promptBox({
          color: "warning",
          title: this.state.json["fbmpublic-000096"] /* 国际化处理： 退出转单*/,
          content: this.state.json[
            "fbmpublic-000008"
          ] /* 国际化处理：有未保存的单据，确定要退出转单吗?*/,
          beSureBtnClick: () => {
            this.setState({
              transferFinishedBillPkArr:[]
            });
            props.pushTo("/list");
          }
        });
      }else{
        this.setState({
          transferFinishedBillPkArr:[]
        });
        props.pushTo("/list");
      }  
      break;
    // 参照上游生成
    case 'AddFrom':
      let { deleteCache } = this.props.transferTable;
      deleteCache(this.tdataSource);
      props.pushTo('/ref21', {
        pagecode: this.pagecode,
        destTradetype: this.billtype
      });
      break;
    // 贴现办理
    case 'discountTransact':
      let pk_discount = this.props.getUrlParam("id") ||
        this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
      let pk_billtypecode = this.props.form.getFormItemsValue(this.formId, "pk_billtypecode");
      common.discountTransact.call(this, pk_discount, pk_billtypecode);
      break;
    default:
      break;
  }
}


/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/