/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { cardCache } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick.js';
import { constant } from '../../config/config';
import { commondata } from '../../../../public/utils/constant';
import { buttonVisible } from './buttonVisible';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea} from '../../../../../tmpub/pub/util/index';
let { getDefData } = cardCache;
import { BBM_CONST, APP_INFO,BILL_FIELD,REQUEST_URL,BTN } from '../../cons/constant';
const { BBR_CACHEKEY } = BBM_CONST;
const { APPCODE, LIST_PAGECODE,SEARCH_CODE, LIST_TABLECODE,
	CARD__PAGECODE,CARD_FORMCODE,CARD_FORMCODE2,CARD_FORMCODE3,
	PRINT_TEMPLATEID,PRINT_FUNCODE,PRINT_NODEKEY } = APP_INFO;
const { PK_NAME,PK_ORG,VBILLNO,BILL_STATUS,TS,LY_DEP,LY_PSN, BX_DEP, BX_PERSON } = BILL_FIELD;
const {  QUERY,QUERYBYIDS,QUERYCARD,BBMBX,BBMBXCANCEL,BBMLY,BBMLYCANCEL,BBMZF,BBMZFCANCEL,PRINT } = REQUEST_URL;
const { LY_BTN,LY_GROUP,LYCANCEL_BTN,BX_BTN,BX_GROUP,BXCANCEL_BTN,ZF_BTN,ZF_GROUP,ZFCANCEL_BTN,REFRESH_BTN,
	LY_INNER_BTN,LYCANCEL_INNER_BTN,BX_INNSER_BTN,BXCANCEL_INNER_BTN,ZF_INNER_BTN,ZFCANCEL_INNER_BTN
} = BTN;

export default function(props, json, inlt) {

	props.createUIDom(
		{
			pagecode: LIST_PAGECODE, //页面id
			
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
					let isfiplink = getDefData(constant.fipscene_key, BBR_CACHEKEY);
					if(!isfiplink){
						// 高级查询默认业务单元赋值
					setDefOrg2AdvanceSrchArea(props, SEARCH_CODE, data);
					// 查询方案默认业务单元赋值
					setDefOrg2ListSrchArea(props, SEARCH_CODE, data);
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					// props.button.setPopContent('deleteinBtn', this.state.json['36070BBM-000008']);/* 国际化处理： 确定要删除数据吗?*/
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
		// item.visible = true;
		item.col = '3';
		return item;
	});

	meta[LIST_TABLECODE].items = meta[LIST_TABLECODE].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode == VBILLNO) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ textDecoration: '', cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
						onClick={() => {
							props.table.selectAllRows(this.tableId,false);
							props.pushTo(constant.cardpath, {
								pagecode: constant.cpagecode,
								status: 'browse',
								id: record[PK_NAME].value
							});
						}}
					>
						{record && record[VBILLNO] && record[VBILLNO].value}
					</a>
				);
			};
		} 
		// else if (item.attrcode == 'dbilldate') {
		// 	item.render = (text, record, index) => {
		// 		return <span>{record.dbilldate && seperateDate(record.dbilldate.value)}</span>;
		// 	};
		// }
		return item;
	});
	//添加操作列
	meta[LIST_TABLECODE].items.push({
		attrcode: 'opr',
		label: this.state.json['36070BBM-000007'],/* 国际化处理： 操作*/
		fixed: 'right',
		itemtype: 'customer',
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let buttonAry = [];
			switch (record[BILL_STATUS].value){

				case '0':
					buttonAry = [ LY_INNER_BTN,ZF_INNER_BTN ];
					break;

				case '1':
					buttonAry = [ LYCANCEL_INNER_BTN,BX_INNSER_BTN,ZF_INNER_BTN ];
					break;

				case '2':
					buttonAry = [ BXCANCEL_INNER_BTN ];
					break;

				case '3':
					buttonAry = [ ZFCANCEL_INNER_BTN ];
					break;

				default:
					break;
			}

			return props.button.createOprationButton(buttonAry, {
				area: 'list_inner',
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			});
		}
	});

	// 参照过滤
	meta[SEARCH_CODE].items.map((item) => {
		item.isShowDisabledData = true; // “显示停用”的字段
		// 根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: APPCODE,
					TreeRefActionExt: commondata.financeOrgPermissionFilter
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
		// 报销部门
		if (item.attrcode == BX_DEP ) {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(SEARCH_CODE, PK_ORG).value.firstvalue;
				return {
					pk_org: pk_org,
				};
			};
		}
		// 报销人
		if (item.attrcode == BX_PERSON ) {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(SEARCH_CODE, PK_ORG).value.firstvalue;
				return {
					pk_org: pk_org,
				};
			};
		}
	
	});

	//设置参照可以多选和是否清楚记录
	meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_ORG).isMultiSelectedEnabled = true;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_ORG).showHistory = true;
	// LY_DEP,LY_PSN, BX_DEP, BX_PERSON
	meta[SEARCH_CODE].items.find((e) => e.attrcode === LY_DEP).showHistory = false;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === LY_PSN).showHistory = false;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === BX_DEP).showHistory = false;
	meta[SEARCH_CODE].items.find((e) => e.attrcode === BX_PERSON).showHistory = false;
	//财务组织:全加载
	meta[SEARCH_CODE].items.find((e) => e.attrcode === PK_ORG).isTreelazyLoad = false;

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/