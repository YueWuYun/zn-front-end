/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { cardCache, excelImportconfig } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick.js';
import { constant } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { buttonVisible } from './buttonVisible';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
let { getDefData } = cardCache;
//let pageId = constant.lpagecode; //'36070DC_L01';
let searchcode = constant.searchcode;
let ltablecode = constant.ltablecode;
let cacheDataSource = constant.cacheDataSource;
export default function (props, json, inlt) {
	let excelimportconfig = excelImportconfig(props, "cmp", '36S1', true, "",
		{ "appcode": constant.appcode, "pagecode": constant.cpagecode });

	props.createUIDom(
		{
			pagecode: constant.lpagecode, //页面id
			// appid: constant.appregisterpk //'0001Z61000000001PA3D' //注册按钮的id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					if (meta[searchcode]) {
						// 高级查询默认业务单元赋值
						setDefOrg2AdvanceSrchArea(props, searchcode, data);
						// 查询方案默认业务单元赋值
						setDefOrg2ListSrchArea(props, searchcode, data);
					}
				}
				if (data.button) {
					// let multiLang = that.state.json;
					let button = data.button;
					// props.button.setButtons(button);
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					props.button.setPopContent('deleteinBtn', this.state.json['36070AGR-000029']);/* 国际化处理： 确认要删除该信息吗？*/
					// props.button.setPopContent('deleteinBtn', '确认要删除该信息吗？');
					props.button.setUploadConfig("ImportData", excelimportconfig);
				}

			}
		}
	);
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

//查询模板默认显示以及默认不显示
function modifierMeta(props, meta) {
	meta[searchcode].items = meta[searchcode].items.map((item, key) => {
		//item.visible = true; //设置全部字段可显示
		item.col = '3';
		return item;
	});

	meta[ltablecode].items = meta[ltablecode].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode == 'billno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ textDecoration: '', cursor: 'pointer' }}
						onClick={() => {
							props.table.selectAllRows(this.tableId, false);
							props.pushTo(constant.cardpath, {
								status: 'browse',
								id: record.pk_autoinform.value
							});
						}}
					>
						{record && record.billno && record.billno.value}
					</a>
				);
			};
		} 
		// else if (item.attrcode == 'dbilldate') {
		// 	item.render = (text, record, index) => {
		// 		return <span>{record.dbilldate && seperateDate(record.dbilldate.value)}</span>;
		// 	};
		// }
		return item;
	});

	// 参照过滤
	meta[searchcode].items.map((item) => {

		item.isShowDisabledData = true;

		//本方账号
		if (item.attrcode === 'pk_bankacc') {
			item.queryCondition = () => {
				let search_org_value = props.search.getSearchValByField(searchcode, 'pk_org');//所选组织
				if (search_org_value && search_org_value.value.firstvalue) {
					search_org_value = search_org_value.value.firstvalue;
				} else {
					search_org_value = null;
				}
				return {
					pk_org: search_org_value,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					DataPowerOperationCode: 'TMDefault',//使用权组
					// funcode: '36070AGR',
					isDataPowerEnable: 'Y',
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'//自定义增加的过滤条件
				};
			}
		}

		// 根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: commondata.financeOrgPermissionFilter
				};
			};
		}

		//对方单位名称过滤
		if (item.attrcode === 'oppbankacc') {
			item.itemType = 'refer';
			item.refcode = 'uapbd/refer/pub/CustBankAccGridRef/index'; 
			item.refName = '客商银行账户';
			item.queryCondition = () => {
				return {
					accclass:'2',
					pk_org:(props.search.getSearchValByField(searchcode, 'pk_org').value||{}).firstvalue,//所选组织					
					pk_cust: (props.search.getSearchValByField(searchcode, 'oppunitname').value||{}).firstvalue
                }; 
			};
		}

		//对方单位名称过滤
		if (item.attrcode === 'oppunitname') {
			item.isHasDisabledData = true;
			item.queryCondition = () => {
				let custsuptype = props.form.getFormItemsValue(searchcode, 'billtypeobj').value;
				return {
					custsuptype: custsuptype,
					test: 'test',
					queryType: 'pk_custclass',  // 'pk_supplierclass'
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCustSupplierOppunitnameRef'
				};
			};
		}

	});

	//设置参照可以多选和是否显示历史记录
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_bankacc').showHistory = true;


	//财务组织:全加载
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/