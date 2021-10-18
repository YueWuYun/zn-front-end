/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { cardCache, excelImportconfig, viewModel } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import buttonUsability from './buttonUsability';
import { buttonVisible } from './buttonVisible';//凭证联查单据使用按钮控制
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { setDefOrg2AdvanceSrchArea ,showPagination } from '../../../../../tmpub/pub/util/index';
import { setDefOrg2ListSrchArea, go2CardCheck } from '../../../../../tmpub/pub/util/index';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.list_pageid;
let printcard_funcode = Templatedata.printcard_funcode;
let { getDefData, setDefData } = cardCache;
import appBase from "../../base";
const { cons, api } = appBase;
export default function (props) {
	let self = this;
	let excelimportconfig = excelImportconfig(props, "cmp", 'F4', true, "", { "appcode": Templatedata.app_code, "pagecode": Templatedata.card_pageid });
	props.createUIDom(
		{
			pagecode: pageId//页面id
		},
		data => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(self, props);//按钮控制显隐性
					});
					// props.button.setButtons(button);
					props.button.setPopContent('deletetableBtn', props.MutiInit.getIntl("36070RBM") && props.MutiInit.getIntl("36070RBM").get('36070RBM-000101')); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('submittableBtn', '确认要提交该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('makebilltableBtn', '确认要该信息制单吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					// props.button.setPopContent('unsubmittableBtn', '确认要收回该信息吗？'); /* 设置操作列上删除按钮的弹窗提示 */
					props.button.setUploadConfig("ImportData", excelimportconfig);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self, props, meta);
					showPagination(props,self.tableId,data);
					setDefOrg2AdvanceSrchArea(props, self.searchId, data);//高级查询区赋值
					setAdvTradetype.call(self, props, self.searchId, data);//高级查询区赋值
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, self.searchId, data);//普通查询区赋值


					//默认交易类型查询赋值
					// setDefTradetypeSrchArea(props, self.searchId, data, meta);//普通查询区赋值
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
//高级查询区赋值交易类型
function setAdvTradetype(props, areaCode, data) {
	//判空
	if (!props || !props.search || !areaCode || !data.template || !data.context) {
		return;
	}
	let meta = data.template;
	//获取默认业务单元
	//发布小应用默认交易类型赋值
	if (data.context && data.context.paramMap) {
		let { transtype, pk_transtype, transtype_name } = data.context.paramMap;
		if (transtype && pk_transtype && transtype_name) {
			//遍历查询区域字段 发布小应用给交易类型赋值
			meta[areaCode].items.map((item) => {
				if (item.attrcode == 'pk_tradetypeid') {
					item.visible = true;
					item.initialvalue = { 'display': transtype_name, 'value': pk_transtype }
				}
			});
			this.setState({ tpflag: false });
			//若存储值是字符串，可以直接存储
			setGlobalStorage('sessionStorage', 'sessionTP', transtype);
			setGlobalStorage('sessionStorage', 'sessionName', transtype_name);
			setGlobalStorage('sessionStorage', 'billname', transtype_name);//发布而来的小应用采用这种名称转换
			setGlobalStorage('sessionStorage', 'sessionpk', pk_transtype);
			console.log('transtype:', getGlobalStorage('sessionStorage', 'sessionTP'));
			console.log('transtype_name:', getGlobalStorage('sessionStorage', 'sessionName'));
			console.log('billname:', getGlobalStorage('sessionStorage', 'billname'));
			console.log('pk_transtype:', getGlobalStorage('sessionStorage', 'sessionpk'));
		}

	}

}
/**
 * 给列表查询区域赋默认业务单元(在setMeta之后使用)
 * @param {*} props 页面内置对象
 * @param {*} areaCode 列表查询区域编码
 * @param {*} data  createUIDom请求返回数据
 */
function setDefTradetypeSrchArea(props, areaCode, data, meta) {
	//判空
	if (!props || !props.search || !areaCode || !data.context || !data.context.paramMap) {
		return;
	}
	//获取默认单元
	let { transtype, pk_transtype, transtype_name } = data.context.paramMap;
	console.log('trade_name:', transtype);
	console.log('trade_pk:', pk_transtype);
	if (pk_transtype && transtype) {
		//列表查询区赋值<交易类型>
		meta[areaCode].items.map((item) => {
			if (item && item.attrcode == 'pk_tradetypeid') {
				item.visible = true;
				item.initialvalue = { 'display': transtype_name, 'value': pk_transtype }
			}
		});
	}
}
function modifierMeta(props, meta) {

	
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		// item.visible = true;
		// item.col = '11';
		return item;
	})
	let self2 = this;
	//操作列点击事件
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;
		//单据编号
		if (item.attrcode == 'bill_no') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							let isvoucherlink = getDefData(this.linkkey, this.dataSource);//是否凭证联查单据
							let isotherlink = getDefData(this.linkscekey, this.dataSource);//是否来自其他单据联查
							//弹异常提示
							cardCache.setDefData(cons.comm.iserrtoast, cons.comm.dataSource, true);

							if (isvoucherlink || isotherlink) {
								//凭证联查收款结算页面或者其他单据联查此单据
								//2004-zhanghjr:列表跳卡片并发适配
								go2CardCheck({
									props,
									url: '/nccloud/cmp/recbill/gotocardcheck.do',
									pk: record.pk_recbill.value,
									ts: record.ts.value,
									checkTS: false,
									checkSaga: false,
									fieldPK: 'pk_recbill',
									go2CardFunc: () => {
										props.pushTo('/card', {
											status: 'browse',
											id: record.pk_recbill.value,
											billno: record.bill_status.value,
											pagecode: record.trade_type.value,
											scene: 'linksce',//来自列表的查询
											src: 'list'//来自列表可以显示返回箭头
										});
									}
								});

							} else {
								//2004-zhanghjr:列表跳卡片并发适配
								go2CardCheck({
									props,
									url: '/nccloud/cmp/recbill/gotocardcheck.do',
									pk: record.pk_recbill.value,
									ts: record.ts.value,
									checkTS: false,
									checkSaga: false,
									fieldPK: 'pk_recbill',
									go2CardFunc: () => {
										props.pushTo('/card', {
											status: 'browse',
											id: record.pk_recbill.value,
											billno: record.bill_status.value,
											pagecode: record.trade_type.value
										});
									}
								});
								
							}

						}}
					>
						{record && record.bill_no && record.bill_no.value}
					</a>
				);
			};
		}
		else if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return (
					<span>
						{record.dbilldate && seperateDate(record.dbilldate.value)}
					</span>
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000018'),/* 国际化处理： 操作*/
		fixed: 'right',
		width: '200px',
		visible: true,
		itemtype: 'customer',
		render: (text, record, index) => {

			let buttonAry = [];

			if (record && record.bill_status && record.bill_status.value == '-10') {
				/* 单据状态：已保存  */
				buttonAry = ["submittableBtn", "edittableBtn", "deletetableBtn"];
			} else if (record && record.bill_status && record.bill_status.value == '-99') {
				/* 单据状态：暂存 */
				buttonAry = ["edittableBtn", "deletetableBtn"];
			} else if (record.bill_status && record.bill_status.value == '8') {
				/* 单据状态：签字 */
				buttonAry = ["makebilltableBtn"];
			} else if (record.bill_status && record.bill_status.value == '-1') {
				/* 单据状态：待审批 */
				buttonAry = ["unsubmittableBtn"];
			} else if (record.bill_status && record.bill_status.value == '1') {
				/* 单据状态：审批通过:针对没有审批流直接退回 */
				buttonAry = ["unsubmittableBtn"];
			}
			//生效状态:0-未生效，10-生效，5-未生成凭证
			if (record && record.effect_flag && record.effect_flag.value == '10') {
				buttonAry.push('redbillBtn');//红冲
			}
			//如果是凭证联查单据的话去掉操作列按钮
			if (getDefData(this.linkkey, this.dataSource)) {
				buttonAry = [];
			}
			//如果是被联查单据，不显示操作列按钮
			if (getDefData(this.linkscekey, this.dataSource)) {
				buttonAry = [];
			}
			//begin tm zhanghe 20191120 支持分布式事务异常交互			
			// return props.button.createOprationButton(buttonAry, {
			// 	area: Templatedata.list_inner,
			// 	buttonLimit: 3,
			// 	onButtonClick: (props, key) => tableButtonClick.call(self2, props, key, text, record, index)
			// });
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry, {
						area: Templatedata.list_inner,
						buttonLimit: 3,
						onButtonClick: (props, key) => tableButtonClick.call(self2, props, key, text, record, index)
					});
				}
			}));
			//end

		}
	});
	//组织用户权限过滤
	meta[searchId].items.map((item) => {
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: printcard_funcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		//收款银行账户(子表)
		if (item.attrcode == 'items.pk_account') {
			item.queryCondition = () => {
				let search_org_value2 = props.search.getSearchValByField(searchId, 'pk_org');//所选组织
				if (search_org_value2 && search_org_value2.value.firstvalue) {
					search_org_value2 = search_org_value2.value.firstvalue;
				} else {
					search_org_value2 = null;
				}
				let search_buycurr_value = props.search.getSearchValByField(searchId, 'items.pk_currtype');//所选买入币种
				if (search_buycurr_value && search_buycurr_value.value.firstvalue) {
					search_buycurr_value = search_buycurr_value.value.firstvalue;
				} else {
					search_buycurr_value = null;
				}

				return {
					pk_orgs: search_org_value2,
					pk_currtype: search_buycurr_value,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			}
		}

	});
	//设置参照可以多选
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/