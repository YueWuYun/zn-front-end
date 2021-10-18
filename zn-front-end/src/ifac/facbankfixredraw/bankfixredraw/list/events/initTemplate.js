/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip,NCMenu } = base;
import { buttonVisible } from './buttonVisible';
import {bodyButtonClick} from './bodyButtonClick';
import { voucherLinkBill } from '../../busbutton/voucherLinkBill';
import { pageCodeList, searchId, tableId, app_code,pkname, pageCodeCard,rowcode,gotocardcheck } from '../../cons/constant.js';
import {setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea} from '../../../../../tmpub/pub/util/index.js';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
import { requesturl } from '../../cons/requesturl.js';
const { Item } = NCMenu;
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
					let src = props.getUrlParam('scene');
					if ('fip' == src ) {
						initData.call(that, props);
					}
					meta = modifierMeta(that, props, meta);
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
					let src = props.getUrlParam('scene');
					if ('fip' == src ) {
						props.button.setButtonVisible(['Add', 'Delete', 'Copy','Refresh',
						'Tally',
						'UnTally'],false);
					}
				}
			}
			buttonVisible.call(this,props);
			props.button.setPopContent('DeleteTableBtn', loadMultiLang(props, '36140NDSR-000013'));/* 国际化处理： 确认要删除吗?*/
		}
	)
}
function modifierMeta(that, props, meta) {
	meta[tableId].pagination = true;
	let multiLang = props.MutiInit.getIntl(app_code);
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode == 'vbillcode') {
			let scene = props.getUrlParam("scene");
			item.render = (text, record, index) => {
                if(record && record.vbillcode && record.vbillcode.value){
                    return (
						<a
							style={{ cursor: "pointer" }}
							onClick={() => {
								go2CardCheck({
									props,
									url:gotocardcheck,
									pk: record[pkname].value,
									ts: record["ts"].value,
									checkTS: false,
									fieldPK: pkname,
									go2CardFunc: () => {
										props.pushTo("/card", {
											status: "browse",
											id: record.pk_fixeddatewithdraw.value,
											pagecode: pageCodeCard,
											scene: scene,
											islisttocard: "islisttocard"
										});
									}
								})
								
							}}
						>
						{record && record.vbillcode && record.vbillcode.value}
						</a>
                    );
                }else{
                    return (
						<a
							style={{ cursor: "pointer" }}
							onClick={() => {
								go2CardCheck({
									props,
									url: gotocardcheck,
									pk: record[pkname].value,
									ts: record["ts"].value,
									checkTS: record["ts"].value ? true : false,
									fieldPK: pkname,
									go2CardFunc: () => {
										props.pushTo("/card", {
											status: "browse",
											id: record.pk_fixeddatewithdraw.value,
											pagecode: pageCodeCard
										});
									}
								})
								
							}}
						>
						{'------'}
						</a>
                    );
                }               
            };
		} 
		return item;
	});
	//财务组织用户过滤
	meta[searchId].items.map((item) => {
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode == 'pk_depositreceipt' ) {
			item.queryCondition = () => {
				// 贷款单位
				let pk_org = props.search.getSearchValByField(searchId, 'pk_org').value.firstvalue;//let search_org_value = 
				let pk_depositbank = props.search.getSearchValByField(searchId, 'pk_depositbank').value.firstvalue;
				// let pk_currtype = props.form.getFormItemsValue(this.formId, 'pk_currtype').value;
				// pk_depositbank

				return {
					pk_org: pk_org,
					pk_depositbank: pk_depositbank,
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					GridRefActionExt: 'nccloud.web.fac.bankfixeddatewithdraw.filter.NCCAccidFilter' //自定义增加的过滤条件	
				};
			};
		}


	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: multiLang && multiLang.get('36140NDSR-000025'),
		// label: '操作',
		itemtype: 'customer',
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			let isnet = true;
			let buttonAry = [];
			if(props.getUrlParam("scene") == 'fip' || props.getUrlParam("scene") == 'linksce'){
				buttonAry = [];
			
		}else{
			if (record.billstate && record.billstate.value == '0') {
				buttonAry = ['TallyTableBtn', 'DeleteTableBtn','EditTableBtn'];
			} else if (record.billstate && record.billstate.value == '1') {
				buttonAry = ['UnTallyTableBtn'];	
			} 
		}
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry,
						{
							area: rowcode,//区域编码
							buttonLimit: 3,//按钮显示个数
							onButtonClick: (props, key) => { bodyButtonClick.call(that, props, key, text, record, index); }
						});
				}
			}));
		}
	});
	return meta;
}

function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this, this.props, pageCodeList,tableId);
	} 
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/