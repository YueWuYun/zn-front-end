/*v/YwngCLIKNy2vWpC4yGKfjtV/CoIK+7aw6IMH0JuGE=*/
import { ajax, toast, pageTo } from 'nc-lightapp-front';
import * as CONSTANTS from '../const/constants';
import { linkApp } from '../../../../tmpub/pub/util/LinkUtil';
let { tableId, billtype_pay, billtype_contract, LinkInst_URL, payPK_field } = CONSTANTS;
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
        data: { pks: [pk] , userObj:'Center'},
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
                    pageTo.openTo("/icdmc/icdmc/interest/main/index.html#/list", {
                        id: pks,
                        appcode: "36360FCIB",
                        pagecode: "36360FCIB"
                    });
                } else if (rowsCount == 1) {
                    // 单条跳卡片
                    let pk_interestlist =
                        data.grid['list_head'].rows[0].values.pk_interestlisticdmc
                            .value;
                    pageTo.openTo("/icdmc/icdmc/interest/main/index.html#/list", {
                        id: pk_interestlist,
                        appcode: "36360FCIB",
                        pagecode: "36360FCIB"
                    });
                }else if (rowsCount == 0) {
                    toast({
                        content: props.MutiInit.getIntl("36360ICI") && props.MutiInit.getIntl("36360ICI").get('36360ICI-000021'),
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
            content: props.MutiInit.getIntl("36360ICI") && props.MutiInit.getIntl("36360ICI").get('36360ICI-000022'),
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
 * 联查-贷款合同
 * @param {*} props 
 */
export const linkcontract = function (props) {
    let selectedData = props.table.getCheckedRows(tableId);
    if (IsSelectedDate(props, selectedData)) return;
    let pk_contract = "";
    selectedData.forEach((vale) => {
        pk_contract = vale.data.values.contractid.value;
    });
    let sbExtParam = {
        status: 'browse',
        LinkBillType: billtype_contract,
        id: pk_contract
    };
    linkApp(props, billtype_contract, sbExtParam);
}

/**
 * 联查-放款单
 * @param {*} props 
 */
export const linkpay = function (props) {
    let selectedData = props.table.getCheckedRows(tableId);
    if (IsSelectedDate(props, selectedData)) return;
    let pk_financepay = "";
    selectedData.forEach((vale) => {
        pk_financepay = vale.data.values.pk_innerloanpay.value;
    });
    let sbExtParam = {
        status: 'browse',
        LinkBillType: billtype_pay,
        id: pk_financepay
    };
    linkApp(props, billtype_pay, sbExtParam);
}

function IsSelectedDate(props, selectedData) {
    if (selectedData.length == 0) {
        toast({
            content: props.MutiInit.getIntl("36360ICI") && props.MutiInit.getIntl("36360ICI").get('36360ICI-000001'),
            color: 'warning'
        });
        return true;
    }
    if (selectedData.length > 1) {
        toast({
            content: props.MutiInit.getIntl("36360ICI") && props.MutiInit.getIntl("36360ICI").get('36360ICI-000002'),
            color: 'warning'
        });
        return true;
    }
    return false;
}
/*v/YwngCLIKNy2vWpC4yGKfjtV/CoIK+7aw6IMH0JuGE=*/