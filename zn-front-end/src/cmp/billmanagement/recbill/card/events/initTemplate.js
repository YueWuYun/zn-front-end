/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { viewModel } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { buttonVisable } from "./buttonVisable";//按钮显隐性
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
let formId = Templatedata.card_formid;
let tableId = Templatedata.card_tableid;
let edit_talbeId = Templatedata.card_edit_form;
let pageId = Templatedata.card_pageid;
export default function (props) {
	let that = this;
	if (props.getUrlParam('pagecode')) {
		pageId = props.getUrlParam('pagecode');
	}
	props.createUIDom(
		{
			pagecode: pageId//页面id
		},
		data => {
			if (data) {
				let status = props.getUrlParam('status');
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// props.button.setPopContent('deletelineBtn', '确认要删除这条信息吗？');
					// props.button.setPopContent('deletebodyBtn', '确认要删除这些信息吗？'); 
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(that, props, meta)
					props.meta.setMeta(meta, () => {
						orgVersionView(props, formId)//多版本视图显隐性
					});
					//默认组织赋值
					let context = data.context;
					if (context.pk_org) {
						that.setState({
							curr_pk_org: context.pk_org,
							curr_orgname: context.org_Name,
							curr_pk_org_v: context.pk_org_v,
							curr_orgname_v: context.org_v_Name,
						});
						that.org_value = context.pk_org;
						that.org_display = context.org_Name
					}
					//发布小应用默认交易类型赋值
					if (data.context && data.context.paramMap) {
						let { transtype, pk_transtype, transtype_name } = data.context.paramMap;
						if (transtype && pk_transtype && transtype_name) {
							//发布交易类型而来的小应用
							this.setState({
								isPublishTradeTypeApp:true
							});
							//若存储值是字符串，可以直接存储
							setGlobalStorage('sessionStorage', 'sessionTP', transtype);
							setGlobalStorage('sessionStorage', 'sessionName', transtype_name);
							setGlobalStorage('sessionStorage', 'billname', transtype_name);
							setGlobalStorage('sessionStorage', 'sessionpk', pk_transtype);
							
						} else {
							if (status == 'add') {
								//共享中心传递过来的数据
								let refpk = props.getUrlParam('refpk');
								let refname = props.getUrlParam('refname');
								let refcode = props.getUrlParam('pagecode');
								if (refpk && refname && refcode) {
									//若存储值是字符串，可以直接存储
									setGlobalStorage('sessionStorage', 'sessionTP', refcode);
									setGlobalStorage('sessionStorage', 'sessionName', refname);
									setGlobalStorage('sessionStorage', 'billname', refname);
									setGlobalStorage('sessionStorage', 'sessionpk', refpk);
								}
							}
						}

					}
					//如果是[关联结算信息]新增就不用处理
					if (props.getUrlParam('src')) {
						console.log('注意：', 'this request from linksettlement！');
					} else {
						//设置新增的时候除了组织之外其他的不可以编辑
						if (status == 'add') {
							props.form.setFormItemsVisible(formId, { 'pk_org_v': false });
							props.form.setFormItemsDisabled(formId, { 'pk_org': false });
							if (context.pk_org) {
								props.resMetaAfterPkorgEdit();
							} else {
								//单据没有主组织，新增时,将其他字段设置为不可编辑.
								props.resMetaAfterPkorgEdit();
								props.initMetaByPkorg();
							}
						}
						if (status == 'browse') {
							props.cardTable.setStatus(tableId, 'browse');
						} else {
							props.cardTable.setStatus(tableId, 'edit');
						}
					}
				}
				that.initData();//首次加载数据
				buttonVisable.call(that, props);//按钮显隐性
			}
		}
	)
}
//页面加载meta
function modifierMeta(props, meta) {
	let self = this;
	let status = props.getUrlParam('status');
	if (status === 'browse') {
		meta[formId].status = status;
		meta[tableId].status = status;
	} else {
		meta[formId].status = 'edit';
		meta[tableId].status = 'edit';
	}



	//组织权限
	meta[formId].items.map((item) => {

		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		// 发送发组织，接收方组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: Templatedata.app_code,

					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});
	// let multiLang = props.MutiInit.getIntl(moudleId);
	let porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000018'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			//操作列展开和收起适配
			let status = props.cardTable.getStatus(tableId);
			let buttonAry = status === "browse"
				? (record.expandRowStatus ? ["closeBtn"] : ["openBtn"])
				: (self.state.pasteflag ?
					["copythisBtn"] : ["editmoreBtn", "copylineBtn", "addlineBtn", "deletelineBtn"]);

			return props.button.createOprationButton(buttonAry, {
				area: Templatedata.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(self, props, key, text, record, index)
			});
		}
	};
	meta[tableId].items.push(porCol);
	//财务组织:全加载
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//zhanghjr_begin:1909支持网问题：单据上选择收支项目时，未选到最末级收支项目
	//收支项目:是否只有叶子节点可选
	meta[formId].items.find((e) => e.attrcode === 'pk_recproject').onlyLeafCanSelect = true;
	meta[tableId].items.find((e) => e.attrcode === 'pk_recproject').onlyLeafCanSelect = true;
	meta[edit_talbeId].items.find((e) => e.attrcode === 'pk_recproject').onlyLeafCanSelect = true;
	//资金计划项目：是否只有叶子节点可选
	meta[formId].items.find((e) => e.attrcode === 'bankroll_projet').onlyLeafCanSelect = true;
	meta[tableId].items.find((e) => e.attrcode === 'bankroll_projet').onlyLeafCanSelect = true;
	meta[edit_talbeId].items.find((e) => e.attrcode === 'bankroll_projet').onlyLeafCanSelect = true;
	//科目字段:是否只有叶子节点可选-->只能选到末级科目
	(meta[formId].items.find((e) => e.attrcode === 'pk_subjct') || {}).onlyLeafCanSelect = true;
	(meta[tableId].items.find((e) => e.attrcode === 'pk_subjct') || {}).onlyLeafCanSelect = true;
	(meta[edit_talbeId].items.find((e) => e.attrcode === 'pk_subjct') || {}).onlyLeafCanSelect = true;
	//zhanghjr_end
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/