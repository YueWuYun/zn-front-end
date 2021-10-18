/*v/YwngCLIKNy2vWpC4yGKfjtV/CoIK+7aw6IMH0JuGE=*/
import { ajax, toast, pageTo } from 'nc-lightapp-front';
import * as CONSTANTS from '../const/constants';
import { linkApp } from '../../../../tmpub/pub/util/LinkUtil';
let { tableId, billtype_pay, QueryLoanReceiptPK_URL, LinkInst_URL, payPK_field, QueryLoanContractPK_URL } = CONSTANTS;
//联查利息清单，常量
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
 * 联查-利息清单
 */
export const linkInterestList = function (props) {
    let selectedData = props.table.getCheckedRows(tableId);
    if (IsSelectedDate(props, selectedData)) return;
    let pk =
        selectedData[0] &&
        selectedData[0].data.values[payPK_field] &&
        selectedData[0].data.values[payPK_field].value;
    ajax({
        url: LinkInst_URL,
        data: { pks: [pk], userObj: 'Unit' },
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
                    for (let i = 0; i < data.grid['list_head'].rows.length; i++) {
                        let pk =
                        data.grid['list_head'].rows[i].values.pk_interestlisticdmc
                            .value;
                        pks.push(pk);
                    }
                    pageTo.openTo("/icdmc/icdmc/interestcompany/main/index.html#/list", {
                        id: pks,
                        appcode: "36362FCIB",
                        pagecode: "36362FCIB"
                    });
                } else if (rowsCount == 1) {
                     // 单条跳卡片
                     let pk_interestlist =
                     data.grid['list_head'].rows[0].values.pk_interestlisticdmc
                         .value;
                    pageTo.openTo("/icdmc/icdmc/interestcompany/main/index.html#/list", {
                        id: pk_interestlist,
                        appcode: "36362FCIB",
                        pagecode: "36362FCIB"
                    });
                } else if (rowsCount == 0) {
                    toast({
                        content: props.MutiInit.getIntl("36362IWI") && props.MutiInit.getIntl("36362IWI").get('36362IWI-000026'),
                        color: 'warning'
                    });
                }
            }
        }
    });
}
/**
 * 联查-结息日
 * @param {*} props 
 */
export const linksettle = function (props) {
    let selectedData = props.table.getCheckedRows(tableId);
    if (IsSelectedDate(props, selectedData)) return;
    let iadate = selectedData[0] &&
        selectedData[0].data.values["pk_settledate"];
    if(!(iadate.value)){
        toast({
            content: props.MutiInit.getIntl("36362IWI") && props.MutiInit.getIntl("36362IWI").get('36362IWI-000025'),
            color: 'warning'
        });
        return;
    }
        
    

    pageTo.openTo("/tmpub/pub/settledate/main/index.html#/card", {
        status: "browse",
        appcode: "36010ISDC",
        pagecode: "36010ISDC_CARD_01",
        scene: "linksce",
        id: iadate && iadate.value
    });
}
/**
 * 联查-利率
 * @param {*} props 
 */
export const linkrate = function (props) {
    let selectedData = props.table.getCheckedRows(tableId);
    if (IsSelectedDate(props, selectedData)) return;
    let pk = selectedData[0] && selectedData[0].data.values["pk_rate"].value;
    ajax({
        url: "/nccloud/tmpub/tmbd/linkinterest.do",
        data: { pk },
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
                    id: pk
                });
            }
        }
    });
}
/**
 * 联查-借款合同
 * @param {*} props 
 */
export const linkcontract = function (props) {
    let selectedData = props.table.getCheckedRows(tableId);
    if (IsSelectedDate(props, selectedData)) return;
    let pk_contract = "";
    selectedData.forEach((vale) => {
        pk_contract = vale.data.values.contractid.value;
    });
    ajax({
        url: QueryLoanContractPK_URL,
        data: { pk: pk_contract },
        success: res => {
            let { data } = res;
            if (data) {
                props.openTo('/icdmc/icdmc/innerdebitcontract/main/index.html#/card', {
                    srcFunCode: '36362IDC',
                    id: data,
                    appcode: '36362IDC',
                    pagecode: '36362IDC_C01',
                    status: 'browse',
                });
            }
        }
    });

}

/**
 * 联查-放款回单
 * @param {*} props 
 */
export const linkpay = function (props) {
    let selectedData = props.table.getCheckedRows(tableId);
    if (IsSelectedDate(props, selectedData)) return;
    let pk_financepay = "";
    selectedData.forEach((vale) => {
        pk_financepay = vale.data.values.pk_innerloanpay.value;
    });
    ajax({
        url: QueryLoanReceiptPK_URL,
        data: { pk: pk_financepay },
        success: res => {
            let { data } = res;
            if (data) {
                props.openTo('/icdmc/icdmc/financepayreceipt/main/index.html#card', {
                    srcFunCode: '36362IWI',
                    appcode: '36362IPR',
                    pagecode: '36362IPR_CARD',
                    status: 'browse',
                    id: data,
                    scene: "linksce"
                });
            }
        }
    });
}

function IsSelectedDate(props, selectedData) {
    if (selectedData.length == 0) {
        toast({
            content: props.MutiInit.getIntl("36362IWI") && props.MutiInit.getIntl("36362IWI").get('36362IWI-000001'),
            color: 'warning'
        });
        return true;
    }
    if (selectedData.length > 1) {
        toast({
            content: props.MutiInit.getIntl("36362IWI") && props.MutiInit.getIntl("36362IWI").get('36362IWI-000002'),
            color: 'warning'
        });
        return true;
    }
    return false;
}
/*v/YwngCLIKNy2vWpC4yGKfjtV/CoIK+7aw6IMH0JuGE=*/