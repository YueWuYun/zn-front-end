//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
/*
 * @Author: 刘奇 
 * @PageInfo: 卡片初始化模板
 * @Date: 2018-05-29 20:06:42 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-08 10:52:46
 */

import { AREA, STATUS, BUTTON } from '../../constance';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { onHeadInner_BtnClick, onBodyInner_BtnClick } from '../btnClicks';
import { buttonControl } from '../viewController/buttonController';
export default function(props) {
	props.createUIDom(
		{
			pagecode: AREA.pageArea //卡片页面编码
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				buttonControl.call(this, props);
			}
		}
	);
}

function modifierMeta(props, meta) {
	let headPorCol = {
		attrcode: 'opr',
		label: getLangByResId(this, '1014QUALITYLEVEL-000013') /* 国际化处理： 操作*/,
		visible: true,
		width: '100px',
		itemtype: 'customer',
		render: (text, record, index) => {
			let buttonAry = [ BUTTON.edit, BUTTON.delete ];
			if (props.editTable.getStatus(AREA.headTableArea) === STATUS.edit) {
				buttonAry = [];
			}
			return (
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					{props.button.createOprationButton(buttonAry, {
						area: BUTTON.list_head_inner,
						buttonLimit: 3,
						onButtonClick: (props, key, e) => onHeadInner_BtnClick.call(this, props, key, record, index, e)
					})}
				</div>
			);
		}
	};
	meta[AREA.headTableArea].items.push(headPorCol);
	let bodyPorCol = {
		attrcode: 'opr',
		label: getLangByResId(this, '1014QUALITYLEVEL-000013') /* 国际化处理： 操作*/,
		visible: true,
		width: '100px',
		fixed: 'right',
		itemtype: 'customer',
		render: (text, record, index) => {
			let buttonAry = [];
			if (props.editTable.getStatus(AREA.bodyTableArea) === STATUS.edit) {
				buttonAry = [ BUTTON.deleteLine ];
			}
			return props.button.createOprationButton(buttonAry, {
				area: BUTTON.list_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => onBodyInner_BtnClick.bind(this)(props, key, record, index)
			});
		}
	};
	meta[AREA.bodyTableArea].items.push(bodyPorCol);
	return meta;
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX