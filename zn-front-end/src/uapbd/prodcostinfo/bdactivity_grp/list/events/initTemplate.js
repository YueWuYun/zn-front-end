//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX

import { ajax, base, high, toast } from 'nc-lightapp-front';
import { pageId, appcode, tableId } from '../constants';
import tableButtonClick from './tableButtonClick';
// import TransferInTableCell from '../../../../public/components/TransferInTableCell';
export default function (props, callback) {
	let that = this;
	props.createUIDom(
		{
			pagecode: that.pageId,//页面id
			appcode: props.getSearchParam("c"),//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					getButtonsKey(button, that.Info.allButtonsKey);//保存所有头部和肩部按钮
					props.button.setButtons(button);

				}
				if (callback) {
					callback()
				}

			}
		}
	)
}


function modifierMeta(that, props, meta) {

	//添加操作列
	meta[that.tableId].items.push({
		label: that.state.json['10140ACTG-000005'],/* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: '100px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let enablestate = record.values.enablestate.value;
			let trueBtn = [];
			let status = that.props.editTable.getStatus(that.tableId);
			if (enablestate == '2') {
				if (status == 'edit') {
					trueBtn = ['Delete_inner'];
				} else {
					trueBtn = ['Delete_inner', 'Disable_inner'];
				}
			} else {
				if (status == 'edit') {
					trueBtn = ['Delete_inner'];
				} else {
					trueBtn = ['Delete_inner', 'Enable_inner'];
				}

			}
			// if(enablestate=='2'){
			// 	trueBtn =['Delete_inner','Disable_inner'];
			// }else{
			// 	trueBtn =['Delete_inner','Enable_inner'];
			// }
			return props.button.createOprationButton(trueBtn, {
				area: "list_inner_area",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			});
		}
	});


	return meta;
}




let getButtonsKey = function (inBtn, outBtnKey) {
	for (let i = 0; i < inBtn.length; i++) {
		if (inBtn[i].children.length == 0) {
			outBtnKey.push(inBtn[i].key);
		} else {
			outBtnKey.push(inBtn[i].key);
			getButtonsKey(inBtn[i].children, outBtnKey);
		}

	}
	return outBtnKey;
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX