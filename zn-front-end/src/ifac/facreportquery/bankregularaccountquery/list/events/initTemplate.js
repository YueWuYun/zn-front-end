/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip,NCMenu } = base;
import { buttonVisible } from './buttonVisible';
import { pageCodeList, searchId, tableId,attrCode,pkname,rowcode,app_code,formId } from '../../cons/constant.js';
import {setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea,loadMultiLang} from '../../../../../tmpub/pub/util/index.js';
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
export default function (props) {
	let that = this;
	
	props.createUIDom( 
		{
			pagecode: pageCodeList,//页面id 
			appcode:props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props,searchId,data);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props,searchId,data);
					//orgVersionView(props, formId);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
				}
			}
			if(!props.getUrlParam('scene')){
				buttonVisible.call(this,props);
			}
			
		}
	)
}
function modifierMeta(that, props, meta) {
	meta[tableId].pagination = true;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == attrCode) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[pkname].value,
							});
						}}
					>
						{record && record[attrCode] && record[attrCode].value}
					</a>
				);
			};
		}
		return item;
	});
	meta[tableId].items.push({
		attrcode: 'opr',
		label: loadMultiLang(props, '36300-000032')/* 国际化处理： 操作*/,
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		itemtype: 'customer',
		render: (text, record, index) => {
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					let buttonAry=[];
					return props.button.createOprationButton(buttonAry,
						{
							area: rowcode,//区域编码
							buttonLimit: 3,//按钮显示个数
							// onButtonClick: (props, key) => { buttonClick.call(that, props, key, text, record, index); }
						});
				}
			}));
			//end tangleic
		}
	});
	meta[searchId].items.map((item) => {
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	
	return meta;
}


/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/