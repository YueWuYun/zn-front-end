/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
import { setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util/index';
import {cardCache} from "nc-lightapp-front";
import { commondata } from '../../../../public/utils/constant';
import { BBP_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
let {setDefData, getDefData } = cardCache;
let { NCPopconfirm, NCIcon ,NCTooltip} = base;
import tableButtonClick from './tableButtonClick';
import buttonUsability from './buttonUsability';
import { buttonVisible } from './buttonVisible';
const { PK, VBILLNO, PK_ORG, PK_BANK, GZ_BZ,GZ_DEPT, GZ_PERSON } = BILL_FIELD;
const { LINK_KEY, BBP_CACHEKEY } = BBP_CONST;
const { APPCODE, LIST_PAGECODE, LIST_TABLECODE,CARD__PAGECODE, SEARCH_CODE } = APP_INFO;
const { EDIT_INNER_BTN, DELETE_INNER_BTN} = BTN;
import  {go2Card}  from '../../util/goToCard.js';
export default function(props) {
	props.createUIDom(
		{
			pagecode: LIST_PAGECODE, //页面id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;	
					meta = modifierMeta.call(this, props, meta);
					//解决联查场景查询区赋值问题
					debugger;
					let ISlINK = getDefData(LINK_KEY, BBP_CACHEKEY);
				    if(!ISlINK){
				    	setDefOrg2AdvanceSrchArea(props,SEARCH_CODE,data);
					}		
					props.meta.setMeta(meta);
					if(!ISlINK){
						setDefOrg2ListSrchArea(props,SEARCH_CODE,data);
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					buttonUsability.call(this, this.props,null);
					props.button.setPopContent(DELETE_INNER_BTN, this.state.json['36070BBP-000004'] );/* 国际化处理： 确认要删除该信息吗？*/
				}
			}
		}
	);
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {
	meta[SEARCH_CODE].items = meta[SEARCH_CODE].items.map((item, key) => {
		//item.visible = true;
		//item.col = '3';
		return item;
	});
	// props.renderItem(
	// 	'search', // 区域类型form/table/search
	// 	SEARCH_CODE, // 模板中的区域id
	// 	'pk_org' // 字段的attrcode
	// 	// getRefer('cont', {
	// 	// 	// refcode以及其他参数
	// 	// 	isMultiSelectedEnabled: false
	// 	// 	//...item
	// 	// })
	// );
	//meta[LIST_TABLECODE].showindex = true;
	//修改列渲染样式
	meta[SEARCH_CODE].items.map((ele) => {
		//ele.visible = true;
	});
	//财务组织:全加载
	meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_ORG).isTreelazyLoad = false;
	//财务组织用户过滤
	meta[SEARCH_CODE].items.map((item) => {
		item.isShowDisabledData = true; // “显示停用”的字段
		// 财务组织：根据用户权限过滤
		if (item.attrcode == PK_ORG) {
			item.queryCondition = () => {
				return {
					funcode: APPCODE,
					TreeRefActionExt: commondata.financeOrgPermissionFilter // 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
		// 银行账户过滤
		if (item.attrcode === PK_BANK) {
			item.queryCondition = () => {
				let search_org_value = props.search.getSearchValByField(SEARCH_CODE, PK_ORG);//所选组织
				if (search_org_value && search_org_value.value.firstvalue) {
					search_org_value = search_org_value.value.firstvalue;
				} else {
					search_org_value = null;
				}
				let search_currency_value = props.search.getSearchValByField(SEARCH_CODE, GZ_BZ);//币种
				if (search_currency_value && search_currency_value.value.firstvalue) {
					search_currency_value = search_currency_value.value.firstvalue;
				} else {
					search_currency_value = null;
				}
				return {
					pk_org: search_org_value,
					pk_currtype: search_currency_value,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'//自定义增加的过滤条件
				};
			};
		}
		//付款银行账号
		if (item.attrcode == 'items.pk_oppaccount') {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(SEARCH_CODE, PK_ORG).value.firstvalue;
				let currtype=props.search.getSearchValByField(SEARCH_CODE,'items.pk_currtype').value.firstvalue;
				return {
					pk_orgs: pk_org,
					pk_currtype: currtype,
					refnodename: this.props.MutiInit.getIntl("36070BBP") && this.props.MutiInit.getIntl("36070BBP").get('36070BBPCOMP-000017'),/* 国际化处理： 使用权参照*/
					noConditionOrg:'Y',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder' //自定义参照过滤条件
				};
			};
		}
		// 购置部门
		if (item.attrcode == GZ_DEPT) {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(SEARCH_CODE, PK_ORG).value.firstvalue;
				return {
					pk_org: pk_org
				};
			};
		}
		// 购置人
		if (item.attrcode == GZ_PERSON ) {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(SEARCH_CODE, PK_ORG).value.firstvalue;
				return {
					pk_org: pk_org
				};
			};
		}

	});

	meta[LIST_TABLECODE].items = meta[LIST_TABLECODE].items.map((item, key) => {
		if (item.attrcode == VBILLNO) {
			item.render = (text, record, index) => {
				return (
					//<NCTooltip placement="top" overlay={record.bill_no ? record.bill_no.value : ''}>
					<a
						style={{cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
						onClick={() => {
							// this.setStateCache();
							go2Card(props,{ status: 'browse',	id: record[PK].value,pagecode: CARD__PAGECODE} ,{} );
							//props.pushTo("/card",{pagecode: CARD__PAGECODE,status:"browse",id:record[PK].value});
						}}
					>
						{record && record[VBILLNO] && record[VBILLNO].value}
					</a>
					//</NCTooltip>
				);
			};
		} 
		// else if (item.attrcode == 'bill_date') {
		// 	item.render = (text, record, index) => {
		// 		return <span>{record && record.bill_date && seperateDate(record.bill_date.value)}</span>;
		// 	};
		// }
		return item;
	});
	meta[SEARCH_CODE].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//添加操作列
	meta[LIST_TABLECODE].items.push({
		attrcode: 'opr',
		label:  this.state.json['36070BBP-000012'], //intl.get('20521030-0005'),/* 国际化处理： 操作*/
		width: 200,
		visible: true,
		fixed: 'right',
		itemtype:'customer',
		render: (text, record, index) => {
			let buttonAry = [EDIT_INNER_BTN, DELETE_INNER_BTN ];
			return props.button.createOprationButton(buttonAry, {
				area: 'list_inner',
				buttonLimit: 4,
				onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			});
		}
	});

	// 清除历史记录缓存
	meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_BANK).showHistory = false;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === GZ_DEPT).showHistory = false;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === GZ_PERSON).showHistory = false;

	return meta;
}
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/