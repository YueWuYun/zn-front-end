/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { buttonVisable } from "./buttonVisable";//按钮显隐性
import { orgVersionUtil } from "../../util/orgVersionUtil";//多版本显示
/**
 * 模版配置参数
 */
let formId = Templatedata.card_formid;
let tableId = Templatedata.card_tableid;
let pageId = Templatedata.release_card_pageid;//认领pagecode
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
					//设置新增的时候除了组织之外其他的不可以编辑
					if (props.getUrlParam('status') == 'add') {
						props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑. 
					}
					self.init();//加载数据
				}
				//修改页面状态
				togglePageShow.call(self, props);

			}
		}
	)
}

//根据页面状态，修改编辑态表格
function togglePageShow(props) {
	orgVersionUtil.call(this, this.props, this.formId);//多版本视图显隐性
	buttonVisable.call(this, props);//按钮显隐性
}

function modifierMeta(props, meta) {
	
	let self = this;
	let status = self.state.tranferstatus;
	if (status === 'browse') {
		meta[formId].status = status;
		meta[tableId].status = status;
	} else {
		meta[formId].status = 'edit';
		meta[tableId].status = 'edit';
	}
	//参照过滤
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
	//表体中操作列按钮显示
	let porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000018'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let status = props.cardTable.getStatus(tableId);
			let buttonAry =
				status === "browse"
					? (record.expandRowStatus ? ["closeBtn"] : ["openBtn"])
					: ["editmoreBtn", "deletelineBtn"];
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
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/