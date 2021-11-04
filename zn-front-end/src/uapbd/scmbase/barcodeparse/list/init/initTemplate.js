//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
/*
 * @Author: qiaobb 
 * @PageInfo: 模板初始化
 * @Date: 2018-05-29 20:14:18 
 * @Last Modified by: qiaobb
 * @Last Modified time: 2019-07-09 10:22:07
 */

import { ajax, base } from 'nc-lightapp-front';
import { btnClick } from '../btnClicks';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { PAGECODE, AREA, UISTATE, FIELD, URL, BUTTONID, BUTTON_AREA } from '../../constance';
export default function(props) {
	//页面初始化
	props.createUIDom(
		{
			pagecode: PAGECODE
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					initButtonActionState.call(this);
					props.button.setUploadConfig(BUTTONID.import, {});
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);

					props.meta.setMeta(meta, () => {
						initData.call(this, props, data.context);
					});
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	//添加操作列
	let material_event = {
		label: getLangByResId(this, '4017BARCODEPARSE-000005') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '150px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			return props.button.createOprationButton([ BUTTONID.delete ], {
				area: BUTTON_AREA.list_inner,
				buttonLimit: 3,
				ignoreHotkeyCode: [ BUTTONID.delete ],
				onButtonClick: (props, key) => btnClick.call(this, props, key, text, record, index)
			});
		}
	};
	meta[AREA.tableArea].items.push(material_event);
	meta[AREA.tableArea].items.forEach((item) => {
		if (item.attrcode != 'vbarcode') {
			item.disabled = true;
		}
	});
	return meta;
}

function initData(props, context) {
	let pk_org = (context || {}).pk_org;
	if (pk_org) {
		this.setState({ mainorg: { refpk: pk_org, refname: (context || {}).org_Name } });
		this.props.button.setDisabled({ [BUTTONID.add]: false });
	}
}
/**
 * 初始化按钮状态
 */
function initButtonActionState() {
	this.props.button.setDisabled({
		[BUTTONID.add]: true,
		[BUTTONID.delete]: true,
		[BUTTONID.parsebarcode]: true
	});
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX