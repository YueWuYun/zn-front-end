/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { card } from '../../../../public/container/index';
import { elecSignListPrint, elecSignCardPrint } from "../../../../../tmpub/pub/util";
export function bodyButtonClick(props, key, text, record, index) {
    let currTableId = this.tabCode;
    let curTabKey = this.props.cardTable.getCurTabKey();
    switch (key) {
        //正式打印
        case 'OffiPrint':
            elecSignPrint(props, true);
            break;
        //补充打印
        case 'InOffiPrint':
            elecSignPrint(props, false);
            break;
    }
}

/**
 * 电子签章打印
 */
const elecSignPrint = function (props, offical) {
    elecSignCardPrint(props, {
        url: base_url + 'paymentelecsignprint.do',
        offical,
        appCode: funcode,
        nodeKey: offical ? printnodekey.official : printnodekey.inofficial,
        headCode: card_from_id,
        field_id: PaymentConst.pk_filed,
        field_billno: 'vbillno',
        getOrgFunc: () => {
            let pk_delgoorg = props.form.getFormItemsValue(card_from_id, 'pk_delgoorg') && props.form.getFormItemsValue(card_from_id, 'pk_delgoorg').value;
            if (pk_delgoorg) {
                return pk_delgoorg;
            }
            else {
                return props.form.getFormItemsValue(card_from_id, 'pk_org').value;
            }
        },
        validateFunc: () => {
            let busistatus = props.form.getFormItemsValue(card_from_id, 'billstatus').value;
            if (billstatus.PayOK != busistatus) {
                return props.MutiInit.getIntl("36300TP") && props.MutiInit.getIntl("36300TP").get('36300TP-000110')/** 单据状态非转账成功！ */;
            }
            return null;
        }
    })
}
/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/