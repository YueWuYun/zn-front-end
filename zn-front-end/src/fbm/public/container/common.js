/*q+Tp88nQNo7z782f3GAtCEGei+DqyCQZhUF0Alo7wR/U2jibEe0rDh4uWg5xKBD+*/
/* 
    公共方法（与业务无关）
    created by: liyaoh 2018-09-08
*/
import { ajax, toast, print, cacheTools } from 'nc-lightapp-front';
import * as constant from './constant';

//公共文件moduleid
export const MODULE_ID = '';
//按钮操作名称
export const OPR_NAME = {
    commit: 'fbmpublic-000027',/* 国际化处理： 提交*/
    uncommit: 'fbmpublic-000028',/* 国际化处理： 收回*/
    delete: 'fbmpublic-000000',/* 国际化处理： 删除*/
    terminate: 'fbmpublic-000002',/* 国际化处理： 终止*/
    unterminate: 'fbmpublic-000029',/* 国际化处理： 取消终止*/
    save: 'fbmpublic-000030',/* 国际化处理： 保存*/
    saveCommit: 'fbmpublic-000031',/* 国际化处理： 保存提交*/
    change: 'fbmpublic-000032',/* 国际化处理： 变更*/
    deleteVersion: 'fbmpublic-000033',/* 国际化处理： 删除版本*/
    makeVoucher: 'fbmpublic-000034',/* 国际化处理： 制证*/
    cancelVoucher: 'fbmpublic-000035',/* 国际化处理： 取消制证*/
    interest: 'fbmpublic-000036',/* 国际化处理： 计息*/
    uninterest: 'fbmpublic-000037',/* 国际化处理： 取消计息*/
    disable: 'fbmpublic-000038',/* 国际化处理： 作废*/
    cancelDisable: 'fbmpublic-000039',/* 国际化处理： 取消作废*/
    sendCommand: 'fbmpublic-000040',/* 国际化处理： 发送指令*/
    counterCommand: 'fbmpublic-000041',/* 国际化处理： 撤回指令*/
    return: 'fbmpublic-000042',/* 国际化处理： 退回*/
    handle: 'fbmpublic-000043',/* 国际化处理： 经办*/
    upquota: 'fbmpublic-000044',/* 国际化处理： 额度上收*/
    downquota: 'fbmpublic-000045',/* 国际化处理： 额度下拨*/
    withdrawInstruction: 'fbmpublic-000018',/* 国际化处理： 解除质押*/
    cancelImpawnBack: 'fbmpublic-000046',/* 国际化处理： 取消解押*/
    withdrawImpawn: 'fbmpublic-000047',/* 国际化处理： 质押/解押撤回*/
    confirmreceipt: 'fbmpublic-000011',/* 国际化处理： 确认收妥*/
    unconfirmreceipt: 'fbmpublic-000048',/* 国际化处理： 取消确认*/
    commission: 'fbmpublic-000079',/* 国际化处理： 委托办理*/
    uncommission: 'fbmpublic-000080',/* 国际化处理： 取消委托办理*/
    destroy: 'fbmpublic-000077',/* 国际化处理： 核销*/
    transform: 'fbmpublic-000083',/* 国际化处理： 冲销*/
    cancelTransform: 'fbmpublic-000084',/* 国际化处理： 取消冲销*/
    accept: 'fbmpublic-000086',/* 国际化处理：  受理 */
    unaccept: 'fbmpublic-000087',/* 国际化处理：  取消受理 */
    impawnBackSign: 'fbmpublic-000088',/* 国际化处理：  解除质押签收 */
    tally: 'fbmpublic-000089',/* 国际化处理： 记账*/
    cancelTally: 'fbmpublic-000090'/* 国际化处理： 取消记账*/
}

// 跨服务按钮定义 1.对应后台常量类跨服务按钮定义  2.对应API_URL定义的接口key
export const SAGABUTTONS = [
    'save','commit','saveCommit','uncommit','makeVoucher',
    'cancelVoucher','delete','cancelDisable','disable',
    'transform','cancelImpawnBack','withdrawInstruction'
]

/**
 * 按钮接口操作 需要使用call调用。调用的接口需要在constant.js中定义
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
export function api(params) {
    let { name, data, success, error } = params;
    ajax({
        url: this.API_URL[name],
        data,
        success: (res) => {
            success && success(res);
        }
    });
}
/**
 * 给修改按钮用，做saga校验
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
export function apiSaga(params) {
    let { data, success, error } = params;
    ajax({
        url: `/nccloud/tmpub/pub/sagacheck.do`,
        data,
        success: (res) => {
            success && success(res);
        }
    });
}
/**
 * 基于Promise封装ajax请求
 *
 * @param {*} { url, data }
 * @returns
 */
export function request({ url, data }) {
    return new Promise((resolve, reject) => {
        ajax({
            url,
            data,
            success: (res) => {
                resolve(res);
            },
            error: (res) => {
                toast({ color: 'danger', content: res.message });
                reject(res);
            }
        });
    });
}

/**
 * 打印清单
 *
 * @param {*} pks - 数组类型pk
 */
export function printFnList(pks) {
    print(
        'pdf',
        this.API_URL.print,
        {
            appcode: this.appcode,
            nodekey: this.nodekeyList,
            oids: pks
        }
    );
}

/**
 * 打印
 *
 * @param {*} pks - 数组类型pk
 */
export function printFn(pks) {
    print(
        'pdf',
        this.API_URL.print,
        {
            appcode: this.appcode,
            nodekey: this.nodekey,
            oids: pks
        }
    );
}

/**
 * 输出
 *
 * @param {*} pks - 数组类型pk
 */
export function output(pks) {
    this.setState({
        outputData: {
            nodekey: this.nodekey,
            oids: pks,
            outputType: 'output'
        }
    }, () => {
        this.refs.printOutput.open();
    });
}

/**
 * 附件管理
 *
 * @param {*} billId - 主键id
 * @param {*} billNo - 单据编号
 */
export function fileMgr(billId, billNo) {
    this.setState({
        showUploader: !this.state.showUploader,
        billInfo: { billId, billNo }
    });
}

/**
 * 联查审批详情
 *
 * @param {*} billId - 主键id
 */
export function approveDetail(billId) {
    this.setState({
        showApproveDetail: true,
        billInfo: { billId }
    });
}


/**
 *
 * @param {*} props
 * @param {*} {
 *     url, 联查应用地址
 *     status = 'browse', 页面编辑状态，默认浏览态
 *     appcode, 小应用编码
 *     pagecode, 页面编码
 *     scene, 场景名称，默认联查
 *     id 被联查单据主键
 * }
 */
export function linkApp(props, {
    url,
    status = 'browse',
    appcode,
    pagecode,
    scene = 'linksce',
    id,
    ...other
}) {
    props.openTo(url, {
        status,
        appcode,
        pagecode,
        scene,
        id,
        // scene: "linksce", // 前端代码控制时需要的 场景参数
        sence: "4", // 公共处理是需要的应用跳转参数 4-联查 3-审批 1-默认
        ...other
    });
}

export const linkAppFromTmpub = function (props, billTypeOrTransType, urlExtParam) {
    const base_url = '/nccloud/tmpub/pub/';
    ajax({
        url: base_url + 'qrylinkinfo.do',
        data: { billTypeOrTransType },
        success: (res) => {
            let { data } = res;
            if (!data) {
                return;
            }
            let { url, appCode, linkPageCode } = data;
            if (!urlExtParam || Object.keys(urlExtParam).length == 0) {
                urlExtParam = {};
            }
            //默认指定联查场景
            if (!urlExtParam['scene']) {
                urlExtParam['scene'] = 'linksce';
            }
            //默认浏览态
            if (!urlExtParam['status']) {
                urlExtParam['status'] = 'browse';
            }
            urlExtParam['appcode'] = appCode;
            urlExtParam['pagecode'] = linkPageCode;
            //begin tm tangleic 地址平台会根据appcode和pagecode来获取，故无需指定小应用url
            // props.openTo(url, urlExtParam);
            props.openTo(null, urlExtParam);
            //end tangleic
        }
    });
}


/* 
    ====================联查====================
*/

/**
 * 联查审批详情
 *
 * @param {*} pk - 主键id
 */
export function linkApproveDetail(pk) {
    approveDetail.call(this, pk);
    // this.setState({
    //     showApproveDetail: true,
    //     billInfo: { billId: pk }
    // });
}

/**
 * 联查凭证
 *
 * @param {*} voucherArr - 联查凭证需要的数据，pk_group/pk_org/relationID组成的数组
 *      格式:[{pk_group: '', //集团主键
                pk_org:'', //组织主键
                relationID: '', //单据主键
                pk_billtype: ''
 *           }]
 */
export function linkVoucher(voucherArr) {
    //拼接联查数据,支持批量联查
    // let querydata = [{
    //     pk_group: voucherArr[0].pk_group, //集团主键
    //     pk_org: voucherArr[0].pk_org, //组织主键
    //     relationID: voucherArr[0].relationID, //单据主键
    //     pk_billtype: voucherArr[0].pk_billtype//交易类型
    // }];
    ajax({
        url: this.API_URL.linkVoucher,//业务组自己写入口类
        data: voucherArr,
        success: (res) => {
            if (res.success) {
                let srcCode = res.data.src;
                if ('_LinkVouchar2019' == srcCode) {
                    //走联查
                    if (res.data.des) {//跳转到凭证界面
                        if (res.data.pklist) {
                            // cacheTools.set(this.appcode+'_LinkVouchar',voucherArr);
                            if (res.data.pklist.length == 1) {//单笔联查
                                this.props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    id: res.data.pklist[0],
                                    pagekey: 'link',//这个参数去掉,不传了
                                    n: this.state.json['fbmpublic-000049'],//'联查凭证'/* 国际化处理： 联查凭证*/
                                    backflag: 'noback'
                                });
                                return;
                            } else {//多笔联查
                                // cacheTools.set("checkedData", res.data.pklist);
                                cacheTools.set(res.data.cachekey, res.data.pklist);//之前缓存的key是”checkedData”,现在改为res.data.cachekey,从接口获取缓存的key
                                this.props.openTo(res.data.url, {
                                    status: 'browse',
                                    appcode: res.data.appcode,
                                    pagecode: res.data.pagecode,
                                    n: this.state.json['fbmpublic-000049'], //'联查凭证'/* 国际化处理： 联查凭证*/
                                    scene: this.appcode + srcCode //多笔联查新加scene字段
                                });
                                return;
                            }
                        }
                    } else {
                        //跳转到会计平台
                        cacheTools.set(res.data.appcode + srcCode, res.data.pklist);
                        //打开凭证节点
                        this.props.openTo(res.data.url, {
                            status: 'browse',
                            appcode: res.data.appcode,
                            pagecode: res.data.pagecode,
                            scene: res.data.appcode + srcCode,
                            n: this.state.json['fbmpublic-000049'] // '凭证预览' 凭证使用这个参数,会计平台不用
                        });
                    }
                } 
                // else if ('_Preview2019' == srcCode) {
                //     //走预览
                //     cacheTools.set(res.data.appcode + srcCode, viewData);
                //     //打开凭证节点
                //     this.props.openTo(res.data.url, {
                //         status: 'browse',
                //         appcode: res.data.appcode,
                //         pagecode: res.data.pagecode,
                //         scene: res.data.appcode + srcCode,
                //         n: this.state.json['fbmpublic-000049'] // '凭证预览' 凭证使用这个参数,会计平台不用
                //     });
                // } 
                else {//跳转到会计平台 这里的appcode是业务组的小应用编码
                    toast({ color: 'warning', content: this.state.json['fbmpublic-000050'] });//000057/* 国际化处理： 未查到凭证*/
                    return;
                }
            }
        }
    });
}
// 凭证联查单据
export function voucherLinkBill() {
    let checkedData = [];
    //缓存中的key为’checkedData’,
    checkedData = cacheTools.get('checkedData');
    if (checkedData && checkedData.length > 0) {
        ajax({
            url: this.API_URL.voucherlink,
            data: {
                operatingLogVO: checkedData,
                pageCode: this.pageId
            },
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        let rowlenght = data[this.tableId].rows;
                        if (rowlenght.length == 1) {
                            let record = rowlenght[0];
                            //1条数据跳转到卡片页面
                            this.props.pushTo("/card", {
                                status: 'browse',
                                id: record.values[this.primaryId] && record.values[this.primaryId].value,
                                scene: "linksce",
                                pagecode: this.cardPageCode
                            });
                        } else {
                            //多条数据跳转到列表页面
                            this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                        }
                    } else {
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                    }
                }
            }
        });
    }
}

/**
 * 联查预算计划
 *
 * @param {*} pk - 主键
 */
export function linkNtb(pk) {
    if (!this.fullAggClassName) {
        toast({
            color: 'warning',
            content: this.state.json['fbmpublic-000014'] + this.fullAggClassName                /* 国际化处理： 全路径类名错误，请检查！*/
        });
        return;
    }
    // 联查预算url
    let url = this.API_URL.linkNtb ? this.API_URL.linkNtb : '/nccloud/fbm/pub/fbmntblinkplan.do';
    ajax({
        url: url,
        data: {
            pk,
            className: this.fullAggClassName,
            modulecode: this.modulecode
        },
        success: (res) => {
            let { data } = res;
            if (data.hint) {
                toast({ color: 'warning', content: res.data.hint });
            } else {
                this.setState({
                    showNtbDetail: true,
                    ntbdata: data
                });
            }
        }
    });
}


/**
 * 联查授信
 *
 * @param {*} balanceinfo - 授信协议参数 
 */
export function linkCredit(balanceinfo) {
    this.setState({
        showCCCBalance: balanceinfo,
        showCCC: true,
    });
}

/**
 * 联查内部结算账户
 *
 * @param {*} accpk - 内部账户参数 
 */
export function linkInnerAccount(accpk) {
    this.setState({
        showInneraccpk: accpk,
        showInnerAccount: true,
    });
}

/**
 * 联查余额
 *
 * @param {*} balanceData
 *     pk_org 财务组织id
 *     pk_account 银行账户id（可选）
 *     pk_cashaccount 现金账户id（可选）
 * 
 */
export function linkBankBalance(balanceData) {
    this.setState({
        showOriginalData: balanceData,
        showOriginalBalance: true,
    });
}

/**
 * 申请单
 *
 * @param {*} pk - 主键
 */
export function linkQuotaApply(pks) {
    let { urlCard, appcode, pagecodeCard } = constant.quotaapplyConst;
    linkApp(this.props, {
        url: urlCard,
        appcode,
        pagecode: pagecodeCard,
        id: pks,
        billtype: '36HQ'
    });
}

/**
 * 单位下拨可用额度
 *
 * @param {*} pk - 主键
 */
export function linkUnitQuota(pk) {
    let { urlList, appcode, pagecodeList } = constant.unitquotaConst;
    linkApp(this.props, {
        url: urlList,
        appcode,
        pagecode: pagecodeList,
        id: pk,
        srcPage: this.pageId,
        billtype: '36US'
    });
}

/**
 * 收付单据
 *
 * @param {*} pk - 主键
 */
export function linkReceAndPaybill(pk, vbillno, pk_register, pk_group) {
    //首先通过pk进行后台查询 找到要联查页面的类型和pk
    ajax({
        url: this.API_URL.linkReceAndPaybill,
        data: {
            pk: pk,
            extParam: {
                vbillno: vbillno,
                pk_register: pk_register,
                pk_group: pk_group,
            }
        },
        success: res => {
            let { data } = res;
            if (data) {
                let pk_outerbill_h = data.pk_outerbill_h;
                let billtype = data.billtype;
                let rreturnExtparam = {
                    status: 'browse',
                    id: pk_outerbill_h,
                };
                linkAppFromTmpub(this.props, billtype, rreturnExtparam);
            }
        }
    });
}

/**
 * 应付票据贴现
 *
 * @param {*} pk - 主键
 */
export function linkBuyerDiscount(pks) {
    let { urlList, urlCard, appcode, pagecodeList, pagecodeCard } = constant.buyerdiscount;
    linkApp(this.props, {
        url: urlCard,
        appcode,
        pagecode: pagecodeCard,
        id: pks,
        billtype: '36HV'
    });
}


/**
 * 额度上收
 *
 * @param {*} pk - 主键
 */
export function linkUpquota(pks) {
    let { urlList, urlCard, appcode, pagecodeList, pagecodeCard } = constant.upquotaConst;
    linkApp(this.props, {
        url: urlList,
        appcode,
        pagecode: pagecodeList,
        id: pks,
        billtype: '36HS'
    });
}

/**
 * 联查利息清单
 * 票据不用这个方法
 * @param {*} pk - 主键
 */
export function linkInterestList(pk) {
    let { urlList, urlCard, appcode, pagecodeList, pagecodeCard } = constant.interestListConst;
    if (this.appcode === '36650BCIA') { // 利息调整走其他接口，且只存在一对一，跳卡片
        ajax({
            url: '/nccloud/bond/interestadjust/queryinterestlistpk.do',
            data: { pk: pk },
            success: (res) => {
                let { data } = res;
                if (data) {
                    linkApp(this.props, {
                        url: urlCard,
                        appcode,
                        pagecode: pagecodeCard,
                        id: data,
                        billtype: ''
                    });
                } else {
                    toast({ color: 'warning', content: this.state.json['fbmpublic-000051'] });/* 国际化处理： 此利息调整单无利息清单！*//* 国际化处理： 此利息调整单无利息清单！*/
                }
            }
        });
    } else {
        ajax({
            url: '/nccloud/bond/calcintst/interestlistlink.do',
            data: { pks: [pk] },
            success: (res) => {
                let { data } = res;
                let pagecode = pagecodeList;
                let url = urlList;
                let rowsData = data.table && data.table.rows;
                //单条条卡片，多条跳列表
                if (rowsData.length == 1) {
                    url = urlCard;
                    pagecode = pagecodeCard;
                    pk = rowsData[0].values['pk_bondinterestslist'] && rowsData[0].values['pk_bondinterestslist'].value;
                }
                linkApp(this.props, {
                    url,
                    appcode,
                    pagecode,
                    id: pk,
                    billtype: ''
                });
            }
        });
    }

}
/**
 * 联查票据台账
 *
 * @param {*} pk_register
 *     pk_register 票据pk

 */
export function linkLinkSDBook(pk_register) {
    this.props.openTo("/fbm/fbm/counterbook/main/index.html#/card", {
        billtype: "36HM", // 单据类型管理中的 (目标应用)类型代码
        appcode: "36181BL",
        pagecode: "36181BL_C01",
        status: "browse",
        scene: "linksce",
        sence: "4",
        id: pk_register
    });
}
/**列表页
 * 票据台账反联查单据
 * @param pk 单据pk
 */
export function SDBookLinkBill(pk) {
    
    if (pk) {
        let pks = pk.split(',');
        // if ((pks && pks.length>1) || this.linkAtList) {
        // 数组多条，单条也当做多条来做
        let data = {
            pageCode: this.pageId,
            pks: pks,
            extParam: {
                srcPage: this.props.getUrlParam("srcPage")
            }
        };
        // 取联查url，没有就取分页查询url
        let url = this.API_URL.linkSence ? this.API_URL.linkSence : this.API_URL.queryListPks
        ajax({
            url: url,
            data,
            success: res => {
                let { data } = res;
                if (data) {
                    let { grid, head } = data;
                    let gridRow = grid && grid[this.tableId].rows;
                    if (gridRow.length > 1 || this.linkAtList) {
                        this.props.table.setAllTableData(
                            this.tableId,
                            data.grid[this.tableId]
                        );
                        // 显示全部页签
                        this.setState({
                            activeTab: this.props.listTabs
                        });
                    } else if (gridRow.length == 1) {
                        let pk =
                            grid[this.tableId].rows[0].values[this.primaryId]
                                .value;
                        this.props.pushTo("/card", {
                            status: "browse",
                            id: pk,
                            scene: "linksce",
                            showBackBtn: false,
                            pagecode: this.cardPageCode
                        });
                    }
                }
            }
        });
        // }else{
        //     let linkpk = '';
        //     if (Array.isArray(pk)) {
        //         linkpk=pk[0];
        //     }else{
        //         linkpk = pk;
        //     }
        //     this.props.pushTo("/card",{
        //         status: 'browse',
        //         id: linkpk,
        //         scene: "linksce",
        //     });
        // }
    }
}

/**
 * 委托办理
 * @param {*} props 
 */
export function doCommission(props) {
    let that = this
    let pk = props.form.getFormItemsValue(this.formId, "pk_quotaapply").value;
    let sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: true
    }

    ajax({
        url: this.API_URL.commission,
        data: sendData,
        success: (res) => {
            let { data } = res;
            if (data.errMsg) {
                toast({
                    color: 'error',
                    content: data.errMsg
                })
            }
            else if (data.billCard.head) {
                this.props.form.setAllFormValue({ [that.formId]: res.data.billCard.head[that.formId] });
            }
            this.buttonVisible(this.props);
        }
    });


}

/**
 * 取消委托办理
 */
export function doUnCommission(props) {
    let that = this
    let pk = props.form.getFormItemsValue(this.formId, "pk_quotaapply").value;
    let sendData = {
        pks: [pk],
        pagecode: this.pageId,
        isCardOpt: true
    }

    ajax({
        url: this.API_URL.uncommission,
        data: sendData,
        success: (res) => {
            let { data } = res;
            if (data.errMsg) {
                toast({
                    color: 'error',
                    content: data.errMsg
                })
            }
            else if (data.billCard.head) {
                this.props.form.setAllFormValue({ [that.formId]: res.data.billCard.head[that.formId] });
            }
            this.buttonVisible(this.props);
        }
    });
}

export function clsRowno(card_table_id) {
    let allTableData = this.props.cardTable.getAllRows(card_table_id);
    let maxrowno;
    if (allTableData[0].values.banklineno && allTableData[0].values.banklineno.value) {
        maxrowno = parseInt(allTableData[0].values.banklineno.value);
    } else {
        maxrowno = parseInt(0);
    }
    if (allTableData) {
        allTableData.forEach((val) => {
            if (val.values.banklineno && val.values.banklineno.value) {
                if (maxrowno < parseInt(val.values.banklineno.value)) {
                    maxrowno = parseInt(val.values.banklineno.value);
                }
            }
        });
        allTableData.forEach((val) => {
            if (val.values.banklineno && val.values.banklineno.value) {

            } else {
                maxrowno = (parseInt(maxrowno) + parseInt(10));
                val.values.banklineno.value = String(maxrowno);
            }
        });
    }
}
/**
 * 跳转到票据签发
 * @param {*} pk 开票申请受理的主键
 */
export function signLink(signAcceptPk) {
    this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
        billtype: "36H2", // 票据签发的单据类型
        pagecode: "36180BS_CARD",
        appcode: "36180BS",
        status: "add",
        pk_billtypecode: "36NB",
        pk_sign_accept: signAcceptPk,
        id: signAcceptPk
    });
}
/**
 * 联查开票申请单
 * @param {*} signApplyPk 开票申请单的主键
 */
export function signApplyLink(signApplyPk) {
    this.props.openTo("/fbm/cfbm/signapply/main/index.html#/card", {
        billtype: "36NA", // 开票申请的单据类型
        pagecode: "36370IFBA_CARD",
        appcode: "36370IFBA",
        status: "browse",
        scene: "linksce",
        id: signApplyPk
    });
}

/**
 * 联查票据签发单
 * @param  signAcceptPk 开票申请受理的主键
 */
export function SignBillLink(signAcceptPk) {

    api.call(this, {
        name: "querysignpk",
        data: { pks: [signAcceptPk] },
        success: res => {
            let result = res["data"];
            if (result) {
                this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
                    billtype: "36H2", // 票据签发的单据类型
                    pagecode: "36180BS_CARD",
                    appcode: "36180BS",
                    status: "browse",
                    scene: "linksce",
                    id: result
                });
            } else {
                toast({
                    color: "warning",
                    content: this.state.json["fbmpublic-000093"] /* 国际化处理： 该单据未签发，没有查询到票据签发单*/
                });
                return;
            }
        }
    })
}

/**
* 联查票据付款单
* @param {*} pk_accept 票据付款单的主键
*/
export function acceptLink(pk_accept) {
    this.props.openTo("/fbm/fbm/accept/main/index.html#/cardlinkq", {
        billtype: "36HD", // 单据类型
        pagecode: "36180BP_C02",
        appcode: "36180BP",
        status: "browse",
        scene: "linksce",
        id: pk_accept
    });
}

/**
* 联查应付票据贴现单
* @param {*} pk_buyerdiscount 应付票据贴现单的主键
*/
export function buyerDiscountLink(pk_buyerdiscount) {
    this.props.openTo("/fbm/fbm/buyerdiscount/main/index.html#/card", {
        billtype: "36HV", // 单据类型
        pagecode: "36180PDT_CARD",
        appcode: "36180PDT",
        status: "browse",
        scene: "linksce",
        id: pk_buyerdiscount
    });
}

/**
* 联查票据签发单
* 通过主键联查
* @param {*}  registerPK 票据签发单的主键
*/
export function registerLink(registerPK) {
    this.props.openTo("/fbm/fbm/sign/main/index.html#/card", {
        billtype: "36H2", // 票据签发的单据类型
        pagecode: "36180BS_CARD",
        appcode: "36180BS",
        status: "browse",
        scene: "linksce",
        id: registerPK
    });
}



/**
* 贴现申请点贴现办理按钮
* @param pk 申请单主键,对应贴现办理pk_discount_app字段
* @param pk_billtypecode 单据类型
 */
export function discountTransact(pk, pk_billtypecode) {
    ajax({
        url: this.API_URL.discounttransact,
        data: { pk },
        success: (res) => {
            let { data } = res;
            if (data) {
                let openurl, billtype, appcode, pagecode;
                if (pk_billtypecode) {
                    // 来源贴现申请，目标贴现办理
                    if (pk_billtypecode.value == "36H6") {
                        openurl = "/fbm/fbm/discount/main/index.html#/card";
                        billtype = "36H7";
                        appcode = "36180DT";
                        pagecode = "36180DT_C01";
                    }
                    // 来源为池内贴现申请，目标池内贴现
                    else if (pk_billtypecode.value == "36HL") {
                        openurl = "/fbm/pfbm/discountin/main/index.html#/card";
                        billtype = "36HJ";
                        appcode = "36200DT";
                        pagecode = "36200DT_C01";
                    }
                    this.props.openTo(openurl, {
                        billtype: billtype, // 单据类型管理中的 (目标应用)类型代码
                        pagecode: pagecode,
                        status: "add",
                        appcode: appcode,
                        // 申请单主键,对应贴现办理pk_discount_app字段
                        id: pk,
                    });
                }
            }
        }
    });
}

/*q+Tp88nQNo7z782f3GAtCEGei+DqyCQZhUF0Alo7wR/U2jibEe0rDh4uWg5xKBD+*/