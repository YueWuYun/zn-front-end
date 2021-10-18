/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import bodyButtonClick from './bodyButtonClick';
import { setButtonUsabilitys } from '../events';
import { app_id, AllocateAgreeCache, AllocateAgreeConst, base_url, list_page_id, list_search_id, list_table_id, button_limit, base_path, card_page_id, card_table_id } from '../../cons/constant.js';
import { go2card, loadSearchCache } from "../../util/index";
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util';
import { SCENE } from "../../../../../tmpub/pub/cons/constant";
import { getDefData, setDefData } from '../../../../../tmpub/pub/util/cache';
import { TbbLinkBill } from '../../util/index';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: list_page_id,//页面id 
		},

		function (data) {
			if (data) {
				//主键信息
				let srcid = props.getUrlParam('id');
				//联查场景标志
				let src = props.getUrlParam('scene');
				//预算反联查参数
				let tbbParam = props.getUrlParam('pk_ntbparadimvo');
				console.log('tbbParam',tbbParam);
				let linkflag = false;
				if (SCENE.LINK == src || tbbParam || srcid) {
					linkflag = true;
					setDefData(AllocateAgreeCache, AllocateAgreeConst.islink, true);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					if (!linkflag) {
						setDefOrg2AdvanceSrchArea(props, list_search_id, data);
					}
					props.meta.setMeta(meta);
					if (!linkflag) {
						loadSearchCache(props);
					}
					//查询赋默认组织	
					if (!linkflag) {
						setDefOrg2ListSrchArea(props, list_search_id, data);
					}
					console.log('linkflag',linkflag);
					initData.call(that, props);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					setButtonUsabilitys(props);
					// props.button.setMainButton(['BatchCommitMajor'],true);
				}
			}
		}
	)
}


function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(that, props, meta) {

	meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
		//item.visible = true;
		item.col = '3';
		return item;
	})
	//参照
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[list_search_id].items.map((item) => {
		//下拨组织根据角色权限显示
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		// if (item.attrcode == 'allocateagree_b.pk_accid' || item.attrcode == 'allocateagree_b.pk_custbankacc') {
		// 	debugger
		// 	item.queryCondition = () => {
		// 		return {
		// 			pk_currtype:(props.search.getSearchValByField(list_search_id, 'pk_currtype') || {}).value,
		// 			GridRefActionExt:'nccloud.web.sf.allocation.allocateagree.filter.AllocateAgreePkBankaccRFilter'
		// 		};
		// 	};
		// }
		// if (item.attrcode == 'allocateagree_b.pk_bankacc_r') {
		// 	debugger
		// 	item.queryCondition = () => {
		// 		return {
		// 			pk_currtype:(props.search.getSearchValByField(list_search_id, 'pk_currtype') || {}).value,
		// 			pk_org:(props.search.getSearchValByField(list_search_id, 'allocateagree_b.pk_financeorg_r') || {}).value,
		// 		};
		// 	};
		// }
		// if (item.attrcode == 'allocateagree_b.pk_company_r') {
		// 	debugger
		// 	item.queryCondition = () => {
		// 		return {
		// 			pk_org: (props.search.getSearchValByField(list_search_id, 'allocateagree_b.pk_financeorg_r') || {}).value,
		// 		};
		// 	};
		// }
	});
	meta[list_table_id].pagination = true;
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		item.width = 150;
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							// props.pushTo('/card', {
							// 	pagecode: card_page_id,
							// 	status: 'browse',
							// 	id: record.pk_allocateagree_h.value
							// });
							go2card(props, {
								pagecode: card_page_id, status: 'browse',
								id: record.pk_allocateagree_h.value
							},
								that.getState.bind(that));
						}}
					>
						{record && record.vbillno && record.vbillno.value}
					</a>
				);
			};
		}
		else if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return (
					<span>
						{record && record.dbilldate && seperateDate(record.dbilldate.value)}
					</span>
				);
			};
		}
		return item;
	});
//	let multiLang = props.MutiInit.getIntl('36320FAA');
	//添加操作列
	meta[list_table_id].items.push({
		attrcode: 'opr',
		label: loadMultiLang(props,'36320FAA-000019'),/* 国际化处理： 操作*/
		itemtype: 'customer',
		width: 250,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			let bankaccflag = false;
			if (record.agreedate && record.agreedate.value || record.agreeuser && record.agreeuser.value) {
				bankaccflag = true;
			}
			let buttonAry = [];

			//&& !bankaccflag 
			if (record.billstatus && record.billstatus.value == '1' && !bankaccflag) {
				buttonAry = ['Agree', 'Back'];
			} else if (record.billstatus && record.billstatus.value == '1' && bankaccflag) {
				buttonAry = ['Agree', 'Back', 'Commit'];
			}
			else if (record.billstatus && record.billstatus.value == '2') {
				buttonAry = ['Uncommit', 'LookApprove'];
			}else if (record.billstatus && (record.billstatus.value == '3')) {
				buttonAry = ['Uncommit', 'CreateAllocate', 'LookApprove'];
			}else if (record.billstatus && (record.billstatus.value == '4')) {
				buttonAry = ['CreateAllocate', 'LookApprove'];
			}
			 else {
				buttonAry = ['LookApprove'];
			}

			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: button_limit,
				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
			});
		}
	});
	return meta;
}

function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	//预算反联查参数
	let tbbParam = props.getUrlParam('pk_ntbparadimvo');
	//是否已查询标志
	if (SCENE.LINK == src || tbbParam || srcid) {
		setDefData(AllocateAgreeCache, AllocateAgreeCache.islink, true);
		let linkSourceData = getDefData(AllocateAgreeCache, AllocateAgreeCache.linkSourceData + srcid);
		console.log('linkSourceData', linkSourceData);
		if(linkSourceData){
			props.table.setAllTableData(list_table_id, linkSourceData);
			return;
		}
	}
	if (SCENE.LINK == src) {
		if (srcid) {
			this.props.pushTo('/card', {
				status: 'browse',
				scene: SCENE.LINK,
				id: srcid,
				pagecode: card_page_id
			});
		}
	} else if (tbbParam) {
		TbbLinkBill.call(this, this.props);
	} else if (srcid) {
		this.props.pushTo('/card', {
			status: 'browse',
			scene: SCENE.LINK,
			id: srcid,
			pagecode: card_page_id
		});
	}
}


/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/