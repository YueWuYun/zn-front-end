/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import * as CONSTANTS from '../constants';
let { tableId, searchId, pagecode, appid, formId_org, formId_01, formId_02, formId_03, formId_04, formId_06, oid } = CONSTANTS;
const { NCMenu, NCDropdown, NCCheckbox, NCButton, NCMessage, NCCol, NCRow } = base;
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
const { Item } = NCMenu;

export default function (props) {
	let that = this;
	debugger;
	props.createUIDom(
		{
			pagecode,//页面id
			appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;

					meta = modifierMeta(that, props, meta)					
					//加载模板数据
					props.meta.setMeta(meta);
					//设置默认组织
					setDefaultOrg(props) ;					
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	)
}
/**
 * 日期格式化
 * @param {*} date 
 */
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}
function modifierMeta(that, props, meta) {
	//显示查询区域字段
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.visible = true;
		item.col = '4';
		item.isShowDisabledData = true;
		return item;
	})
	//银行账户子户，设置多选
	// meta[searchId].items.find((e) => e.attrcode === 'pk_acc_sub').isMultiSelectedEnabled = true;
	//财务组织，设置多选
	//meta[formId_org].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = true;;
	/**
	 * 查询区域参照过滤
	 */
	meta[searchId].items.map((item) => {
		//财务组织过滤,用户有权限的组织
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: '36070AI',
					isSSCOrg: 'N',
					TreeRefActionExt: 'nccloud.web.cmp.informer.refbuilder.InformerSSCOrgRefBuilder' 
				};
			};
		}
		//银行账户子户过滤，根据组织过滤
		if (item.attrcode == 'pk_acc_sub') {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue;
				return {
					pk_org: pk_org,
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccSubDefaultBuilder'
				};
			};
		}
	});

	meta[tableId].pagination = true;
	// meta[tableId].items = meta[tableId].items.map((item, key) => {
	// 	//item.width = 150;
	// 	// if (item.attrcode == 'infodate') {
	// 	// 	item.render = (text, record, index) => {
	// 	// 		return (
	// 	// 			<span>
	// 	// 				{record.infodate && seperateDate(record.infodate.value)}
	// 	// 			</span>
	// 	// 		);
	// 	// 	};
	// 	// } 
	// 	return item;
	// });
	let multiLang = props.MutiInit.getIntl('36070AIPSC');
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		// label: multiLang && multiLang.get('36300TP-0005'),
		label: props.MutiInit.getIntl("36070AIPSC") && props.MutiInit.getIntl("36070AIPSC").get('36070AIPSC--000011')/*'操作'*/,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		itemtype:'customer',
		render: (text, record, index) => {
			let buttonAry = ['Ldetail'];
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			});
		}
	});
	return meta;
}

function setDefaultOrg(props) {
	ajax({
		url: '/nccloud/cmp/informer/defaultorg.do',
		data: { ssc: 'false' },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.search.setSearchValByField('search', 'pk_org', { value: data.value, display: data.display });
				} else {
				    props.search.setSearchValByField('search', 'pk_org', {});
				}
			}
		}
	});
}



/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/