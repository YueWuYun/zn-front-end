/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { orgVersionUtil } from "../../util/orgVersionUtil";//多版本显示
// 先引入参照，进行表格参照过滤
const tableId = Templatedata.card_tableid;
const formId = Templatedata.card_formid;
const pageId = Templatedata.link_card_pageid;
import appBase from "../../base";
const { cons, api } = appBase;

export default function (props) {
	let seft = this;
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
					modifierMeta.call(seft, props, meta)
					props.meta.setMeta(meta);
				}
				//修改页面状态
				togglePageShow.call(seft, props);

			}
		}
	)
}

//根据页面状态，修改编辑态表格
function togglePageShow(props) {

	let status = props.getUrlParam('status');
	let billstatus = props.getUrlParam('billno');//获取单据状态
	orgVersionUtil.call(this, this.props, this.formId)//多版本视图显隐性
	//控制重试按钮显示情况
    api.comm.showErrBtn(props, { 
        headBtnCode: cons.card.btnHeadCode,
        headAreaCode: cons.card.headCode ,
        fieldPK: cons.field.pk,
        datasource: cons.comm.dataSource
    });
	if (status != 'browse') {
		//新增or修改or复制：保存，保存提交，保存新增，取消，附件
		props.button.setButtonVisible(['addBtn', 'editBtn', 'deleteBtn'
			, 'copyBtn', 'subimtBtn', 'unsubmitBtn', 'rectradetypeBtn', 'linksettleBtn'
			, 'imagegroup', 'moreoperateBtn', 'printgroup', 'annexgroup',
			, 'editBtn', 'subimtBtn', 'unsubmitBtn', ''], false);
		//保存，保存提交，保存新增，取消，附件
		props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
			, 'cancelBtn', 'annexBtn', 'moreoperateBtn', 'annexgroup', 'printgroup', 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn', 'openBtn',
			'copylineBtn', 'addlineBtn', 'deletelineBtn', 'editmoreBtn'], true);
	} else {
		//浏览态状态过滤	
		if (billstatus && billstatus === '-1') {
			//待审批
			props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
				, 'addbodyBtn', 'deletebodyBtn'
				, 'copybodyBtn'], false);
			//新增，复制，收款交易类型，关联结算信息，收回，影像，更多
			props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
				, 'unsubmitBtn', 'imagegroup', 'moreoperateBtn'], true);

		} else if (billstatus && billstatus === '-99') {
			//暂存态
			props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'subimtBtn', 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
				, 'unsubmitBtn'], false);
			//新增，复制，收款交易类型，关联结算信，影像，更多	
			props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
				, 'imagegroup', 'moreoperateBtn'], true);
		} else if (billstatus && billstatus === '8') {
			//签字态
			props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
				, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
				, 'unsubmitBtn'], false);
			//新增，复制，收款交易类型，关联结算信，影像，更多	
			props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
				, 'imagegroup', 'moreoperateBtn'], true);
		} else if (billstatus && billstatus === '1') {
			//审批通过
			props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
				, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
				, 'unsubmitBtn'], false);
			//新增，复制，收款交易类型，关联结算信，影像，更多	
			props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
				, 'imagegroup', 'moreoperateBtn'], true);
		} else if (billstatus && billstatus === '2') {
			//审批中
			props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
				, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
				, 'unsubmitBtn'], false);
			//新增，复制，收款交易类型，关联结算信，影像，更多	
			props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
				, 'imagegroup', 'moreoperateBtn'], true);
		} else if (billstatus && billstatus === '0') {
			//审批失败
			props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'subimtBtn', 'deleteBtn'
				, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
				, 'unsubmitBtn'], false);
			//新增，修改，复制，收款交易类型，关联结算信，影像，更多	
			props.button.setButtonVisible(['addBtn', 'copyBtn', 'editBtn', 'rectradetypeBtn'
				, 'imagegroup', 'moreoperateBtn'], true);
		} else if (billstatus && billstatus === '9') {
			//未确认
			props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'subimtBtn', 'editBtn', 'deleteBtn'
				, 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
				, 'unsubmitBtn'], false);
			//新增，复制，收款交易类型，关联结算信，影像，更多	
			props.button.setButtonVisible(['addBtn', 'copyBtn', 'rectradetypeBtn'
				, 'imagegroup', 'moreoperateBtn'], true);
		} else if (billstatus && billstatus === '-10') {
			//保存态
			props.button.setButtonVisible(['saveBtn', 'savesubmitBtn', 'saveaddBtn'
				, 'cancelBtn', 'annexBtn', 'addbodyBtn', 'deletebodyBtn', 'copybodyBtn'
				, 'unsubmitBtn'], false);
			//新增，修改，删除复制，收款交易类型，关联结算信息，收回，影像，更多
			props.button.setButtonVisible(['addBtn', , 'editBtn', 'deleteBtn', 'copyBtn', 'rectradetypeBtn'
				, 'subimtBtn', 'imagegroup', 'moreoperateBtn'], true);
		}

	}
}

function modifierMeta(props, meta) {
	let self = this;
	let status = props.getUrlParam("status");
	if (status === 'browse') {
		meta[formId].status = status;
		meta[tableId].status = status;
	} else {
		status = 'browse';
		meta[formId].status = status;
		meta[tableId].status = status;
	}
	let porCol = {
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000018'),/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render(text, record, index) {
			let buttonAry =
				props.getUrlParam("status") === "browse"
					? (record.expandRowStatus ? ["closeBtn"] : ["openBtn"])
					: ['editmoreBtn', "copylineBtn", "deletelineBtn"];
			return props.button.createOprationButton(buttonAry, {
				area: Templatedata.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(self, props, key, text, record, index)
			});
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/