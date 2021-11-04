//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { createPage, ajax, base, toast, cardCache ,excelImportconfig} from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick.js';
import searchBeforeEvent from './searchBeforeEvent.js';
import {importPageId } from '../constants';
import {getButtonsKey,getInnerButtonkey,buttonVisible} from'../../common/buttonVisible';
//import { loginContext, getContext, loginContextKeys } from '../../../../public/components/pubUtils/loginContext';
let { setDefData } = cardCache;

export default function (props,callback) {
	const that = this;
	let appcode= props.getSearchParam("c");
	//let pagecode = props.getSearchParam("p");
	props.createUIDom(
		{
			pagecode: that.pageId,//页面id
			appcode: appcode,//注册按钮的id
		},
		function (data) {
			if (data) {
				if(!data.template[that.tableId]){
					return;
				}
				let lineButton = [];
				if (data.button) {
					let button = data.button;
					//获取所有行按钮
					lineButton = getInnerButtonkey(button);
					//获取所有按钮(除去行按钮)--后续控制按钮用到
					getButtonsKey(button, that.Info.allButtonsKey);
					props.button.setButtons(button);
					//给行按钮上的删除附加气泡功能
					props.button.setPopContent('Delete_inner', that.state.json['10140CCSD-000002']);/*删除信息提示框*//* 国际化处理： 确定要删除吗？*/
				}
				if (data.template) {						
					let meta = data.template;
					//修改部分模板信息
					meta = modifierMeta(props, meta, lineButton, that);
					//查询区编辑前事件
					searchBeforeEvent(that,props,that.searchId,meta);
					//渲染模板
					props.meta.setMeta(meta);
				}
				if (data.context) {
					//初始化上下文信息--列表的个性化中心可以直接通过模板选择默认主组织，如果特殊需要，可以再该处保存个性化中心的值，后续自己处理
					//loginContext(data.context);
				}
				if(callback){
					callback()
				}
			}
		}
	)
}



function modifierMeta(props, meta, lineButton, that) {
	meta[that.tableId].items = meta[that.tableId].items.map((item, key) => {
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ textDecoration: 'none', cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record.pk_pursubratio.value
							});
						}}
					>
						{record.vbillcode && record.vbillcode.value}
					</a>
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[that.tableId].items.push({
		label: that.state.json['10140CCSD-000001'],/* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: '180px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = lineButton ? lineButton : [];
			let trueBtn = [];
			for (let i = 0; i < buttonAry.length; i++) {
				let flag = buttonVisible.call(that,that.props, record, buttonAry[i],'list');
				if (flag) {
					trueBtn.push(buttonAry[i]);
				}
			}
			return props.button.createOprationButton(trueBtn, {
				area: "list_inner_area",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			});
		}
	});
	return meta;
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX