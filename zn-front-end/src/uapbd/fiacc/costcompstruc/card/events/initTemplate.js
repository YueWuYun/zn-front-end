//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import tableButtonClick from './tableButtonClick'
import {formId,tableId,pagecode,cardBodyBody,moduleName,exprotBillType,importPageId} from '../constants';
import {getButtonsKey,cardBodyAndInnerButtonVisible} from '../../../../public/excomponents/pubUtils/buttonVisible';
import { loginContext } from '../../../../public/excomponents/pubUtils/loginContext';
/**
 * 页面初始化，渲染页面模板，按钮方法
 */
export default function(props,callback) {
	let that = this;
	props.createUIDom(
		{
			pagecode:  pagecode,//页面id
			appcode: props.getSearchParam('c') //小应用编码
		}, 
		function (data){
			if(data){
				if(data.button){
					let button = data.button;
					getButtonsKey(button, that.Info.allButtonsKey);//保存所有头部和肩部按钮
					props.button.setButtons(button);
				}
				if(data.template){
					let meta = data.template;
					modifierMeta(that,props, meta);
					props.meta.setMeta(meta);
				}
				if (data.context) {
					//初始化上下文信息
					loginContext(data.context);
				
				}
				if(callback){
					callback();
				}
			}   
		}
	)
}

function modifierMeta(that,props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	meta[formId].items.map((item) => {
	})
	let porCol = {
		attrcode: 'opr',
		label: that.state.json['10140CCSC-000003'],/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer', 
		visible: true,
		width:'180px',
		render: (text, record, index) => {

			//处理表体行间按钮，
			let buttonAry =cardBodyAndInnerButtonVisible(that, that.state.buttonflag,record.expandRowStatus);

			return props.button.createOprationButton(buttonAry, {
                area: cardBodyBody,
                buttonLimit: 3,
                onButtonClick: (props, key) => tableButtonClick.call(that,props,key,tableId, record, index)
            });
        }
	};
	meta[tableId].items.push(porCol);
	return meta;
}

//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX