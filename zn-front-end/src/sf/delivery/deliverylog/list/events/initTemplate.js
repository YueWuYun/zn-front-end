/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon, NCTooltip } = base;
import { jsoncode, requesturl } from '../../util/const.js';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
let searchId = 'search_deliverylog_01';
let tableId = 'table_deliverylog_01';
let pageId = '36321ACLQ_L01';
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appcode: props.getUrlParam('c')  //复制小应用时传输
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//高级查询区域加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, jsoncode.searchcode, data);
					meta[that.tableId].pagination = true;
					meta = modifierMeta(props, meta)
					props.meta.setMeta(meta);
					//列表查询区域加载默认业务单元
					setDefOrg2ListSrchArea(props, jsoncode.searchcode, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
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

function modifierMeta(props, meta) {
	//缴款单位跨集团
	meta[jsoncode.searchcode].items.find((e) => e.attrcode == 'deliverylog_b.pk_financeorg').isShowUnit = true;
	meta[jsoncode.searchcode].items.map((item) => {
		item.isShowDisabledData = true;
		//财务组织根据角色权限显示
		// if (item.attrcode == 'pk_org') {
		// 	item.queryCondition = () => {
		// 		return {
		// 			funcode: jsoncode.appcode,
		// 			TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
		// 		};
		// 	};
		// }
		//财务组织根据角色权限显示
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					//funcode: jsoncode.appcode,
					//用来解决复制小应用的组织权限
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		// 上收银行账户
		if (item.attrcode == 'pk_bankacc_r') {
			item.queryCondition = () => {
				let pk_orgsearchVal = props.search.getSearchValByField(jsoncode.searchcode, 'pk_org');
				let bankacc_r_pk_org = '';
				if (pk_orgsearchVal) {
					// 取search区域的值
					bankacc_r_pk_org = pk_orgsearchVal.value.firstvalue.split(',')[0];
				}
				return {
					// 这里对record.values.materiel要做一下非空校验
					pk_org: bankacc_r_pk_org,
					refnodename: loadMultiLang(props, '36320DA-000021'),/* 国际化处理： 使用权参照*/
					//自定义增加的过滤条件
					GridRefActionExt: 'nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoFrozenFilter4NCC,nccloud.web.tmpub.filter.BanksubaccOnlyCurrent4NCC,nccloud.web.sf.delivery.delivery.filter.DefaultPayBankRefAccFilter4NCC'
				};
			}
		}
		// 缴款单位银行账户
		if (item.attrcode == 'deliverylog_b.pk_bankacc_p') {
			item.queryCondition = () => {
				let pk_org_psearchVal = props.search.getSearchValByField(jsoncode.searchcode, 'deliverylog_b.pk_financeorg');
				let pkorgVal = '';
				if (pk_org_psearchVal) {
					// 取search区域的值
					pkorgVal = pk_org_psearchVal.value.firstvalue.split(',')[0];
				}
				return {
					pk_org: pkorgVal,
					refnodename: loadMultiLang(props, '36320DA-000021'),/* 国际化处理： 使用权参照*/
					//自定义增加的过滤条件
					GridRefActionExt:
						'nccloud.web.sf.allocation.allocateapply.filter.AllocateApplyCurrentRefBankAccFilter,' +
						'nccloud.web.sf.allocation.allocateapply.filter.DefaultRefRBankAccFilter'
				};
			}
		}

	});

	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.col = '3';
		return item;
	})

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == 'rulecode') {
			item.render = (text, record, index) => {
				return (

					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo("/card", {
								pagecode: jsoncode.cpageid,
								status: 'browse',
								id: record.pk_deliverylog_h.value
							});
						}}
					>
						{record && record.rulecode && record.rulecode.value}
					</a>

				);
			};
		}
		return item;
	});


	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/