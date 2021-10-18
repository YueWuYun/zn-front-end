/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { buttonVisable } from "./buttonVisable";//按钮显隐性
let formId = Templatedata.card_formid;
let tableId = Templatedata.card_tableid;
let pageId = Templatedata.card_pageid;
export default function (props) {
	let self = this;
	if (props.getUrlParam('pagecode')) {
		pageId = props.getUrlParam('pagecode');
	}
	props.createUIDom(
		{
			pagecode: pageId//页面id
		},
		function (data) {
			if (data) {
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
					self.refresh();
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				//修改页面状态
				togglePageShow.call(self, props);

			}
		}
	)
}
//根据页面状态，修改编辑态表格
function togglePageShow(props) {
	buttonVisable.call(this, props);//按钮显隐性
}
function modifierMeta(props, meta) {
	let self = this;
	let status = props.getUrlParam("status");
	if (status === 'browse') {
		meta[formId].status = status;
		meta[tableId].status = status;
	} else {
		status ='browse';
		meta[formId].status = status;
		meta[tableId].status = status;
	}
	let porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000017'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			
			let buttonAry =
				status === "browse"
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
	meta[tableId].items.push(porCol);
	//财务组织:全加载
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/