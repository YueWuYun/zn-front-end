/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax, cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { orgVersionUtil } from '../../config/orgVersionUtil'
import { buttonVisible } from './buttonVisible';
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";
let { getDefData } = cardCache;
let { NCPopconfirm } = base;
 const cpagecode = '36070WC_C01';
// const tablecode = 'table_cashdraw_C01';
const formcode1 = constant.formcode1;
const fromcode2 = constant.formcode2;
// const fromcode3 = constant.formcode3;
export default function(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: constant.cpagecode, // 页面id
			appid: constant.appregisterpk // 注册按钮的id
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta, () => {
						if (props.getUrlParam('status') == 'add') {
							if(!hasDefaultOrg(data)){
								// props.resMetaAfterPkorgEdit();
								props.resMetaAfterPkorgEdit();
								props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑. 
							}
						}
					});

					orgVersionUtil.call(this, props, formcode1)//多版本视图显隐性
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// buttonVisible(props);
				}
				
			}
		}
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	// meta[formcode1].status = status;
	if(status==='copy'){
		meta[formcode1].status = 'edit';
	}else{
		meta[formcode1].status = status;
	}
	meta[formcode1].items.map((item) => {
		if (item.attrcode == 'pk_org_v') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(formcode1, 'vbillcode').value;
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
			let status = props.cardTable.getStatus(formcode1);
			return status === 'browse' ? (
				<span
					onClick={() => {
						props.cardTable.toggleRowView(formcode1, record);
					}}
				>
					{' '}
					{this.state.json['36070WC-000006']}{/* 国际化处理： 切换视图*/}
				</span>
			) : (
				<div className="currency-opr-col">
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.openModel(formcode1, 'edit', record, index);
							e.stopPropagation();
						}}
					>
						<i className="icon iconfont icon-gengduo" />
					</span>
					&nbsp;&nbsp;
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.deleteRowsByIndex(formcode1, index);
							e.stopPropagation();
						}}
					>
						<i className="icon iconfont icon-shanchu" />
					</span>
				</div>
			);
		}
	};
	meta[formcode1].items.push(porCol);
	meta[formcode1].items.map((item) => {
		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: commondata.financeOrgPermissionFilter
				};
			};
		}
	});
	//财务组织:全加载
	meta[formcode1].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//参照过滤
	meta[fromcode2].items.map((item) => {
		if (item.attrcode === 'pk_cashaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(formcode1, 'pk_currency').value;
				return { pk_org: orgpk,
					pk_currtype: currency,
					refnodename: commondata.refnodename,
					GridRefActionExt: commondata.cashaccountref
				};
			};
		}
		// 资金计划项目
		if(item.attrcode === 'pk_planitem'){
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				return {
					pk_org: orgpk
				};
			};
		}
		// 银行账户
		if (item.attrcode === 'pk_bankaccount') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(formcode1, 'pk_org').value;
				let currency = props.form.getFormItemsValue(formcode1, 'pk_currency').value;
				return { pk_org: orgpk,
					pk_currtype: currency,
					refnodename: commondata.refnodename,
					//begin lidyu 银行账户参照过滤修改  只允许参照到活期账户
					// GridRefActionExt: commondata.bankaccsubref//自定义增加的过滤条件
					GridRefActionExt:'nccloud.web.cmp.ref.CMPCashBillBankaccSubDefaultGridRefSqlBuilder'
					//end lidyu 
				};
			};
			item['isShowUnit']=false; 
		}
	});
	meta[fromcode2].items.find((e) => e.attrcode === 'pk_cashaccount').showHistory = false;
	meta[fromcode2].items.find((e) => e.attrcode === 'pk_bankaccount').showHistory = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/