/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
//列表头部按钮操作
import { promptBox, toast } from "nc-lightapp-front";
import { common, list } from "../../../container";
import { elecSignListPrint } from "../../../../../tmpub/pub/util/index";

export function buttonClick(props, id) {
    // const langData = this.props.MultiInit.getLangData(MODULE_ID);
    let selectDatas = props.table.getCheckedRows(this.tableId);
    let pks =
        selectDatas &&
        selectDatas.map(item => item.data.values[this.primaryId].value);
    let pkMapTs = new Map();
    let pkMapRowIndex = new Map();
    selectDatas &&
        selectDatas.map(item => {
            let pk = item.data.values[this.primaryId].value;
            let ts = item.data.values["ts"] && item.data.values["ts"].value;
            let index = item.index;
            //主键与tsMap
            if (pk && ts) {
                pkMapTs.set(pk, ts);
            }
            pkMapRowIndex.set(pk, index);
        });
    switch (id) {
        //头部 新增
        case "Add":
            list.listAdd.call(this);
            break;
        //头部 参照上游生成
        case 'AddFrom':
            let { deleteCache } = this.props.transferTable;
            deleteCache(this.tdataSource);
            props.pushTo('/ref21', {
                pagecode: this.pageId,
                destTradetype: this.billtype
            });
            break;
        //头部 删除
        case "Delete":
            let deleteMsg = this.state.json["fbmpublic-000013"];//统一用13号提示语，付利利定的，不管选择几条
            // selectDatas.length > 1
            //     ? this.state.json["fbmpublic-000013"]
            //     : this.state.json[
            //           "fbmpublic-000001"
            //       ]; /* 国际化处理： 确定要删除所选数据吗？,确定删除吗？*/ /* 国际化处理： 确定要删除所选数据吗？,确定删除吗？*/
            promptBox({
                color: "warning",
                title: this.state.json[
                    "fbmpublic-000000"
                ] /* 国际化处理： 删除*/ /* 国际化处理： 删除*/,
                content: deleteMsg,
                beSureBtnClick: () => {
                    list.listDelete.call(this, {
                        isMulti: true,
                        data: { pks, pkMapTs, pkMapRowIndex }
                    });
                }
            });
            break;
        //经办
        case "Handle":
            if (list.checkSelected.call(this, "one")) {
                let info = window.parent.GETBUSINESSINFO();
                props.pushTo("/card", {
                    status: "handle",
                    id: pks[0],
                    // pagecode: this.pageId,
                    context: info,
                    pagecode: this.cardPageCode
                });
            }
            break;
        //维护
        case "Mainten":
            if (list.checkSelected.call(this, "one")) {
                props.pushTo("/card", {
                    status: "mainten",
                    id: pks[0],
                    pagecode: this.cardPageCode
                });
            }
            break;
        //复制
        case "Copy":
            // if (list.checkSelected.call(this, 'one')) {
            props.pushTo("/card", {
                status: "copy",
                id: pks[0],
                pagecode: this.cardPageCode
            });
            // }
            break;
        //提交
        case "Commit":
            list.listCommit.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //收回
        case "Uncommit":
            list.listUncommit.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //头部 打印
        case "Print":
            list.listPrint.call(this, pks);
            break;
        //头部 打印清单
        case "PrintList":
            list.listPrintList.call(this, pks);
            break;
        // 正式打印
        case 'OffiPrint':
            elecSignListPrint(this.props, {
                url: this.props.constant.API_URL.elecsignprint,
                offical: true,
                appCode: this.props.constant.appcode,
                nodeKey: 'OFFICIAL',//打印模板
                tableCode: 'table',//区域
                field_id: this.primaryId,//主键
                field_billno: 'vbillno',//由列表跳转到卡片的字段
                getOrgFunc: () => {
                    let pk_org =
                        selectDatas[0].data.values["pk_signorg"] && selectDatas[0].data.values["pk_signorg"].value;
                    return pk_org;
                }
            });
            break;
        // 补充打印
        case 'InOffiPrint':
            elecSignListPrint(this.props, {
                url: this.props.constant.API_URL.elecsignprint,
                offical: false,
                appCode: this.props.constant.appcode,
                nodeKey: 'INOFFICIAL',//打印模板
                tableCode: 'table',//区域
                field_id: this.primaryId,//主键
                field_billno: 'vbillno',//由列表跳转到卡片的字段
                getOrgFunc: () => {
                    let pk_org =
                        selectDatas[0].data.values["pk_signorg"] && selectDatas[0].data.values["pk_signorg"].value;
                    return pk_org;
                }
            });
            break;
        //头部 输出
        case "Output":
            list.listOutput.call(this, pks);
            break;
        //导出数据
        case "ExportData":
            doDataExport.call(this, props);
            break;
        // 导出模板
        case "ExportExcel":
            doExcelExport.call(this, props);
            break;
        //头部 附件
        case "Attachment":
            let billId =
                selectDatas[0] &&
                selectDatas[0].data.values[this.primaryId].value;
            let billNo =
                selectDatas[0] && selectDatas[0].data.values[this.billNo].value;
            list.listFileMgr.call(this, billId, billNo);
            break;
        //头部 刷新
        case "Refresh":
            list.listRefresh.call(this);
            break;
        //联查 授信额度
        case "CreditAmount":
            if (list.checkSelected.call(this, false)) {
                let balanceinfo = {
                    pk_protocol:
                        selectDatas[0] &&
                        selectDatas[0].data.values["ccno"] &&
                        selectDatas[0].data.values["ccno"].value,
                    pk_currtype:
                        selectDatas[0] &&
                        selectDatas[0].data.values["pk_cccurrtype"] &&
                        selectDatas[0].data.values["pk_cccurrtype"].value,
                    pk_org:
                        selectDatas[0] &&
                        selectDatas[0].data.values["pk_org"] &&
                        selectDatas[0].data.values["pk_org"].value,
                    credittype:
                        selectDatas[0] &&
                        selectDatas[0].data.values["pk_cctype"] &&
                        selectDatas[0].data.values["pk_cctype"].value,
                    pk_bankdoc:
                        selectDatas[0] &&
                        selectDatas[0].data.values["ccbank"] &&
                        selectDatas[0].data.values["ccbank"].value
                };
                common.linkCredit.call(this, balanceinfo);
            }
            break;
        //联查 审批详情
        case "ApproveDetail":
            if (list.checkSelected.call(this, false)) {
                // 控制联查第一条，不控制选择一条
                common.linkApproveDetail.call(this, pks[0]);
            }
            break;
        //联查 资金计划
        case "FundPlan":
            if (list.checkSelected.call(this, false)) {
                common.linkNtb.call(this, pks[0]);
            }
            break;
        //联查 凭证
        case "Voucher":
            let voucherArr = [];
            if (list.checkSelected.call(this)) {
                if(!(selectDatas[0].data.values["voucher"].value)){
                    toast({
                        color: "warning",
                        content:
                            this.state.json["fbmpublic-000050"]/* 国际化处理： 未查到凭证*/
                    });
                    return;
                }
                // 其他单据的联查凭证，与上面隔离，不知道上面的为什么这么做
                //selectDatas.map(val => { 只联查一个凭证
                    let Values = selectDatas[0].data.values;
                    voucherArr.push({
                        pk_billtype: this.billtype,
                        pk_group: Values.pk_group && Values.pk_group.value,
                        pk_org: Values.pk_org && Values.pk_org.value,
                        relationID:
                            Values[this.primaryId] &&
                            Values[this.primaryId].value
                    });
               // });
                common.linkVoucher.call(this, voucherArr);
            }
            break;
        //联查 账户余额
        case "Balance":
            let balanceData = [
                {
                    pk_org:
                        selectDatas[0].data.values["pk_org"] &&
                        selectDatas[0].data.values["pk_org"].value,
                    pk_account:
                        selectDatas[0].data.values[this.fields.issueAccount] &&
                        selectDatas[0].data.values[this.fields.issueAccount].value
                }
            ];
            if (list.checkSelected.call(this, false)) {
                common.linkBankBalance.call(this, balanceData);
            }
            break;
        // 联查计划预算
        case "LinkBudgetPlan":
            if (!this.fullAggClassName) {
                /* 国际化处理： 全路径类名错误，请检查！*/
                toast({
                    color: "warning",
                    content:
                        this.state.json["fbmpublic-000014"] + this.fullAggClassName
                });
                return;
            }
            if (list.checkSelected.call(this, false)) {
                common.linkNtb.call(this, pks[0]);
            }
            break;
        // 联查票据台账
        case "LinkSDBook":
            if (list.checkSelected.call(this, false)) {
                let pk_register =
                    selectDatas[0].data.values["pk_register"].value;
                common.linkLinkSDBook.call(this, pk_register);
            }
            break;
        // 联查 担保合同
        case "Guarantee":
            if (list.checkSelected.call(this, false)) {
                let impawnmode =
                    selectDatas[0].data.values["impawnmode"] &&
                    selectDatas[0].data.values["impawnmode"].value;
                // 票据池或信用
                if (impawnmode === "BILLPOOL" || impawnmode === "CREDIT") {
                    /* 国际化处理：单据没有使用担保合同，无法联查担保*/
                    toast({
                        color: "warning",
                        content: this.state.json["fbmpublic-000081"]
                    });
                    return;
                }
                let pk_register =
                    selectDatas[0].data.values["pk_register"] &&
                    selectDatas[0].data.values["pk_register"].value;
                props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/list", {
                    billtype: "36W2",
                    pagecode: "36620GCL_LIST",
                    scene: "linksce",
                    sence: "4",
                    id: pk_register
                });
            }
            break;
        // 核销
        case "Destroy":
            /* 国际化处理： 核销为不可逆操作，是否核销？*/
            let destroyMsg = this.state.json["fbmpublic-000078"];
            promptBox({
                color: "warning",
                /* 国际化处理：核销*/
                title: this.state.json["fbmpublic-000077"],
                content: destroyMsg,
                beSureBtnClick: () => {
                    list.listDestroy.call(this, {
                        isMulti: true,
                        data: { pks, pkMapTs }
                    });
                }
            });

            break;
        //制证
        case "MakeVoucher":
            if (selectDatas && selectDatas.length > 1 && this.pageId == "36180PDT_LIST") {
                toast({
                    color: "info",
                    content: this.state.json[
                        "fbmpublic-000085"
                    ] /* 国际化处理： 请选择一条数据*/
                });
                return;
            }
            list.listMakeVoucher.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //取消制证
        case "CancelVoucher":
            if (selectDatas && selectDatas.length > 1 && this.pageId == "36180PDT_LIST") {
                toast({
                    color: "info",
                    content: this.state.json[
                        "fbmpublic-000085"
                    ] /* 国际化处理： 请选择一条数据*/
                });
                return;
            }
            list.listCancelVoucher.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        // 取消作废
        case "CancelInvalid":
            list.listCancelInvalid.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        // 退回
        case "Return":
            this.setState(
                {
                    returnComShow: !this.state.returnComShow,
                    disabledData: {
                        pks,
                        pkMapTs,
                        pkMapRowIndex
                    }
                },
                () => {
                    this.props.form.setFormStatus(this.returnReason, "edit");
                }
            );
            break;
        // 作废
        case "Disabled":
        case "consignBankDisable":
            this.setState(
                {
                    disabledComShow: !this.state.disabledComShow,
                    disabledData: {
                        pks,
                        pkMapTs
                    }
                },
                () => {
                    this.props.form.setFormStatus(this.disableReason, "edit");
                }
            );
            break;
        case "Invalid":
            this.setState(
                {
                    disabledComShow: !this.state.disabledComShow,
                    disabledData: {
                        pks,
                        pkMapTs
                    }
                },
                () => {
                    this.props.form.setFormStatus(this.disableReason, "edit");
                }
            );
            break;
        // 取消作废
        case "CancelDisabled":
        case "consignCancelDisable":
            list.listCancelInvalid.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        // 发送指令
        case "SendInstruction":
            list.listSendInstruction.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        // 收回指令
        case "CancelInstruction":
            list.listCancelInstruction.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //下面两个是额度管理的指令
        // 额度申请
        case "RequestList":
            if (list.checkSelected.call(this, false)) {
                let pk_srcbill =
                selectDatas &&
                selectDatas.map(
                    item => item.data.values["pk_srcbill"].value
                );
                common.linkQuotaApply.call(this, pk_srcbill[0]);
            }
            break;
        // 单位下拨可用额度
        case "UnitQuota":
            if (list.checkSelected.call(this, false)) {
                let unitQuotapk = selectDatas[0].data.values[this.primaryId].value;
                common.linkUnitQuota.call(this, unitQuotapk);
            }
            break;
        // 额度上收
        case "Upquota":
            if (list.checkSelected.call(this, false)) {
                common.linkUpquota.call(this, pks);
            }
            break;
        // 额度下拨
        case "Downquota":
            list.listDownquota.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //下面三个是票据退票操作
        // 冲销
        case "Transform":
            list.listTransform.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        // 取消冲销
        case "CancelTransform":
            list.listCancelTransform.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //下面三个是票据质押、池内质押的指令
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
                            this.props.form.setFormStatus(
                                this.impawnbackAreaCode,
                                "edit"
                            );
                            // 获取第一条选中行 pk_org
                            let selectDataPk_org =
                                selectDatas[0].data.values.pk_org.value;
                            // 设置质押回收人参照按财务组织过滤
                            let meta = this.props.meta.getMeta();
                            meta[this.impawnbackAreaCode].items = meta[
                                this.impawnbackAreaCode
                            ].items.map(item => {
                                if (item.attrcode === "impawnbackpersonid") {
                                    item.queryCondition = () => {
                                        return {
                                            pk_org: selectDataPk_org
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
            list.cancelImpawnBack.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //质押/质押收回撤回
        case "WithdrawImpawn":
            list.withdrawImpawn.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //解除质押签收
        case "ImpawnBackSign":
            list.impawnBackSign.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;

        // 受理
        case "Accept":
            list.listAccept.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;

        // 取消受理
        case "UnAccept":
            list.listUnAccept.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        // 委托办理
        case "Commission":
            list.listCommission.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        // 跳转到票据签发
        case "SignLink":
            if (selectDatas.length > 1) {
                /* 国际化处理： 请选择单条数据操作！*/
                toast({
                    color: "warning",
                    content: this.state.json["fbmpublic-000092"]
                });
                return;
            }
            common.signLink.call(this, pks[0])
            break;
        // 联查开票申请单
        case "SignApplyLink":
            if (list.checkSelected.call(this, false)) {
                let signApplyPk = selectDatas[0].data.values["pk_signapply"]
                    && selectDatas[0].data.values["pk_signapply"].value;
                common.signApplyLink.call(this, signApplyPk);
            }
            break;

        // 联查票据签发单
        case "SignBillLink":
            if (list.checkSelected.call(this, false)) {
                common.SignBillLink.call(this, pks[0]);
            }
            break;

        // 联查票据付款单
        case "AcceptBillLink":
            if (list.checkSelected.call(this, false)) {
                let pk_accept = selectDatas[0].data.values["pk_srcbill"]
                    && selectDatas[0].data.values["pk_srcbill"].value;
                common.acceptLink.call(this, pk_accept);
            }
            break;

        // 联查应付票据贴现单
        case "BuyerDiscountBillLink":
            if (list.checkSelected.call(this, false)) {
                let pk_buyerdiscount = selectDatas[0].data.values["pk_srcbill"]
                    && selectDatas[0].data.values["pk_srcbill"].value;
                common.buyerDiscountLink.call(this, pk_buyerdiscount);
            }
            break;

        // 联查票据签发单
        case "RegisterBillLink":
            if (list.checkSelected.call(this, false)) {
                let registerPK = selectDatas[0].data.values["pk_parent"]
                    && selectDatas[0].data.values["pk_parent"].value;
                common.registerLink.call(this, registerPK);
            }
            break;

        // 取消委托办理
        case "CommissionCancel":
            list.listUnCommission.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        // 贴现办理
        case "discountTransact":
            if (selectDatas && selectDatas.length > 1) {
                toast({
                    color: "info",
                    content: this.state.json[
                        "fbmpublic-000015"
                    ] /* 国际化处理： 请选择一条数据*/
                });
                return;
            }
            if (list.checkSelected.call(this, false)) {
                let pk_discount = selectDatas[0].data.values["pk_discount"].value;
                let pk_billtypecode = selectDatas[0].data.values["pk_billtypecode"];
                common.discountTransact.call(this, pk_discount, pk_billtypecode);
            }
            break;
        //联查应付票据贴现
        case "BuyerDiscount":
            if (list.checkSelected.call(this, false)) {
                let returnpk =
                    selectDatas[0].data.values[this.primaryId].value;
                common.linkBuyerDiscount.call(this, returnpk);
            }
            break;
        //联查内部结算账户
        case "LinkInnerAccount":
            if (list.checkSelected.call(this, false)) {
                let accpk = selectDatas[0].data.values[this.pk_inbalaacc]
                    && selectDatas[0].data.values[this.pk_inbalaacc].value;
                common.linkInnerAccount.call(this, accpk);
            }
            break;
        //联查内部保证金账户
        case "LQueryInSecurityAcc":
            if (list.checkSelected.call(this, false)) {
                let accpk = selectDatas[0].data.values[this.pk_insecurityacc]
                    && selectDatas[0].data.values[this.pk_insecurityacc].value;
                common.linkInnerAccount.call(this, accpk);
            }
            break;
        // 记账
        case "Tally":
            this.setState(
                {
                    tallyComShow: !this.state.tallyComShow,
                    disabledData: {
                        pks,
                        pkMapTs
                    }
                },
                () => {
                    this.props.form.setFormStatus(this.tallyPlan, "edit");
                }
            );
            break;
        // 取消记账
        case "CancelTally":
            list.listCancelTally.call(this, {
                isMulti: true,
                data: { pks, pkMapTs }
            });
            break;
        //联查收付单据
        case "LinkReceAndPaybill":
            if (list.checkSelected.call(this, false)) {
                let primaryId = selectDatas[0].data.values[this.primaryId];
                let vbillno = selectDatas[0].data.values["vbillno"];
                let pk_register = selectDatas[0].data.values["pk_register"];
                let pk_group = selectDatas[0].data.values["pk_group"];
                common.linkReceAndPaybill.call(this,
                    primaryId && primaryId.value,
                    vbillno && vbillno.value,
                    pk_register && pk_register.value,
                    pk_group && pk_group.value);
            }
            break;
        default:
            break;
    }
}

/**
 * 数据导出
 * @param {} props
 */
function doDataExport(props) {
    let selectData = props.editTable.getCheckedRows(this.tableId);
    if (selectData && selectData.length == 0) {
        toast({
            color: "info",
            content: this.state.json[
                "fbmpublic-000015"
            ] /* 国际化处理： 请选择一行数据进行操作！*/
        });
        return;
    }

    let seleckpks = [];
    selectData.forEach(e => {
        seleckpks.push(e.data.values[this.primaryId].value);
    });

    if (seleckpks.length > 0) {
        this.selectedPKS = seleckpks;
    }
    props.modal.show("exportFileModal"); //不需要导出的只执行这行代码
}

/**
 * 模板导出
 * @param {} props
 */
function doExcelExport(props) {
    this.selectedPKS = [];
    props.modal.show("exportFileModal"); //不需要导出的只执行这行代码
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/