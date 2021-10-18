/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/
import { ajax, promptBox } from 'nc-lightapp-front';
//引入配置常量定义
import { FIELD, card_page_id, card_form_id, URL_INFO } from '../../cons/constant.js';
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	let eventData = props.createFormAfterEventData(card_page_id, card_form_id, moduleId, key, value);
	let newvalue = eventData.newvalue && eventData.newvalue.value;
	let oldvalue = eventData.oldvalue && eventData.oldvalue.value;
	switch (key) {
		// 组织
		case FIELD.PKORG:
			//旧值为空，新值不为空
			if (!oldvalue && newvalue) {
				//选择主组织以后，恢复其他字段的编辑性
				props.resMetaAfterPkorgEdit();
			}
			//旧值不为空
			if (oldvalue) {
				//清空表单form所有数据
				props.form.EmptyAllFormValue(card_form_id);
				//新的值是空的（清空）
				if (!newvalue) {
					//将其他字段设置为不可编辑
					props.initMetaByPkorg();
				}
				//新的值不是空的（修改）
				else if (oldvalue != newvalue) {
					props.form.setFormItemsValue(card_form_id, { key: { value: newvalue || null, display: eventData.newvalue.display || null, scale: eventData.newvalue.scale || -1 } });
				}
			}
			break;
		// 现金账户
		case FIELD.PKCASHACCOUNT:
			if (newvalue) {
				ajax({
					url: URL_INFO.CARD.AFTEREDIT,
					data: { eventPosition: 'head', eventType: 'form', eventData: JSON.stringify(eventData) },
					success: (res) => {
						let { success, data } = res;
						if (success) {
							props.beforeUpdatePage();//打开开关
							props.form.setAllFormValue({ [card_form_id]: data.form[card_form_id] });
							props.updatePage(card_form_id);//关闭开关
						}
					}
				});
			}
			break;
		// 最低余额控制
		case FIELD.ISLOWMNYCONTROL:
			if (newvalue) {
				props.form.setFormItemsDisabled(card_form_id, {
					[FIELD.LOWMONEY]: false,
					[FIELD.LOWMNYCONTROLSCHE]: false
				});
			}
			else {
				props.form.setFormItemsDisabled(card_form_id, {
					[FIELD.LOWMONEY]: true,
					[FIELD.LOWMNYCONTROLSCHE]: true
				});
				props.form.setFormItemsValue(card_form_id, {
					[FIELD.LOWMONEY]: { display: null, value: null },
					[FIELD.LOWMNYCONTROLSCHE]: { display: null, value: null }
				});
			}
			break;
		// 最高余额控制
		case FIELD.ISHIGHMNYCONTROL:
			if (newvalue) {
				props.form.setFormItemsDisabled(card_form_id, {
					[FIELD.HIGHMONEY]: false,
					[FIELD.HIGHMNYCONTROLSCHE]: false
				});
			}
			else {
				props.form.setFormItemsDisabled(card_form_id, {
					[FIELD.HIGHMONEY]: true,
					[FIELD.HIGHMNYCONTROLSCHE]: true
				});
				props.form.setFormItemsValue(card_form_id, {
					[FIELD.HIGHMONEY]: { display: null, value: null },
					[FIELD.HIGHMNYCONTROLSCHE]: { display: null, value: null }
				});
			}
			break;
		case 'default':
			// 选择主组织以后，恢复其他字段的编辑性
			props.resMetaAfterPkorgEdit();
		default:
			break;
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXkxwybQQCwGrZob5e6QpHUoYznqJU8gycuJhjoVxUoAo*/