/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import {ajax} from 'nc-lightapp-front';
import {  requesturl } from '../../config/config';
import { setButtonUsability } from '../events';
import {  APP_INFO,BILL_FIELD,REQUEST_URL } from '../../cons/constant';
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS, } = BILL_FIELD;
const {  QUERYBYIDS } = REQUEST_URL;

export default function (props, config, pks) {

    let that = this;
    // 后台还没更新，暂不可用
    let data = {
        pks: pks,
        pageCode: LIST_PAGECODE
    };
    ajax({
        url: QUERYBYIDS,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    let billid = data[LIST_TABLECODE].rows[0].values[PK_NAME].value;
                    that.setState({
                        addid: billid
                    });
                    props.table.setAllTableData(LIST_TABLECODE, data[LIST_TABLECODE]);
                    setButtonUsability.call(this, this.props);
                } else {
                    props.table.setAllTableData(LIST_TABLECODE, { rows: [] });
                }
            }
        }
    });
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/