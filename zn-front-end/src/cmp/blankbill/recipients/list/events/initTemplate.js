/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast,excelImportconfig } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon ,NCTooltip} = base;
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
import { setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util/index';
import {cardCache} from "nc-lightapp-front";
let {setDefData, getDefData } = cardCache;
import tableButtonClick from './tableButtonClick';
import buttonUsability from './buttonUsability';
import { buttonVisible } from './buttonVisible';
import { commondata } from '../../../../public/utils/constant';
import {BBR_CONST, APP_INFO, BILL_FIELD, REQUEST_URL, BTN } from '../../cons/constant.js';
const { APPCODE, LIST_PAGECODE, SEARCH_CODE, LIST_TABLECODE, CARD__PAGECODE } = APP_INFO
const { PK_NAME, VBILLNO, PK_ORG, LY_DEP, LY_PSN, BANKCODE, MENOY_KIND } = BILL_FIELD
const { BBR_CACHEKEY,BBR_PKNAMEKEY,BBR_STATEKEY,SEARCH_KEY,LINK_KEY,SAVED,APPROVING } = BBR_CONST
const { QUERY, QUERYBYIDS, QUERYCARD, SAVE, DELETE, PRINT } = REQUEST_URL;
const { EDIT_INNER_BTN, DELETE_INNER_BTN } = BTN;
import  {go2Card}  from '../../util/goToCard.js';
export default function(props) {

	let _this = this;
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
					let ISlINK = getDefData(LINK_KEY, BBR_CACHEKEY);
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
					props.button.setPopContent(DELETE_INNER_BTN, this.state.json['36070BBR-000004']);/* 国际化处理： 确认要删除该信息吗？*/
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
	// 查询区参照过滤
	meta[SEARCH_CODE].items.map((item) => {
		item.isShowDisabledData = true; // “显示停用”的字段
			//财务组织用户过滤
		if (item.attrcode == PK_ORG ) {
			item.queryCondition = () => {
				return {
					funcode: APPCODE,
					TreeRefActionExt: commondata.financeOrgPermissionFilter
				};
			};
		}
		//银行账号过滤
		if (item.attrcode == BANKCODE ) {
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(SEARCH_CODE, PK_ORG).value.firstvalue;
				let currtype = props.search.getSearchValByField(SEARCH_CODE, MENOY_KIND).value.firstvalue;
				return {
					pk_org: pk_org,
					pk_currtype: currtype,
					refnodename: '使用权参照',/* 国际化处理： 使用权参照*/
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',//是否加载参照默认条件
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBankaccGridRefNotInnerAccSqlBuilder'//自定义增加的过滤条件
				};
			};
		}

			// 领用部门
		if (item.attrcode == LY_DEP ) {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(SEARCH_CODE, PK_ORG).value.firstvalue;
				return {
					pk_org: pk_org,
				};
			};
		}
			// 领用人
		if (item.attrcode == LY_PSN ) {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(SEARCH_CODE, PK_ORG).value.firstvalue;
				return {
					pk_org: pk_org,
				};
			};
		}
	});

	meta[LIST_TABLECODE].items = meta[LIST_TABLECODE].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == VBILLNO) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
						onClick={() => {
							let ISlINK = getDefData(LINK_KEY, BBR_CACHEKEY);
							if(ISlINK) {

								go2Card(props,{pagecode: CARD__PAGECODE,
									status: 'browse',
									id: record[PK_NAME].value,
									scene: 'linksce'} ,{} );
								// props.pushTo('/card', {
								// 	pagecode: CARD__PAGECODE,
								// 	status: 'browse',
								// 	id: record[PK_NAME].value,
								// 	scene: 'linksce'
								// });

							}else{
								go2Card(props,{pagecode: CARD__PAGECODE,status:"browse",id:record[PK_NAME].value} ,{} );

								//props.pushTo("/card",{pagecode: CARD__PAGECODE,status:"browse",id:record[PK_NAME].value});
							}
						}}
					>
						{record && record[VBILLNO] && record[VBILLNO].value}
					</a>
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
	//添加操作列
	meta[LIST_TABLECODE].items.push({
		attrcode: 'opr',
		label: this.state.json['36070BBR-000005'], /* 国际化处理： 操作*/
		width: 200,
		visible: true,
		fixed: 'right',
		itemtype:'customer',
		render: (text, record, index) => {
				let buttonAry = [EDIT_INNER_BTN, DELETE_INNER_BTN];
				return props.button.createOprationButton(buttonAry, {
				area: 'list_inner',
				buttonLimit: 4,
				onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			});
		}
	});

	//设置参照可以多选和是否清楚记录
	meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_ORG).isMultiSelectedEnabled = true;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_ORG).showHistory = true;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === BANKCODE).showHistory = false;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === LY_DEP).showHistory = false;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === LY_PSN).showHistory = false;
	//财务组织:全加载
	meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_ORG).isTreelazyLoad = false;
	return meta;
}
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/