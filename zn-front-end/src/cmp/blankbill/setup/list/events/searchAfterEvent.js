/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAnBoRQn1JlIHIOB02i+1jyU*/
import { ajax, toast } from 'nc-lightapp-front';
import { SHOW_MODE } from '../../../../pub/cons/constant';
import { BBC_CONST,APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const {  } = BBC_CONST;
const { APPCODE,LIST_PAGECODE,SEARCH_CODE,FORM_BBC_01,FORM_BBC_02,FORM_BBC_03,FORM_BBC_04,FORM_BBC_05,TREE } = APP_INFO;
const { PK_NAME,PK_ORG,TS,BILLPK } = BILL_FIELD;
const { QUERY,SAVE,QUERYNOTETYPE } = REQUEST_URL;
const { SAVE_BTN, EDIT_BTN, CANCEL_BTN } = BTN;
const { ADD,BROWSER,EDIT } = SHOW_MODE;

export default function searchAfterEvent(field, val) {

    if (field === 'pk_org') {
        let pk_org = val.refpk;
        // 为空则直接返回
        if (!pk_org) {
            this.props.button.setButtonDisabled(EDIT_BTN, true);
            // return;
        }else{
            this.props.button.setButtonDisabled(EDIT_BTN, false);
        }
        // let data = {
        //     pk_org: pk_org
        // };
        // this.refreshHtml();
        // 此处查询组织的建账日期
        // query.call(this, data, getData);
    }
}

export function query(data, callback) {
    ajax({
        url: QUERY,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    let startdate = { value: data.startdate, display: data.startdate };
                    this.props.search.setSearchValByField(this.searchId, 'startdate', startdate);
                    if (data.localcurrtype) {
                        this.localcurrtype = data.localcurrtype;
                    }
                    this.props.syncTree.setNodeSelected(this.treeId, '0');
                    callback && callback(this);
                }
            }
        }
    });
}

function getData(that) {
    let pkorg = that.props.search.getAllSearchData(that.searchId);//此方法对必输项校验
    let pkfirstvalue = null;
    if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
        pkfirstvalue = pkorg.conditions[0].value;
        pkfirstvalue.secondvalue = "0";
        that.onchangeGetDate(pkfirstvalue);
    }
}

/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAnBoRQn1JlIHIOB02i+1jyU*/