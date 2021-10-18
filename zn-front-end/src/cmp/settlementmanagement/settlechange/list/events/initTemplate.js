/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick.js';
import { constant,requesturl } from '../../config/config.js';
import { commondata } from '../../../../public/utils/constant';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea} from '../../../../../tmpub/pub/util/index';
import { go2CardCheck } from "../../../../../tmpub/pub/util";
let { NCPopconfirm, NCIcon,NCTooltip } = base;
let searchcode = constant.searchcode;

export default function(props) {
	props.createUIDom(
		{
			pagecode: constant.lpagecode, //页面id
			appid: constant.appregisterpk //注册按钮的id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					// 高级查询默认业务单元赋值
					setDefOrg2AdvanceSrchArea(props, searchcode, data);
					// 查询方案默认业务单元赋值
					setDefOrg2ListSrchArea(props, searchcode, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('deleteinBtn', this.state.json['36070CPI-000017']);/* 国际化处理： 确认要删除该信息吗？*/
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

function modifierMeta(props, meta) {
	meta[searchcode].items = meta[searchcode].items.map((item, key) => {
		// item.visible = true;
		item.col = '3';
		return item;
	});

	meta[constant.ltablecode].items = meta[constant.ltablecode].items.map((item, key) => {
		// item.width = 150;
		//点击某一列跳转到browse状态
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					
						<a
							style={{ textDecoration: '', cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
							onClick={() => {
							//tm begin lidyu 并发交互跳转卡片检查 20200312
							let ts = record.ts.value;
							go2CardCheck({
								props,
								url: requesturl.gotocardcheck,
								pk: record.pk_settlechange.value,
								ts: ts,
								checkTS: false,
								fieldPK: constant.pkname,
								actionCode : null ,
								permissionCode: null ,
								checkSaga : false,
								go2CardFunc: () => {
									// this.setCacheState();
									// props.table.selectAllRows(this.tableId,false);
									props.pushTo(constant.cardpath, {
										pagecode: constant.cpagecode,
										status: 'browse',
										billstatus: record.busistatus.value,
										id: record.pk_settlechange.value
								});
								}
							})
							//tm end lidyu 并发交互跳转卡片检查 20200312  
							}}
						>
							{record && record.vbillno && record.vbillno.value}
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
	let multiLang = props.MutiInit.getIntl(constant.moduleId);
	//添加操作列
	meta[constant.ltablecode].items.push({
		attrcode: 'opr',
		label: this.state.json['36070CPI-000018'],/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let buttonAry = record.busistatus.value == 1 ? ['submitinBtn', 'editinBtn','deleteinBtn' ] 
			: record.busistatus.value == 2 ? [ 'unsubmitinBtn' ] 
			: record.busistatus.value == 3 ? [ 'unsubmitinBtn', 'preparenetinBtn'] 
			: [];
			return props.button.createOprationButton(buttonAry, {
				area: 'list_inner',
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			});
		}
	});
	//参展过滤
	meta[searchcode].items.map((item) => {
		item.isShowDisabledData = true; // “显示停用”的字段
		// 根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
			return {
				funcode: constant.appcode,
				TreeRefActionExt: commondata.financeOrgPermissionFilter //'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}

		// 本方账户
		if (item.attrcode === 'pk_account') {
			item.queryCondition = () => {
				let search_org_value1 = props.search.getSearchValByField(searchcode, 'pk_org');// 所选组织
				if (search_org_value1 && search_org_value1.value.firstvalue) {
					search_org_value1 = search_org_value1.value.firstvalue;
				} else {
					search_org_value1 = null;
				}
				let search_currtype_value1 = props.search.getSearchValByField(searchcode, 'pk_curr');// 币种
				if (search_currtype_value1 && search_currtype_value1.value.firstvalue) {
					search_currtype_value1 = search_currtype_value1.value.firstvalue;
				} else {
					search_currtype_value1 = null;
				}

				return {
					pk_orgs: search_org_value1,
					pk_currtype: search_currtype_value1,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};

			};

		}

		// 原有本方账户
		if (item.attrcode === 'pk_account_old') {
			item.queryCondition = () => {
				let search_org_value2 = props.search.getSearchValByField(searchcode, 'pk_org');// 所选组织
				if (search_org_value2 && search_org_value2.value.firstvalue) {
					search_org_value2 = search_org_value2.value.firstvalue;
				} else {
					search_org_value2 = null;
				}
				let search_currtype_value2 = props.search.getSearchValByField(searchcode, 'pk_curr');// 币种
				if (search_currtype_value2 && search_currtype_value2.value.firstvalue) {
					search_currtype_value2 = search_currtype_value2.value.firstvalue;
				} else {
					search_currtype_value2 = null;
				}

				return {
					pk_orgs: search_org_value2,
					pk_currtype: search_currtype_value2,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
		
	});
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/