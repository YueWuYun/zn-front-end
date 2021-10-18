/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/
import { ajax, toast } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { getDefData, setDefData } from '../../../../../tmpub/pub/util/cache';

//表头字段属性值：props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
export default function afterEvent(props, moduleId, key, value, changedrows, index, record, type) {
	let eventData, newvalue, oldvalue, extParam;
	switch (key) {
		case 'redepositamount':// 转存原币金额
			handlePaymentHeadAfterEdit(props, moduleId, key, value, changedrows, index, eventData);
			break;

		default:
			break;
	}
}

/**
 * 表头编辑后事件
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} value 
 * @param {*} changedrows 
 * @param {*} i 
 * @param {*} eventData 
 */
const handlePaymentHeadAfterEdit = function (props, moduleId, key, value, changedrows, i, eventData, copyOldValue, callback) {
	let newvalue, extParam, oldvalue;
	extParam = { 'uiState': props.getUrlParam('status') };
	
	//获取页面数据
	eventData = props.createHeadAfterEventData(constant.cpagecode, constant.formcode1, [], constant.formcode1, key, value);
	//获取编辑的值
	newvalue = eventData.newvalue;
	if (copyOldValue) {
		oldvalue = JSON.parse(copyOldValue);
	} else {
		oldvalue = eventData.oldvalue;
	}

	if (!oldvalue || !oldvalue.value || newvalue.value != oldvalue.value || key=='bodyevent') {
		ajax({
			url: requesturl.afterevent,
			async: false,
			data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventData), extParam },
			success: (res) => {
				let { success, data } = res;
				if (success) {
					let { card, extParam, headItemProps, bodyItemProps } = data;
					let { head, bodys } = card;

					//更新表单数据
					props.form.setAllFormValue({ [constant.formcode1]: head[constant.formcode1] });
					//设置表头字段属性
					setHeadItemProp(props, constant.formcode1, headItemProps);
					if (extParam.hasOwnProperty('warning')) {
						props.form.setFormItemsValue(constant.formcode1, { key: { value: oldvalue ? oldvalue.value : null, display: oldvalue ? oldvalue.display : null } });
						toast({ color: 'warning', content: extParam.warning });
					}
					//回调
					if (callback && (typeof callback == 'function')) {
						callback(props, data);
					}
				}
				
			},
			error: (res) => {
				props.form.setFormItemsValue(constant.formcode1, { key: { value: oldvalue ? oldvalue.value : null, display: oldvalue ? oldvalue.display : null } });
				toast({ color: 'warning', content: res.message });
			}
		});
	}
}

export const setHeadItemProp = function (props, headCode, headItemProps) {
    let form = props.form;
    let editArray = {};
    let requireArray = {};
    let visibleArray = {};
    if (!headItemProps || headItemProps.length == 0) {
        return;
    }
    for (let itemProp of headItemProps) {
        if (!itemProp.hasOwnProperty('itemName')) {
            continue;
        }
        let itemName = itemProp.itemName;
        if (!itemName) {
            continue;
        }
        if (itemProp.hasOwnProperty('editable')) {
            let flag = itemProp.editable;
            if (flag != null) {
                editArray[itemName] = !(flag == 'true' ? true : false);
            }

        }
        if (itemProp.hasOwnProperty('require')) {
            let flag = itemProp.require;
            if (flag != null) {
                requireArray[itemName] = flag == 'true' ? true : false;
            }
        }
        if (itemProp.hasOwnProperty('visible')) {
            let flag = itemProp.visible;
            if (flag != null) {
                visibleArray[itemName] = flag == 'true' ? true : false;
            }
        }
    }
    if (Object.keys(requireArray).length > 0) {
        //批量设置字段必输性
        form.setFormItemsRequired(headCode, requireArray);
    }
    if (Object.keys(editArray).length > 0) {
        //批量设置字段编辑性
        form.setFormItemsDisabled(headCode, editArray);
    }
    if (Object.keys(visibleArray).length > 0) {
        //批量设置字段可见性
        form.setFormItemsVisible(headCode, visibleArray);
    }
}

/*OWmq6Ugo6jPE4W7xoi1UXtwyG8PvkGWATiOtyLuO/PFXAYlFB8kC9Ndt3FEOsD6+*/