/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast, cardCache,excelImportconfig } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import buttonUsability from './buttonUsability';
import { buttonVisible } from './buttonVisible';
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
import { setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util/index';
import { cache } from '../../../../../tmpub/pub/cons/constant';
import { go2CardCheck } from "../../../../../tmpub/pub/util";

let { NCPopconfirm, NCIcon, NCTooltip } = base;
let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.list_pageid;
let appId = Templatedata.list_appid;
let oid = Templatedata.list_oid;
let querytype = Templatedata.list_querytype;
let list_inner = Templatedata.list_inner;
let inittemp_query = Templatedata.inittemp_query;
let printcard_funcode = Templatedata.printcard_funcode;
let appcode = Templatedata.app_code;
let cacheDataSource  = Templatedata.dataSource;
//缓存
let { setDefData, getDefData } = cardCache;
export default function (props) {
	let excelimportconfig = excelImportconfig(props, "cmp", '36S5',true,"",
	{"appcode":Templatedata.app_code,"pagecode":Templatedata.card_pageid});
	let self = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: appcode//小应用code
			// appid: appId//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(self, props);//按钮控制显隐性<凭证联查单据>
					});
					// props.button.setButtons(button);
					props.button.setPopContent('deleteinnerBtn', props.MutiInit.getIntl("36070FCE") && props.MutiInit.getIntl("36070FCE").get('36070FCE-000030') ); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('submitBtn', '确认要提交该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('unsubmitBtn', '确认要收回该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('settleBtn', '确认要结算该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('unsettleBtn', '确认要取消结算该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					props.button.setUploadConfig("ImportData", excelimportconfig);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self, props, meta)
					setDefOrg2AdvanceSrchArea(props, self.searchId, data);//高级查询区赋值
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, self.searchId, data);//普通查询区赋值
				}
				buttonUsability.call(self, props, '');//列表按钮显影性
			}
		}
	)
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		// item.visible = true;
		// item.col = '3';
		return item;
	})
	let self2 = this;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode === 'vbillno') {

			//begin lidyu 单击进入卡片 异常交互 
			cardCache.setDefData(cache.iserrtoast, cacheDataSource, true);
			//end 

			// item.width = 160;//模版修改table的宽度
			item.render = (text, record, index) => {
				return (
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => {
								let link_scene = props.getUrlParam('scene')==null?null:props.getUrlParam('scene');//是否联查过来的单据;
								let isvoucherlink = getDefData(this.linkkey, this.dataSource);//是否凭证联查单据
								if (isvoucherlink) {
									//tm begin lidyu 并发交互跳转卡片检查 20200311
									let ts = record.ts.value;
									go2CardCheck({
										props,
										url: Templatedata.gotocardcheck,
										pk: record.pk_cruexchange.value,
										ts: ts,
										checkTS: false,
										fieldPK: Templatedata.pkname,
										actionCode : null ,
										permissionCode: null ,
										go2CardFunc: () => {
											props.pushTo('/card', {
												status: 'browse',
												id: record.pk_cruexchange.value,
												pk: record.busistatus.value,
												scene:link_scene,
												fip: true//是否凭证联查标识
											});
								}
							})
							//tm end lidyu 并发交互跳转卡片检查 20200311 

								} else {
									let ts = record.ts.value;
									go2CardCheck({
										props,
										url: Templatedata.gotocardcheck,
										pk: record.pk_cruexchange.value,
										ts: ts,
										checkTS: false,
										fieldPK: Templatedata.pkname,
										actionCode : null ,
										permissionCode: null ,
										go2CardFunc: () => {
											props.pushTo('/card', {
												status: 'browse',
												id: record.pk_cruexchange.value,
												pk: record.busistatus.value,
		
											});
								}
							})
									
								}

							}}
						>
							{record && record.vbillno && record.vbillno.value}
						</a>
				);
			};
		}


		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000073'),/* 国际化处理： 操作*/
		width: '200px',
		fixed: 'right',
		visible: true,
		itemtype:'customer',
		render: (text, record, index) => {
			let buttonAry = [];
			if (record && record.busistatus && record.busistatus.value == 1) {
				/* 单据状态：已保存  */
				buttonAry = ["submitBtn", "editinnerBtn", "deleteinnerBtn"];
			} else if (record && record.busistatus && record.busistatus.value == 2) {
				/* 单据状态：待审批 */
				buttonAry = ["unsubmitBtn"];
			} else if (record.busistatus && record.busistatus.value == 3) {
				/* 单据状态：待办理 */
				buttonAry = ["settleBtn", "unsubmitBtn"];
			} else if (record.busistatus && record.busistatus.value == 4) {
				/* 单据状态：已完毕 */
				buttonAry = ["unsettleBtn", "makebillBtn"];
			}
			// 单据状态为待结算时 且为内部账户
			if(record.busistatus.value == 3 && record.isinner.value){
				buttonAry = ['unsubmitBtn','transferBtn'];
			}
			// 单据状态为待结算时 且结算状态为结算中 且为内部账户
			if(record.busistatus.value ==3 && record.settlestatus.value ==1 && record.isinner.value){
				buttonAry = ['unsubmitBtn','canceltransferBtn'];
			}
			// 单据状态为完结 且为内部账户
			if(record.busistatus.value == 4 && record.isinner.value){
				buttonAry = ['makebillBtn','canceltransferBtn'];
				let srcsystem = record.srcsystem;
				if(srcsystem && srcsystem.value){
					buttonAry = ['makebillBtn']; 
				}  
			}
			//如果是凭证联查单据的话去掉操作列按钮
			if (getDefData(this.linkkey, this.dataSource)) {
				buttonAry = [];
			}
			//begin tm lidyu 20191120 分布式异常交互改造
			// return props.button.createOprationButton(buttonAry, {
			// 	area: list_inner,
			// 	buttonLimit: 3,
			// 	onButtonClick: (props, key) => tableButtonClick.call(self2, props, key, text, record, index)
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
	meta[searchId].items.map((item) => {
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		//卖出账户
		if (item.attrcode === 'pk_sellacct') {

			item.queryCondition = () => {
				let search_org_value = props.search.getSearchValByField(searchId, 'pk_org');//所选组织
				if (search_org_value && search_org_value.value.firstvalue) {
					search_org_value = search_org_value.value.firstvalue;
				} else {
					search_org_value = null;
				}
				let search_sellcurr_value = props.search.getSearchValByField(searchId, 'pk_sellcurrtype');//所选卖出币种
				if (search_sellcurr_value && search_sellcurr_value.value.firstvalue) {
					search_sellcurr_value = search_sellcurr_value.value.firstvalue;
				} else {
					search_sellcurr_value = null;
				}

				return {
					pk_org: search_org_value,
					pk_currtype: search_sellcurr_value,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'//自定义增加的过滤条件
				};

			}
		}
		//买入账户
		if (item.attrcode === 'pk_buyacct') {

			item.queryCondition = () => {
				let search_org_value2 = props.search.getSearchValByField(searchId, 'pk_org');//所选组织
				if (search_org_value2 && search_org_value2.value.firstvalue) {
					search_org_value2 = search_org_value2.value.firstvalue;
				} else {
					search_org_value2 = null;
				}
				let search_buycurr_value = props.search.getSearchValByField(searchId, 'pk_buycurrtype');//所选买入币种
				if (search_buycurr_value && search_buycurr_value.value.firstvalue) {
					search_buycurr_value = search_buycurr_value.value.firstvalue;
				} else {
					search_buycurr_value = null;
				}

				return {
					pk_org: search_org_value2,
					pk_currtype: search_buycurr_value,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'//自定义增加的过滤条件
				};
			}
		}
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: printcard_funcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	//设置参照可以多选和是否清楚记录
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_buyacct').showHistory = false;
	meta[searchId].items.find((e) => e.attrcode === 'pk_sellacct').showHistory = false;
	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/