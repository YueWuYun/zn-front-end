/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { constant } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { orgVersionUtil } from '../../config/orgVersionUtil'
import { hasDefaultOrg } from "../../../../../tmpub/pub/util/index";
import { cardCache } from 'nc-lightapp-front';
import { dataSource } from '../../cons/constant';
import { orgChangeAfterEvent } from './afterEvent';
let { setDefData } = cardCache;

const form1 = constant.formcode1;
const form2 = constant.formcode2;
const form3 = constant.formcode3;
const form4 = constant.formcode4;
const form5 = constant.formcode5;

export default function (props, json, inlt) {
	props.createUIDom(
		{
			pagecode: constant.cpagecode, //页面id
			// appid: constant.appregisterpk //注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}

				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta, () => {
						if (props.getUrlParam('status') == 'add') {
							if (!hasDefaultOrg(data)) {
								props.resMetaAfterPkorgEdit();
								props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑. 
							} else {
								//设置组织默认值
								if (data.context) {
									props.form.setFormItemsValue(form1, { 'pk_org': { value: data.context.pk_org ? data.context.pk_org : null, display: data.context.org_Name ? data.context.org_Name : null } });
									orgChangeAfterEvent(props);//更改财务组织编辑后事件
								}
								props.form.setFormItemsDisabled(form1, { 'oppbankacc': true });//对方账号不可编辑
							}
						}
					});
					openareafunc(props);//控制表单区域展开
					orgVersionUtil.call(this, props, form1)//多版本视图显隐性
				}

				// 个性化注册中的值,只有inittemple中能获取到该值
				// 先缓存下来，后续需要用到个性化注册中默认值时需要用到
				if (data.context) {
					setDefData('context', dataSource, data.context);
				}
			}
		}
	);
}
//表单区域展开方法
function openareafunc(props) {
	props.form.openArea(form2);
	props.form.openArea(form3);
	props.form.openArea(form4);
	props.form.openArea(form5);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	//防止复制的卡片字段错乱
	if (status === 'copy') {
		meta[form1].status = 'edit';
	} else {
		meta[form1].status = status;
	}

	//form1参照过滤
	meta[form1].items.map((item) => {
		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.isShowDisabledData = 'N';
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					TreeRefActionExt: commondata.financeOrgPermissionFilter //'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});
	//财务组织:全加载
	meta[form1].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;


	//form2参照过滤
	meta[form2].items.map((item) => {
		// 本方账户过滤
		if (item.attrcode === 'pk_bankacc') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(form1, 'pk_org').value;
				return {
					pk_org: orgpk,
					// test: 'test',//没用
					DataPowerOperationCode: 'TMDefault',//使用权组
					funcode: '36070AGR',
					isDataPowerEnable: 'Y',
					refnodename: commondata.refnodename,
					GridRefActionExt: commondata.bankaccsubref // 'nccloud.web.cmp.ref.CMPRecBillBankaccSubDefaultGridRefSqlBuilder'//自定义增加的过滤条件
				};
			};
		}

		//对方单位名称过滤
		if (item.attrcode === 'oppunitname') {
			item.queryCondition = () => {
				let custsuptype = props.form.getFormItemsValue(form1, 'billtypeobj').value;
				let pk_org = props.form.getFormItemsValue(form1, 'pk_org').value;
				return {
					custsuptype: custsuptype,
					pk_org: pk_org,
					// test: 'test',
					queryType: 'pk_custclass',  // 'pk_supplierclass'
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPCustSupplierOppunitnameRef'
				};
			};
		}

		// 对方账号过滤
		if (item.attrcode === 'oppbankacc') {
			item.queryCondition = () => {
				let pk_tab_cust = null;//客户
				let tb_acclass = '2';//默认显示客商
				let pk_org = props.form.getFormItemsValue(form1, 'pk_org').value;
				//0表示客户,1表示供应商，2表示部门，3表示个人
				pk_tab_cust = props.form.getFormItemsValue(form1, 'oppunitname').value;
				if (tb_acclass && pk_tab_cust) {
					return {
						pk_org: pk_org,
						pk_cust: pk_tab_cust,
						accclass: tb_acclass,
						GridRefActionExt: 'nccloud.web.cmp.ref.CMPRecBillCustBankAccGridRefSqlBuilder'
					};
				} else {
					return {};
				}
			};
		}
	});

	//form3参照过滤
	meta[form3].items.map((item) => {

		//单据交易类型 根据单据类型过滤
		if (item.attrcode === 'billtransactype') {
			item.queryCondition = () => {
				let billtype = props.form.getFormItemsValue(form1, 'billtype').value ? props.form.getFormItemsValue(form1, 'billtype').value : 'F2,F4';//默认过滤F2,F4（1909暂只支持这两种单据）
				if (billtype) {
					return {
						parentbilltype: billtype,
						// test: 'test',
						GridRefActionExt: 'nccloud.web.cmp.ref.CMPInformerBilltransactypeRef'//这个是参照过滤注册，作用就是拼查询条件，当点击参照的时候，会自动调用这个类，获取condition
					};
				}
			};
		}

		//托收协议过滤
		if (item.attrcode === 'collectionagree') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(form1, 'pk_org').value;
				return {
					pk_org: orgpk,
					// test: 'test',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPInformerMandateRef'
				};
			};
		}

		//计划项目过滤
		if (item.attrcode === 'planproject') {
			item.queryCondition = () => {
				let orgpk = props.form.getFormItemsValue(form1, 'pk_org').value;
				return {
					pk_org: orgpk,
					// test: 'test',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPInformerMandateRef'
				};
			};
		}


		//部门过滤
		if (item.attrcode == 'department') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(form1, ['pk_org'])[0].value;
				return {
					pk_org: pk_org,
				};
			};
		}

		//人员过滤，通过传递参数来控制左树的显示
		if (item.attrcode == 'staff') {
			item.queryCondition = () => {
				return {
					pk_dept: props.form.getFormItemsValue(form1, 'department') && props.form.getFormItemsValue(form3, 'department').value,
					pk_org: props.form.getFormItemsValue(form1, 'pk_org') && props.form.getFormItemsValue(form1, 'pk_org').value
				};
			};
		}

	});

	meta[form2].items.find((e) => e.attrcode === 'pk_bankacc').showHistory = false;
	meta[form2].items.find((e) => e.attrcode === 'oppunitname').showHistory = false;
	meta[form2].items.find((e) => e.attrcode === 'oppbankacc').showHistory = false;

	meta[form3].items.find((e) => e.attrcode === 'collectionagree').showHistory = false;
	meta[form3].items.find((e) => e.attrcode === 'planproject').showHistory = false;
	meta[form3].items.find((e) => e.attrcode === 'staff').showHistory = false;
	meta[form3].items.find((e) => e.attrcode === 'department').showHistory = false;
	meta[form3].items.find((e) => e.attrcode === 'billtransactype').showHistory = false;

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/