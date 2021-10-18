/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import * as CONSTANTS from '../../const/constants';
let { tableId, searchId, pageCodeList, appId, oid, appcode, attrCode, pkname } = CONSTANTS;
const { NCMenu, NCDropdown, NCCheckbox, NCButton, NCMessage, NCCol, NCRow } = base;
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
const { Item } = NCMenu;
import buttonClick from './buttonClick';

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			// pageCodeList,//页面code
			pagecode:pageCodeList,
			// appId//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;

					meta = modifierMeta(that, props, meta)
					//加载模板数据
					props.meta.setMeta(meta);
					//高级查询区域加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, searchId, data);
					//列表查询区域加载默认业务单元
					setDefOrg2ListSrchArea(props, searchId, data);					
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	)
	//huzhpm 初始化禁用打印等按钮
	props.button.setButtonDisabled(['formalprint', 'supplyprint', 'print', "printout"], true);
}

function modifierMeta(that, props, meta) {

	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_org_p').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_transactorg').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_org_r').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_fundorg').isMultiSelectedEnabled = true;

	meta[searchId].items.map((item) => {
		//显示停用
	item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				item.isTreelazyLoad = false;
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode == 'pk_transactorg') {
			item.queryCondition = () => {
				let pk_transactorg = props.search.getSearchValByField(searchId, 'pk_transactorg').value.firstvalue; // 调用相应组件的取值API
				return { pk_transactorg: pk_transactorg }; 
			};
			//支持跨集团
			item.isShowUnit = true;
		}
		if (item.attrcode == 'pk_org_p') {
			item.queryCondition = () => {
				let pk_org_p = props.search.getSearchValByField(searchId, 'pk_org_p').value.firstvalue; // 调用相应组件的取值API
				return { pk_org_p: pk_org_p }; 
			};
			//支持跨集团
			item.isShowUnit = true;
		}
		if (item.attrcode == 'pk_org_r') {
			item.queryCondition = () => {
				let pk_org_r = props.search.getSearchValByField(searchId, 'pk_org_r').value.firstvalue; // 调用相应组件的取值API
				return { pk_org_r: pk_org_r }; 
			};
			//支持跨集团
			item.isShowUnit = true;
		}
		if (item.attrcode == 'pk_fundorg') {
			item.queryCondition = () => {
				let pk_fundorg = props.search.getSearchValByField(searchId, 'pk_fundorg').value.firstvalue; // 调用相应组件的取值API
				return { pk_fundorg: pk_fundorg }; 
			};
			//支持跨集团
			item.isShowUnit = true;
		}
	});

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;
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
	//huzhpm 添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: props.MutiInit.getIntl("36300REC") && props.MutiInit.getIntl("36300REC").get('36300REC-000016'),/* 国际化处理： 操作*/
		width: 160,
		itemtype: 'customer',
		className: "table-opr",
		fixed: 'right',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = ['link'];
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick(props, key, text, record, index)
			});
		}
	})
	return meta;
}




/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/