/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { base, ajax } from 'nc-lightapp-front';
import initButton from './initButton';
import {
	app_id, module_id, base_url, button_limit, oid, appcode,
	list_page_id, list_search_id, list_table_id,
	card_page_id, card_from_id, card_fromtail_id
} from '../../cons/constant.js';
import { afterEvent } from './index';

let { NCPopconfirm } = base;
const { NCMessage } = base;

//begin tm tangleic 20200219 修改保存新增逻辑，卡片新增时注入组织参数
// export default function(props) {
export default function (props, param) {
	//end tm tangleic
	let that = this;
	props.createUIDom(
		{
			//页面id
			pagecode: card_page_id,
			//注册按钮的id
			// appid: app_id,
		},
		function (data) {
			if (data) {
				let status = props.getUrlParam('status');
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta)
					// 初始化字段 编辑性及字段赋值
					props.meta.setMeta(meta);
					if (status === 'add') {
						//单据有主组织，新增时,将其他字段设置为不可编辑.
						props.initMetaByPkorg();
						let metaFromData = meta[card_from_id];
						metaFromData.items.forEach((val) => {
							if (val.attrcode === 'pk_org') {
								val.visible = true;
								val.disabled = false;
								return;
							} else {
								// val.disabled = true;
							}
						});
					} else {
						let metaFromData = meta[card_from_id];
						metaFromData.items.forEach((val) => {
							if (val.attrcode === 'pk_org') {
								val.visible = true;
								val.disabled = true;
								return;
							}
						});
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					initButton(props);
				}
				//begin tm tangleic 20200219 保存新增修改
				// if (data.context) {
				if ((param && param.pk_org) || data.context) {
					//end tm tangleic 
					let context = data.context;
					//begin tm tangleic 20200219 保存新增修改
					// that.setState({
					// 	curr_pk_org: context.pk_org,
					// 	curr_orgname: context.org_Name,
					// 	curr_pk_org_v: context.pk_org_v,
					// 	curr_orgname_v: context.org_v_Name,
					// });
					let pk_org = (param && param.pk_org) ? param.pk_org.value : context.pk_org;
					let pk_org_v = (param && param.pk_org_v) ? param.pk_org_v.value : context.pk_org_v;
					let pk_org_name = (param && param.pk_org) ? param.pk_org.display : context.org_Name;
					let pk_org_v_name = (param && param.pk_org_v) ? param.pk_org_v.display : context.org_v_Name;
					let newState = {
						curr_pk_org: pk_org,
						curr_orgname: pk_org_name,
						curr_pk_org_v: pk_org_v,
						curr_orgname_v: pk_org_v_name,
					};
					that.setState(newState);
					//end tm tangleic 
					if (status === 'add') {
						//begin tm tangleic 20200219 保存新增修改
						// that.props.form.setFormItemsValue(card_from_id,
						// 	{
						// 		'pk_org': {
						// 			value: context.pk_org,
						// 			display: context.org_Name
						// 		},
						// 		'pk_org_v': {
						// 			value: that.state.curr_pk_org_v,
						// 			display: that.state.curr_orgname_v
						// 		}
						// 	}
						// );
						that.props.form.setFormItemsValue(card_from_id,
							{
								'pk_org': {
									value: pk_org,
									display: pk_org_name
								},
								'pk_org_v': {
									value: pk_org_v,
									display: pk_org_v_name
								}
							}
						);
						//begin tm tangleic 20200219 重构保存新增功能
						// if (context.pk_org) {
						// let pk_org = {
						// 	value: context.pk_org,
						// 	display: context.org_Name
						// };
						// afterEvent.call(that, that.props, card_from_id, "pk_org", pk_org, null, null, true);
						if ((param && param.pk_org) || data.context) {
							afterEvent.call(that, that.props, card_from_id, "pk_org", { value: pk_org, display: pk_org_name }, null, null, true);
							//end tm tangleic
							that.props.resMetaAfterPkorgEdit();
							// that.props.form.setFormItemsDisabled(card_from_id, { 'pk_org': false });
						}
					}
				}
				that.toggleShow();
			}
		}
	)
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[card_from_id].status = status;

	meta[card_from_id].items.map((item) => {
		item.isShowDisabledData = true;
		// 开户单位过滤
		if (item.attrcode == 'pk_ownerorg') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				// 调用相应组件的取值API
				let pk_ownerorg_org = props.form.getFormItemsValue(card_from_id, 'pk_org');
				let pk_group = props.form.getFormItemsValue(card_from_id, 'pk_group');
				return {
					pk_org: pk_group && pk_group.value,
					pk_financeorg: pk_ownerorg_org && pk_ownerorg_org.value,
					funcode: props.getSearchParam('c'),
					isShowDisabledData: 'N',
					//自定义增加的过滤条件  根据pk_org过滤
					// TreeRefActionExt: 'nccloud.web.tmpub.tmbd.accid.filter.OwnerOrgFilter4NCC,nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
					TreeRefActionExt: 'nccloud.web.tmpub.tmbd.accid.filter.OwnerOrgFilter4NCC'
				};
			};
		}
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}
	});

	return meta;
}

// 初始化字段 编辑性及字段赋值
function initFormFiled(props) {
	let status = props.getUrlParam('status');
	if (status === 'add') {
		//默认新增添加默认值财务组织
		// 设置编辑性
		// 单据类型
		props.form.setFormItemsValue(card_from_id, { 'billtype': { value: '36B1' } });
	}
	//查询单据详情[编辑卡片]
	if (status === 'edit') {
		//后台grid只接受pageid。
		let data = { pk: props.getUrlParam('id') };
		ajax({
			url: '/nccloud/tmpub/tmbd/accidquerycard.do',
			data: data,
			success: (res) => {
				//获取后台返回data				
				if (res && res.data) {
					props.form.setAllFormValue({ [card_from_id]: res.data[list_table_id] });

					props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true });
					initButton(props);
				} else {
					props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
				}
			}
		});
	}
	//复制单据详情[复制]
	if (status === 'copy') {
		//后台grid只接受pageid。
		let data = { pk: props.getUrlParam('id') };
		ajax({
			url: '/nccloud/tmpub/tmbd/accidcopy.do',
			data: data,
			success: (res) => {
				//获取后台返回data				
				//获取后台返回data				
				if (res && res.data) {
					props.form.setAllFormValue({ [card_from_id]: res.data[list_table_id] });

					props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true });
					initButton(props);
					// 编辑性
					if (res.data[list_table_id] && res.data[list_table_id].rows && res.data[list_table_id].rows[0]
						&& res.data[list_table_id].rows[0].values) {
						if (res.data[list_table_id].rows[0].values.pk_org) {
							// 防止变更后编辑项被修改，重置一下新增的编辑项。
							let editFiled = {
								'acctype': false, 'accidcode': false, 'accidname': false,
								'pk_ownerorg': false, 'accopendate': false, 'pk_currtype': false,
								'arapprop': false, 'accstartupdate': false, 'yearbeginymny': false,
								'incomeymny': false, 'outymny': false
							};
							props.form.setFormItemsDisabled(card_from_id, editFiled);
						}
						let acctype = res.data[list_table_id].rows[0].values.acctype;
						if (acctype && acctype.value != 1 && acctype.value != 0) {
							props.form.setFormItemsDisabled(card_from_id, { 'overdraftmny': true, 'istrade': true });
						}
						// 触发币种，账户类型 编辑后事件

					}
				} else {
					props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
				}
			}
		});
	}
	//查询单据详情[浏览卡片]
	if (status === 'browse') {
		//后台grid只接受pageid。
		let data = { pk: props.getUrlParam('id') };
		ajax({
			url: '/nccloud/tmpub/tmbd/accidquerycard.do',
			data: data,
			success: (res) => {
				//data要看返回的id，而不是后台设置的id
				//获取后台返回data				
				if (res && res.data) {
					props.form.setAllFormValue({ [card_from_id]: res.data[list_table_id] });
					initButton(props);
				} else {
					props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
				}
			}
		});
	}
	//查询单据详情[变更]
	if (status === 'change') {
		//后台grid只接受pageid。
		let data = { pk: props.getUrlParam('id') };
		ajax({
			url: '/nccloud/tmpub/tmbd/accidchange.do',
			data: data,
			success: (res) => {
				//获取后台返回data				
				if (res && res.data) {
					props.form.setAllFormValue({ [card_from_id]: res.data[list_table_id] });
					props.form.setFormItemsDisabled(card_from_id, { 'pk_org': true });
					initButton(props);
					// 编辑性
					if (res.data[list_table_id] && res.data[list_table_id].rows && res.data[list_table_id].rows[0]
						&& res.data[list_table_id].rows[0].values) {
						// 条件 2 账户类型 0=活期，1=协定，2=定期，3=通知，4=贷款，7=票据，
						let acctype = res.data[list_table_id].rows[0].values.acctype;
						// 条件 2-1 账户类型为 协定、活期 收支属性、是否默认、透支 可编辑 ；
						//  其中 协定的"协定金额"也可编辑
						if (acctype == 0) {
							// 取消掉可以编辑控制，wyd默认为不可编辑 OVERDRAFTTYPE
							// 增加活期协定账户的互转
							let editFiled = {
								'arapprop': false, 'isaccounting': false, 'istrade': false,
								'overdraftmny': false, 'acctype': false
							};
							props.form.setFormItemsDisabled(card_from_id, editFiled);
						} else if (acctype == 1) {
							let editFiled = {
								'arapprop': false, 'isaccounting': false, 'istrade': false,
								'overdraftmny': false, 'acctype': false
							};
							props.form.setFormItemsDisabled(card_from_id, editFiled);
						} else {
							let editFiled = {
								'arapprop': true, 'isaccounting': true,
								'overdraftmny': true, 'overdrafttype': true
							};
							props.form.setFormItemsDisabled('card_from_id', editFiled);
							// 同时 清空 收支属性
							props.form.setFormItemsValue(card_from_id, { 'arapprop': { value: null } });
						}

						if (acctype != 1 && acctype != 0) {
							props.form.setFormItemsDisabled(card_from_id, { 'istrade': true });
						}
						// 触发币种 编辑后事件

					}
				} else {
					props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
				}
			}
		});
	}

	if (status === 'copy' || status === 'change') {
		status = 'edit';
	}
	props.form.setFormStatus(card_from_id, status);
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/