/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
import { go2Card, listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../../pub/cons/constant.js';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
import { setButtonUsability } from '../events';
let { NCPopconfirm, NCIcon,NCTooltip } = base;
import { go2card, loadSearchCache } from "../../util/index";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

let searchId = 'search_deliveryrule_01';
let tableId = 'table_deliveryrule_01';
let pageId = '36320ACC_L01';
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
					meta = modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
					loadSearchCache(props, data);
					//列表查询区域加载默认业务单元
					setDefOrg2ListSrchArea(props, jsoncode.searchcode, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonUsability(props);
					props.button.setPopContent('DeleteInner', loadMultiLang(props,'36320ACC-000029'));/* 国际化处理： 确定要删除吗？*/
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
	meta[jsoncode.searchcode].items.find((e) => e.attrcode == 'deliveryrule_b.pk_financeorg').isShowUnit = true;
	meta[jsoncode.searchcode].items.map((item) => {
		item.isShowDisabledData = true;
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
				// 上收银行账户 参考资金上收业务
				if (item.attrcode == 'pk_bankacc_r') {
					item.queryCondition = () => {
						let pk_orgsearchVal = props.search.getSearchValByField(jsoncode.searchcode, 'pk_org');
						let bankacc_r_pk_org ='';
						if(pk_orgsearchVal){
							// 取search区域的值
							bankacc_r_pk_org = pk_orgsearchVal.value.firstvalue.split(',')[0];
						}
						return {
							// 这里对record.values.materiel要做一下非空校验
							pk_org: bankacc_r_pk_org, 
							refnodename: loadMultiLang(props,'36320ACC-000013'),/* 国际化处理： 使用权参照*//* 国际化处理： 使用权参照*/
							//自定义增加的过滤条件
							GridRefActionExt: 'nccloud.web.tmpub.filter.BanksubaccNoInnerAccFilter4NCC,nccloud.web.tmpub.filter.BanksubaccNoFrozenFilter4NCC,nccloud.web.tmpub.filter.BanksubaccOnlyCurrent4NCC,nccloud.web.sf.delivery.delivery.filter.DefaultPayBankRefAccFilter4NCC'
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
							go2card(props, { pagecode: jsoncode.cpageid, status: 'browse', id: record.pk_deliveryrule_h.value }, that.getState.bind(that));
						}}
					>
						{record && record.rulecode && record.rulecode.value}
					</a>

				);
			};
		}
		//  else if (item.attrcode == 'dapprovedate'){
		// 	item.render = (text, record, index) => {
		// 		return (
		// 			<span>
		// 				{record.dapprovedate && seperateDate(record.dapprovedate.value)}
		// 			</span>
		// 		);
		// 	};
		// }
		return item;
	});

	let multiLang = props.MutiInit.getIntl('2052');
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		//label: multiLang && multiLang.get('20521030-0005'),
		label: loadMultiLang(props,'36320ACC-000014'),/* 国际化处理： 操作*/
		itemtype:'customer',
		fixed: 'right',
		width: 200,
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [];
			if (record.billstatus && record.billstatus.value == '3') {//待提交
				buttonAry = ['CommitInner', 'EditInner', 'DeleteInner', 'BankAccReWriteInner', 'BankAccBrowseInner'];
			} else if (record.billstatus && record.billstatus.value == '1') {//待审批
				buttonAry = ['UncommitInner', 'BankAccReWriteInner', 'BankAccBrowseInner', 'ApproveInfoInner'];
			} else if (record.billstatus && record.billstatus.value == '2') {//已审批
				if (record.isenable.value == false) {//封存 否  说明是启用状态  显示停用按钮
					buttonAry = ['UncommitInner','DisableInner', 'BankAccBrowseInner'];
				} else {
					buttonAry = ['UncommitInner','EnableInner', 'BankAccBrowseInner'];
				}

			}
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			});
		}
	});

	const tableButtonClick = (props, key, text, record, index) => {
		let searchId = 'search_deliveryrule_01';
		let tableId = 'table_deliveryrule_01';
		let pageId = '36320ACC_L01';
		let pkMapTs = {};
		switch (key) {
			// 表格操作按钮
			case 'EditInner':
				//修改
				props.pushTo("/card", {
					pagecode: jsoncode.cpageid,
					status: 'edit',
					id: record.pk_deliveryrule_h.value
				});

				break;
			//行内删除按钮
			case 'DeleteInner':
				let { deleteCacheId } = props.table;
				let indexArr2 = [];
				indexArr2.push(record.index);
				ajax({
					url: '/nccloud/sf/deliveryrule/deliveryruledelete.do',
					data: {
						pk: record.pk_deliveryrule_h.value,
						ts: record.ts.value
					},

					success: function (res) {
						let { success, data } = res;
						if (success) {
							toast({ color: 'success', content: loadMultiLang(props,'36320ACC-000017') });/* 国际化处理： 删除成功*/
							props.table.deleteTableRowsByIndex(tableId, index)//直接删除table中的行列
							//删除缓存中数据
							deleteCacheId(jsoncode.tablecode, record.pk_deliveryrule_h.value);
						} else {
							toast({ color: 'warning', content: loadMultiLang(props,'36320ACC-000032') });/* 国际化处理： 删除失败，请稍后再试！*/
						}
					}
				});
				break;
			// 提交
			case 'CommitInner':
				listSingleOperator(props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchcommit, record, 'pk_deliveryrule_h', index, loadMultiLang(props,'36320ACC-000007'), jsoncode.dataSource, false, null, (props, data) => {/* 国际化处理： 提交*/
					let { workflow } = data;
					//有指派信息，则指派，没有则重绘界面
					if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
						that.setState({
							assignData: data,
							assignShow: data,
							index: index,
							ts: record['ts'].value,
							billID: record['pk_deliveryrule_h'].value
						});
					}
				});
				break;
			// 收回
			case 'UncommitInner':
				listSingleOperator(props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchuncommit, record, 'pk_deliveryrule_h', index, loadMultiLang(props,'36320ACC-000012'), jsoncode.dataSource);/* 国际化处理： 收回*/
				break;
			// 启用
			case 'EnableInner':
				listSingleOperator(props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchenable, record, 'pk_deliveryrule_h', index, loadMultiLang(props,'36320ACC-000010'), jsoncode.dataSource);/* 国际化处理： 启用*/
				break;
			// 停用
			case 'DisableInner':
				listSingleOperator(props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchdisable, record, 'pk_deliveryrule_h', index, loadMultiLang(props,'36320ACC-000011'), jsoncode.dataSource);/* 国际化处理： 停用*/
				break;
			// 补录
			case 'BankAccReWriteInner':
				pkMapTs[record.pk_deliveryrule_h.value] = record.ts.value;
				that.pkMapTs = pkMapTs;
				ajax({
					url: '/nccloud/sf/deliveryrule/deliveryrulebankrewrite.do',
					data: {
						//主键pk与时间戳ts的映射
						pkMapTs,
						//页面编码
						pageCode: jsoncode.pagecode,
						//是否返回数据
						isRet: true
					},
					success: (res) => {
						if (res && res.data) {
							that.setState(
								{
									onLineData: res.data || [],
									modelType: SHOWMODEL_BULU
								}, () => {
									that.setState({ showBuLu: true });
								});
						}
					}
				});
				break;
			// 浏览
			case 'BankAccBrowseInner':
				pkMapTs[record.pk_deliveryrule_h.value] = record.ts.value;
				that.pkMapTs = pkMapTs;
				ajax({
					url: '/nccloud/sf/deliveryrule/deliveryrulebankbrowse.do',
					data: {
						//主键pk与时间戳ts的映射
						pkMapTs,
						//页面编码
						pageCode: jsoncode.pagecode,
						//是否返回数据
						isRet: true
					},
					success: (res) => {
						if (res && res.data) {
							that.setState(
								{
									onLineData: res.data || [],
									modelType: SHOWMODEL_LIULAN
								}, () => {
									that.setState({ showBuLu: true });
								});
						}
					}
				});
				break;
			//审批意见
			case 'ApproveInfoInner':
				if (record.pk_deliveryrule_h && record.pk_deliveryrule_h.value) {
					that.setState({
						showApprove: true,
						approveBilltype: '36KC',//单据类型
						approveBillId: record.pk_deliveryrule_h.value//单据pk
					});
				}
			default:
				console.log(key, index);
				break;
		}
	};
	return meta;
}



// export const listSingleUpdate = function (props, data, tableId, index) {
// 	if (data && data.head && data.head[tableId] && data.head[tableId].rows && data.head[tableId].rows.length > 0) {
// 		let row = data.head[tableId].rows[0];
// 		let updateDataArr = [{
// 			index: index,
// 			data: { values: row.values }
// 		}]
// 		props.table.updateDataByIndexs(tableId, updateDataArr);
// 	}
// }

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/