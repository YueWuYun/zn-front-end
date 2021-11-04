//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX

import tableButtonClick from './tableButtonClick.js';
import {cardBodyAndInnerButtonVisible,getButtonsKey} from '../../common/buttonVisible';

export default function(props,callback) {
	let that = this;
	let appcode = props.getSearchParam("c");
	let pagecode = that.pageId;
	props.createUIDom(
		{
			pagecode: pagecode,
			appcode: appcode,
		}, 
		function (data){
			if(data){
				if(!data.template[that.tableId]){
					return;
				}
				if(data.template){
					let meta = data.template;
					meta = modifierMeta(props, meta,that);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					getButtonsKey(button, that.Info.allButtonsKey);//保存所有头部和肩部按钮
					props.button.setButtons(button);
				}
				if (data.context) {
					//初始化上下文信息-主要渲染个性化中心的值
					that.Info.context = data.context;
				}
				if(callback){
					callback()
				}
			}   
		}
	)
}

function modifierMeta(props, meta,that) {
	let status = props.getUrlParam('status');
	meta[that.formId].status = status;
	meta[that.tableId].status = status;
	//修改模板的部分内容
	meta[that.formId].items.map((item) => {
		let attrcode = item.attrcode;
		switch (attrcode) {
			case 'vnote'://备注是文本域
				item.itemtype = 'textarea';
		}
	})
	meta[that.tableId].items.map((item) => {
		let attrcode = item.attrcode;
		switch (attrcode) {
			case 'cmaterialid'://物料版本
				item.isMultiSelectedEnabled = true;//设置物料版本为多选
				break;
		}
	})
	//添加操作列
	meta[that.tableId].items.push({
		label: that.state.json['10140CCSD-000001'],/* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: '180px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let trueBtn =cardBodyAndInnerButtonVisible.call(that,props,that.state.buttonfalg,record.expandRowStatus);
			return props.button.createOprationButton(trueBtn, {
				area: "card_inner_area",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that,props, key, text, record, index)
			});
		}
	});
	return meta;
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX