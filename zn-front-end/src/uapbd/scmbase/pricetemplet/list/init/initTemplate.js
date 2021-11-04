//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
/*
 * @Author: zhaopym
 * @Date: 2019-03-01 13:30:17
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-03-13 10:23:32
 */
import { AREA, PAGECODE, STATUS, BUTTON, FIELD } from '../../constants';
import { togglePageStatus } from '../../viewController';
import { buttonClick } from '../btnClick';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE, //页面id
		},
		data => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = handleMeta.call(this, props, meta);
					props.meta.setMeta(meta, togglePageStatus.bind(this, props, STATUS.browse));
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}
function handleMeta(props, meta) {
	modifyBtn.call(this, props, meta);
	handleRef.call(this, props, meta);
	return meta;
}
function modifyBtn(props, meta) {
	//表头操作列
	let head_inline_button_config = {
		attrcode: 'opr',
		label: getLangByResId(this, '4004PRICETEMPLET-000009') /* 国际化处理： 操作*/,
		width: 140,
		visible: true,
		fixed: 'right',
		itemtype: 'customer',
		render: (text, record, index) => {
			let buttonAry = [BUTTON.Edit_inline_head, BUTTON.Delete_inline_head];
			return props.button.createOprationButton(buttonAry, {
				area: AREA.table_head_inline,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index),
			});
		},
	};
	meta[AREA.table_head].items.push(head_inline_button_config);
	//表体操作列
	let body_inline_button_config = {
		attrcode: 'opr',
		label: getLangByResId(this, '4004PRICETEMPLET-000009') /* 国际化处理： 操作*/,
		width: 140,
		visible: true,
		fixed: 'right',
		itemtype: 'customer',
		render: (text, record, index) => {
			let buttonAry = [BUTTON.AddLine_inline_body, BUTTON.DeleteLine_inline_body];
			return props.button.createOprationButton(buttonAry, {
				area: AREA.table_body_inline,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index),
			});
		},
	};
	meta[AREA.table_body].items.push(body_inline_button_config);
}

function handleRef(props, meta) {
	/**
	 * 表体参照
	 */
	meta[AREA.table_body].items.map(item => {
		// 价格项编码 只能参照服务类物料
		if (item.attrcode == FIELD.cpriceitem) {
			item.isMultiSelectedEnabled = true; //多选
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.ct.priceTemplate.ref.PriceTemplateMaterialRefFilter',
					UsualGridRefActionExt: 'nccloud.web.ct.priceTemplate.ref.PriceTemplateMaterialRefFilter',
				};
			};
		}
	});
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX