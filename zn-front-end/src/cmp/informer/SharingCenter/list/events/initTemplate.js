/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import buttonDisable from './buttonDisable';
import * as CONSTANTS from '../constants';
let { tableId, searchId, pagecode, appid, formId_org, formId_01, formId_02, formId_03, formId_04, formId_06, oid } = CONSTANTS;
const { NCMenu, NCDropdown, NCCheckbox, NCButton, NCMessage, NCCol, NCRow } = base;
const { Item } = NCMenu;

export default function (props) {
	let that = this;
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
					props.meta.setMeta(meta);
					setDefaultOrg(props) ;
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonDisable.call(that, props, 'table');
				}
			}
		}
	)
}

function setDefaultOrg(props) {
	ajax({
		url: '/nccloud/cmp/informer/defaultorg.do',
		data: { ssc: 'true' },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.search.setSearchValByField('search', 'pk_org', { value: data.value, display: data.display });
				} else {
					props.search.setSearchValByField('search', 'pk_org', { value: null });
				}
			}
		}
	});
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
	meta[searchId].items.find((e) => e.attrcode === 'pk_acc_sub').isMultiSelectedEnabled = true;

	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	//是否显示历史数据
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_acc_sub').showHistory = true;

	/**
	 * 查询区域参照过滤
	 */
	meta[searchId].items.map((item) => {
		//财务组织过滤,用户有权限的组织
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: '36070AI',
					isSSCOrg: 'Y',
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
					refnodename: props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000008'),/* 国际化处理： 使用权参照*/
					isDisableDataShow: 'N',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccSubDefaultBuilder'
				};
			};
		}
	});

	meta[tableId].pagination = true;

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// if (item.attrcode == 'infodate') {
		// 	item.render = (text, record, index) => {
		// 		return (
		// 			<span>
		// 				{record.infodate && seperateDate(record.infodate.value)}
		// 			</span>
		// 		);
		// 	};
		// }
		return item;
	});

	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		// label: multiLang && multiLang.get('36300TP-0005'),
		label: props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000003'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype:'customer',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			let moneyy = record.moneyy.value;
			let usemoney = record.usemoney.value;
			let buttonAry =
				record.generateflag.value == 'hasnogenerate'//未生成
					? ["Lungenerate", 'Lpublish',]//不生单，发布
					: record.generateflag.value == 'hasrelease'//已发布
						? ["Lcancelpublish","Ldetail"]//明细，取消发布
						: record.generateflag.value == 'nogenerate'//不生成
							? ["Lregenerate"]//恢复生成
							: record.generateflag.value == 'hasgenerate'//已生成
								? moneyy && usemoney && moneyy - usemoney>0 ?['Lpublish','Ldetail']:[]
								: record.generateflag.value == 'hasclaim'//已认领
									? []
									: record.generateflag.value == 'nclaunch'//NC发起
										? []
										: []
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			});
		}
	});
	return meta;
}



/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/