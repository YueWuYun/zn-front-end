/*3qjakgBz8U307oLILQl1lx3XstScvLgmLN/C321/eZA4AjtcYm0K1c08g9qyfA+E*/
/**
 * 贷款管理列表表体按钮事件
 * @author：zhangyangz
 */
import { ajax, toast, promptBox } from "nc-lightapp-front";
import { bodyBtnOperation } from "./listEvent";
import { checkEditRight } from "./listEvent";
import { go2CardCheck } from "../../../tmpub/pub/util/index";
/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 * @param {*} index   index
 */
export function bodyButtonClick(key, record, index) {
    let pk = record[this.primaryId] && record[this.primaryId].value;
    switch (key) {
        case "edit_inner": //修改
            checkEditRight.call(this, this.props, record[this.primaryId].value).then((res) => {
                go2CardCheck({
                    props: this.props,
                    url: this.gotocardcheck,
                    pk: record[this.primaryId].value,
                    ts: record["ts"].value,
                    checkTS: record["ts"].value ? true : false,
                    checkSaga: this.isCheckSaga ? true : false,
                    fieldPK: this.primaryId,
                    go2CardFunc: () => {
                        this.props.pushTo("/card", {
                            status: "edit",
                            id: record[this.primaryId].value,
                            pagecode: this.pageCode
                        });
                    }
                })
            });
            break;
        case "del_inner": //删除
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000017'],/* 国际化处理： 删除：*/
                record,
                this.listDelUrl,
                this.state.json['36360PUBLIC-000018'],/* 国际化处理： 删除成功!*/
                index
            );
            break;
        case "commit_inner": //提交
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000011'],/* 国际化处理： 提交：*/
                record,
                this.listCommitUrl,
                this.state.json['36360PUBLIC-000012'],/* 国际化处理： 提交成功!*/
                index
            );
            break;
        case "uncommit_inner": //收回
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000039'],/* 国际化处理： 收回：*/
                record,
                this.listUnCommitUrl,
                this.state.json['36360PUBLIC-000040'],/* 国际化处理： 收回成功!*/
                index
            );
            break;
        case "approvalDetail_inner": //审批详情
            this.setState({
                showApproveDetail: true,
                billInfo: { billId: pk }
            });
            break;
        case "change_inner": //变更
            let prepayinterest;
            if (record) {
                prepayinterest = record.prepayinterest;
            }
            if (prepayinterest && prepayinterest.value) {
                toast({
                    color: "warning",
                    content: this.state.json["36360IP-000054"]
                }); /* 国际化处理： 先付息单据不可展期*/
                return;
            }
            let saga_frozen;
            if(record) {
                saga_frozen=record.saga_frozen;
            }
            if(saga_frozen&&saga_frozen.value==1) {
                toast({
                    color: "danger",
                    content: this.state.json["36360IP-000057"]
                }); /* 国际化处理： 冻结单据不可变更*/
                return;
            }
            go2CardCheck({
                props: this.props,
                url: this.gotocardcheck,
                pk: record[this.primaryId].value,
                ts: record["ts"].value,
                checkTS: record["ts"].value ? true : false,
                checkSaga: this.isCheckSaga ? true : false,
                fieldPK: this.primaryId,
                go2CardFunc: () => {
                    this.props.pushTo("/card", {
                        status: "change",
                        id: record[this.primaryId].value,
                        pagecode: this.pageCode
                    });
                }
            })
            break;
        case "viewVersion_inner": //历史版本
            this.props.pushTo("/card", {
                status: "browse",
                pageType: "version",
                id: record[this.primaryId].value,
                pagecode: this.pageCode
            });
            break;
        case "delete_version": //删除版本
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000063'],/* 国际化处理： 删除版本*/
                    content: this.state.json['36360PUBLIC-000064'],/* 国际化处理： 是否删除当前最新版本?*/
                    beSureBtnClick: bodyBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000041'],/* 国际化处理： 删除版本：*/
                        record,
                        this.delVersionUrl,
                        this.state.json['36360PUBLIC-000042'],/* 国际化处理： 删除版本成功!*/
                        index
                    )
                });
            } else {
                bodyBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000041'],/* 国际化处理： 删除版本：*/
                    record,
                    this.delVersionUrl,
                    this.state.json['36360PUBLIC-000042'],/* 国际化处理： 删除版本成功!*/
                    index
                );
            }
            break;
        case "Bookkeeping_inner"://记账
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000047'],/* 国际化处理： 记账：*/
                record,
                this.tallyUrl,
                this.state.json['36360PUBLIC-000048'],/* 国际化处理： 记账成功!*/
                index
            );
            break;
        case "unBookkeeping_inner"://取消记账
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000049'],/* 国际化处理： 取消记账：*/
                record,
                this.untallyUrl,
                this.state.json['36360PUBLIC-000050'],/* 国际化处理： 取消记账成功!*/
                index
            );
            break;
        case "accreditation_inner": //制证
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000025'],/* 国际化处理： 制证：*/
                record,
                this.vouchermakeUrl,
                this.state.json['36360PUBLIC-000026'],/* 国际化处理： 制证成功!*/
                index
            );
            break;
        case "unAccreditation_inner": //取消制证
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000027'],/* 国际化处理： 取消制证：*/
                record,
                this.vouchercancelUrl,
                this.state.json['36360PUBLIC-000028'],/* 国际化处理： 取消制证成功!*/
                index
            );
            break;
        case "calcIntst_inner": //计息
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000029'],/* 国际化处理： 计息：*/
                record,
                this.calcIntstUrl,
                this.state.json['36360PUBLIC-000030'],/* 国际化处理： 计息成功!*/
                index
            );
            break;
        case "cancelIntst_inner": //取消计息
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000031'],/* 国际化处理： 取消计息：*/
                record,
                this.cancelIntstUrl,
                this.state.json['36360PUBLIC-000032'],/* 国际化处理： 取消计息成功!*/
                index
            );
            break;
        case "preGetIntst_inner": //预提
            this.setState({
                modalInfo: {
                    record,
                    index
                },
                showWithholdingModal: true
            });
            break;
        case "cancelGetIntst_inner": //取消预提
            bodyBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000043'],/* 国际化处理： 取消预提：*/
                record,
                this.cancelGetIntstUrl,
                this.state.json['36360PUBLIC-000044'],/* 国际化处理： 取消预提成功!*/
                index
            );
            break;
        case "tryCal_inner": //试算
            this.setState({
                modalInfo: {
                    record,
                    index
                },
                showInterestTrialModal: true
            });
            break;
        case "termination_inner": //终止
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000055'],/* 国际化处理： 结束协议*/
                    content: this.state.json['36360PUBLIC-000056'],/* 国际化处理： 是否结束当前协议?*/
                    beSureBtnClick: bodyBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000019'],/* 国际化处理： 终止：*/
                        record,
                        this.terminationUrl,
                        this.state.json['36360PUBLIC-000020'],/* 国际化处理： 终止成功!*/
                        index
                    )
                });
            } else {
                if(this.primaryId=='pk_innerloanpay') {
                    let preinterest;
                    if (record) {
                        preinterest = record.prepayinterest;
                    }
                    if(preinterest&&preinterest.value) {
                        toast({
                            color: "warning",
                            content: this.state.json["36360IP-000055"]
                        }); /* 国际化处理： 先付息单据不可终止*/
                        return;
                    }
                }
                bodyBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000019'],/* 国际化处理： 终止：*/
                    record,
                    this.terminationUrl,
                    this.state.json['36360PUBLIC-000020'],/* 国际化处理： 终止成功!*/
                    index
                );
            }
            break;
        case "unTermination_inner": //取消终止
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000057'],/* 国际化处理： 取消结束协议*/
                    content: this.state.json['36360PUBLIC-000058'],/* 国际化处理： 是否取消结束当前协议?*/
                    beSureBtnClick: bodyBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000021'],/* 国际化处理： 取消终止：*/
                        record,
                        this.unTerminationUrl,
                        this.state.json['36360PUBLIC-000022'],/* 国际化处理： 取消终止成功!*/
                        index
                    )
                });
            } else {
                bodyBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000021'],/* 国际化处理： 取消终止：*/
                    record,
                    this.unTerminationUrl,
                    this.state.json['36360PUBLIC-000022'],/* 国际化处理： 取消终止成功!*/
                    index
                );
            }

            break;
        case "frozen_inner": //冻结
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000059'],/* 国际化处理： 冻结协议*/
                    content: this.state.json['36360PUBLIC-000060'],/* 国际化处理： 是否冻结当前协议?*/
                    beSureBtnClick: bodyBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000051'],/* 国际化处理： 冻结：*/
                        record,
                        this.frozenUrl,
                        this.state.json['36360PUBLIC-000052'],/* 国际化处理： 冻结成功!*/
                        index
                    )
                });
            } else {
                bodyBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000051'],/* 国际化处理： 冻结：*/
                    record,
                    this.frozenUrl,
                    this.state.json['36360PUBLIC-000052'],/* 国际化处理： 冻结成功!*/
                    index
                );
            }

            break;
        case "unFrozen_inner": //取消冻结
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000061'],/* 国际化处理： 取消冻结协议*/
                    content: this.state.json['36360PUBLIC-000062'],/* 国际化处理： 是否取消冻结当前协议?*/
                    beSureBtnClick: bodyBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000053'],/* 国际化处理： 取消冻结：*/
                        record,
                        this.unFrozenUrl,
                        this.state.json['36360PUBLIC-000054'],/* 国际化处理： 取消冻结成功!*/
                        index
                    )
                });
            } else {
                bodyBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000053'],/* 国际化处理： 取消冻结：*/
                    record,
                    this.unFrozenUrl,
                    this.state.json['36360PUBLIC-000054'],/* 国际化处理： 取消冻结成功!*/
                    index
                );
            }

            break;
        case "back_inner":
            this.props.form.setFormStatus('list_back', "edit");
            this.props.form.setFormItemsDisabled('list_back', { 'backres': false });
            this.setState({
                backdisplay: true,
                record: record,
                index: index
            });
        default:
            break;
    }
}

/*3qjakgBz8U307oLILQl1lx3XstScvLgmLN/C321/eZA4AjtcYm0K1c08g9qyfA+E*/