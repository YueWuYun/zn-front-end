/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip,NCMenu } = base;
import { buttonVisible } from './buttonVisible';
import {bodyButtonClick} from './bodyButtonClick';
import { pageCodeList, searchId, tableId, app_code,attrCode,pkname, formId,base_url } from '../../cons/constant.js';
import {setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea} from '../../../../../tmpub/pub/util/index.js';
const { Item } = NCMenu;
import { loadMultiLang,go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { voucherLinkBill } from './voucherLinkBill';
export default function (props) {
	let that = this;
	props.createUIDom( 
		{
			pagecode: pageCodeList,//页面id 
			appcode:props.getUrlParam('c')
		}, 
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//联查场景标志
					let src = that.props.getUrlParam('scene');
					if ('fip' == src && that.props.getUrlParam('resource') != 'card') {
						initData.call(that, props);
					}

					meta = modifierMeta(that,props, meta);
					props.meta.setMeta(meta);
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props,searchId,data);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props,searchId,data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
				}
			}
			buttonVisible.call(that,props);
			props.button.setPopContent('DeleteTableBtn', loadMultiLang(props, '36340FDW-000031'));/* 国际化处理： 确认要删除吗?*/
			
		}
	) 
}
function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志 
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this,props, pageCodeList, tableId);
	} 
}
function modifierMeta(that,props, meta) {
	let scene = props.getUrlParam("scene");
	let islinklistquery=props.getUrlParam("islinklistquery");
	if(scene != 'fip'&&scene != 'linksce'){
		meta[tableId].pagination = true;
	}else{
		meta[tableId].pagination = false;
	}
	meta[searchId].items.find((e) => e.attrcode === 'pk_group').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_billtype').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_varieties').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_depostrate').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_aiacrate').isMultiSelectedEnabled = true;
	//查询区域参照过滤
	meta[searchId].items.map((item) => {
		item.isShowDisabledData = true;
		//资金组织参照过滤
		if (item.attrcode == 'pk_org') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					funcode: app_code,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				}
			}
		}
		//存款单位参照过滤
		if (item.attrcode == 'pk_depositorg') {
			item.isShowUnit=true;
			item.isTreelazyLoad = false;
			item.queryCondition = () => {  
				return {
					isSelect:"Y",
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					TreeRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkDepositorgFilter'
				}
			}
		}
		//定期利率参照过滤
		if (item.attrcode == 'pk_depostrate') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"FRATE",
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.tmpub.tmbd.ratecode.action'
				}					   
			}
		}
		//活期利率参照过滤
		if (item.attrcode == 'pk_aiacrate') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"CRATE",
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.tmpub.tmbd.ratecode.action'
				}					   
			}
		}
		//定期账户参照过滤
		if (item.attrcode == 'pk_depositacc') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					isSelect:"Y",
					billtype:true,
					pk_currtype: (props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					pk_depositorg: (props.search.getSearchValByField(searchId, 'pk_depositorg') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkDepositaccFilter'
				}
			}
		}
		//结算账户参照过滤
		if (item.attrcode == 'pk_settleacc') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					isSelect:"Y",
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					pk_depositorg: (props.search.getSearchValByField(searchId, 'pk_depositorg') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkSettleaccFilter'
				}
			}
		}
		//存单号（定期存单）参照过滤
		if (item.attrcode == 'pk_depositreceipt') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					isSelect:"Y",
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					pk_depositorg: (props.search.getSearchValByField(searchId, 'pk_depositorg') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
					// billstate:(props.search.getSearchValByField(searchId, 'billstate') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkDepositreceiptFilter'
				}
			}
		}
		//定期业务品种参照过滤
		if (item.attrcode == 'pk_varieties') {
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					pk_org: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
					pk_currtype: (props.search.getSearchValByField(searchId, 'pk_currtype') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdraw.filter.NCCPkVarietiesFilter'
				}
			}
		}
		//成本中心跨集团参照
		if (item.attrcode == 'pk_costcenter') {
			item.isShowUnit = true;
			item.isTreelazyLoad = false;
		}
	});
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == attrCode) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							go2CardCheck({ 
								props,
								url: base_url + 'FDWgotocardcheck.do',
								pk:record[pkname].value,
								ts:record["ts"].value,
								//主键字段名
								fieldPK: pkname,
								//动作编码（权限检查 空则不检查）
								actionCode:null,
								//权限编码（权限检查 空则不检查）
								permissionCode:null,
								//是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
								checkSaga : false,
								//是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
								checkTS : false,
								go2CardFunc: () => {
									props.pushTo('/card', { 
										status: 'browse',
										scene,
										islinklistquery,
										id: record[pkname].value,
									});
								}
							});
						}}
					>
						{record && record[attrCode] && record[attrCode].value}
					</a>
				);
			};
		}
		return item;
	});
	//添加操作列
	if(scene != 'fip'&&scene != 'linksce'){
		meta[tableId].items.push({
			attrcode: 'opr',
			label: loadMultiLang(props, '36340FDW-000019'),
			// label: '操作',
			itemtype: 'customer',
			width: 200,
			fixed: 'right',
			className: "table-opr",
			visible: true,
			render: (text, record, index) => { 
				let isnet = true;
				let buttonAry = [];
				//待提交
				if (record.billstate && record.billstate.value == '1') {
					if(record.pk_srcbill.value&&record.pk_srcbilltype.value){
						buttonAry = ['CommitTableBtn', 'BackTableBtn','EditTableBtn'];
					}else{
						buttonAry = ['CommitTableBtn', 'DeleteTableBtn','EditTableBtn'];
					}
				} 
				//待审批和审批成功
				else{
					buttonAry = ['UnCommitTableBtn'];
				}
				return (props.button.createErrorButton({
					record,
					showBack: false,
					sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry,
							{
								area: "list_inner",//区域编码
								buttonLimit: 3,//按钮显示个数
								onButtonClick: (props, key) => { bodyButtonClick.call(that, props, key, text, record, index); }
							});
					}
				}));
			}
		});
	}
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/