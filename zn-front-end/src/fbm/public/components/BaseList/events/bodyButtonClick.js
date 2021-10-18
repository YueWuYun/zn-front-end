/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
//列表操作列按钮操作
import { list, common } from "../../../container";
import { promptBox } from "nc-lightapp-front";

export function bodyButtonClick(key, record, index) {
  let pk = record[this.primaryId] && record[this.primaryId].value;
  let ts = record["ts"] && record["ts"].value;
  let pkMapTs = new Map();
  //主键与tsMap
  if (pk && ts) {
    pkMapTs.set(pk, ts);
  }
  switch (key) {
    //经办
    case "HandleInner":
      list.listHandle.call(this, pk);
      break;
    //修改
    case "EditInner":
      list.listEdit.call(this, pk);
      break;
    //删除
    case "DeleteInner":
      list.listDelete.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //提交
    case "CommitInner":
      list.listCommit.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //收回
    case "UnCommitInner":
      list.listUncommit.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //终止
    case "terminate":
      list.listTerminate.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //制证
    case "MakeVoucherInner":
      list.listMakeVoucher.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //取消制证
    case "CancelVoucherInner":
      list.listCancelVoucher.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //作废
    case "DisabledInner":
    case "consignBankDisableInner":
      this.setState(
        {
          disabledComShow: !this.state.disabledComShow,
          disabledData: {
            pks: [pk],
            pkMapTs
          },
          index
        },
        () => {
          this.props.form.setFormStatus(this.disableReason, "edit");
        }
      );
      break;
    //取消作废
    case "CancelDisabledInner":
    case "consignCancelDisableInner":
      list.listCancelInvalid.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    // 确认收妥
    case "BeSureOrderInner":
      this.setState(
        {
          confirmreceiptComShow: !this.state.confirmreceiptComShow,
          confirmreceiptData: {
            pks: [pk],
            pkMapTs
          },
          index
        },
        () => {
          this.props.form.setFormStatus(this.confirmreceipt, "edit");
        }
      );
      break;
    // 取消确认
    case "UnBeSureOrderInner":
      list.listUnconfirmreceipt.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    // 发送指令
    case "CommandInner":
      list.listSendInstruction.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    // 收回指令
    case "CancelCommandInner":
      list.listCancelInstruction.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //下面是应收票据退票所属按钮
    // 冲销
    case "Transform":
      list.listTransform.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    // 取消冲销
    case "CancelTransform":
      list.listCancelTransform.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    // 冲销
    case "TransformInner":
      list.listTransform.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    // 取消冲销
    case "CancelTransformInner":
      list.listCancelTransform.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //下面是应付票据贴现回单操作
    // 记账
    case "TallyInner":
      this.setState(
        {
          tallyComShow: !this.state.tallyComShow,
          disabledData: {
            pks: [pk],
            pkMapTs,
            index
          },
          index
        },
        () => {
          this.props.form.setFormStatus(this.tallyPlan, "edit");
          // 开票计划项目按财务组织过滤
          let meta = this.props.meta.getMeta();
          meta[this.tallyPlan].items = meta[this.tallyPlan].items.map(item => {
            if (item.attrcode === "invoiceplanitem") {
              item.queryCondition = () => {
                return {
                  pk_org: record.pk_org.value
                };
              };
            }
            //记账：利息计划项目，收入项目
            if (item.attrcode == "interestplanitem") {
              item.queryCondition = () => {
                return {
                  pk_org: record.pk_org.value
                };
              };
            }
            //记账：手续费计划项目，收入项目
            if (item.attrcode == "chargeplanitem") {
              item.queryCondition = () => {
                return {
                  pk_org: record.pk_org.value
                };
              };
            }
            //记账：承兑计划项目
            if (item.attrcode == "acceptplanitem") {
              item.queryCondition = () => {
                return {
                  pk_org: record.pk_org.value
                };
              };
            }
            return item;
          });
          this.props.meta.setMeta(meta);
        }
      );
      break;
    // 取消记账
    case "CancelTallyInner":
      list.listCancelTally.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //下面是票据质押、池内质押的指令
    // 解除质押
    case "ImpawnBackInstrInner":
      promptBox({
        color: "warning",
        title: this.state.json[
          "fbmpublic-000082"
        ] /* 国际化处理： 确定要解除质押吗*/,
        beSureBtnClick: () => {
          this.setState(
            {
              impawnbackComShow: !this.state.impawnbackComShow,
              disabledData: {
                pks: [pk],
                pkMapTs,
                index
              },
              index
            },
            () => {
              // 设置当前区域可编辑
              this.props.form.setFormStatus(this.impawnbackAreaCode, "edit");
              // 设置质押回收人参照按财务组织过滤
              let meta = this.props.meta.getMeta();
              meta[this.impawnbackAreaCode].items = meta[
                this.impawnbackAreaCode
              ].items.map(item => {
                if (item.attrcode === "impawnbackpersonid") {
                  item.queryCondition = () => {
                    return {
                      pk_org: record.pk_org.value
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
    //  取消收回
    case "CancelImpawnBackInner":
      list.cancelImpawnBack.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //质押/质押收回撤回
    case "WithdrawImpawnInner":
      list.withdrawImpawn.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    //解除质押签收
    case "ImpawnBackSignInner":
      list.impawnBackSign.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs },
        index
      });
      break;

    // 受理
    case "AcceptInner":
      list.listAccept.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs },
        index
      });
      break;

    // 取消受理
    case "UnAcceptInner":
      list.listUnAccept.call(this, {
        isMulti: false,
        data: { pks: [pk], pkMapTs },
        index
      });
      break;

    // 跳转到票据签发
    case "SignLinkInner":
      common.signLink.call(this, pk);
      break;

    // 委托办理
    case "CommissionInner":
      // list.doBodyCommission.call(this,this.props,record,index);
      list.listCommission.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    // 取消委托办理
    case "CommissionCancelInner":
      list.listUnCommission.call(this, {
        data: { pks: [pk], pkMapTs },
        index
      });
      break;
    // 退回
    case "ReturnInner":
      this.setState(
        {
          returnComShow: !this.state.returnComShow,
          disabledData: {
            pks: [pk],
            pkMapTs,
            index
          },
          index
        },
        () => {
          this.props.form.setFormStatus(this.returnReason, "edit");
        }
      );
      break;
    // 贴现办理
    case "discountTransactInner":
      let pk_billtypecode = record["pk_billtypecode"];
      common.discountTransact.call(this, pk, pk_billtypecode);
      break;
    default:
      break;
  }
}

/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/