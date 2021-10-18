/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
let { NCPopconfirm } = base;

const pageId = constant.approve_card_pagecode;
const formId = constant.formcode1;
const formId2 = constant.formcode2;
const formId3 = constant.formcode3;
const formId4 = constant.formcode4;
export default function(props) {
	props.createUIDom(
		{
			pagecode: pageId, //页面id
			appid: constant.appregisterpk //注册按钮的id
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						// buttonVisible(props);
					});
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;

	meta[formId].items.map((item) => {
		if (item.attrcode == 'pk_org_v') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(formId, 'vbillcode').value;
				return { vbillcode: data };
			};
		}
	});
	let multiLang = props.MutiInit.getIntl('2052');
	let porCol = {
		attrcode: 'opr',
		label: multiLang && multiLang.get('20521030-0005'),
		visible: true,
		width: 200,
		render(text, record, index) {
			let status = props.cardTable.getStatus(formId);
			return status === 'browse' ? (
				<span
					onClick={() => {
						props.cardTable.toggleRowView(formId, record);
					}}
				>
					{' '}
					{this.state.json['36070TBR-000010']}{/* 国际化处理： 切换视图*/}
				</span>
			) : (
				<div className="currency-opr-col">
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.openModel(formId, 'edit', record, index);
							e.stopPropagation();
						}}
					>
						<i className="icon iconfont icon-gengduo" />
					</span>
					&nbsp;&nbsp;
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.deleteRowsByIndex(formId, index);
							e.stopPropagation();
						}}
					>
						<i className="icon iconfont icon-shanchu" />
					</span>
				</div>
			);
		}
	};
	meta[formId].items.push(porCol);


	meta[constant.formcode1].items.map((item) => {
		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					// TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});
	//财务组织:全加载
	meta[constant.formcode1].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

	//参照过滤
	meta[formId2].items.map((item) => {

		//划出银行
		if (item.attrcode === 'transformoutbank') {
			item.queryCondition = () => {
				let pkorg = props.form.getFormItemsValue(formId, 'pk_org').value;
				return { pk_org: pkorg };
			};
		}
		//划出银行账户
		if (item.attrcode === 'transformoutaccount') {
			item.queryCondition = () => {
				let pkorg = props.form.getFormItemsValue(formId, 'pk_org').value;
				let transformoutbank = props.form.getFormItemsValue(formId, 'transformoutbank').value;
				let pk_currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
				return { pk_org: pkorg,
					pk_currtype: pk_currtype,
					pk_bankdoc:transformoutbank,
					refnodename: commondata.refnodename, //'使用权参照',
					GridRefActionExt: constant.bankaccsubref //  'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件	
				};
			};
		}
		//划入银行
		if (item.attrcode === 'transforminbank') {
			item.queryCondition = () => {
				let pkorg = props.form.getFormItemsValue(formId, 'pk_org').value;
				return { pk_org: pkorg };
			};
		}
		//划入银行账户
		if (item.attrcode === 'transforminaccount') {
			item.queryCondition = () => {
				let pkorg = props.form.getFormItemsValue(formId, 'pk_org').value;
				let transforminbank = props.form.getFormItemsValue(formId,'transforminbank').value;
				let pk_currtype = props.form.getFormItemsValue(formId, 'pk_currtype').value;
				return { pk_org: pkorg,
					pk_currtype: pk_currtype,
					pk_bankdoc: transforminbank,
					refnodename:  commondata.refnodename,
					GridRefActionExt: constant.bankaccsubref // 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件	
				};
			};
		}

	});

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/