/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { app_id, base_url, link_list_page_id, list_table_id, button_limit, dataSource, SHOWMODEL_BULU, SHOWMODEL_LIULAN } from '../../cons/constant.js';
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { card_table_id, card_page_id } from '../../../allocate_pay/cons/constant.js';
// ca签名
import Sign from '../../../../../tmpub/pub/util/ca/index.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

export default async function bodyButtonClick(props, key, text, record, index) {
    let isNetpay = false
    switch (key) {
        //表体 提交
        case 'commit_inner':
            listSingleOperator(props, link_list_page_id, list_table_id, base_url + 'commit.do', record, 'pk_allocate_h', index, loadMultiLang(this.props,'36320FA-000006'), dataSource, false, null, (props, data) => {/* 国际化处理： 提交成功！*/
                let { workflow } = data;
                //有指派信息，则指派，没有则重绘界面
                if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
                    this.setState({
                        assignData: data,
                        assignShow: data,
                        rowIndex: index,
                        ts: record['ts'].value,
                        billId: record['pk_allocate_h'].value
                    });
                }
            });
            break;
        //表体 收回
        case 'uncommit_inner':
            listSingleOperator(props, link_list_page_id, list_table_id, base_url + 'uncommit.do', record, 'pk_allocate_h', index, loadMultiLang(this.props,'36320FA-000007'), dataSource);/* 国际化处理： 收回成功！*/
            break;
        //表体 编辑行
        case 'edit':
            let url = base_url + 'querycard.do';
            let data = { pk: record.pk_allocate_h.value, pageid: link_list_page_id, status: 'edit', pageCode: link_list_page_id };
            ajax({
                url,
                data: data,
                success: (res) => {
                    if (res.data) {
                        props.pushTo('/card', {
                            pagecode:card_page_id,
                            status: 'edit',
                            id: record.pk_allocate_h.value,
                            from: 'list'
                        });
                    }
                }
            });
            break;
        //表体 删除行
        case 'delete_inner':
            listSingleOperator(props, link_list_page_id, list_table_id, base_url + 'delete.do', record, 'pk_allocate_h', index, loadMultiLang(this.props,'36320FA-000069'), dataSource);/* 国际化处理： 删除成功！*/
            break;
        //表体经办
        case 'decide':
            let decideurl = base_url + 'decide.do';
            let decidedata = { pk: record.pk_allocate_h.value, pageid: link_list_page_id, status: 'decide' };
            let srcbusitype = record.srcbusitype.value;
            ajax({
                url: decideurl,
                data: decidedata,
                success: (res) => {
                    if (res.data) {
                        props.pushTo('/card', {
                            pagecode:card_page_id,
                            status: 'decide',
                            id: record.pk_allocate_h.value,
                            srcbusitype: srcbusitype,
                            from: 'list'
                        });
                    }
                }
            });
            break;
        //表体退回
        case 'return_inner':
            this.setState({ showReBackinner: true, record: record, index: index });
            break;

        //制证
        case 'make':
            listSingleOperator(props, link_list_page_id, list_table_id, base_url + 'make.do', record, 'pk_allocate_h', index, loadMultiLang(this.props,'36320FA-000008'), dataSource);/* 国际化处理： 制证成功！*/
            break;
        //取消制证
        case 'unmake':
            listSingleOperator(props, link_list_page_id, list_table_id, base_url + 'unmake.do', record, 'pk_allocate_h', index, loadMultiLang(this.props,'36320FA-000009'), dataSource);/* 国际化处理： 取消制证成功！*/
            break;
        //支付
        case 'pay_inner':
            let pk_allocate_pay = record.pk_allocate_h.value;
            let ts_pay = record.ts.value;
            let pkMapTs_doPay_inner = {}

            if (pk_allocate_pay && ts_pay) {
                pkMapTs_doPay_inner[pk_allocate_pay] = ts_pay;
            }

            let data_pay = {
                "pkMapTs": pkMapTs_doPay_inner,
                "pageid": link_list_page_id,
                'isCardOpt': false,
                'isValidate': true,
            };

            ajax({
                url: '/nccloud/sf/allocation/allocatepay.do',
                data: data_pay,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        if (data.errorMsg) {
                            toast({ color: 'warning', content: data.errorMsg });
                        }
                        else {
                            isNetpay = data.isNetpay
                            doPay_inner.call(this, props, record, isNetpay, index);
                        }
                    }
                }
            });
            break;
        //支付确认
        case 'payinnerconfirm':
            let payBtnConfirmresult = await Sign({
                isSign: false,
                isKey: isNetpay,
                data: null,
                encryptVOClassName: null
            });
            if (payBtnConfirmresult.isStop) {
                return;
            }

            let payconfirm_pk = record.pk_allocate_h.value;
            let payconfirm_ts = record.ts.value;
            let pkMapTs_doPayInnerConfirm = {}

            if (payconfirm_pk && payconfirm_ts) {
                pkMapTs_doPayInnerConfirm[payconfirm_pk] = payconfirm_ts;
            }


            let data_payconfirm = {
                "pkMapTs": pkMapTs_doPayInnerConfirm,
                "operator": 1,
                "pageid": link_list_page_id,
                "isCardOpt": false,
                "isValidate": false,
            };
            ajax({
                url: '/nccloud/sf/allocation/allocatepay.do',
                data: data_payconfirm,
                success: (res) => {
                    if (res.success) {
                        if (res.data) {
                            toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000019') });/* 国际化处理： 支付成功*/
                        }
                        if (res.data.grid) {
                            props.table.updateDataByIndexs(list_table_id, [{ index: index, data: { values: data.grid[list_table_id].rows[0].values } }]);
                        }
                    }
                }
            });
            break;
        //取消支付
        case 'unpay_inner':
            doCancelPay.call(this, props, record, index);
            break;
        //查询审批详情
        case 'queryapprove':
            if (record) {
                this.setState({
                    approveshow: !this.state.approveshow,
                    //单据pk
                    billId: record.pk_allocate_h && record.pk_allocate_h.value,
                });
            }
            break;

        // 网银浏览
        case 'e_bank_browse':
            let netbankbrowsedata = {
                pk: record['pk_allocate_h'].value,
                ts: record['ts'].value,
                pageid: link_list_page_id,
            }
            ajax({
                url: '/nccloud/sf/allocation/allocatenetbankbrowse.do',
                data: netbankbrowsedata,
                success: (res) => {
                    if (res && res.data) {
                        // console.log(res.data, 'res.data');
                        this.setState(
                            {
                                onLineData: res.data || [],
                                modelType: SHOWMODEL_LIULAN,
                            }, () => {
                                this.setState({ showBuLu: true });
                            });

                    }
                }
            });
            break;

        // 网银补录
        case 'e_bank':
            let netbankbuludata = {
                pk: record['pk_allocate_h'].value,
                ts: record['ts'].value,
                pageid: link_list_page_id,
            }
            ajax({
                url: '/nccloud/sf/allocation/allocatenetbankrewrite.do',
                data: netbankbuludata,
                success: (res) => {
                    if (res && res.data) {
                        this.setState(
                            {
                                onLineData: res.data || [],
                                modelType: SHOWMODEL_BULU,
                            }, () => {
                                this.setState({ showBuLu: true });
                            });
                    }
                }
            });
            // refreshHtml(props);
            break;
        // 支付状态
        case "paystatus":
            doPayStatus.call(this, props);
            break;

        default:
            break;
    }
}

/**
 * 取消支付
 * @param  props 
 */
const doCancelPay = function (props, record, index) {
    let pkMapTs_paycancel = {};
    let pk_allocate_paycancel = record.pk_allocate_h.value;
    let ts_paycancel = record.ts.value;
    pkMapTs_paycancel[pk_allocate_paycancel] = ts_paycancel;

    ajax({
        url: "/nccloud/sf/allocation/allocateunpay.do",
        data: {
            pkMapTs: pkMapTs_paycancel,
            pageid: link_list_page_id,
            isCardOpt: false,
        },
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data.successMsg) {
                    toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000037') });/* 国际化处理： 取消支付成功*/
                    // let row = res.data.head[0];
                    // let updateDataArr = [{
                    //   index: index,
                    //   data: { values: row.values }
                    // }];
                    // props.table.updateDataByIndexs(list_table_id, updateDataArr);
                } else if (data.errorMsg) {
                    toast({ color: 'warning', content: data.errorMsg });
                }
                if (res.data.grid) {
                    props.table.updateDataByIndexs(list_table_id, [{ index: index, data: { values: data.grid[list_table_id].rows[0].values } }]);
                }
            }
        }
    });

}

/**
* 表体行的支付按钮
* @param  props 
*/
const doPay_inner = async function (props, record, isNetpay, index) {
    let payresult = await Sign({
        isSign: false,
        isKey: isNetpay,
        data: null,
        encryptVOClassName: null
    });
    if (payresult.isStop) {
        return;
    }
    let pk_allocate_pay = record.pk_allocate_h.value;
    let ts_pay = record.ts.value;
    let pkMapTs_doPay_inner = {}

    if (pk_allocate_pay && ts_pay) {
        pkMapTs_doPay_inner[pk_allocate_pay] = ts_pay;
    }

    let data_pay = {
        "pkMapTs": pkMapTs_doPay_inner,
        "pageid": link_list_page_id,
        'isCardOpt': false,
        'isValidate': false
    };

    ajax({
        url: '/nccloud/sf/allocation/allocatepay.do',
        data: data_pay,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data.errorMsg) {
                    toast({ color: 'warning', content: data.errorMsg });
                }
                else if (data.interactMsg) {
                    props.modal.show('payModel', {
                        title: loadMultiLang(this.props,'36320FA-000036'),/* 国际化处理： 支付*/
                        content: data.interactMsg,
                        //点击确定按钮事件
                        beSureBtnClick: buttonClick.bind(this, props, 'payinnerconfirm'),
                    });
                }
                else if (data.warningMsg) {
                    toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000019') + data.warningMsg });/* 国际化处理： 支付成功*/
                }
                else if (data.successMsg) {
                    toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000019') });/* 国际化处理： 支付成功*/
                }
                if (res.data.grid) {
                    props.table.updateDataByIndexs(list_table_id, [{ index: index, data: { values: data.grid[list_table_id].rows[0].values } }]);
                }
            }
        }
    });
}


/**
 * 支付确认事件
 * @param  props 
 */
const doPayInnerConfirm = function (props, record) {
    let payBtnConfirmresult = Sign({
        isSign: false,
        isKey: true,
        data: null,
        encryptVOClassName: null
    });
    if (payBtnConfirmresult.isStop) {
        return;
    }

    let payconfirm_pk = record.pk_allocate_h.value;
    let payconfirm_ts = record.ts.value;
    let pkMapTs_doPayInnerConfirm = {}

    if (payconfirm_pk && payconfirm_ts) {
        pkMapTs_doPayInnerConfirm[payconfirm_pk] = payconfirm_ts;
    }


    let data_pay = {
        "pkMapTs": pkMapTs_doPayInnerConfirm,
        "operator": 1,
        "pageid": link_list_page_id,
        "isCardOpt": true,
    };
    ajax({
        url: '/nccloud/sf/allocation/allocatepay.do',
        data: data_pay,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000019') });/* 国际化处理： 支付成功*/
                }
            }
        }
    });
}

/**
 * 支付状态
 * @param  props 
 */
const doPayStatus = function (props) {
    let paystatus_pk = record.pk_allocate_h.value;
    // let paystatus_selectrows = props.cardTable.getAllRows(card_table_id)
    let paystaus_ts = record.ts.value;
    let paystatus_pkbs = []

    paystatus_selectrows.forEach((val) => {
        //子表主键数组
        paystatus_pkbs.push(val.values.pk_allocate_b.value);
    });

    // cardOperator(props, link_card_page_id, card_from_id,[card_table_id] ,'pk_allocate_h', base_url + 'allocatequerypaystatus.do', '获取支付状态成功！', dataSource ,this.toggleShow.bind(this));

    let paystatus_data = {
        pk: paystatus_pk && paystatus_pk.value,
        ts: paystaus_ts && paystaus_ts.value,
        pageid: link_card_page_id,
        isCardOpt: true,
        //   pkbs:paystatus_pkbs
    }

    ajax({
        url: '/nccloud/sf/allocation/allocatequerypaystatus.do',
        data: paystatus_data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000033') })/* 国际化处理： 获取支付状态成功*/

                }
                // doRefresh.call(this,props)
            }
        }
    });
}

//退回确认
export const backConfirmInner = function (props, record, index, value) {
    if (!value) {
        toast({ color: 'warning', content: loadMultiLang(this.props,'36320FA-000046') });/* 国际化处理： 退回原因必输！*/
        return;
    }
    listSingleOperator(props, link_list_page_id, list_table_id, base_url + 'allocateback.do', record, 'pk_allocate_h', index, loadMultiLang(this.props,'36320FA-000047'), dataSource, null, null, () => {/* 国际化处理： 退回成功！*/
        this.setState({ showReBack: false, showReBackinner: false });
    });
}

/*zPpBovT29EyoCeGjE4sa1QAsy8Mtwt0eyRhkUzSFw25vralxLredaQtO6SWWaK7c*/