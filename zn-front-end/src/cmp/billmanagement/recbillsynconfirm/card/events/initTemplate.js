/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { buttonVisable } from "./buttonVisable";//按钮显隐性
import { orgVersionUtil } from "../../util/orgVersionUtil";//多版本显示
const formId = Templatedata.card_formid;
const tableId = Templatedata.card_tableid;
const pageId = Templatedata.card_pageid;
let printcard_funcode = Templatedata.printcard_funcode;
export default function (props) {
	let self = this;
	props.createUIDom(
		{
			pagecode: pageId//页面id
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(self, props, meta)
					props.meta.setMeta(meta);
					if (props.getUrlParam('status') == 'browse') {
						props.cardTable.setStatus(tableId, 'browse');
					} else {
						props.cardTable.setStatus(tableId, 'edit');
					}
				}
				self.refresh();//首次加载数据
				togglePageShow.call(self, props);//修改页面状态

			}
		}
	)
}
//根据页面状态，修改编辑态表格
function togglePageShow(props) {
	orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
	buttonVisable.call(this, props);//按钮的显隐性
}
function modifierMeta(props, meta) {
	let self = this;
	let status = props.getUrlParam('status');
	if (status === 'copy') {
		meta[formId].status = 'edit';
		meta[tableId].status = 'edit';
	} else {
		meta[formId].status = status;
		meta[tableId].status = status;
	}
	let porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000016'),/* 国际化处理： 操作*/
		fixed: 'right',//固定操作列
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			//展开和收起使用
			let status = props.cardTable.getStatus(tableId);
			let buttonAry =
				props.getUrlParam("status") === "browse"
					? (record.expandRowStatus ? ["closeBtn"] : ["openBtn"])
					: (self.state.pasteflag ?
						["copythisBtn"] : ['editmoreBtn', "copylineBtn", "addlineBtn", "deletelineBtn"]);
			return props.button.createOprationButton(buttonAry, {
				area: Templatedata.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(self, props, key, text, record, index)
			});

		}
	};
	//组织用户权限过滤
	meta[formId].items.map((item) => {
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
	//财务组织:全加载
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/