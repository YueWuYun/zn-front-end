/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/
import { createPage, ajax, base, toast ,cardCache} from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
import clickSearchBtn from './searchBtnClick';
import { setButtonUsability } from '../events';
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/SFButtonUtil';
import { go2card, loadSearchCache } from "../../util/index";
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
let { NCPopconfirm, NCIcon, NCTooltip } = base;
let searchId = jsoncode.searchcode;
let tableId = jsoncode.tablecode;
let pageId = jsoncode.pagecode;

//委托办理、取消委托办理用常量 begin
//map中存放主键与单据状态
let pkMap = {};
let indexEntrust = 0;
let pkEntrust = null;
let statusEntrust = null;
//委托办理、取消委托办理用常量 end
export default function (props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appid: jsoncode.appid
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//高级查询区域加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, jsoncode.searchcode, data);
					meta = modifierMeta(that, props, meta)
					props.meta.setMeta(meta);
					//从缓存中取值，给列表赋值
					setTimeout(()=>{
						let listdata = cardCache.getDefData(jsoncode.tablecode, jsoncode.dataSource);
						if (listdata && listdata.rows && listdata.rows.length > 0) {
							props.table.setAllTableData(jsoncode.tablecode, listdata);
						}
					},0);
					
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					setButtonUsability(props);
					props.button.setPopContent('DeleteInner', loadMultiLang(props,'36320DA-000058'));/* 国际化处理： 确定要删除吗？*/
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
	//上收组织跨集团
	meta[jsoncode.searchcode].items.find((e) => e.attrcode == 'pk_gatherorg').isShowUnit = true;
	meta[jsoncode.searchcode].items.map((item) => {
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
	});
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.col = '3';
		return item;
	})

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == 'vbillno') {
			item.render = (text, record, index) => {
				return (

					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							//go2card(props, { pagecode: jsoncode.cpageid, status: 'browse', id: record.pk_deliveryapply_h.value }, that.getState.bind(that));
							props.pushTo("/linkcard", { status: "browse", id: record.pk_deliveryapply_h.value });
						}}
					>
						{record && record.vbillno && record.vbillno.value}
					</a>

				);
			};
		}
		return item;
	});

	let multiLang = props.MutiInit.getIntl('2052');
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		//label: multiLang && multiLang.get('20521030-0005'),
		label: loadMultiLang(props,'36320DA-000022'),/* 国际化处理： 操作*/
		itemtype:'customer',
		fixed: 'right',
		width: 200,
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [];
			// if (record.billstatus && record.billstatus.value == '1') {//待审批
			// 	buttonAry = ['UncommitInner', 'ApproveInfoInner'];
			// } else if (record.billstatus && record.billstatus.value == '2') {//待委托
			// 	buttonAry = ['UncommitInner', 'EntrustInner', 'ApproveInfoInner'];
			// } else if (record.billstatus && record.billstatus.value == '3') {//处理中
			// 	buttonAry = ['CancelEntrustInner', 'ApproveInfoInner'];
			// } else if (record.billstatus && record.billstatus.value == '4') {//处理完毕
			// 	buttonAry = ['ApproveInfoInner'];
			// } else if (record.billstatus && record.billstatus.value == '5') {//待提交
			// 	buttonAry = ['CommitInner', 'EditInner', 'DeleteInner'];
			// }
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick(that, props, key, text, record, index)
			});
		}
	});

	const tableButtonClick = (that, props, key, text, record, index) => {
		let searchId = jsoncode.searchcode;
		let tableId = jsoncode.tablecode;
		let pageId = jsoncode.pagecode;
		//刷新
		let searchData = props.search.getAllSearchData(jsoncode.searchcode);
		switch (key) {
			// 表格操作按钮
			case 'EditInner':
				//修改
				// props.pushTo("/card", {
				// 	status: "edit",
				// 	id: record.pk_deliveryapply_h.value,
				// 	pagecode: jsoncode.cpageid
				// });
				//修改改为如下方式，是因为当有数据权限的时候，不让其跳转页面，上面屏蔽的那种方式，是先跳页面，在去查询判断
				let editData = {
					pk: record.pk_deliveryapply_h.value,
					ts: record.ts && record.ts.value,
					pageid: jsoncode.cpageid,
					status: 'edit',
				}
				ajax({
					url: requesturl.querycard,
					data: editData,
					success: (res) => {
						if (res.data) {
							props.pushTo("/card", {
								status: 'edit',
								id: record.pk_deliveryapply_h && record.pk_deliveryapply_h.value
							});
						}
					}
				});
				break;
			case 'DeleteInner':
				let { deleteCacheId } = props.table;
				//删除按钮
				let indexArr2 = [];
				indexArr2.push(record.index);
				ajax({
					url: requesturl.delete,
					data: {
						pk: record.pk_deliveryapply_h.value,
						ts: record.ts.value
					},
					success: function (res) {
						let { success, data } = res;
						if (success) {
							toast({ color: 'success', content: loadMultiLang(props,'36320DA-000025') });/* 国际化处理： 删除成功*/
							props.table.deleteTableRowsByIndex(tableId, index)//直接删除table中的行列
							//删除缓存中数据
							deleteCacheId(jsoncode.tablecode, record.pk_deliveryapply_h.value);
						} else {
							toast({ color: 'warning', content: loadMultiLang(props,'36320DA-000059') });/* 国际化处理： 删除失败，请稍后再试！*/
						}
					}
				});
				break;
			// 提交
			case 'CommitInner':
				listSingleOperator(props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchcommit, record, 'pk_deliveryapply_h', index, loadMultiLang(props,'36320DA-000010'), jsoncode.dataSource, false, null, (props, data) => {/* 国际化处理： 提交*/
					let { workflow } = data;
					//有指派信息，则指派，没有则重绘界面
					if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
						that.setState({
							assignData: data,
							assignShow: data,
							index: index,
							ts: record['ts'].value,
							billID: record['pk_deliveryapply_h'].value
						});
					}
				});
				break;
			// 收回
			case 'UncommitInner':
				listSingleOperator(props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchuncommit, record, 'pk_deliveryapply_h', index, loadMultiLang(props,'36320DA-000011'), jsoncode.dataSource);/* 国际化处理： 收回*/
				break;
			//委托办理
			case 'EntrustInner':
				listSingleOperator(props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchsubmit, record, 'pk_deliveryapply_h', index, loadMultiLang(props,'36320DA-000019'), jsoncode.dataSource);/* 国际化处理： 委托办理*/
				break;
			//取消委托
			case 'CancelEntrustInner':
				listSingleOperator(props, jsoncode.pagecode, jsoncode.tablecode, requesturl.batchunsubmit, record, 'pk_deliveryapply_h', index, loadMultiLang(props,'36320DA-000020'), jsoncode.dataSource);/* 国际化处理： 取消委托办理*/
				break;
			//审批意见
			case 'ApproveInfoInner':
				if (record.pk_deliveryapply_h && record.pk_deliveryapply_h.value) {
					that.setState({
						showApprove: true,
						approveBilltype: '36K3',//单据类型
						approveBillId: record.pk_deliveryapply_h.value//单据pk
					});
				}
				break;
		}
	};
	// meta[searchId].items.map((item) => {
	//     //上收组织参照过滤
	// 	if (item.attrcode == 'pk_gatherorg') {
	// 	            item.queryCondition = () => {
	// 	                let pk_org = props.search.getSearchValByField('search', 'pk_org').value.firstvalue;
	// 	                return {
	// 	                    pk_org: pk_org		              
	// 	                };
	// 	            };
	// 	}
	// 	//缴款银行账户参照过滤
	// 	if (item.attrcode == 'pk_bankacc_p') {
	// 		       item.queryCondition = () => {
	// 			        return {
	// 						GridRefActionExt: ('nccloud.web.sf.delivery.deliveryapply.filter.DefaultPayBankRefAccFilter')		              
	// 		            };
	// 		        };
	// 		}

	// });
	//被联查页面不显示 翻页
	meta[tableId].pagination = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakSyfTwhWpk4XRVJggXxHt0O/7C0qG9iK3AHbi3mv/Fzl*/