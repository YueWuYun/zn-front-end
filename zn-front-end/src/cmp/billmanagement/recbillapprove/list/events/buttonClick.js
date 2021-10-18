/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, cacheTools, print, toast, viewModel } from "nc-lightapp-front";
import { linkVoucherApp } from "../../../../public/utils/LinkUtil"; //凭证
import { Templatedata } from "../../config/Templatedata"; //配置的id和area信息
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
let card_pagecod = Templatedata.card_pageid; //用于提交收回等操作
//联查协同单据
let synbill_src = Templatedata.synbill_paybillsrc;
let synbill_key = Templatedata.synbill_cachekey;
let synbill_paybillcode = Templatedata.synbill_paybillcode;
let synbill_paybillappid = Templatedata.synbill_paybillappid;
let synbill_pagecode = Templatedata.synbill_pagecode;
//联查凭证
let voucher_billtype = Templatedata.voucher_billtype;
let voucher_calchekey = Templatedata.voucher_calchekey;
let voucher_code = Templatedata.voucher_code;
let voucher_appid = Templatedata.voucher_appid;
let voucher_appcode = Templatedata.voucher_appcode;
//关联结算信息
let settle_code = Templatedata.settle_code;
let settle_pageid = Templatedata.settle_pageid;
let settle_callback = Templatedata.settle_callback;
let settle_cachekey = Templatedata.settle_cachekey;
let settle_appid = Templatedata.settle_appid;
let settle_src = Templatedata.settle_src;
let callback_appcode = Templatedata.callback_appcode;
let callback_pagecode = Templatedata.callback_pagecode;
//打印清单
let printlist_billtype = Templatedata.printlist_billtype;
let printlist_funcode = Templatedata.printlist_funcode;
let printlist_nodekey = Templatedata.printlist_nodekey;
let printlist_templetid = Templatedata.printlist_templetid;
//打印卡片
let printcard_billtype = Templatedata.printcard_billtype;
let printcard_funcode = Templatedata.printcard_funcode;
let printcard_nodekey = Templatedata.printcard_nodekey;
let printcard_templetid = Templatedata.printcard_templetid;
//审批意见
let approve_billtype = Templatedata.approve_billtype;
//联查单据
let billtrack_billtype = Templatedata.billtrack_billtype;

export default function buttonClick(props, id) {
    let self = this;
    /**
     * 新增---->根据交易类型----->加载模版
     */
    let tradecode = JSON.parse(getGlobalStorage("sessionStorage", "sessionTP"));
    let urlpagecode = card_pagecod;
    console.log(urlpagecode, "add_pageid");
    if (tradecode) {
        urlpagecode = tradecode;
    }
    switch (id) {
        //列表页---新增按钮
        case "addBtn":
            props.linkTo("/cmp/billmanagement/recbill/card/index.html", {
                status: "add",
                pagecode: urlpagecode,
                form: "fromlist",
                id: this.state.add_pk, //查询后赋值，单据pk
                bill_no: this.state.add_status //查询后赋值，单据状态
            });
            break;

        //列表页---删除按钮
        case "deleteBtn":
            const selectedData = props.table.getCheckedRows(this.tableId);
            if (selectedData.length == 0) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000004"
                        )
                }); /* 国际化处理： 请选择数据，进行删除!*/
                return;
            }
            props.modal.show("delete");
            break;

        //列表页---复制按钮
        case "copyBtn":
            let copyData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (copyData.length != 1) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000058"
                        )
                }); /* 国际化处理： 请选择单条数据，进行复制!*/
                return;
            }
            let copyid = 0;
            let billNum = "";
            copyData.forEach(val => {
                copyid = val.data.values.pk_recbill.value;
                /**
                 * 复制----->加载模版----->交易类型
                 */
                urlpagecode = val.data.values.trade_type.value;
                billNum = val.data.values.bill_status.value;
            });
            props.linkTo("/cmp/billmanagement/recbill/card/index.html", {
                status: "copy",
                id: copyid,
                bill_no: billNum, //单据状态
                pagecode: urlpagecode
            });

            break;
        //收款交易类型
        case "rectradetypeBtn":
            toast({
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36070RBMAPP") &&
                    this.props.MutiInit.getIntl("36070RBMAPP").get(
                        "36070RBMAPP-000010"
                    )
            }); /* 国际化处理： 功能待开发*/
            break;
        //列表页---提交按钮
        case "submitBtn":
            let submitData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (submitData.length == 0) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000059"
                        )
                }); /* 国际化处理： 请选择数据,进行提交!*/
                // NCMessage.create({ content: '请选择数据', color: 'warning', position: 'top' });
                return;
            }

            let submitdataArr = [];
            //处理选择数据
            submitData.forEach(val => {
                submitdataArr.push(val.data.values.pk_recbill.value); //主键数组
            });
            // dataArr6.push('1001Z61000000001R7GY');//测试使用
            //自定义请求数据
            let submitdata = {
                pks: submitdataArr,
                pageid: card_pagecod
            };

            ajax({
                url: "/nccloud/cmp/recbill/recbillsubmit.do",
                data: submitdata,
                success: function(res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36070RBMAPP") &&
                                this.props.MutiInit.getIntl("36070RBMAPP").get(
                                    "36070RBMAPP-000008"
                                )
                        }); /* 国际化处理： 提交成功*/
                        // NCMessage.create({ content: '提交成功', color: 'success', position: 'top' });
                        self.refresh();
                    }
                }
            });
            break;
        //列表页---收回按钮
        case "unsubmitBtn":
            let unsubmitData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (unsubmitData.length == 0) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000060"
                        )
                }); /* 国际化处理： 请选择数据,进行收回!*/
                // NCMessage.create({ content: '请选择数据', color: 'warning', position: 'top' });
                return;
            }

            let unsubmitdataArr = [];
            //处理选择数据
            unsubmitData.forEach(val => {
                unsubmitdataArr.push(val.data.values.pk_recbill.value); //主键数组
            });
            // dataArr6.push('1001Z61000000001R7GY');//测试使用
            //自定义请求数据
            let unsubmitdata = {
                pks: unsubmitdataArr,
                pageid: card_pagecod
            };

            ajax({
                url: "/nccloud/cmp/recbill/recbillunsubmit.do",
                data: unsubmitdata,
                success: function(res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36070RBMAPP") &&
                                this.props.MutiInit.getIntl("36070RBMAPP").get(
                                    "36070RBMAPP-000009"
                                )
                        }); /* 国际化处理： 收回成功*/
                        // NCMessage.create({ content: '提交成功', color: 'success', position: 'top' });
                        self.refresh();
                    }
                }
            });
            break;
        //列表页---关联结算信息按钮
        case "linksettleBtn":
            // toast({ color: 'warning', content: '功能待开发' });
            let settle_calchekey = settle_cachekey;
            let settle_Arr = "";
            cacheTools.set(settle_calchekey, settle_Arr);
            let appOption = {
                code: settle_code,
                name:
                    this.props.MutiInit.getIntl("36070RBMAPP") &&
                    this.props.MutiInit.getIntl("36070RBMAPP").get(
                        "36070RBMAPP-000012"
                    ) /* 国际化处理： 关联结算信息*/,
                pk_appregister: settle_appid
            };
            let type = {
                type: null
            };
            let query = {
                status: "browse",
                src: settle_src,
                callback: settle_callback //回调页面
            };
            // window.parent.openNew(appOption, null, query);
            props.openTo(
                "/cmp/settlementmanagement/settlepublic/list/index.html",
                {
                    appcode: settle_code,
                    pagecode: settle_pageid,
                    status: "browse",
                    src: settle_src,
                    callback: settle_callback, //回调页面
                    name:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000012"
                        ) /* 国际化处理： 关联结算信息*/,
                    callbackappcode: callback_appcode,
                    callbackpagecode: callback_pagecode
                }
            );

            break;
        //列表页---联查凭证按钮
        case "queryvoucherBtn":
            let voucherData = props.table.getCheckedRows(this.tableId);
            //let pk_billtype='36S2';
            //数据校验
            if (voucherData.length != 1) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000061"
                        ) /* 国际化处理： 请选择单条，联查凭证!*/
                });
                return;
            }
            let vorcher_type = voucher_billtype;
            let vorcher_pk = "";
            let vorcher_billno = "";
            voucherData.forEach(val => {
                vorcher_pk = val.data.values.pk_recbill.value; //主键数组
                vorcher_type = val.data.values.trade_type.value;
                vorcher_billno = val.data.values.bill_no.value;
            });
            if (vorcher_type) {
                voucher_billtype = vorcher_type;
            }
            linkVoucherApp(
                props,
                vorcher_pk,
                "nc.vo.cmp.bill.RecBillAggVO",
                voucher_appcode,
                voucher_billtype,
                vorcher_billno
            );
            // let voucherArr = [];
            // //处理选择数据
            // voucherData.forEach((val) => {
            //     let pk_group, pk_org, pk_recbill
            //     if (val.data.values.pk_group && val.data.values.pk_group.value != null) {
            //         pk_group = val.data.values.pk_group.value;
            //     }
            //     if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
            //         pk_org = val.data.values.pk_org.value;
            //     }
            //     if (val.data.values.pk_recbill && val.data.values.pk_recbill.value != null) {
            //         pk_recbill = val.data.values.pk_recbill.value;
            //     }
            //     if (val.data.values.bill_type && val.data.values.bill_type.value != null) {
            //         voucher_billtype = val.data.values.bill_type.value;
            //     }
            //     let voucher = {
            //         pk_billtype: voucher_billtype,
            //         pk_group: pk_group,
            //         pk_org: pk_org,
            //         relationID: pk_recbill
            //     }
            //     voucherArr.push(voucher);
            // });
            // cacheTools.set(voucher_calchekey, voucherArr);
            // let voucher_appOption = {
            //     code: voucher_code,
            //     name: '联查凭证',
            //     pk_appregister: voucher_appid
            // };
            // let voucher_type = {
            //     type: null
            // };
            // let voucher_query = {
            //     status: 'browse',
            //     src: voucher_calchekey,
            //     callback: ''//回调页面
            // }
            // window.parent.openNew(voucher_appOption, "", voucher_query);

            break;
        //列表页---取消关联结算信息按钮
        case "unlinksettleBtn":
            // toast({ color: 'warning', content: '功能待开发' });
            let unlinksettleBtnData = props.table.getCheckedRows(this.tableId);

            if (unlinksettleBtnData.length == 0) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000062"
                        )
                }); /* 国际化处理： 请选择数据,进行取消关联结算信息!*/
                return;
            }
            let unlinksettleBtn_dataArr = [];

            //处理选择数据
            unlinksettleBtnData.forEach(val => {
                unlinksettleBtn_dataArr.push(val.data.values.pk_recbill.value); //主键数组
            });
            //自定义请求数据
            let send_data = {
                pks: unlinksettleBtn_dataArr
            };

            ajax({
                url: "/nccloud/cmp/recbill/recbillunlinksettle.do",
                data: send_data,
                success: function(res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36070RBMAPP") &&
                                this.props.MutiInit.getIntl("36070RBMAPP").get(
                                    "36070RBMAPP-000063"
                                )
                        }); /* 国际化处理： 取消关联结算成功*/
                        self.refresh();
                    }
                }
            });
            break;
        //联查协同单据-->付款结算单
        case "querysynbillBtn":
            let querysynbillBtnData = props.table.getCheckedRows(this.tableId);
            //数据校验

            if (querysynbillBtnData.length != 1) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000064"
                        )
                }); /* 国际化处理： 请选择单条数据，联查协同单据!*/
                return;
            }

            let querysynbillArr = [];
            //处理选择数据
            querysynbillBtnData.forEach(val => {
                if (
                    val.data.values.pk_recbill &&
                    val.data.values.pk_recbill.value != null
                ) {
                    let pk = val.data.values.pk_recbill.value;
                    querysynbillArr.push(pk); //主键
                }

                if (
                    val.data.values.pk_upbill &&
                    val.data.values.pk_upbill.value != null &&
                    val.data.values.pk_upbill.value != "~"
                ) {
                    let uppk = val.data.values.pk_upbill.value;
                    querysynbillArr.push(uppk); //上后主键
                }
            });

            /**
             * 优先查询是否存在协同单据，不存在直接报错
             */
            let isAction = false;
            let confirmdate = {
                pks: querysynbillArr
            };
            ajax({
                url: "/nccloud/cmp/recbill/linkbillconfirm.do",
                data: confirmdate,
                success: res => {
                    let { success, data } = res;
                    if (success) {
                        isAction = true;
                    }
                }
            });
            if (!isAction) {
                return;
            }
            cacheTools.set(synbill_key, querysynbillArr);

            let querysynbillBtn_appOption = {
                code: synbill_paybillcode,
                name:
                    this.props.MutiInit.getIntl("36070RBMAPP") &&
                    this.props.MutiInit.getIntl("36070RBMAPP").get(
                        "36070RBMAPP-000014"
                    ) /* 国际化处理： 付款结算管理*/,
                pk_appregister: synbill_paybillappid
            };
            let querysynbillBtn_type = {
                type: null
            };
            let querysynbillBtn_query = {
                status: "browse",
                src: synbill_src,
                callback: "1"
            };
            // window.parent.openNew(querysynbillBtn_appOption, "", querysynbillBtn_query);
            props.openTo("/cmp/billmanagement/paybill/linkcard/index.html", {
                appcode: synbill_paybillcode,
                pagecode: synbill_pagecode,
                status: "browse",
                src: synbill_src,
                name:
                    this.props.MutiInit.getIntl("36070RBMAPP") &&
                    this.props.MutiInit.getIntl("36070RBMAPP").get(
                        "36070RBMAPP-000015"
                    ) /* 国际化处理： 付款结算联查*/
            });

            break;

        //红冲
        case "redbillBtn":
            let redbillBtnData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (redbillBtnData.length != 1) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000065"
                        )
                }); /* 国际化处理： 请选择单条数据，进行红冲!*/
                return;
            }
            let redbill_pk = null;
            redbillBtnData.forEach(val => {
                redbill_pk = val.data.values.pk_recbill.value;
            });

            let reddata = { pk: redbill_pk, pageid: this.pageId };

            ajax({
                url: "/nccloud/cmp/recbill/recbillredhandle.do",
                data: reddata,
                success: res => {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36070RBMAPP") &&
                                this.props.MutiInit.getIntl("36070RBMAPP").get(
                                    "36070RBMAPP-000066"
                                )
                        }); /* 国际化处理： 红冲成功*/
                        // NCMessage.create({ content: '提交成功', color: 'success', position: 'top' });
                        self.refresh();
                    }
                }
            });

            break;
        //刷新
        case "refreshBtn":
            let searchData = props.search.getAllSearchData(this.searchId);
            if (searchData && searchData.conditions) {
                self.refresh();
            }
            break;
        //联查计划预算
        case "queryconsumeBtn":
            let queryconsumeData = props.table.getCheckedRows(this.tableId);

            if (queryconsumeData.length == 0) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000067"
                        )
                }); /* 国际化处理： 请选择数据，进行联查预算!*/
                return;
            }
            let queryconsume_pk = null;

            queryconsumeData.forEach(val => {
                queryconsume_pk = val.data.values.pk_recbill.value;
            });

            let queryconsume_data = {
                pk: queryconsume_pk,
                pageid: this.pageId
            };
            console.log(queryconsume_data);
            ajax({
                url: "/nccloud/cmp/recbill/linkplan.do",
                data: queryconsume_data,
                success: res => {
                    let { success, data } = res;
                    if (res.data) {
                        this.setState({
                            showInspection: true,
                            sourceData: res.data
                        });
                    }
                }
            });

            break;
        //附件
        case "annexBtn":
            // toast({ color: 'warning', content: '请选择1条数据' });
            let accessoryBtnData = props.table.getCheckedRows(this.tableId);
            let pk_rec = ""; //单据pk
            let bill_no = ""; //单据编号
            //选择一个或者不选择，多选默认显示空数据
            if (accessoryBtnData.length == 1) {
                accessoryBtnData.forEach(val => {
                    if (
                        val.data.values.pk_recbill &&
                        val.data.values.pk_recbill.value != null
                    ) {
                        pk_rec = val.data.values.pk_recbill.value;
                    }
                    if (
                        val.data.values.bill_no &&
                        val.data.values.bill_no.value != null
                    ) {
                        bill_no = val.data.values.bill_no.value;
                    }
                });
            } else {
                toast({
                    duration: 3, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: "warning", // 提示类别，默认是 "success",非必输
                    title:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000068"
                        ), // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000069"
                        ) // 提示内容,非必输/* 国际化处理： 附件支持单条操作!*/
                });
                return;
            }
            this.setState({
                billId: pk_rec, //单据pk
                billno: bill_no, //附件管理使用单据编号
                showUploader: !this.state.showUploader,
                target: null
            });
            break;
        //打印
        case "printBtn":
            let printcardData = props.table.getCheckedRows(this.tableId);

            if (printcardData.length == 0) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000070"
                        )
                }); /* 国际化处理： 请选择数据，进行打印!*/
                return;
            }
            let oidss = [];
            printcardData.forEach(item => {
                oidss.push(item.data.values.pk_recbill.value);
                if (
                    item.data.values.trade_type &&
                    item.data.values.trade_type.value
                ) {
                    printcard_billtype = item.data.values.trade_type.value;
                }
            });
            print(
                "pdf", //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                "/nccloud/cmp/recbill/recbillprintcard.do",
                {
                    // billtype: printcard_billtype,  //单据类型
                    // funcode: printcard_funcode, //功能节点编码，即模板编码
                    // nodekey: printcard_nodekey,     //模板节点标识
                    // printTemplateID: printcard_templetid, //输出打印模板id
                    // appcode: props.getSearchParam('c'),
                    oids: oidss // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                }
            );

            break;
        //预览
        case "viewBtn":
            toast({
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36070RBMAPP") &&
                    this.props.MutiInit.getIntl("36070RBMAPP").get(
                        "36070RBMAPP-000010"
                    )
            }); /* 国际化处理： 功能待开发*/
            break;
        //输出
        case "outputBtn":
            let outputBtnData = props.table.getCheckedRows(this.tableId);
            if (outputBtnData.length == 0) {
                toast({
                    duration: 3, // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: "warning", // 提示类别，默认是 "success",非必输
                    title:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000068"
                        ), // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000071"
                        ) // 提示内容,非必输/* 国际化处理： 请选择数据，进行打印输出!*/
                });
                return;
            }
            let oids = [];
            outputBtnData.forEach(item => {
                oids.push(item.data.values.pk_recbill.value);
            });
            this.refs.printOutput.open();
            this.setState(
                {
                    outputData: {
                        // billtype: printcard_billtype,  //单据类型
                        // funcode: printcard_funcode, //功能节点编码，即模板编码
                        // nodekey: printcard_nodekey,     //模板节点标识：单据模版初始化
                        // printTemplateID: printcard_templetid, //输出打印模板id
                        // appcode: props.getSearchParam('c'),
                        oids: oids,
                        outputType: "output"
                    } //打印输出使用
                },
                () => {
                    this.refs.printOutput.open();
                }
            );
            break;
        //打印清单
        case "printDetailBtn":
            let printData = props.table.getCheckedRows(this.tableId);

            if (printData.length == 0) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000070"
                        )
                }); /* 国际化处理： 请选择数据，进行打印!*/
                return;
            }
            let pks = [];
            printData.forEach(item => {
                pks.push(item.data.values.pk_recbill.value);
                if (
                    item.data.values.trade_type &&
                    item.data.values.trade_type.value
                ) {
                    printlist_billtype = item.data.values.trade_type.value;
                }
            });
            print(
                "pdf", //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                "/nccloud/cmp/recbill/recbillprint.do",
                {
                    // billtype: printlist_billtype,  //单据类型
                    // funcode: printlist_funcode, //功能节点编码，即模板编码
                    // nodekey: printlist_nodekey,     //模板节点标识
                    // printTemplateID: printlist_templetid, //输出打印模板id
                    // appcode: props.getSearchParam('c'),
                    oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                }
            );
            break;
        //联查单据
        case "linkquerybillBtn":
            let linkquerybillData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (linkquerybillData.length != 1) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000072"
                        ) /* 国际化处理： 请选择单条数据，联查单据!*/
                });
                return;
            }
            //处理选择数据
            let showbilltrackpk;

            linkquerybillData.forEach(val => {
                if (
                    val.data.values.pk_recbill &&
                    val.data.values.pk_recbill.value
                ) {
                    showbilltrackpk = val.data.values.pk_recbill.value;
                }
                if (
                    val.data.values.bill_type &&
                    val.data.values.bill_type.value
                ) {
                    billtrack_billtype = val.data.values.bill_type.value;
                }
            });
            console.log(showbilltrackpk, "billtrack_showbilltrackpk");
            debugger;
            if (showbilltrackpk) {
                self.setState({
                    showbilltrack: true, //显示联查单据
                    showbilltracktype: billtrack_billtype, //单据类型
                    showbilltrackpk: showbilltrackpk //单据pk
                });
            }
            break;
        //联查审批意见
        case "querymsgBtn":
            let approvemsgData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (approvemsgData.length != 1) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000073"
                        ) /* 国际化处理： 请选择单条数据，查看审批意见!*/
                });
                return;
            }
            //处理选择数据
            let billid;
            approvemsgData.forEach(val => {
                if (
                    val.data.values.pk_recbill &&
                    val.data.values.pk_recbill.value
                ) {
                    billid = val.data.values.pk_recbill.value;
                }
                if (
                    val.data.values.trade_type &&
                    val.data.values.trade_type.value
                ) {
                    approve_billtype = val.data.values.trade_type.value;
                }
            });
            console.log(billid, "approve_billid");
            debugger;
            if (billid) {
                self.setState({
                    show: true,
                    billtype: approve_billtype, //单据类型
                    billid: billid //单据pk
                });
            }
            break;
    }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/