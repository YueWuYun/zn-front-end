/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast, cardCache,excelImportconfig} from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick.js';
import  { constant, requesturl }  from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { buttonVisible } from './buttonVisible';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea} from '../../../../../tmpub/pub/util/index';
import { cache } from '../../../../../tmpub/pub/cons/constant';
import { go2CardCheck } from "../../../../../tmpub/pub/util";


let { NCPopconfirm, NCIcon,NCTooltip } = base;
let {setDefData, getDefData } = cardCache;
let searchcode = constant.searchcode;
let cacheDataSource = constant.cacheDataSource;

export default function(props) {
	let excelimportconfig = excelImportconfig(props, "cmp", '36S2',true,"",
	{"appcode":constant.appcode,"pagecode":constant.cpagecode});
	props.createUIDom(
		{
			pagecode: constant.lpagecode, //页面id
			appid: constant.appregisterpk //注册按钮的id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let isfiplink = getDefData(constant.fipscene_key, cacheDataSource);
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);

					if(!isfiplink){
						// 高级查询默认业务单元赋值
						setDefOrg2AdvanceSrchArea(props, searchcode, data);
						// 查询方案默认业务单元赋值
						setDefOrg2ListSrchArea(props, searchcode, data);
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					let btnflag = true;
					// props.button.setPopContent('deleteinBtn', this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000030'));/* 国际化处理： 确认要删除该信息吗？*/
					props.button.setPopContent('deleteinBtn', this.state.json['36070WC-000030']);/* 国际化处理： 确认要删除该信息吗？*/
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

function modifierMeta(props, meta) {
	meta[searchcode].items = meta[searchcode].items.map((item, key) => {
		// item.visible = true;
		item.col = '3';
		return item;
	});

	meta[constant.ltablecode].items = meta[constant.ltablecode].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode == 'billno') {
			item.render = (text, record, index) => {
				return (
						<a
							style={{ textDecoration: '', cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
							onClick={() => {
								let isfiplink = getDefData(this.fipscene_key, cacheDataSource);
								// props.table.selectAllRows(this.tableId,false);
								//tm begin lidyu 并发交互跳转卡片检查 20200311
								let ts = record.ts.value;
								go2CardCheck({
									props,
									url: requesturl.gotocardcheck,
									pk: record.pk_cashdraw.value,
									ts: ts,
									checkTS: false,
									fieldPK: constant.pkname,
									actionCode : null ,
									permissionCode: null ,
									go2CardFunc: () => {
										props.table.selectAllRows(this.tableId,false);
										props.pushTo(constant.cardpath, {
											pagecode: constant.cpagecode,
											status: 'browse',
											id: record.pk_cashdraw.value
										});
									}
								})
								//tm end lidyu 并发交互跳转卡片检查 20200311
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
	//添加操作列
	meta[constant.ltablecode].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000031'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			//begin tm lidyu  20200401 添加联查标志 去掉操作列按钮 修改根據billstatus显示操作按钮的逻辑
			let buttonAry = [];
			// buttonAry = record.billstatus.value == 0 ? ['editinBtn'] 
			// : record.billstatus.value == 1 ? ['submitinBtn', 'editinBtn','deleteinBtn' ] 
			// : record.billstatus.value == 2 ? [ 'unsubmitinBtn' ] 
			// : record.billstatus.value == 3 ? [ 'settleinBtn','unsubmitinBtn' ] 
			// : record.billstatus.value == 4 ? [ 'unsettleinBtn','makebillBtn' ] 
			// : [];
			if(record.billstatus.value == 0){
				buttonAry = [ 'editinBtn' ];
			}
			if(record.billstatus.value == 1){
				buttonAry = [ 'submitinBtn', 'editinBtn', 'deleteinBtn' ];
			}
			if(record.billstatus.value == 2){
				buttonAry = [ 'unsubmitinBtn' ];
			}
			if(record.billstatus.value == 3){
				buttonAry = [ 'settleinBtn','unsubmitinBtn' ];
			}
			if(record.billstatus.value == 4){
				buttonAry = [ 'unsettleinBtn', 'makebillBtn' ];
			}
			//end lidyu 20200401
			// 单据状态为待结算时 且为内部账户
			if(record.billstatus.value == 3 && record.isinneracc.value){
				buttonAry = ['unsubmitinBtn','transferBtn'];
			}
			// 单据状态为待结算时 且结算状态为结算中 且为内部账户
			if(record.billstatus.value ==3 && record.settlestatus.value ==1 && record.isinneracc.value){
				buttonAry = ['unsubmitinBtn','canceltransferBtn'];
			}
			// 单据状态为完结 且为内部账户
			if(record.billstatus.value == 4 && record.isinneracc.value){
				buttonAry = ['makebillBtn','canceltransferBtn']; 
				let systemcode = record.systemcode;
				if(systemcode && systemcode.value){
					buttonAry = ['makebillBtn']; 
				}  
			}
			//如果是凭证联查单据的话去掉操作列按钮
			let isfiplink = getDefData(constant.fipscene_key, cacheDataSource)
			if (isfiplink) {
				buttonAry = [];
			}
			//begin tm lidyu 20191120 分布式异常交互改造
			// return props.button.createOprationButton(buttonAry, {
			// 	area: 'list_inner',
			// 	buttonLimit: 3,
			// 	onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			// });
			
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry,
						{
							area: 'list_inner',//区域编码
							buttonLimit: 3,//按钮显示个数
							onButtonClick: (props, key) => { tableButtonClick.call(this, props, key, text, record, index); }
						});
				}
			}));
			//lidyu end
		}
	});
	//参展过滤
	meta[searchcode].items.map((item) => {
		item.isShowDisabledData = true; // “显示停用”的字段
	// 现金账户
// 	if (item.attrcode === 'pk_cashaccount') {
// 			item.queryCondition = () => {
// 				let orgpk,currency
// 				if(props.search.getSearchValByField(searchcode, 'pk_org')){
// 					orgpk = props.search.getSearchValByField(searchcode, 'pk_org').value.firstvalue;
// 				}
// 				if(props.search.getSearchValByField(searchcode, 'pk_currency')){
// 					currency = props.search.getSearchValByField(searchcode, 'pk_currency').value.firstvalue;
// 				}
// 				return { 
// 					pk_org: orgpk, 
// 					pk_currtype: currency,
// 					refnodename: commondata.refnodename,
// 					isDisableDataShow:false,//默认只加载启用的账户
//                     noConditionOrg:'N',
// 					GridRefActionExt: commondata.cashaccountref // 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
// 				};
// 			};
// 		}

		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: commondata.financeOrgPermissionFilter // 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}

		//银行账户
		if (item.attrcode === 'pk_bankaccount') {

			item.queryCondition = () => {
				let search_org_value = props.search.getSearchValByField(searchcode, 'pk_org');//所选组织
				if (search_org_value && search_org_value.value.firstvalue) {
					search_org_value = search_org_value.value.firstvalue;
				} else {
					search_org_value = null;
				}
				let search_currency_value = props.search.getSearchValByField(searchcode, 'pk_currency');//所选买入币种
				if (search_currency_value && search_currency_value.value.firstvalue) {
					search_currency_value = search_currency_value.value.firstvalue;
				} else {
					search_currency_value = null;
				}

				return {
					pk_org: search_org_value,
					pk_currtype: search_currency_value,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'//自定义增加的过滤条件
				};
			}
		}

	});

	//设置参照可以多选和是否清楚记录
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	//财务组织:全加载
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/