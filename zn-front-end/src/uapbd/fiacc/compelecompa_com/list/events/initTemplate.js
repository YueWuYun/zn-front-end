//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import tableButtonClick from './tableButtonClick';
import {oprarea,searchId,tableId,moduleName,exprotBillType,importPageId,pkname} from '../constants';
import {getButtonsKey,getInnerButtonkey,buttonVisible} from'../../../../public/excomponents/pubUtils/buttonVisible';
import beforeEvent from './beforeEvent.js';
import { innerButton } from '../../../../public/excomponents/pubUtils/buttonName.js';
import defaultPeriod from '../../../../public/excomponents/pubUtils/defaultPeriod.js';
import { excelImportconfig} from 'nc-lightapp-front';

/**
 * 页面初始化，渲染页面模板，按钮方法
 */
export default function(props,callback) {
	let that = this;
	let excelimportconfig = excelImportconfig(props, moduleName, exprotBillType,true,"",{"appcode": props.getSearchParam('c'),"pagecode":importPageId});
	props.createUIDom(
		{
			pagecode: `${props.getSearchParam('c')}_list`, //页面id
			appcode: props.getSearchParam('c') //小应用编码
		},
		function(data) {
			if (data) {
				let lineButton = [];
				if (data.button) {
					/* 按钮适配 将请求回来的按钮组数据设置到页面的 属性上 */
					let button = data.button;
					//获取操作列所有按钮
					lineButton = getInnerButtonkey(button);
					//获取所有按钮
					getButtonsKey(button, that.Info.allButtonsKey);
					// 临时模拟数据
					props.button.setButtons(button);
					//列表行按钮操作提示
					props.button.setPopContent(innerButton.Delete_inner,that.state.json['10140CECA-000016']); /* 国际化处理： 确定要该合同删除吗？*/
					props.button.setUploadConfig("ImportData", excelimportconfig);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that,props, meta,lineButton);
					//编辑前事件
					beforeEvent(that,props,searchId,meta);
					props.meta.setMeta(meta);
					//查询区默认会计期间
					// if(!that.props.getUrlParam('cardFlag')){//判断是否从卡片返回
					// 	defaultPeriod(props, searchId,that);
					// }
				}
				if(callback){
					callback()
				}
			}
		}
	);
}
function modifierMeta(that,props, meta,lineButton) {
	//添加操作列
	meta[tableId].items.push({
		label: that.state.json['10140CECA-000003'],/* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: '180px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = lineButton ? lineButton : [];
            //如果有不同逻辑，展示不同操作列按钮，可以对buttonAry（所有行上按钮）进行筛选
			return props.button.createOprationButton(buttonAry, {
				area: oprarea,
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick(that,props, key, text, record, index)
			});
		}
	});
	//依据单据号超链接
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				if (record && record.vbillcode) {
					return (
						<a
							style={{ cursor: 'pointer' }}
							//链接的点击事件
							onClick={() => {
								props.pushTo('/card', {
									status:'browse',
									id: record[pkname].value
								});
							}}
						>
							{record.vbillcode.value}
						</a>
					);
				}
			};
		}
		return item;
	});
	return meta;
}


//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX