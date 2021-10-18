/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast, cardCache} from 'nc-lightapp-front';
import tabButtonClick from './tabButtonClick';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
import {
	app_id, appcode, module_id, base_url,
	list_page_id, list_search_id, list_table_id,
	button_limit, oid, card_page_id, dataSource
} from '../../cons/constant.js';
import { cache } from "../../../../../tmpub/pub/cons/constant";
let { NCPopconfirm, NCIcon } = base;

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			//页面id
			pagecode: list_page_id,
			appcode: props.getUrlParam('c')
			// 页面编码
			// appcode: appcode,
			// //注册按钮的id
			// appid: app_id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//高级查询区域加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, list_search_id, data);
					meta = modifierMeta.call(this, props, meta, that)
					props.meta.setMeta(meta);
					//列表查询区域加载默认业务单元
					setDefOrg2ListSrchArea(props, list_search_id, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('delete_inner', props.MutiInit.getIntl("36320FDA") && props.MutiInit.getIntl("36320FDA").get('36320FDA--000063'));/* 国际化处理： 确认要删除该信息吗？*/
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

function modifierMeta(props, meta, that) {
	meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
		//这里会控制查询的预置方案 true为全部显示
		// item.visible = true;
		//显示停用
		item.isShowDisabledData = true;
		item.col = '3';
		return item;
	})

	//begin tm tangleic 20190902 查询区域不用隐藏历史记录
	// meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').showHistory = false;
	// meta[list_search_id].items.find((e) => e.attrcode === 'delivery_b.pk_bankacc_r').showHistory = false;
	// meta[list_search_id].items.find((e) => e.attrcode === 'delivery_b.pk_org_p').showHistory = false;
	// meta[list_search_id].items.find((e) => e.attrcode === 'delivery_b.pk_bankacc_p').showHistory = false;
	//end tangleic 

	//财务组织用户过滤
	meta[list_search_id].items.map((item) => {
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode == 'delivery_b.pk_org_p') {
			item.isShowUnit = true;
		}
		// 上收银行账户
		if (item.attrcode == 'delivery_b.pk_bankacc_r') {
			item.queryCondition = () => {
				let pk_orgsearchVal = props.search.getSearchValByField(list_search_id, 'pk_org');
				let bankacc_r_pk_org = '';
				if (pk_orgsearchVal) {
					// 取search区域的值
					bankacc_r_pk_org = pk_orgsearchVal.value.firstvalue.split(',')[0];
				}
				return {
					// 这里对record.values.materiel要做一下非空校验
					pk_org: bankacc_r_pk_org,
					refnodename: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000048'),/* 国际化处理： 使用权参照*/
					//自定义增加的过滤条件
					GridRefActionExt: 'nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoFrozenFilter4NCC,nccloud.web.tmpub.filter.BanksubaccOnlyCurrent4NCC,nccloud.web.sf.delivery.delivery.filter.DefaultPayBankRefAccFilter4NCC'
				};
			}
		}
		// 缴款单位银行账户
		if (item.attrcode == 'delivery_b.pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_org_psearchVal = props.search.getSearchValByField(list_search_id, 'delivery_b.pk_org_p');
				let pkorgVal = '';
				if (pk_org_psearchVal) {
					// 取search区域的值
					pkorgVal = pk_org_psearchVal.value.firstvalue.split(',')[0];
				}
				return {
					pk_org: pkorgVal,
					refnodename: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000048'),/* 国际化处理： 使用权参照*/
					//自定义增加的过滤条件
					GridRefActionExt: 'nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoFrozenFilter4NCC,nccloud.web.tmpub.filter.BanksubaccOnlyCurrent4NCC,nccloud.web.sf.delivery.delivery.filter.DefaultPayBankRefAccFilter4NCC'
				};
			}
		}
	});

	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							//添加异常提示标记
    						cardCache.setDefData(cache.iserrtoast, dataSource, true);  
							props.pushTo("/card", {
								status: "browse",
								id: record.pk_delivery_h && record.pk_delivery_h.value,
								pagecode: card_page_id,
							});
						}}
					>
						{record && record.vbillno && record.vbillno.value}
					</a>
				);
			};
		}
		return item;
	});
	let multiLang = props.MutiInit.getIntl('36320FDA');
	//添加操作列
	meta[list_table_id].items.push({
		attrcode: 'opr',
		/* 国际化处理： 操作*/
		label: that.props.MutiInit.getIntl("36320FDA")
			&& that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000049'),
		width: 200,
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		render: (text, record, index) => {
			// 单据状态  1=待审批，2=待支付，3=支付中，4=转账成功，5=已作废，6=待提交， 
			let billstatus = record.billstatus;
			// 来源业务类型   1=手工录入，2=上收申请生成，3=自动上收生成，4=到账通知生成，5=委托付款取消回拨生成，    
			let srcbusitype = record.srcbusitype;
			// 审批状态 0=审批未通过，1=审批通过，2=审批进行中，3=提交，-1=自由， 
			let vbillstatus = record.vbillstatus;
			let ismakevoucher = record.ismakevoucher;

			let buttonAry = [];
			if (billstatus && billstatus.value) {
				// 1=待审批，2=待支付，3=支付中，4=转账成功，5=已作废，6=待提交
				if (billstatus.value == 6) {
					// 提交
					buttonAry.push('commit_inner');
					if (srcbusitype && srcbusitype.value) {
						if (srcbusitype.value == 1) {
							// 修改
							buttonAry.push('edit_inner');
							buttonAry.push('delete_inner');
						}
						else if (srcbusitype.value == 2 || srcbusitype.value == 4) {
							// 经办
							buttonAry.push('decide_inner');
							// 退回
							buttonAry.push('back_inner');
						}
					}
				}
				// 1=待审批，2=待支付，3=支付中，4=转账成功，5=已作废，6=待提交
				if (billstatus.value == 1) {
					if (vbillstatus && vbillstatus.value == 3) {
						// 收回
						buttonAry.push('umcommit_inner');
					}
				}
				if (ismakevoucher && ismakevoucher.value) {
					// 取消制证
					buttonAry.push('cancelvoucher');
				} else {
					if (billstatus.value == 4) {
						// 制证
						buttonAry.push('voucher_inner');
					}
				}
				if (srcbusitype.value != 5) {
					// 1=待审批，2=待支付，3=支付中，4=转账成功，5=已作废，6=待提交
					if (billstatus.value == 2) {
						// 支付
						buttonAry.push('pay_inner');
						// 网银补录
						buttonAry.push('netbankbulu_inner');
						// 收回
						buttonAry.push('umcommit_inner');
						// 网银浏览
						buttonAry.push('netbankbrowse_inner');
					}
					else if (billstatus.value == 3) {
						// 网银浏览
						// buttonAry.push('netbankbrowse_inner');
						// 收回
						buttonAry.push('umcommit_inner');
						// 支付状态
						buttonAry.push('paystatus_inner');
					}
					else if (billstatus.value == 4) {
						// 取消支付
						buttonAry.push('unpay_inner');
						// 网银浏览
						buttonAry.push('netbankbrowse_inner');
					}
					else if (billstatus.value == 5) {
						// 网银浏览
						buttonAry.push('netbankbrowse_inner');
					}
				}
				if (billstatus.value != 6) {
					// 审批详情
					buttonAry.push('reviewapprove_inner');
				}
			}
			// return props.button.createOprationButton(buttonAry, {
			// 	area: "list_inner",
			// 	buttonLimit: 3,
			// 	onButtonClick: (props, key) => tabButtonClick.call(this, props, key, text, record, index)
			// });
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry,
						{
							area: "list_inner",//区域编码
							buttonLimit: 3,//按钮显示个数
							onButtonClick: (props, key) => { tabButtonClick.call(that, props, key, text, record, index); }
						});
				}
			}));
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/