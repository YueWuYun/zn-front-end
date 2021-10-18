/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base, toast, cacheTools, print, promptBox } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { linkApp, linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证
import { MakeBillApp } from '../../../../../tmpub/pub/util/Makebill';//制单
import NCCOriginalBalance from'../../../../public/restmoney/list/index';
const { NCMessage } = base;
//请求url
let buttonclick_delete = Templatedata.buttonclick_delete;
let buttonclick_approve = Templatedata.buttonclick_approve;
let buttonclick_unapproce = Templatedata.buttonclick_unapproce;
let buttonclick_settle = Templatedata.buttonclick_settle;
let buttonclick_unsettle = Templatedata.buttonclick_unsettle;
let buttonclick_submit = Templatedata.buttonclick_submit;
let buttonclick_unsubmit = Templatedata.buttonclick_unsubmit;
let buttonclick_refrseh = Templatedata.buttonclick_refrseh;

export default function buttonClick(props, id) {
    let that = this;
    //联查余额
    let cacheTools_buybalance_key = Templatedata.balance_key;
    let balance_src = Templatedata.balance_src;
    let balance_appid = Templatedata.balance_appid;
    let balance_code = Templatedata.balance_code;
    let balance_pagecode = Templatedata.balance_pagecode;
    //联查凭证
    let voucher_calchekey = Templatedata.voucher_calchekey;
    let voucher_code = Templatedata.voucher_code;
    let voucher_appid = Templatedata.voucher_appid;
    let voucher_billtype = Templatedata.voucher_billtype;
    let voucher_appcode = Templatedata.voucher_appcode;
    //制单
    let makebill_billtype = Templatedata.makebill_billtype;
    let makebill_cachekey = Templatedata.makebill_cachekey;
    let makebill_code = Templatedata.makebill_code;
    let makebill_appid = Templatedata.makebill_appid;
    let makebill_appcode = Templatedata.makebill_appcode;
    //打印
    let printlist_billtype = Templatedata.printlist_billtype;
    let printlist_funcode = Templatedata.printlist_funcode;
    let printlist_nodekey = Templatedata.printlist_nodekey;
    let printcard_templetid = Templatedata.printcard_templetid;
    //联查审批意见
    let approve_billtype = Templatedata.approve_billtype;
    switch (id) {
        //新增
        case 'addBtn':
            //1,没有查询数据新增---数据id传空
            //2,查询了数据有新增---数据第一条pk直接获取。
            props.linkTo('/cmp/billmanagement/curexchange/card/index.html', {
                status: 'add',
                pagecode: this.pageCode,
                form: 'fromlist',
                id: this.state.add_pk,//查询后赋值
                bill_no: this.state.add_status//查询后赋值
            });
            break;
        //修改	
        case 'editBtn':

            const editData = props.table.getCheckedRows(this.tableId);

            if (editData.length != 1) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择单条数据!'   // 提示内容,非必输
                })
                return
            }
            let editId = 0;
            editData.forEach((val) => {

                editId = val.data.values.pk_cruexchange.value;//主键

            });

            props.linkTo('/cmp/billmanagement/curexchange/card/index.html', {
                status: 'edit',
                id: editId,
                pagecode: this.pageCode
            })

            break;

        //删除，可以支持批量
        case 'deleteBtn':
            let selectedData = props.table.getCheckedRows(this.tableId);
            if (selectedData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据,进行删除!'   // 提示内容,非必输
                })
                return;
            }
            props.modal.show('delete');
            break;

        //审批
        case 'approveBtn':

            let approveData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (approveData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据!'   // 提示内容,非必输
                })
                return
            }
            let indexArrapprove = [];
            let dataArrapprove = [];
            //处理选择数据
            approveData.forEach((val) => {
                dataArrapprove.push(val.data.values.pk_cruexchange.value);//主键数组
                indexArrapprove.push(val.index);
            });
            // dataArrapprove.push('1001Z61000000001R7GY');//测试使用
            //自定义请求数据
            let data2 = {
                'pks': dataArrapprove
            };

            ajax({
                url: buttonclick_approve,
                data: data2,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: "已成功",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '审批成功!'   // 提示内容,非必输
                        })
                        that.refresh();
                    }
                }
            });
            break;

        //审批取消-退审
        case 'unapproveBtn':

            let unapproveData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (unapproveData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据!'   // 提示内容,非必输
                })
                return
            }
            let indexArr3 = [];
            let dataArr3 = [];
            //处理选择数据
            unapproveData.forEach((val) => {

                dataArr3.push(val.data.values.pk_cruexchange.value);//主键数组
                indexArr3.push(val.index);
            });
            // dataArr3.push('1001Z61000000001R7GY');//测试使用
            //自定义请求数据
            let data3 = {
                'pks': dataArr3
            };

            ajax({
                url: buttonclick_unapproce,
                data: data3,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: "已成功",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '审批取消成功!'   // 提示内容,非必输
                        })
                        that.refresh();
                    }
                }
            });
            break;

        //结算
        case 'settlelistBtn':

            let settleData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (settleData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据,进行结算!'   // 提示内容,非必输
                })
                return
            }
            let indexArr4 = [];
            let dataArr4 = [];
            //处理选择数据
            settleData.forEach((val) => {

                dataArr4.push(val.data.values.pk_cruexchange.value);//主键数组
                indexArr4.push(val.index);
            });
            // dataArr4.push('1001Z61000000001R7GY');//测试使用
            //自定义请求数据
            let data4 = {
                'pks': dataArr4
            };

            ajax({
                url: buttonclick_settle,
                data: data4,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: "已成功",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '结算成功!'   // 提示内容,非必输
                        })
                        that.refresh();
                    }
                }
            });
            break;

        //结算取消
        case 'unsettlelistBtn':

            let unsettleData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (unsettleData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据,进行取消结算!'   // 提示内容,非必输
                })
                return
            }
            let indexArr5 = [];
            let dataArr5 = [];
            //处理选择数据
            unsettleData.forEach((val) => {
                dataArr5.push(val.data.values.pk_cruexchange.value);//主键数组
                indexArr5.push(val.index);
            });
            //自定义请求数据
            let data5 = {
                'pks': dataArr5,
                'pageid': this.pageCode
            };

            ajax({
                url: buttonclick_unsettle,
                data: data5,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: "已成功",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '结算取消成功!'   // 提示内容,非必输
                        })
                        that.refresh();
                    }
                }
            });
            break;

        //复制
        case 'copyBtn':

            let copyData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (copyData.length != 1) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择单条数据,进行复制!'   // 提示内容,非必输
                })
                return
            }
            let copyid = 0;
            let bill_num = 1;
            copyData.forEach((val) => {
                copyid = val.data.values.pk_cruexchange.value;
                bill_num = val.data.values.busistatus.value;
            });
            props.linkTo('/cmp/billmanagement/curexchange/card/index.html', {
                status: 'copy',
                id: copyid,
                bill_no: bill_num,
                pagecode: this.pageCode
                // id: '1001Z61000000001R7GR'//测试使用
            });

            break;


        //提交
        case 'submitlistBtn':
            let submitData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (submitData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据,进行提交!'   // 提示内容,非必输
                })
                return
            }
            let indexArr6 = [];
            let dataArr6 = [];
            let listTsmap = [];//ts的list类型
            //处理选择数据
            submitData.forEach((val) => {
                dataArr6.push(val.data.values.pk_cruexchange.value);//主键数组
                indexArr6.push(val.index);
                let tsmap = {
                    'pk': val.data.values.pk_cruexchange.value,
                    'ts': val.data.values.ts.value
                }
                listTsmap.push(tsmap);
            });

            // dataArr6.push('1001Z61000000001R7GY');//测试使用
            //自定义请求数据
            let data6 = {
                'pks': dataArr6,
                'pageid': this.pageCode,
                'listTsmap': listTsmap
            };

            ajax({
                url: buttonclick_submit,
                data: data6,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: "已完成",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '提交成功!'   // 提示内容,非必输
                        })
                        that.refresh();
                    }
                }
            });
            break;



        //收回
        case 'unsubmitlistBtn':

            let unsubmitData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (unsubmitData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据，进行收回'   // 提示内容,非必输
                })
                return
            }
            let indexArr7 = [];
            let dataArr7 = [];
            let unsubmitlistTsmap = [];//ts的list类型
            //处理选择数据
            unsubmitData.forEach((val) => {
                dataArr7.push(val.data.values.pk_cruexchange.value);//主键数组
                indexArr7.push(val.index);
                let unsubTsmap = {
                    'ts': val.data.values.ts.value,
                    'pk': val.data.values.pk_cruexchange.value
                }
                unsubmitlistTsmap.push(unsubTsmap);
            });
            //自定义请求数据
            let data7 = {
                'pks': dataArr7,
                'pageid': this.pageCode,
                'listTsmap': unsubmitlistTsmap
            };

            ajax({
                url: buttonclick_unsubmit,
                data: data7,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: "已成功",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '收回成功!'   // 提示内容,非必输
                        })
                        that.refresh();
                    }
                }
            });
            break;

        //制单
        case 'makebillBtn':
            let makebilData = props.table.getCheckedRows(this.tableId);
            if (makebilData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据，进行制单！'   // 提示内容,非必输
                })
                return;
            }
            if (makebilData.length != 1) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择单条数据，进行制单！'   // 提示内容,非必输
                })
                return;
            }
            let makebillArr = [];
            let arr = [];
            //处理选择数据
            let pk_billtypecode = makebill_billtype;
            makebilData.forEach((val) => {
                makebillArr.push(val.data.values.pk_cruexchange.value);
                makebillArr.push(pk_billtypecode);
                arr.push(makebillArr);
            });
            MakeBillApp(props, makebill_appcode, arr);
            // let makebillData = props.table.getCheckedRows(this.tableId);
            // //数据校验
            // if (makebillData.length == 0) {
            //     toast({
            //         duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            //         color: 'warning',     // 提示类别，默认是 "success",非必输
            //         title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
            //         content: '请选择数据,进行制单!'   // 提示内容,非必输
            //     })
            //     return
            // }
            // let makebillArr = [];
            // let Arr = [];
            // makebillArr.push(makebill_billtype);
            // //处理选择数据

            // makebillData.forEach((val) => {
            //     makebillArr.push(val.data.values.pk_cruexchange.value);
            // });

            // Arr.push(makebillArr);
            // cacheTools.set(makebill_cachekey, Arr);
            // console.log(Arr, "makebillArr");

            // let makebill_appOption = {
            //     code: makebill_code,
            //     name: '单据生成,制单',
            //     pk_appregister: makebill_appid
            // }
            // let makebill_type = {
            //     type: null
            // }
            // let makebill_query = {
            //     status: 'browse',
            //     src: makebill_cachekey,
            // }
            // window.parent.openNew(makebill_appOption, "", makebill_query);
            break;

        //刷新
        case 'refreshBtn':

            let searchData = props.search.getAllSearchData(this.searchId);
            if (searchData && searchData.conditions) {
                that.refresh();
            }

            break;

        //测试功能-联查收款结算单
        case 'testBtn':
            let datasArr = [];
            datasArr.push('1001G5100000000016TH');
            datasArr.push('1001G5100000000021B2');
            cacheTools.set('checkedData', datasArr);
            // window.parent.openNew({ code: '36070RBM', name: '收款结算管理', pk_appregister: '0001Z6100000000264K0' }, 'current', 'status=browse&src=fip')
            window.parent.openNew({
                code: '36070RBM',
                name: '收款结算管理',
                pk_appregister: '0001Z6100000000264K0'
            },
                null, 'status=browse&src=fip')
            break;
        //买入账户余额
        case 'buybalanceBtn':

            let buybalanceBtnData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (buybalanceBtnData.length != 1) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择单条数据，联查买入账户余额!'   // 提示内容,非必输
                })
                return;
            }

            let buybalanceBtnArr = [];
            //处理选择数据
            buybalanceBtnData.forEach((val) => {

                if (val.data.values.pk_buyacct && val.data.values.pk_buyacct.value != null) {

                    let pk_buyacct = val.data.values.pk_buyacct.value;
                    if (!pk_buyacct) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'warning',     // 提示类别，默认是 "success",非必输
                            title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '不存在买入账户!'   // 提示内容,非必输
                        })
                        return;
                    }
                    let pk_buyorg = val.data.values.pk_org.value;
                    //修改请求联查方式
                    let query_data = {
                        pk_org: pk_buyorg, //财务组织id
                        pk_account: pk_buyacct, //银行账户id，没有可不写，和现金账户二选一
                        pk_cashaccount: null //现金账户id，没有可不写
                    }
                    buybalanceBtnArr.push(query_data);//买入银行账号
                } else {
                    toast({
                        duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                        color: 'warning',     // 提示类别，默认是 "success",非必输
                        title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                        content: '不存在买入账户!'   // 提示内容,非必输
                    })
                    return;
                }

            });
            this.setState({
                showOriginalData:buybalanceBtnArr,
                showOriginal:true,
            });
            break;
        //卖出账户余额
        case 'sellbalanceBtn':
            let sellbalanceBtnData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (sellbalanceBtnData.length != 1) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择单条数据，联查卖出账户余额！'   // 提示内容,非必输
                })
                return;
            }

            let sellbalanceBtnArr = [];
            //处理选择数据
            sellbalanceBtnData.forEach((val) => {

                if (val.data.values.pk_sellacct && val.data.values.pk_sellacct.value != null) {
                    let pk_sellacct = val.data.values.pk_sellacct.value;
                    if (!pk_sellacct) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'warning',     // 提示类别，默认是 "success",非必输
                            title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '不存在卖出账户！'   // 提示内容,非必输
                        })
                        return;
                    }
                    let pk_sellorg = val.data.values.pk_org.value;
                    //修改请求联查方式
                    let query_sell_data = {
                        pk_org: pk_sellorg, //财务组织id
                        pk_account: pk_sellacct, //银行账户id，没有可不写，和现金账户二选一
                        pk_cashaccount: null //现金账户id，没有可不写
                    }

                    sellbalanceBtnArr.push(query_sell_data);//卖出银行账号
                } else {
                    toast({
                        duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                        color: 'warning',     // 提示类别，默认是 "success",非必输
                        title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                        content: '不存在卖出账户！'   // 提示内容,非必输
                    })
                    return;
                }

            });
            this.setState({
                showOriginalData:sellbalanceBtnArr,
                showOriginal:true,
            });
            break;
        //手续费账户余额
        case 'chargebalanceBtn':
            let chargebalanceBtnData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (chargebalanceBtnData.length != 1) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择单条数据，联查手续费账户！'   // 提示内容,非必输
                })
                return;
            }

            let chargebalanceBtnArr = [];
            //处理选择数据
            chargebalanceBtnData.forEach((val) => {

                if (val.data.values.pk_paychargeacct && val.data.values.pk_paychargeacct.value != null) {
                    let pk_paychargeacct = val.data.values.pk_paychargeacct.value;
                    if (!pk_paychargeacct) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'warning',     // 提示类别，默认是 "success",非必输
                            title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                            content: '不存在手续费账户！！'   // 提示内容,非必输
                        })
                        return;
                    }
                    let pk_charge_org = val.data.values.pk_org.value;
                    //修改请求联查方式
                    let query_charge_data = {
                        pk_org: pk_charge_org, //财务组织id
                        pk_account: pk_paychargeacct, //银行账户id，没有可不写，和现金账户二选一
                        pk_cashaccount: null //现金账户id，没有可不写
                    }
                    chargebalanceBtnArr.push(query_charge_data);//卖出银行账号
                } else {
                    toast({
                        duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                        color: 'warning',     // 提示类别，默认是 "success",非必输
                        title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                        content: '不存在手续费账户！！'   // 提示内容,非必输
                    })
                    return;
                }

            });
            this.setState({
                showOriginalData:chargebalanceBtnArr,
                showOriginal:true,
            });
            break;
        //联查凭证
        case 'voucherBtn':
            let selectData = props.table.getCheckedRows(this.tableId);
            if (selectData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据，进行联查凭证！'   // 提示内容,非必输
                })
                return;
            }
            if (selectData.length != 1) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择单条数据，进行联查凭证！'   // 提示内容,非必输
                })
                return;
            }
            let record_pk = '';
            let record_vbillno = '';
            selectData.forEach((val) => {
                record_pk = val.data.values.pk_cruexchange.value;
                record_vbillno = val.data.values.vbillno.value;
            });
            linkVoucherApp(
                props,
                record_pk,
                'nc.vo.cmp.curexchange.CurExchangeVO',
                voucher_appcode,
                voucher_billtype,
                record_vbillno,
            );
            // let voucherData = props.table.getCheckedRows(this.tableId);
            // //数据校验
            // if (voucherData.length != 1) {
            //     toast({
            //         duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            //         color: 'warning',     // 提示类别，默认是 "success",非必输
            //         title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
            //         content: '请选择单条数据，联查凭证!'   // 提示内容,非必输
            //     })
            //     return;
            // }
            // let voucherArr = [];
            // //处理选择数据
            // voucherData.forEach((val) => {
            //     let pk_group, pk_org, pk_cruexchange
            //     if (val.data.values.pk_group && val.data.values.pk_group.value != null) {
            //         pk_group = val.data.values.pk_group.value;
            //     }
            //     if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
            //         pk_org = val.data.values.pk_org.value;
            //     }
            //     if (val.data.values.pk_cruexchange && val.data.values.pk_cruexchange.value != null) {
            //         pk_cruexchange = val.data.values.pk_cruexchange.value;
            //     }
            //     let voucher = {
            //         pk_billtype: voucher_billtype,
            //         pk_group: pk_group,
            //         pk_org: pk_org,
            //         relationID: pk_cruexchange
            //     }
            //     voucherArr.push(voucher);
            // });
            // cacheTools.set(voucher_calchekey, voucherArr);
            // debugger;
            // let voucher_appOption = {
            //     code: voucher_code,
            //     name: '联查单据凭证',
            //     pk_appregister: voucher_appid
            // }
            // let voucher_type = {
            //     type: null
            // }
            // let voucher_query = {
            //     status: 'browse',
            //     src: voucher_calchekey,
            // }
            // window.parent.openNew(voucher_appOption, '', voucher_query);

            break;

        //审批意见
        case 'approvemsgBtn':
            let approvemsgData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (approvemsgData.length != 1) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择单条数据，查看审批意见!'   // 提示内容,非必输
                })
                return;
            }
            //处理选择数据
            let billid;
            approvemsgData.forEach((val) => {

                if (val.data.values.pk_cruexchange && val.data.values.pk_cruexchange.value != null) {
                    billid = val.data.values.pk_cruexchange.value;
                }

            });
            debugger;
            if (billid) {
                that.setState({
                    show: true,
                    billtype: approve_billtype,//单据类型
                    billid: billid//单据pk
                });
            }
            break
        //打印
        case 'printBtn':

            let printData = props.table.getCheckedRows(this.tableId);

            if (printData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据，进行打印!'   // 提示内容,非必输
                })
                return;
            }
            let pks = [];
            printData.forEach((item) => {
                pks.push(item.data.values.pk_cruexchange.value);
            });
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/cmp/curexchange/curexchangeprint.do',
                {
                    billtype: printlist_billtype,  //单据类型
                    funcode: printlist_funcode, //功能节点编码，即模板编码
                    nodekey: printlist_nodekey,     //模板节点标识
                    printTemplateID: printcard_templetid, //输出打印模板id
                    oids: pks   // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,

                }
            );
            break
        //预览
        case 'previewBtn':
            toast({ color: 'warning', content: '功能待开发' });
            break
        //输出
        case 'outputBtn':
            let outputBtnData = props.table.getCheckedRows(this.tableId);
            if (outputBtnData.length == 0) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '请选择数据，进行打印输出!'   // 提示内容,非必输
                })
                return;
            }
            let oids = [];
            outputBtnData.forEach((item) => {
                oids.push(item.data.values.pk_cruexchange.value);
            });
            this.refs.printOutput.open();
            this.setState(
                {
                    outputData: {
                        funcode: printlist_funcode, //功能节点编码，即模板编码
                        nodekey: printlist_nodekey, //模板节点标识
                        printTemplateID: printcard_templetid, //模板id
                        oids: oids,
                        outputType: 'output'
                    }//打印输出使
                },
                () => {
                    this.refs.printOutput.open();
                }
            );
            break
        //附件
        case 'accessoryBtn':

            let accessoryBtnData = props.table.getCheckedRows(this.tableId);

            let pk_rec = '';//单据pk
            let bill_no = '';//单据编号
            //选择一个或者不选择，多选默认显示空数据
            if (accessoryBtnData.length == 1) {
                accessoryBtnData.forEach((val) => {

                    if (val.data.values.pk_cruexchange && val.data.values.pk_cruexchange.value != null) {
                        pk_rec = val.data.values.pk_cruexchange.value;
                    }
                    if (val.data.values.vbillno && val.data.values.vbillno.value != null) {
                        bill_no = val.data.values.vbillno.value;
                    }
                });
            } else {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '附件支持单条操作!'   // 提示内容,非必输
                })
                return;
            }
            console.log(bill_no, '附件');
            console.log(pk_rec, 'pk_rec');
            console.log(bill_no, 'bill_no');
            if (!pk_rec) {
                toast({
                    duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                    color: 'warning',     // 提示类别，默认是 "success",非必输
                    title: "请注意",      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                    content: '操作失败，无数据!'   // 提示内容,非必输
                })
                return;
            }

            this.setState({
                billId: pk_rec,//单据pk
                billno: bill_no,//附件管理使用单据编号
                showUploader: !this.state.showUploader,
                target: null
            })
            break

    }
};
//刷新列表信息
function refreshHtml(props) {

    let table_id = Templatedata.list_tableid;
    let search_id = Templatedata.list_searchid;
    let page_id = Templatedata.list_pageid;

    let refreshpageInfo = props.table.getTablePageInfo(table_id);//分页
    let refreshsearchVal = props.search.getAllSearchData(search_id);//查询condition


    let data = {
        conditions: refreshsearchVal.conditions || refreshsearchVal,
        pageInfo: refreshpageInfo,
        pagecode: page_id,
        queryAreaCode: search_id,  //查询区编码
        oid: Templatedata.list_oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        queryType: Templatedata.list_querytype
    };
    ajax({
        url: buttonclick_refrseh,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    props.table.setAllTableData(table_id, data[table_id]);
                } else {
                    props.table.setAllTableData(table_id, { rows: [] });
                }

            }
        }
    });

}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/