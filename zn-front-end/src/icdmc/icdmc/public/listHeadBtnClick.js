/*9k43NIHQ9Q7ex8VdWjYvNqHOSaRzMesuRPV2YDsyKkScYtHkaVOipJBMF+2tCLH+*/
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
    linkNtb,
    selectedEvent,
    selectedEventForReceipt,
    listMultiOperator, listSingleOperator, listSingleOperatorNoRecord, searchCommonClickForRefresh
} from "./listEvent";
import {
    elecSignListPrint
} from "../../../tmpub/pub/util/index";
import {  go2CardCheck } from "../../../tmpub/pub/util/index";
let { getDefData } = cardCache;
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
    if (!["add", "refresh", "refresh_n", "copy", "commit", "unCommit", "Attachment"].includes(id) && !selectDatas.length) {
        //非新增刷新按钮时要判断是否已勾选数据
        toast({ color: "warning", content: this.state.json['36360PUBLIC-000013'] });/* 国际化处理： 请选择数据！*/
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
    
    let tss =
        selectDatas &&
        selectDatas.map(
            item =>
                item.data.values &&
                item.data.values.ts &&
                item.data.values.ts.value
        );
    switch (id) {
        //头部 新增
        case "add":
            props.pushTo("/card", {
                status: "add",
                pagecode: this.pageCode
            });
            break;
        //头部 复制
        case "copy":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            go2CardCheck({
                props: this.props,
                url: this.gotocardcheck,
                pk: pks[0],
                ts: tss[0],
                checkTS: tss[0] ? true : false,
                checkSaga: this.isCheckSaga ? true : false,
                fieldPK: this.primaryId,
                go2CardFunc: () => {
                    props.pushTo("/card", {
                        pagecode: this.pageCode,
                        status: "copy",
                        id: pks[0]
                    });
                }
            })
           
            break;
        //头部 删除
        case "delete":
            promptBox({
                color: "warning",
                title: this.state.json['36360PUBLIC-000014'],/* 国际化处理： 删除*/
                content:
                    selectDatas.length == 1
                        ? this.state.json['36360PUBLIC-000015']/* 国际化处理： 确定要删除吗？*/
                        : this.state.json['36360PUBLIC-000016'],/* 国际化处理： 确定要删除所选数据吗？*/
                beSureBtnClick: () => {
                    headBtnOperation.call(
                        this,
                        this.state.json['36360PUBLIC-000017'],/* 国际化处理： 删除：*/
                        { pks },
                        this.listDelUrl,
                        this.state.json['36360PUBLIC-000018']/* 国际化处理： 删除成功!*/
                    );
                }
            });
            break;
        //头部 提交
        case "commit":
            listMultiOperator.call(this, props, this.pageId, this.tableId, this.primaryId, this.listHeadCommitUrl, this.state.json['36360PUBLIC-000011']/* 国际化处理： 提交*/, this.dataSource, false, null, (props, data) => {
                if (!data) {
                    return;
                }
                if (Array.isArray(data)) {
                    data = data[0];
                }
                let { workflow } = data;
                //有指派信息，则指派，没有则重绘界面
                if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                    this.setState({
                        compositedata: data,
                        compositedisplay: true,
                        index: selectDatas[0].index,
                        pk: selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values[this.primaryId] && selectDatas[0].data.values[this.primaryId].value,
                        ts: selectDatas[0] && selectDatas[0].data && selectDatas[0].data.values && selectDatas[0].data.values.ts && selectDatas[0].data.values.ts.value
                    });
                }
                selectedEvent.call(this, props, this.tableId);
            });
            break;
        //头部 收回
        case "unCommit":
            listMultiOperator.call(this, props, this.pageId, this.tableId, this.primaryId,
                this.listHeadUnCommitUrl, this.state.json['36360PUBLIC-000039']/* 国际化处理： 收回*/,
                this.dataSource, false, selectedEvent.call(this, props, this.tableId));
            break;
        //头部 终止
        case "termination":
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000055'],/* 国际化处理： 结束协议*/
                    content: this.state.json['36360PUBLIC-000056'],/* 国际化处理： 是否结束当前协议?*/
                    beSureBtnClick: headBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000019'],/* 国际化处理： 终止：*/
                        { pks },
                        this.terminationUrl,
                        this.state.json['36360PUBLIC-000020']/* 国际化处理： 终止成功!*/
                    )
                });
            } else {
                headBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000019'],/* 国际化处理： 终止：*/
                    { pks },
                    this.terminationUrl,
                    this.state.json['36360PUBLIC-000020']/* 国际化处理： 终止成功!*/
                );
            }

            break;
        //头部 取消终止
        case "unTermination":
        case "unTerminate":
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000057'],/* 国际化处理： 取消结束协议*/
                    content: this.state.json['36360PUBLIC-000058'],/* 国际化处理： 是否取消结束当前协议?*/
                    beSureBtnClick: headBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000021'],/* 国际化处理： 取消终止：*/
                        { pks },
                        this.unTerminationUrl,
                        this.state.json['36360PUBLIC-000022']/* 国际化处理： 取消终止成功!*/
                    )
                });
            } else {
                headBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000021'],/* 国际化处理： 取消终止：*/
                    { pks },
                    this.unTerminationUrl,
                    this.state.json['36360PUBLIC-000022']/* 国际化处理： 取消终止成功!*/
                );
            }

            break;
        //头部 冻结
        case "frozen":
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000059'],/* 国际化处理： 冻结协议*/
                    content: this.state.json['36360PUBLIC-000060'],/* 国际化处理： 是否冻结当前协议?*/
                    beSureBtnClick: headBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000051'],/* 国际化处理： 冻结：*/
                        { pks },
                        this.frozenUrl,
                        this.state.json['36360PUBLIC-000052']/* 国际化处理： 冻结成功!*/
                    )
                });
            } else {
                headBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000051'],/* 国际化处理： 冻结：*/
                    { pks },
                    this.frozenUrl,
                    this.state.json['36360PUBLIC-000052']/* 国际化处理： 冻结成功!*/
                );
            }
            break;
        //头部 取消冻结
        case "unFrozen":
            if (this.primaryId == 'pk_incprotocol_i') {
                promptBox({
                    color: "warning",
                    title: this.state.json['36360PUBLIC-000061'],/* 国际化处理： 取消冻结协议*/
                    content: this.state.json['36360PUBLIC-000062'],/* 国际化处理： 是否取消冻结当前协议?*/
                    beSureBtnClick: headBtnOperation.bind(
                        this,
                        this.state.json['36360PUBLIC-000053'],/* 国际化处理： 取消冻结：*/
                        { pks },
                        this.unFrozenUrl,
                        this.state.json['36360PUBLIC-000054']/* 国际化处理： 取消冻结成功!*/
                    )
                });
            } else {
                headBtnOperation.call(
                    this,
                    this.state.json['36360PUBLIC-000053'],/* 国际化处理： 取消冻结：*/
                    { pks },
                    this.unFrozenUrl,
                    this.state.json['36360PUBLIC-000054']/* 国际化处理： 取消冻结成功!*/
                );
            }

            break;
        //头部 打印
        case "print":
            this.printData.oids = pks;
            print("pdf", `${this.printUrl}.do`, {
                ...this.printData,
                userjson: JSON.stringify({ info: selectDatas })
            });
            break;
        //头部 打印清单
        case "printList":
            if (!this.printListData) return;
            this.printListData.oids = pks;
            print("pdf", `${this.printListUrl}.do`, {
                ...this.printListData,
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
        //正式打印
        case 'elecsignformalPrint':
            elecSignListPrint(props, {
                url: `${this.elecPrintUrl}.do`,
                offical: true,               //是否正式打印
                appCode: this.appCode,
                nodeKey: 'OFFICAL',         //正式打印
                tableCode: this.tableId,   //列表id
                field_id: this.primaryId,
                field_billno: 'vbillno',
                validateFunc: (selectData) => {
                    if (this.appCode == '36360IP') {
                        let busistatus = selectData && selectData.data && selectData.data.values && selectData.data.values['busistatus'] && selectData.data.values['busistatus'].value;
                        if ('1' == busistatus || '2' == busistatus) {
                            return null;
                        } else {
                            return this.state.json[
                                "36360PUBLIC-000046"
                            ]/** 单据状态非审批成功！ */;
                        }
                    }
                    //内贷还本
                    if (this.appCode == '36360IRP') {
                        let busistatus = selectData && selectData.data && selectData.data.values && selectData.data.values['busistatus'] && selectData.data.values['busistatus'].value;
                        if ('1' == busistatus || '2' == busistatus) {
                            return null;
                        } else {
                            return this.state.json[
                                "36360PUBLIC-000046"
                            ]/** 单据状态非审批成功！ */;
                        }
                    }
                },
                getOrgFunc: (selectData) => {
                    if (this.appCode == '36360FCIB' || this.appCode == '36362FCIB' || this.appcode == '36362IPIR'
                        || this.appCode == '36362IPR' || this.appCode == '36362IRPR') {
                        let pk_org_r = selectData.data.values['pk_org_r'].value;
                        if (pk_org_r) {
                            return pk_org_r
                        } else
                            return null;
                    } else
                        return selectData.data.values['pk_org'].value;
                }
            })
            break;
        //补充打印
        case 'elecsigninformalPrint':
            elecSignListPrint(props, {
                url: `${this.elecPrintUrl}.do`,
                offical: false,               //是否正式打印
                appCode: this.appCode,
                nodeKey: 'INOFFICAL',         //正式打印
                tableCode: this.tableId,   //列表id
                field_id: this.primaryId,
                field_billno: 'vbillno',
                validateFunc: (selectData) => {
                    if (this.appCode == '36360IP') {
                        let busistatus = selectData && selectData.data && selectData.data.values && selectData.data.values['busistatus'] && selectData.data.values['busistatus'].value;
                        if ('1' == busistatus || '2' == busistatus) {
                            return null;
                        } else {
                            return this.state.json[
                                "36360PUBLIC-000046"
                            ]/** 单据状态非审批成功！ */;
                        }
                    }
                    //内贷还本
                    if (this.appCode == '36360IRP') {
                        let busistatus = selectData && selectData.data && selectData.data.values && selectData.data.values['busistatus'] && selectData.data.values['busistatus'].value;
                        if ('1' == busistatus || '2' == busistatus) {
                            return null;
                        } else {
                            return this.state.json[
                                "36360PUBLIC-000046"
                            ]/** 单据状态非审批成功！ */;
                        }
                    }
                },
                getOrgFunc: (selectData) => {
                    if (this.appCode == '36360FCIB' || this.appCode == '36362FCIB') {
                        let pk_org_r = selectData.data.values['pk_org_r'].value;
                        if (pk_org_r) {
                            return pk_org_r
                        } else
                            return null;
                    } else
                        return selectData.data.values['pk_org'].value;
                }
            })
            break;
        //头部 审批详情
        case "approveDetail":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
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
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
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
                    content: this.state.json['36360PUBLIC-000024'],/* 国际化处理： 请选择一条数据，上传附件！*/
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
                searchBtnClick.call(this, props, null, true);
            break;
        //头部 刷新(利息清单、计息、回单)
        case "refresh_n":
            //这里加上提示后 根据是否是刷新按钮触发 提示不同的提示语
            // this.setState({
            //     isListFresh: true
            // });
            let isRefreshButton = true;
            let searchInfo_n = this.props.search.getQueryInfo(this.searchId);
            searchInfo_n &&
                JSON.stringify(searchInfo_n) !== "{}" &&
                searchCommonClickForRefresh.call(this, props, null, isRefreshButton);
            break;
        //头部 记账
        case "Bookkeeping":
            headBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000047'],/* 国际化处理： 记账：*/
                { pks },
                this.tallyUrl,
                this.state.json['36360PUBLIC-000048'],/* 国际化处理： 记账成功!*/
                null,
                selectedEventForReceipt.bind(this)
            );
            break;
        //头部 取消记账
        case "UnBookkeeping":
            headBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000049'],/* 国际化处理： 取消记账：*/
                { pks },
                this.untallyUrl,
                this.state.json['36360PUBLIC-000050'],/* 国际化处理： 取消记账成功!*/
                null,
                selectedEventForReceipt.bind(this)
            );
            break;
        //头部 制证
        case "accreditation":
            headBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000025'],/* 国际化处理： 制证：*/
                { pks },
                this.vouchermakeUrl,
                this.state.json['36360PUBLIC-000026'],/* 国际化处理： 制证成功!*/
                null,
                selectedEventForReceipt.bind(this)
            );
            break;
        //头部 取消制证
        case "unAccreditation":
            headBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000027'],/* 国际化处理： 取消制证：*/
                { pks },
                this.vouchercancelUrl,
                this.state.json['36360PUBLIC-000028'],/* 国际化处理： 取消制证成功!*/
                null,
                selectedEventForReceipt.bind(this)
            );
            break;
        //头部 计息
        case "calcIntst":
            headBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000029'],/* 国际化处理： 计息：*/
                { pks },
                this.calcIntstUrl,
                this.state.json['36360PUBLIC-000030']/* 国际化处理： 计息成功!*/
            );
            break;
        //头部 取消计息
        case "cancelIntst":
            headBtnOperation.call(
                this,
                this.state.json['36360PUBLIC-000031'],/* 国际化处理： 取消计息：*/
                { pks },
                this.cancelIntstUrl,
                this.state.json['36360PUBLIC-000032']/* 国际化处理： 取消计息成功!*/
            );
            break;
        //头部 联查资金计划
        case "fundPlan":
            linkNtb.call(this, props, pks[0]);
            break;

            //联查内贷还本  
            case 'linkndpayment':
            debugger;
            if(selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let srcbillno = selectDatas[0].data.values['vdef0'].value;
            // console.log(srcbillno.value);   
            pageTo.openTo("/sf/delivery/delivery/main/index.html#/card", {
                status: "browse",
                id: srcbillno,
                appcode: "36320FDA",
                pagecode: "36320FDA_card",
                scene: "linksce"
            });
            break;
            //列表联查资金上收  
            case 'fundcolion':
            if(selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let pk_delivery_h = selectDatas[0].data.values['vdef18'].value;
            // console.log(srcbillno.value);   
            pageTo.openTo("/sf/delivery/delivery/main/index.html#/card", {
                status: "browse",
                id: pk_delivery_h,
                appcode: "36320FDA",
                pagecode: "36320FDA_card",
                scene: "linksce"
            });
            break;

            case 'Allocation':
                        debugger;
                        if (selectDatas.length != 1) {
                            toast({ color: 'warning', content: loadMultiLang(this.props, '36320FA-000081') });/* 国际化处理： 请选择一条数据进行联查。*/
                            return;
                        }
                        let pksrcbill = selectDatas[0].data.values['vdef1'].value;
                        console.log(pksrcbill.value);
                        props.openTo("/sf/allocation/allocate/main/index.html#/card", {
                            status: "browse",
                            id: pksrcbill,
                            appcode: "36320FA",
                            pagecode: "36320FA_C01",
                            scene: "linksce"
                        });
                        break;
            //列表生成资金下拨单
        case 'toAllocation':
            debugger;
            let status= selectDatas[0].data.values['vbillstatus'].value;
            if (selectDatas.length != 1) {
                toast({ color: 'warning', content: loadMultiLang(this.props, '36320FA-000081') });/* 国际化处理： 请选择一条数据进行联查。*/
                return;
            }
            if (status != 1){
                toast({ color: 'warning', content: '当前单据状态不是审批状态，不能生成下游单据' });/* 国际化处理： 当前单据状态不是审批状态，不能生成下游单据*/
                return;
            }
            let PK_INNERLOANPAY = selectDatas[0].data.values['vdef3'].value;
            console.log(PK_INNERLOANPAY.value);
            let loanmny = selectDatas[0].data.values['loanmny'].value;//放款金额
            let vdef2 = selectDatas[0].data.values['vdef2'].value;//累计回写总金额
            if(parseFloat(vdef2)>=parseFloat(loanmny)){
                   toast({
                    color: "danger",
                    content: this.state.json["36360IP-000059"]
            }); /* 国际化处理： 放款结束日期不能早于放款开始日期*/
            return;
            }
            let sourceid = PK_INNERLOANPAY;//来源主键
            props.openTo('/sf/allocation/allocate/main/index.html#/card', 
                {
                    srcFunCode:'36320FA',
                    appcode: '36320FA',
                    pagecode: '36320FA_C01',                   
                    status: 'add',
                    Allocationsourceid:sourceid
                });
            break;




            
        //头部 联查借款账户余额
        case "loanAccountBalance":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            doPaymentAccount.call(this, props, selectDatas);
            break;
        // 头部 联查利息清单
        case "interestList":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
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
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }

            let rate = this.primaryId == "pk_contract_icdmc" ? selectDatas[0] && selectDatas[0].data.values["rateid"].value :
                selectDatas[0] && selectDatas[0].data.values["pk_rate"].value;
            if (!rate) {
                toast({
                    color: "danger",
                    content: this.state.json["3636PUBLIC-000070"]
                }); /* 国际化处理： 单据利率不存在！*/
                return;
            }
            ajax({
                url: "/nccloud/tmpub/tmbd/linkinterest.do",
                data: { pk: rate },
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
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let iadate =
                this.primaryId == "pk_financepay"
                    ? selectDatas[0] &&
                    selectDatas[0].data.values["pk_settledate"]
                    : selectDatas[0] && selectDatas[0].data.values["iadate"];
            if (!iadate || !iadate.value) {
                toast({
                    color: "danger",
                    content: this.state.json["3636PUBLIC-000069"]
                }); /* 国际化处理： 单据结息日不存在！*/
                return;
            }
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
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let applyno =
                selectDatas[0] && selectDatas[0].data.values["applyno"];
            pageTo.openTo("/icdmc/icdmc/apply/main/index.html#/card", {
                status: "browse",
                appcode: "36630BLAL",
                pagecode: "36630BLAL_CARD",
                scene: "linksce",
                id: applyno && applyno.value
            });
            break;
        //头部 联查贷款合同
        case "contract":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let contractid =
                this.primaryId == "pk_innerloanpay" || this.primaryId == "pk_interestlisticdmc" || this.primaryId == "pk_financepayapply"
                    ? selectDatas[0] && selectDatas[0].data.values["contractid"]
                    : this.primaryId == "pk_repayprcpl_h" ? selectDatas[0] &&
                        selectDatas[0].data.values["pk_contract"] : selectDatas[0] &&
                        selectDatas[0].data.values["pk_contract_icdmc"];
            pageTo.openTo("/icdmc/icdmc/contract/main/index.html#/card", {
                status: "browse",
                appcode: "36360ICC",
                pagecode: "36360ICCL_CARD",
                scene: "linksce",
                id: contractid && contractid.value
            });
            break;
        //头部 联查内部借款合同
        case "loanContract":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            let contractidName = "contractid";
            if (this.primaryId == 'pk_repayprcplr_h') {
                contractidName = "pk_contract";
            } else if (this.primaryId == 'pk_repayintstreceipt') {
                contractidName = "pk_contract_icdmc";
            }
            let loanContractid = selectDatas[0] && selectDatas[0].data.values[contractidName]
            if (this.primaryId == "pk_interestlisticdmc" || this.primaryId == 'pk_repayintstreceipt'
                || this.primaryId == 'pk_repayprcplr_h' || this.primaryId == 'pk_financepayreceipt') {
                loanContractid = loanContractid.value;
            }
            if (this.primaryId == 'pk_repayintstreceipt'
                || this.primaryId == 'pk_repayprcplr_h' || this.primaryId == 'pk_financepayreceipt') {
                props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                    srcFunCode: '36362IDC',
                    id: loanContractid,
                    appcode: '36362IDC',
                    pagecode: '36362IDC_C01',
                    status: 'browse',
                    scene:'linksce'
                });
            } else {
                ajax({
                    url: '/nccloud/icdmc/icdmc/queryloanpk.do',
                    data: { pk: loanContractid },
                    success: res => {
                        let { data } = res;
                        if (data) {
                            props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                                srcFunCode: '36362IDC',
                                id: data,
                                appcode: '36362IDC',
                                pagecode: '36362IDC_C01',
                                status: 'browse',
                                scene:'linksce'
                            });
                        }
                    }
                });
            }
            break;
        //头部 联查贷款放款
        case "financepay":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            if (this.primaryId == "pk_contract_icdmc") {
                let contractid =
                    selectDatas[0] &&
                    selectDatas[0].data.values["pk_contract_icdmc"] &&
                    selectDatas[0].data.values["pk_contract_icdmc"].value;
                linkFinancepay.call(this, props, contractid);
            }else if(this.primaryId == "pk_financepayapply"){
                let pk_financepayapply =
                    selectDatas[0] &&
                    selectDatas[0].data.values["pk_financepayapply"] &&
                    selectDatas[0].data.values["pk_financepayapply"].value;
                linkFinancepay.call(this, props, pk_financepayapply);
            }else if(this.primaryId == "pk_financepayreceipt"){
                let loancode =selectDatas[0].data.values["pk_srcbill"];
                pageTo.openTo("/icdmc/icdmc/financepay/main/index.html#/card", {
                    status: "browse",
                    id: loancode && loancode.value,
                    appcode: "36360IP",
                    pagecode: "36360IP_LINKC01",
                    scene: "linksce"
                });
            }else {
                let loancode =
                    this.primaryId == "pk_repayintsticdmc"
                        ? selectDatas[0] && selectDatas[0].data.values["pk_innerloanpay"]
                        : selectDatas[0] &&
                        selectDatas[0].data.values["pk_financepay"];
                pageTo.openTo("/icdmc/icdmc/financepay/main/index.html#/card", {
                    status: "browse",
                    id: loancode && loancode.value,
                    appcode: "36360IP",
                    pagecode: "36360IP_LINKC01",
                    scene: "linksce"
                });
            }

            break;
        //头部 联查内贷还本
        case "repay":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            //合同和放款为还本上游单据
            if (this.primaryId == "pk_contract_icdmc" || this.primaryId == "pk_innerloanpay") {
                let srcpk =
                    this.primaryId == "pk_innerloanpay"
                        ? selectDatas[0] && selectDatas[0].data.values["pk_innerloanpay"]
                        : selectDatas[0] &&
                        selectDatas[0].data.values["pk_contract_icdmc"].value;
                linkrepaylist.call(this, props, srcpk);
            } else {
                //还本为上游单据
                let pk_srcbill =
                    selectDatas[0] && selectDatas[0].data.values["pk_srcbill"];
                if (!pk_srcbill.value) {
                    toast({ content: this.state.json['36360PUBLIC-000033'], color: "warning" });/* 国际化处理： 不允许联查还本单*/
                    return;
                }

                pageTo.openTo("/icdmc/icdmc/repayprcpl/main/index.html#/card", {
                    status: "browse",
                    id: pk_srcbill && pk_srcbill.value,
                    appcode: "36360IRP",
                    pagecode: "36360IRP_CARD",
                    scene: "linksce"
                });
            }

            break;
        //头部 联查贷款付息
        case "repayintst":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            //合同和放款为付息上游单据
            if (this.primaryId == "pk_contract_icdmc" || this.primaryId == "pk_innerloanpay") {
                let srcpk =
                    this.primaryId == "pk_innerloanpay"
                        ? selectDatas[0] && selectDatas[0].data.values["pk_innerloanpay"]
                        : selectDatas[0] &&
                        selectDatas[0].data.values["pk_contract_icdmc"].value;
                linkrepayintstlist.call(this, props, srcpk);
            } else {
                //付息为上游单据
                let pk_srcbill =
                    selectDatas[0] && selectDatas[0].data.values["pk_srcbill"];
                if (!pk_srcbill.value) {
                    toast({ content: this.state.json['3636PUBLIC-000033'], color: "warning" });/* 国际化处理： 不允许联查还本单*/
                    return;
                }

                pageTo.openTo("/icdmc/icdmc/repayintst/main/index.html#/card", {
                    status: "browse",
                    id: pk_srcbill && pk_srcbill.value,
                    appcode: "36360IPI",
                    pagecode: "36360IPIL_C01",
                    scene: "linksce"
                });
            }
            break;
        //头部 联查凭证
        case "voucher":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            voucher.call(this, selectDatas);
            break;
        //头部 联查放款回单
        case "financepayReceipt":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            //还本的主键 就是 回单的来源单据pk
            let pk_financepayr =
                selectDatas[0] && selectDatas[0].data.values["pk_innerloanpay"];
            if (!pk_financepayr.value) {
                toast({ content: this.state.json['3636PUBLIC-000033'], color: "warning" });/* 国际化处理： 不允许联查放款单*/
                return;
            }
            let pk_pk_financepayParam = {
                pk: pk_financepayr.value
            };
            //根据srcbill获取当前回单pk
            ajax({
                url: '/nccloud/icdmc/financepayreceipt/getpkbysrc.do',
                data: pk_pk_financepayParam,
                success: (res) => {
                    if (res.data) {
                        pageTo.openTo("/icdmc/icdmc/financepayreceipt/main/index.html#/card", {
                            status: "browse",
                            id: res.data,
                            appcode: "36362IPR",
                            pagecode: "36362IPR_CARD",
                            scene: "linksce"
                        });

                    }
                }
            });
            break;
        //头部 联查还本回单
        case "repayPrcplReceipt":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            //还本的主键 就是 回单的来源单据pk
            let pk_srcbill =
                selectDatas[0] && selectDatas[0].data.values["pk_repayprcpl_h"];
            if (!pk_srcbill.value) {
                toast({ content: this.state.json['3636PUBLIC-000033'], color: "warning" });/* 国际化处理： 不允许联查还本单*/
                return;
            }
            let pk_srcbillParam = {
                pk: pk_srcbill.value
            };

            //根据srcbill获取当前回单pk
            ajax({
                url: '/nccloud/icdmc/repayprcplreceipt/getpkbysrc.do',
                data: pk_srcbillParam,
                success: (res) => {
                    if (res.data) {
                        pageTo.openTo("/icdmc/icdmc/repayprcplreceipt/main/index.html#/card", {
                            status: "browse",
                            id: res.data,
                            appcode: "36362IRPR",
                            pagecode: "36362IRPR_CARD",
                            scene: "linksce"
                        });

                    }
                }
            });
            break;
        //头部 联查付息回单
        case "repayIntstReceipt":
            if (selectDatas.length != 1) {
                toast({ content: this.state.json['36360PUBLIC-000023'], color: "warning" });/* 国际化处理： 请选择一条数据*/
                return;
            }
            //付息的主键 就是 回单的来源单据pk
            let pk_srcintstbill =
                selectDatas[0] && selectDatas[0].data.values["pk_repayintsticdmc"];
            if (!pk_srcintstbill.value) {
                toast({ content: this.state.json['3636PUBLIC-000068'], color: "warning" });/* 国际化处理： 不允许联查还本单*/
                return;
            }
            let pk_srcintstbillParam = {
                pk: pk_srcintstbill.value
            };

            //根据srcbill获取当前回单pk
            ajax({
                url: '/nccloud/icdmc/repayintstreceipt/getpkbysrc.do',
                data: pk_srcintstbillParam,
                success: (res) => {
                    if (res.data) {
                        pageTo.openTo("/icdmc/icdmc/repayintstreceipt/main/index.html#/card", {
                            status: "browse",
                            id: res.data,
                            appcode: "36362IPIR",
                            pagecode: "36362IPIR_CARD",
                            scene: "linksce"
                        });

                    }
                }
            });
            break;
        case "back":
            props.form.setFormStatus('list_back', "edit");
            props.form.setFormItemsDisabled('list_back', { 'backres': false });
            this.setState({
                backdisplay: true,
                pks: { pks },
                record: null
            });
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
    let pk_org = this.primaryId == "pk_repayprcpl_h"
        ? selectDatas[0].data.values["financecorpid"] &&
        selectDatas[0].data.values["financecorpid"].value
        : selectDatas[0].data.values["pk_org"] &&
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
        url: "/nccloud/icdmc/common/loanlinkbill.do", //业务组自己写入口类
        data: voucherArr,
        success: res => {
            if (res.success) {
                let { success, data } = res;
                let srcCode = data.src;
                let { url, pklist, appcode, pagecode, srcAppCode, cachekey } = data;
                if ("_LinkVouchar2019" == srcCode) {
                    //走联查
                    if (res.data.des) {
                        //跳转到凭证界面
                        if (res.data.pklist) {
                            if (res.data.pklist.length == 1) {
                                //单笔联查
                                this.props.openTo(res.data.url, {
                                    status: "browse",
                                    appcode,
                                    pagecode,
                                    id: res.data.pklist[0],
                                    n: this.state.json['36360PUBLIC-000034'], //'联查凭证'
                                    pagekey: 'link',//去掉联查凭证页面中操作按钮
                                    backflag: "noback"
                                });
                                return;
                            } else {
                                //多笔联查
                                cacheTools.set(cachekey, pklist);
                                this.props.openTo(res.data.url, {
                                    status: "browse",
                                    appcode,
                                    pagecode,
                                    scene: appcode + srcCode,
                                    n: this.state.json['36360PUBLIC-000034'] //'联查凭证'
                                });
                                return;
                            }
                        }
                    } else {
                        //跳转到会计平台 这里的appcode是业务组的小应用编码
                        cacheTools.set(srcAppCode + srcCode, pklist);
                        //打开凭证节点
                        props.openTo(res.data.url, {
                            status: 'browse',
                            appcode,
                            pagecode,
                            scene: srcAppCode + srcCode,
                        });
                    }
                } else {
                    if (res.data.src && res.data.src == "_Preview2019") {
                        toast({
                            color: "warning",
                            content: this.state.json["36360PUBLIC-000045"]
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
                    n: this.state.json['36360PUBLIC-000034'] // '凭证预览' 凭证使用这个参数,会计平台不用
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
                    pageTo.openTo("/icdmc/icdmc/interest/main/index.html#/list", {
                        id: pks,
                        appcode: "36362FCIB",
                        pagecode: "36362FCIB_LIST"
                    });
                } else if (rowsCount == 1) {
                    // 单条跳卡片
                    let pk_interestlist =
                        data.grid[this.tableId].rows[0].values.pk_interestlist
                            .value;
                    pageTo.openTo("/icdmc/icdmc/interest/main/index.html#/card", {
                        id: pk_interestlist,
                        appcode: "36362FCIB",
                        pagecode: "36362FCIB_CARD"
                    });
                } else if (rowsCount == 0) {
                    toast({ content: this.state.json['3636PUBLIC-000062'], color: "warning" });/* 国际化处理： 该单据没有对应的联查单据，请重新选择单据！*/
                    return;
                }
            }
        }
    });
}

/**
 * 联查内部贷款合同
 * @param  props
 * @param  pk
 */

export function linkContract(props, pk) {
    ajax({
        url: `${this.contractlistUrl}.do`,
        data: { pks: [pk], pageCode: '36360ICCL_CARD' },
        success: res => {
            let { data } = res;
            if (data && data.grid['list_head']) {
                //console.log(data);
                let rowsCount =
                    data.grid['list_head'].rows &&
                    data.grid['list_head'].rows.length;
                // 多条跳列表
                if (rowsCount == 1) {
                    // 单条跳卡片
                    let pks =
                        data.grid['list_head'].rows[0].values.pk_contract_icdmc
                            .value;
                    pageTo.openTo("/icdmc/icdmc/contract/main/index.html#/card", {
                        status: "browse",
                        appcode: "36360ICC",
                        pagecode: "36360ICCL_CARD",
                        scene: "linksce",
                        id: pks
                    });
                } else if (rowsCount == 0) {
                    toast({ content: this.state.json['3636PUBLIC-000062'], color: "warning" });/* 国际化处理： 该单据没有对应的联查单据，请重新选择单据！*/
                    return;
                }
            }

        }
    });
}

/**
 * 联查放款单
 * @param  props
 * @param  pk
 */

export function linkFinancepay(props, pk) {
    ajax({
        url: `${this.financepaylistUrl}.do`,
        data: { pk: pk },
        success: res => {
            let { data } = res;
            if (data && data["length"]) {
                // 多条跳列表
                if (data["length"] > 1) {
                    pageTo.openTo("/icdmc/icdmc/financepay/main/index.html#/list", {
                        id: pk,
                        appcode: "36360IP",
                        pagecode: "36360IP_LINKL01",
                        scene: "linksce"
                    });
                } else if (data["length"] == 1) {
                    // 单条跳卡片
                    let pks = data['pk'];
                    pageTo.openTo("/icdmc/icdmc/financepay/main/index.html#/card", {
                        status: "browse",
                        id: pks,
                        appcode: "36360IP",
                        pagecode: "36360IP_LINKC01",
                        scene: "linksce"
                    });
                } else if (data["length"] == 0) {
                    toast({ content: this.state.json['3636PUBLIC-000062'], color: "warning" });/* 国际化处理： 该单据没有对应的联查单据，请重新选择单据！*/
                    return;
                }
            }

        }
    });
}





/**
 * 联查内贷还本清单
 * 现定于[放款和合同]
 * @param  props
 * @param  pk
 */

export function linkrepaylist(props, pk) {
    ajax({
        url: '/nccloud/icdmc/repayprcpl/linkrepaybill.do',//请求:/nccloud/icdmc/repayprcpl/linkrepaybill.do
        data: { pks: [pk], pageCode: '36360IRPL_LIST' },//来源单据pk
        success: res => {
            let { data } = res;
            if (data && data.grid['list_head']) {
                //console.log(data);
                let rowsCount =
                    data.grid['list_head'].rows &&
                    data.grid['list_head'].rows.length;
                // 多条跳列表
                if (rowsCount > 1) {
                    let pks = [];
                    data.grid['list_head'].rows.forEach((val) => {
                        pks.push(val.values.pk_repayprcpl_h.value);
                    });
                    //console.log('pks', pks);
                    pageTo.openTo("/icdmc/icdmc/repayprcpl/main/index.html#/list", {
                        id: '',
                        pks: pks,
                        appcode: "36360IRP",
                        pagecode: "36360IRP_LIST",
                        scene: "linksce"
                    });
                } else if (rowsCount == 1) {
                    // 单条跳卡片
                    let pk =
                        data.grid['list_head'].rows[0].values.pk_repayprcpl_h
                            .value;
                    pageTo.openTo("/icdmc/icdmc/repayprcpl/main/index.html#/card", {
                        status: "browse",
                        id: pk,
                        appcode: "36360IRP",
                        pagecode: "36360IRP_CARD",
                        scene: "linksce"
                    });
                } else if (rowsCount == 0) {
                    toast({ content: this.state.json['3636PUBLIC-000062'], color: "warning" });/* 国际化处理： 该单据没有对应的联查单据，请重新选择单据！*/
                    return;
                }
            }
        }
    });
}



/**
 * 联查内贷付息
 * 现定于[放款和合同]
 * @param  props
 * @param  pk
 */

export function linkrepayintstlist(props, pk) {
    ajax({
        url: '/nccloud/icdmc/repayintst/linkrepayintstbill.do',//请求:/nccloud/icdmc/repayprcpl/linkrepaybill.do
        data: { pks: [pk], pageCode: '36360IPIL_L01' },//来源单据pk
        success: res => {
            let { data } = res;
            if (data && data.grid['list_head']) {
                //console.log(data);
                let rowsCount =
                    data.grid['list_head'].rows &&
                    data.grid['list_head'].rows.length;
                // 多条跳列表
                if (rowsCount > 1) {
                    let pks = [];
                    data.grid['list_head'].rows.forEach((val) => {
                        pks.push(val.values.pk_repayintsticdmc.value);
                    });
                    //console.log('pks', pks);
                    pageTo.openTo("/icdmc/icdmc/repayintst/main/index.html#/list", {
                        id: '',
                        pks: pks,
                        appcode: "36360IPI",
                        pagecode: "36360IPIL_L01",
                        scene: "linksce"
                    });
                } else if (rowsCount == 1) {
                    // 单条跳卡片
                    let pk =
                        data.grid['list_head'].rows[0].values.pk_repayintsticdmc
                            .value;
                    pageTo.openTo("/icdmc/icdmc/repayintst/main/index.html#/card", {
                        status: "browse",
                        id: pk,
                        appcode: "36360IPI",
                        pagecode: "36360IPIL_C01",
                        scene: "linksce"
                    });
                } else if (rowsCount == 0) {
                    toast({ content: this.state.json['3636PUBLIC-000062'], color: "warning" });/* 国际化处理： 该单据没有对应的联查单据，请重新选择单据！*/
                    return;
                }
            }
        }
    });
}

/*9k43NIHQ9Q7ex8VdWjYvNqHOSaRzMesuRPV2YDsyKkScYtHkaVOipJBMF+2tCLH+*/