/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAnBoRQn1JlIHIOB02i+1jyU*/
import { ajax, toast } from 'nc-lightapp-front';
//import { jsondata } from '../jsondata.js';
export default function searchAfterEvent(field, val) {
    // console.log(field, val);
    let tableId = 'table_area';
    let pageId = '360701OB_L01';
    let searchId = 'search_area';
    let that = this;
    if (field === 'pk_org') {
        let pk_org = val.refpk;
        // 为空则直接返回
        if (!pk_org) {
            return;
        }
        let data = {
            pk_org: pk_org
        };
        this.refreshHtml();
        // 此处查询组织的建账日期
        query.call(this, data, getData);
    }
}

export function query(data, callback) {
    ajax({
        url: '/nccloud/cmp/base/aftereventinfo.do',
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