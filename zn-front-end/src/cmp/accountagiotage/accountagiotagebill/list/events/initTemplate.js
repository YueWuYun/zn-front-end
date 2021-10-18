/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast, cardCache} from 'nc-lightapp-front';
import { constant, requesturl, buttonDisable }  from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { buttonVisible } from './buttonVisible';
import { voucherLinkBill } from './voucherLinkBill';
import { cache } from '../../../../../tmpub/pub/cons/constant';
import { go2CardCheck } from "../../../../../tmpub/pub/util";
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea} from '../../../../../tmpub/pub/util/index';
let {setDefData, getDefData } = cardCache;
let searchcode = constant.searchcode;
let ltablecode = constant.ltablecode;
let cacheDataSource = constant.cacheDataSource;
// import {
//     setDefOrg2ListSrchArea,
//     setDefOrg2AdvanceSrchArea
// } from "src/tmpub/pub/util/index";

export default function(props) {
	props.createUIDom(
		{
			pagecode: constant.lpagecode,
			appcode: props.getUrlParam('c')
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;

					//联查场景标志
					let src = props.getUrlParam('scene');
					meta = modifierMeta.call(this, props, meta);
					setDefOrg2AdvanceSrchArea(props, searchcode, data);
					props.meta.setMeta(meta);
					// 给列表查询区域赋默认业务单元(在setMeta之后使用)
				   setDefOrg2ListSrchArea(props, searchcode, data);
				   if ('fip' == src ) {
					initData.call(this, props);
				}
						
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					// if(props.getUrlParam('resource') != 'card'){
					// 	props.button.setButtonDisabled(buttonDisable.listdisable, true);
					// }
					// props.button.setButtonDisabled(buttonDisable.listdisable, true);
				}
			}
		}
	);
}

function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		setDefData(constant.fipscene_key, constant.cacheDataSource, true);
		voucherLinkBill.call(this, this.props, constant.lpagecode, constant.ltablecode);
	} 
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {

	meta[ltablecode].pagination = true;
	// meta[searchcode].items = meta[searchcode].items.map((item, key) => {
	// 	// item.visible = true;
	// 	// item.col = '3';
	// 	return item;
	// });

	meta[constant.ltablecode].items = meta[constant.ltablecode].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode == 'vbillno') {

			item.render = (text, record, index) => {
                if(record && record.vbillno && record.vbillno.value){
                    return (
                        // <NCTooltip placement="top">
                            <a
                                style={{ cursor: "pointer" }}
                                onClick={() => {
									//tm begin lidyu 并发交互跳转卡片检查 20200311
									let ts = record.ts.value;
									go2CardCheck({
										props,
										url: requesturl.gotocardcheck,
										pk: record.pk_accountagiotage.value,
										ts: ts,
										checkTS: false,
										fieldPK: constant.pkname,
										actionCode : null ,
										permissionCode: null ,
										go2CardFunc: () => {
											//联查场景标志
											let src = props.getUrlParam('scene');
											  if(src){
											   this.props.pushTo('/card', {
												   status: 'browse',
												   id: record.pk_accountagiotage.value
											   });
											  }
											  else{
											props.pushTo("/card", {
												status: "browse",
												id: record.pk_accountagiotage.value,
												pagecode: constant.lpagecode
											});
										}
								}
							})
							//tm end lidyu 并发交互跳转卡片检查 20200311        
                                }}
                            >
                            {record && record.vbillno && record.vbillno.value}
                            </a>
                        // </NCTooltip>
                    );
                }else{
                    return (
                        // <NCTooltip placement="top">
                            <a
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    props.pushTo("/card", {
                                        status: "browse",
                                        id: record.pk_accountagiotage.value,
                                        pagecode: constant.lpagecode
                                    });
                                }}
                            >
                            {'------'}
                            </a>
                        // </NCTooltip>
                    );
                }               
            };
		} else if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return <span>{record.dbilldate && seperateDate(record.dbilldate.value)}</span>;
			};
		} else if (item.attrcode == 'doperatedate') {// 制单日期
			item.render = (text, record, index) => {
				return <span>{record.doperatedate && seperateDate(record.doperatedate.value)}</span>;
			};
		}
		return item;
	});
	//参展过滤
	meta[searchcode].items.map((item) => {

		item.isShowDisabledData = true;

		// 现金账户
		if (item.attrcode === 'pk_cashaccount') {
			item.queryCondition = () => {
				let orgpk,currency
				if(props.search.getSearchValByField(searchcode, 'pk_org')){
					orgpk = props.search.getSearchValByField(searchcode, 'pk_org').value.firstvalue;
				}
				if(props.search.getSearchValByField(searchcode, 'pk_curr')){
					currency = props.search.getSearchValByField(searchcode, 'pk_curr').value.firstvalue;
				}
				return { 
					pk_org: orgpk, 
					pk_currtype: currency,
					refnodename: commondata.refnodename,
					isDisableDataShow:false,//默认只加载启用的账户
                    noConditionOrg:'N',
					GridRefActionExt: commondata.cashaccountref // 'nccloud.web.cmp.ref.CMPCashAccountDefaultBuilder'//自定义增加的过滤条件-现金账户
				};
			};
		}

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
				let search_currency_value = props.search.getSearchValByField(searchcode, 'pk_curr');//所选买入币种
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

		if (item.attrcode === 'dbilldate') {

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