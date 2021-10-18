/*9k43NIHQ9Q7ex8VdWjYvNghxhPxe40FJhi0kADAdN6htxr9z/xQR73olGZN+HRJ1*/
/**
 * 贷款管理列表头部按钮事件
 * @author：zhangyangz
 */
import {
    ajax,
    toast,
    print,
    pageTo,
    cardCache,
    cacheTools,
    promptBox
} from "nc-lightapp-front";
import {
    fileMgrList,
    headBtnOperation,
    searchBtnClick,
    searchCommonClick,
    linkNtb
} from "./listEvent";
let { getDefData } = cardCache;
import { common_btn } from './cons/constant';
const linkInterestConst = {
    //组织
    "0": {
        url: "/tmpub/pub/interestrate_org/main/index.html#/card",
        appcode: "36010IRCO",
        pagecode: "36010IRCO_card"
    },
    //集团
    "1": {
        url: "/tmpub/pub/interestrate_group/main/index.html#/card",
        appcode: "36010IRCG",
        pagecode: "36010IRCG_card"
    },
    //全局
    "2": {
        url: "/tmpub/pub/interestrate_global/main/index.html#/card",
        appcode: "36010IRC",
        pagecode: "36010IRC_card"
    }
};
/**
 * 列表头部按钮交互
 * @param {*} props        页面内置对象
 * @param {*} id           注册按钮编码
 */
export function listHeadBtnClick(props, id) {
    let selectDatas = props.table.getCheckedRows(this.tableId); //获取已勾选数据
    if (!["add_btn", "refresh_btn", "refresh_n"].includes(id) && !selectDatas.length) {
        //非新增刷新按钮时要判断是否已勾选数据
        toast({ color: "warning", content: this.state.json['36630PUBLIC-000013'] });/* 国际化处理： 请选择数据！*/
        return;
    }
    //主键
    let pks =
        selectDatas &&
        selectDatas.map(
            item =>
                item.data.values &&
                item.data.values[this.primaryId] &&
                item.data.values[this.primaryId].value
        );
    switch (id) {
        //头部 新增
        case "add_btn":
            props.pushTo("/card", {
                status: "add",
                pagecode: this.pageCode
            });
            break;
        //头部 删除
        case "delete":
            promptBox({
                color: "warning",
                title: this.state.json['36630PUBLIC-000014'],/* 国际化处理： 删除*/
                content:
                    selectDatas.length == 1
                        ? this.state.json['36630PUBLIC-000015']/* 国际化处理： 确定要删除吗？*/
                        : this.state.json['36630PUBLIC-000016'],/* 国际化处理： 确定要删除所选数据吗？*/
                beSureBtnClick: () => {
                    headBtnOperation.call(
                        this,
                        this.state.json['36630PUBLIC-000017'],/* 国际化处理： 删除：*/
                        { pks },
                        this.listDelUrl,
                        this.state.json['36630PUBLIC-000018']/* 国际化处理： 删除成功!*/
                    );
                }
            });
            break;
        //头部 终止
        case "termination":
            headBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000019'],/* 国际化处理： 终止：*/
                { pks },
                this.terminationUrl,
                this.state.json['36630PUBLIC-000020']/* 国际化处理： 终止成功!*/
            );
            break;
        //头部 取消终止
        case "unTermination":
            headBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000021'],/* 国际化处理： 取消终止：*/
                { pks },
                this.unTerminationUrl,
                this.state.json['36630PUBLIC-000022']/* 国际化处理： 取消终止成功!*/
            );
            break;
        //头部 打印
        case "print":
            this.printData.oids = pks;
            print("pdf", `${this.printUrl}.do`, {
                ...this.printData,
                userjson: JSON.stringify({ info: selectDatas })
            });
            break;
        //头部 输出
        case "printOut":
            let { printOut } = this.state;
            printOut.userjson = JSON.stringify({ info: selectDatas });
            printOut.oids = pks;
            this.setState({ printOut }, () => {
                this.refs.printOutput.open();
            });
            break;
        //头部 审批详情
        case "approveDetail":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            this.setState({
                showApproveDetail: true,
                billInfo: { billId: pks[0] }
            });
            break;
        //头部 历史版本
        case "viewVersion":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            this.props.pushTo("/card", {
                status: "browse",
                pageType: "version",
                id: pks,
                pagecode: this.pageCode
            });
            break;
        //头部 附件
        case "Attachment":
            if (selectDatas.length !== 1) {
                toast({
                    content: this.state.json['36630PUBLIC-000024'],/* 国际化处理： 请选择一条数据，上传附件！*/
                    color: "warning"
                });
                return;
            }
            fileMgrList.call(this, props, selectDatas);
            break;
        //头部 刷新
        case "refresh":
            this.setState({
                isListFresh: true
            });
            let searchInfo = this.props.search.getQueryInfo(this.searchId);
            if (
                searchInfo.querycondition &&
                searchInfo.querycondition.conditions &&
                !searchInfo.querycondition.conditions.length
            ) {
                return;
            }
            searchInfo &&
                JSON.stringify(searchInfo) !== "{}" &&
                searchBtnClick.call(this, props);
            break;
        //头部 刷新(利息清单 计息)
        case "refresh_n":
            this.setState({
                isListFresh: true
            });
            let searchInfo_n = this.props.search.getQueryInfo(this.searchId);
            searchInfo_n &&
                JSON.stringify(searchInfo_n) !== "{}" &&
                searchCommonClick.call(this, props);
            break;
        //头部 制证
        case "accreditation":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            headBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000025'],/* 国际化处理： 制证：*/
                { pks },
                this.vouchermakeUrl,
                this.state.json['36630PUBLIC-000026']/* 国际化处理： 制证成功!*/
            );
            break;
        //头部 取消制证
        case "unAccreditation":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            headBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000027'],/* 国际化处理： 取消制证：*/
                { pks },
                this.vouchercancelUrl,
                this.state.json['36630PUBLIC-000028']/* 国际化处理： 取消制证成功!*/
            );
            break;
        //头部 计息
        case "calcIntst":
            headBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000029'],/* 国际化处理： 计息：*/
                { pks },
                this.calcIntstUrl,
                this.state.json['36630PUBLIC-000030']/* 国际化处理： 计息成功!*/
            );
            break;
        //头部 取消计息
        case "cancelIntst":
            headBtnOperation.call(
                this,
                this.state.json['36630PUBLIC-000031'],/* 国际化处理： 取消计息：*/
                { pks },
                this.cancelIntstUrl,
                this.state.json['36630PUBLIC-000032']/* 国际化处理： 取消计息成功!*/
            );
            break;
        //头部 联查资金计划
        case "fundPlan":
            linkNtb.call(this, props, pks[0]);
            break;
        //头部 联查借款账户余额
        case "loanAccountBalance":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            doPaymentAccount.call(this, props, selectDatas);
            break;
        // 头部 联查利息清单
        case "interestList":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let pk_financepay =
                selectDatas[0] &&
                selectDatas[0].data.values["pk_financepay"] &&
                selectDatas[0].data.values["pk_financepay"].value;
            linkInterest.call(this, props, pk_financepay);
            break;
        //头部 联查利率
        case "rate":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }

            let rate =
                selectDatas[0] && selectDatas[0].data.values["pk_rate"].value;
            ajax({
                url: "/nccloud/tmpub/tmbd/linkinterest.do",
                data: { rate },
                success: res => {
                    let { data } = res;
                    if (data) {
                        let { url, appcode, pagecode } = linkInterestConst[
                            data.rateclass
                        ];
                        pageTo.openTo(url, {
                            status: "browse",
                            appcode: appcode,
                            pagecode: pagecode,
                            scene: "linksce",
                            id: rate
                        });
                    }
                }
            });
            break;
        //头部 联查结息日
        case "settledate":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let iadate =
                this.primaryId == "pk_financepay"
                    ? selectDatas[0] &&
                      selectDatas[0].data.values["pk_settledate"]
                    : selectDatas[0] && selectDatas[0].data.values["iadate"];
            pageTo.openTo("/tmpub/pub/settledate/main/index.html#/card", {
                status: "browse",
                appcode: "36010ISDC",
                pagecode: "36010ISDC_CARD_01",
                scene: "linksce",
                id: iadate && iadate.value
            });
            break;
        //头部 联查贷款申请
        case "apply":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let applyno =
                selectDatas[0] && selectDatas[0].data.values["applyno"];
            pageTo.openTo("/cdmc/cdm/apply/main/index.html#/card", {
                status: "browse",
                appcode: "36630BLA",
                pagecode: "36630BLAL_CARD",
                scene: "linksce",
                id: applyno && applyno.value
            });
            break;
        //头部 联查贷款合同
        case "contract":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let contractid =
                this.primaryId == "pk_financepay"
                    ? selectDatas[0] && selectDatas[0].data.values["contractid"]
                    : selectDatas[0] &&
                      selectDatas[0].data.values["pk_contract"];
            pageTo.openTo("/cdmc/cdm/contract/main/index.html#/card", {
                status: "browse",
                appcode: "36630BLC",
                pagecode: "36630BLCL_CARD",
                scene: "linksce",
                id: contractid && contractid.value
            });
            break;
        //头部 联查贷款放款
        case "financepay":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let loancode =
                this.primaryId == "pk_repayintst"
                    ? selectDatas[0] && selectDatas[0].data.values["loancode"]
                    : selectDatas[0] &&
                      selectDatas[0].data.values["pk_financepay"];
            pageTo.openTo("/cdmc/cdm/financepay/main/index.html#/card", {
                status: "browse",
                id: loancode && loancode.value,
                appcode: "36630BDLC",
                pagecode: "36630BDLCL_CARD",
                scene: "linksce"
            });
            break;
        //头部 联查贷款还本
        case "repay":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let pk_srcbill =
                selectDatas[0] && selectDatas[0].data.values["pk_srcbill"];
            if (!pk_srcbill.value) {
                toast({ content: this.state.json['36630PUBLIC-000033'], color: "warning" });/* 国际化处理： 不允许联查还本单*/
                return;
            }
            pageTo.openTo("/cdmc/cdm/repayprcpl/main/index.html#/card", {
                status: "browse",
                id: pk_srcbill && pk_srcbill.value,
                appcode: "36630BLP",
                pagecode: "36630BLPL_CARD",
                scene: "linksce"
            });
            break;
        //头部 联查贷款付息
        case "repayintst":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let pk_repayintst =
                this.primaryId == selectDatas[0] &&
                selectDatas[0].data.values["pk_repayintst"];
            pageTo.openTo("/cdmc/cdm/repayintst/main/index.html#/card", {
                status: "browse",
                id: loancode && loancode.value,
                appcode: "36630BLPIL",
                pagecode: "36630BLPIL_CARD",
                scene: "linksce"
            });
            break;
        //头部 联查凭证
        case "voucher":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36630PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            voucher.call(this, selectDatas);
            break;
        default:
            break;
    }
}
/**
 * 联查凭证
 * @param {*} appcode,pagecode
 */
export const getappurl = (appcode, pagecode) => {
    let appdata = {
        appCode: appcode,
        pageCode: pagecode
    };
    let appurl;
    ajax({
        url: "/nccloud/cdmc/common/appregisterurlquery.do",
        data: appdata,
        async: false,
        success: res => {
            let { success, data } = res;
            if (success) {
                appurl = res.data;
            }
        }
    });
    return appurl;
};
/**
 * 联查 收款账户
 * @param  props
 */
function doPaymentAccount(props, selectDatas) {
    let pk_org =
        selectDatas[0].data.values["pk_org"] &&
        selectDatas[0].data.values["pk_org"].value;
    let pk_account =
        this.primaryId == "pk_repayintst"
            ? selectDatas[0].data.values["loanunitid"] &&
              selectDatas[0].data.values["loanunitid"].value
            : selectDatas[0].data.values["pk_loanbankacc"] &&
              selectDatas[0].data.values["pk_loanbankacc"].value;
    let bankaccbalance_rarr = [];
    let querydata = {
        // 财务组织
        pk_org: pk_org,
        // 银行账户id
        pk_account: pk_account
    };
    bankaccbalance_rarr.push(querydata);
    this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true
    });
}
/**
 * 联查 凭证
 * @param  selectDatas 选中数据
 */
function voucher(selectDatas) {
    // 拼装凭证数据
    let voucherData = selectDatas;
    let voucherArr = [];
    //处理选择数据
    voucherData.forEach(val => {
        let pk_group =
            val.data.values.pk_group && val.data.values.pk_group.value;
        let pk_org = val.data.values.pk_org && val.data.values.pk_org.value;
        let relationID =
            val.data.values[this.primaryId] &&
            val.data.values[this.primaryId].value;
        let pk_billtype = this.pk_billtype;
        let voucher = {
            pk_billtype: pk_billtype,
            pk_group: pk_group,
            pk_org: pk_org,
            relationID: relationID
        };
        voucherArr.push(voucher);
    });
    ajax({
        url: "/nccloud/cdmc/common/loanlinkbill.do", //业务组自己写入口类
        data: voucherArr,
        success: res => {
            if (res.success) {
                let srcCode = res.data.src;
                if ("_LinkVouchar2019" == srcCode) {
                    //走联查
                    if (res.data.des) {
                        //跳转到凭证界面
                        if (res.data.pklist) {
                            if (res.data.pklist.length == 1) {
                                //单笔联查
                                this.props.openTo(res.data.url, {
                                    status: "browse",
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    id: res.data.pklist[0],
                                    n: this.state.json['36630PUBLIC-000034'], //'联查凭证'

                                    backflag: "noback"
                                });
                                return;
                            } else {
                                //多笔联查
                                cacheTools.set("checkedData", res.data.pklist);
                                this.props.openTo(res.data.url, {
                                    status: "browse",
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    n: this.state.json['36630PUBLIC-000034'] //'联查凭证'
                                });
                                return;
                            }
                        }
                    } else {
                        //跳转到会计平台 这里的appcode是业务组的小应用编码
                        cacheTools.set(this.appcode + srcCode, res.data.pklist);
                    }
                }else {
                    if(res.data.src && res.data.src == "_Preview2019") {
                        toast({
                            color: "warning",
                            content: this.state.json["36630PUBLIC-000045"]
                        });
                        return;
                    }
                }
                //打开凭证节点
                this.props.openTo(res.data.url, {
                    status: "browse",
                    appcode: res.data.appcode,
                    pagecode: res.data.pagecode,
                    scene: this.appcode + srcCode,
                    n: this.state.json['36630PUBLIC-000034'] // '凭证预览' 凭证使用这个参数,会计平台不用
                });
            }
        }
    });
}
/**
 * 联查利息清单
 * @param  props
 * @param  pk
 */

export function linkInterest(props, pk) {
    ajax({
        url: `${this.joinintstlistUrl}.do`,
        data: { pks: [pk] },
        success: res => {
            let { data } = res;
            if (data && data.grid[this.tableId]) {
                //console.log(data);
                let rowsCount =
                    data.grid[this.tableId].rows &&
                    data.grid[this.tableId].rows.length;
                // 多条跳列表
                if (rowsCount > 1) {
                    let pks = "";
                    pks =
                        data.grid[this.tableId].rows[0].values.pk_financepay
                            .value;
                    pageTo.openTo("/cdmc/cdm/interest/main/index.html#/list", {
                        id: pks,
                        appcode: "36630BCIB",
                        pagecode: "36630BCIB_LIST"
                    });
                } else if (rowsCount == 1) {
                    // 单条跳卡片
                    let pk_interestlist =
                        data.grid[this.tableId].rows[0].values.pk_interestlist
                            .value;
                    pageTo.openTo("/cdmc/cdm/interest/main/index.html#/card", {
                        id: pk_interestlist,
                        appcode: "36630BCIB",
                        pagecode: "36630BCIB_CARD"
                    });
                }
            }
        }
    });
}

/*9k43NIHQ9Q7ex8VdWjYvNghxhPxe40FJhi0kADAdN6htxr9z/xQR73olGZN+HRJ1*/