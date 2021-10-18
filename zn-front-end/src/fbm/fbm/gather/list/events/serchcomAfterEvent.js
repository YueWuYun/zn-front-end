/*GVSAq+DIODaaExdtc9opU7Bhou549XBKEq94C5V0Gl5ugB0zaQULsfe/3rXdKl9p*/
import { doAjax,formatDateTime } from "./../../utils/commonUtil";
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
import {LIST_SEARCH_CODE2,LIST_TABLE_CODE2, URL_LIST } from "./../../cons/constant";

export default function (props, moduleId, key, value, changedrows, i, s, g,isInit) {
    console.log(moduleId, key, value);
    let data = props.createHeadAfterEventData('36180rbr_l01_search2', moduleId, [], moduleId, key, value);  
    switch (key) {
        case "receiveaccount":
            doReceiveaccountEvent.call(this, props, data,isInit)
			break;
    
        default:
            break;
    }
}

function doReceiveaccountEvent(props, data) {

	let newvalue = data.newvalue.value;
	let oldvalue = data.oldvalue.value;

	/**
	 * 没有变化 直接退出
	 */
	if (newvalue == oldvalue || newvalue == 'undefined' || newvalue == null) {
		return
	}else {
		// 成功回调
		let successCallback = function (res) {
			if (res.data.card.head) {
                //页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性	
                let table =  res.data.card.head[LIST_TABLE_CODE2];
                let pk_banktype = table.rows[0].values.pk_banktype;
                props.form.setFormItemsValue(LIST_SEARCH_CODE2,{'pk_banktype' : pk_banktype});	
			}
		}

		// 后台查询
		doAjax.call(this, data, URL_LIST.AFTER_EVENT, successCallback)
	}

}
/*GVSAq+DIODaaExdtc9opU7Bhou549XBKEq94C5V0Gl5ugB0zaQULsfe/3rXdKl9p*/