/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast,cardCache ,excelImportconfig} from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import { constant, requesturl } from '../../config/config';
import tableButtonClick from './tableButtonClick.js';
import { commondata } from '../../../../public/utils/constant';
import { buttonVisible } from './buttonVisible';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea,go2CardCheck} from '../../../../../tmpub/pub/util/index';
let { getDefData,setDefData } = cardCache;
let lpagecode = constant.lpagecode;
let searchcode = constant.searchcode;
let ltablecode = constant.ltablecode;
let cacheDataSource = constant.cacheDataSource;
import appBase from "../../base";
const { cons, api } = appBase;

export default function(props, json, inlt) {
	let excelimportconfig = excelImportconfig(props, "cmp", '36S4',true,"",
	      {"appcode":constant.appcode,"pagecode":constant.cpagecode});
	props.createUIDom(
		{
			pagecode: lpagecode, //页面id
			appid: constant.appregisterpk //注册按钮的id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					let isfiplink = getDefData(constant.fipscene_key, cacheDataSource);
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
					// props.button.setButtons(button);
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					props.button.setPopContent('deleteinBtn', this.state.json['36070TBR-000040']);/* 国际化处理： 确认要删除该信息吗？*/
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

	meta[ltablecode].items = meta[ltablecode].items.map((item, key) => {
		// item.width = 150;
		//点击某一列跳转到browse状态
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
						<a
							style={{ textDecoration: '', cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
							onClick={() => {
								let id = record.pk_transformbill.value;
								let ts = record.ts.value;
								go2CardCheck({									
									props,url:cons.url.list.LIST2CARD_CHECK,pk:id,ts:ts,fieldPK:cons.field.pk,actionCode:null,permissionCode:null,checkSaga:false,checkTS:false,go2CardFunc:()=>{											
										//弹异常提示
										cardCache.setDefData(cons.comm.iserrtoast, cons.comm.dataSource, true);
										// props.table.selectAllRows(this.tableId,false);
										props.pushTo(constant.cardpath, {
											pagecode: constant.cpagecode,
											status: 'browse',
											id: id
										});
									}
								});									
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
	//添加操作列
	let multiLang = props.MutiInit.getIntl('2052');
	meta[ltablecode].items.push({
		attrcode: 'opr',
		label: this.state.json['36070TBR-000041'],/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let buttonAry
			let billstatus=record.busistatus.value;
			let isinner = record.isinner_pay.value;
			let settlesatus = record.settlesatus.value;
			let payman = record.payman.value;
			let pk_srcbilltypecode  = record.pk_srcbilltypecode.value;

			switch (billstatus) {
				case '1':
					buttonAry = [ 'submitinBtn', 'editinBtn', 'deleteinBtn' ]
					break;
				case '2':
					buttonAry = [ 'unsubmitinBtn' ]
					break;
				case '3':
					// 结算状态
                    switch (settlesatus) {
                        // 未结算
                        case '1':
                            // 判断是不是内部账户
                            if (isinner) {
								// 是内部账户
								buttonAry =  [ 'unsubmitinBtn', 'entrustinBtn' ]
                            } else {
								buttonAry =  [ 'unsubmitinBtn', 'settleinBtn','onlinepaymentinBtn' ]
                            }
                            break;
                            // 结算中
                        case '2':
                            //内部账户
                            if (isinner) {
								buttonAry =  [ 'unentrustinBtn' ]
                            } else {
                                //网银
                                // if (isnetbank === '1') {
								// 	buttonAry =  [ 'unentrustinBtn' ]
                                // }
                            }
                            break;
                            // 结算成功
                        case "3":
                            if (isinner) {
								buttonAry = [ 'makebillBtn' ]
                            }
                            break;
                            // 结算失败
						case '4':
							buttonAry =  [ 'onlinepaymentinBtn' ]
                            break;
                    }
                    break;

					// if(record.isinner_pay.value){
					// 	if(record.settlesatus.value === '1'){
					// 		buttonAry = [ 'entrustinBtn','unsubmitinBtn' ]
					// 	}else if(record.settlesatus.value === '2'){
					// 		buttonAry = [ 'unentrustinBtn' ]
					// 	}
					// }else{
					// 	if(record.settlesatus.value === '1'){
					// 		buttonAry = [ 'settleinBtn','unsubmitinBtn' ]
					// 	}else if(record.settlesatus.value === '2'){
					// 		// buttonAry = [ 'settleinBtn']
					// 	}
					// }
				case '4':
					if(payman){
						buttonAry = [ 'makebillBtn' ]
					}else{
						if(pk_srcbilltypecode == constant.informerbilltype){
							buttonAry = [ 'makebillBtn' ]
						}else{
							buttonAry = [ 'makebillBtn','unsettleinBtn' ]
						}
					}
					break;
				default:
					buttonAry = [];
					break;
			}

			let isfiplink = getDefData(constant.fipscene_key, constant.cacheDataSource);
            if(isfiplink){
				buttonAry = [];
		    } 
			
			//begin tm zhanghe 20191120 支持分布式事务异常交互
			// return props.button.createOprationButton(buttonAry, {
			// 	area: 'list_inner',
			// 	buttonLimit: 3,
			// 	onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			// });
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: 'list_inner',
						buttonLimit: 3,
						onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
					});
				}
			}));
			//end
		}
	});
	//参展过滤
	meta[searchcode].items.map((item) => {
		item.isShowDisabledData = true; // “显示停用”的字段
		// 财务组织：根据用户权限过滤
		// if (item.attrcode == 'pk_org') {
		// 	item.queryCondition = () => {
		// 		return {
		// 			TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
		// 		};
		// 	};
		// }
		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: commondata.financeOrgPermissionFilter // 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}

		//划出银行账户
		if (item.attrcode === 'transformoutaccount') {
			item.queryCondition = () => {

				let search_org_value = props.search.getSearchValByField(searchcode, 'pk_org');//所选组织
				if (search_org_value && search_org_value.value.firstvalue) {
					search_org_value = search_org_value.value.firstvalue;
				} else {
					search_org_value = null;
				}
				let search_currtype_value = props.search.getSearchValByField(searchcode, 'pk_currtype');//所选买入币种
				if (search_currtype_value && search_currtype_value.value.firstvalue) {
					search_currtype_value = search_currtype_value.value.firstvalue;
				} else {
					search_currtype_value = null;
				}

				return {
					pk_orgs: search_org_value,
					pk_currtype: search_currtype_value,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}

		//划入银行账户
		if (item.attrcode === 'transforminaccount') {
			item.queryCondition = () => {

				let search_org_value2 = props.search.getSearchValByField(searchcode, 'pk_org');//所选组织
				if (search_org_value2 && search_org_value2.value.firstvalue) {
					search_org_value2 = search_org_value2.value.firstvalue;
				} else {
					search_org_value2 = null;
				}
				let search_currtype_value2 = props.search.getSearchValByField(searchcode, 'pk_currtype');//所选买入币种
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

	//设置参照可以多选和是否清除记录
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchcode].items.find((e) => e.attrcode === 'transformoutaccount').showHistory = false;
	meta[searchcode].items.find((e) => e.attrcode === 'transforminaccount').showHistory = false;
	meta[searchcode].items.find((e)=>{
		if(e.attrcode === 'transformoutaccount'){

		}
	});
	//财务组织:全加载
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/