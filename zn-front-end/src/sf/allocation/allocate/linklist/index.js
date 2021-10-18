/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, high, toast, cacheTools, cardCache,getMultiLang,createPageIcon } from 'nc-lightapp-front';
const { NCUploader, PrintOutput, ApproveDetail, ApprovalTrans, Inspection } = high;
let { NCFormControl, NCAffix,NCDiv } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"
import { buttonClick, initTemplate, pageInfoClick, tableModelConfirm, afterEvent, setButtonUsability } from './events';
import { go2Card, go2linkCard, listMultiOperator, listSingleOperator } from '../../../pub/utils/SFButtonUtil';
//引入退回弹框
import Modal from "../../../../tmpub/pub/util/modal/index";
import { backConfirm } from "./events/buttonClick";
import { backConfirmInner } from "./events/bodyButtonClick";
// 网银补录
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index.js';
import { base_url, button,module_id,module_name,module_tmpub_name,module_tmpub_id, sourceModel_SF, SHOWMODEL_BULU, list_table_id, 
	link_list_page_id, viewmod_deal, billtype, print_nodekey, print_templateid, funcode, dataSource, card_page_id,allocatePk
    ,allocateBillType } from '../cons/constant.js';
import { getCahceValue } from "../util/index";
import { listSingleOperatorNoRecord } from "../../../pub/utils/SFButtonUtil";
import { setPropCache, saveMultiLangRes, loadMultiLang, createListWebSocket} from "../../../../tmpub/pub/util/index";

const { NCTabPane } = NCTabs;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = '3632';
		this.tableId = 'table_allocate_02';
		this.state = {
			//分组单据总数
			groupCount: {
				//待提交 总数
				DTJ: 0,
				//待审批 总数
				DSP: 0,
				//待支付 总数
				DZF: 0,
				//支付中 总数
				ZFZ: 0,
				//转账成功
				ZZCG: 0,
				//已作废
				YZF: 0,
				//全部
				QB: 0
			},
			// 网银补录 start
			showBuLu: false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			billId: '',//单据id
			billno: '',// 单据编号
			ts: '',
			//行索引
			rowIndex: -1,
			showUploader: false,
			returnnote: '',
			target: null,
			activeKey: '0',
			//默认显示全部分组
			defaultSelectGrup: 0,
			//当前选中的分组
			selectedGroup: 0,
			//输出用   
			outputData: {
				funcode: '', //功能节点编码，即模板编码
				nodekey: '', //模板节点标识
				printTemplateID: '', //模板id
				oids: [],
				outputType: 'output'
			},
			//指派数据
			assignData: null,
			//是否显示指派
			assignShow: false,

			//审批意见 start
			//审批意见是否显示
			approveshow: false,
			//审批意见单据类型
			            billtype: '',
			//审批意见 end
			//联查预算
			showInspection: false,
			//联查预算数据源
			            sourceData: null,
			//退回弹框
			showReBack: false,
			showReBackinner: false,
			record: '',
			index: '',
		}
		initTemplate.call(this, props);
	}
	//被联查逻辑处理
	componentDidMount() {
		//多语资源
		getMultiLang({
			//模块编码
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]:[module_tmpub_id],
				//sf模块多语资源
				[module_name]:[module_id,funcode]
				
			},
			//领域编码
			domainName: module_name,
			//回调
			callback: (lang) => {
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				initTemplate.call(this,this.props);
			}
		});


		let querytype = this.props.getUrlParam('linkquerytype');
		let srcbillid = this.props.getUrlParam('srcbillid');
		let pageInfo = this.props.table.getTablePageInfo(list_table_id);
		let pks =[];
		if(srcbillid) {
			pks = Array.isArray(srcbillid) ? srcbillid : [srcbillid];
		}
		if(!pks||pks.length<1) {
			let id=this.props.getUrlParam('id');
			pks=Array.isArray(id) ? id : [id];
			querytype='3';
		}
		let src = this.props.getUrlParam('scene');//来源场景
		if (src && src == 'fip') {
			//fip代表会计平台，凭证联查单据
			let checkedData = [];
			checkedData = cacheTools.get('checkedData');
			if (checkedData && checkedData.length > 0) {
				ajax({
					url: base_url + 'allocatevoucherbill.do',
					data: {
						operatingLogVO: checkedData,
						pageCode: link_list_page_id,
					},
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data) {
								if (data) {
									cardCache.setDefData(list_table_id, dataSource, data.grid[list_table_id]);
									if (data.grid[list_table_id].rows.length == 1) {
										let pk = data.grid[list_table_id].rows[0].values.pk_allocate_h.value;
										//单条数据跳转卡片
										this.props.pushTo('/linkcard', {
											pagecode:card_page_id,
											status: 'browse',
											id: pk
										});
									} else {
										this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
									}
								} else {
									this.props.table.setAllTableData(list_table_id, { rows: [] });
								}
							} else {
								this.props.table.setAllTableData(list_table_id, { rows: [] });
							}
						}
					}
				});
			}
		} else if (this.props.getUrlParam('pk_ntbparadimvo')) {
			//预算联查单据
			ajax({
				url: '/nccloud/sf/allocation/allocatentblinkbill.do',
				data: { pk: this.props.getUrlParam('pk_ntbparadimvo'), pageCode: link_list_page_id, pageInfo: pageInfo },
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data&&data.grid) {
							this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
						} else {
							this.props.table.setAllTableData(list_table_id, { rows: [] });
						}
					}
					// setButtonUsability.call(this,this.props);
				}
			});
		} else {
			//单据联查单据
			console.log("处理联查场景pks[0]参数：", pks);
			if (querytype && pks && pks.length > 0 && pks[0] != null && pks[0] != undefined) {
				let sendArr = {
					pageInfo: pageInfo,
					linkquerytype: querytype,
					pks: pks
				};
				ajax({
					url: '/nccloud/sf/allocation/linkedquery.do',
					data: sendArr,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if (data) {
								cardCache.setDefData(list_table_id, dataSource, data[list_table_id]);
								let rowlenght = data[list_table_id].rows;
								// let src = this.props.getUrlParam('src');
								if (rowlenght.length == 1) {
									let allocateReceiptRecord = rowlenght[0];
									//单条数据跳转卡片
									this.props.pushTo('/linkcard', {
										pagecode:card_page_id,
										status: 'browse',
										id: allocateReceiptRecord.values.pk_allocate_h.value
									});
								} else {
									//多条数据跳转列表页面
									this.props.table.setAllTableData(this.tableId, data[this.tableId]);
								}
							} else {
								this.props.table.setAllTableData(this.tableId, { rows: [] });
							}
						}
					}
				});
			}
		}


	}

	/**
	 * 更新state
	 */
	updateState(obj) {
		if (!obj || Object.keys(obj).length == 0) {
			return;
		}
		this.setState(obj);
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	//双击进卡片
	onRowDoubleClick = (record, index, props, e) => {
		props.pushTo('/linkcard', {
			pagecode:card_page_id,
			status: 'browse',
			id: record.pk_allocate_h.value
		});
	}


	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	//关闭审批意见页面
	closeApprove = () => {
		this.setState({
			approveshow: false
		})
	}

	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			alert(loadMultiLang(this.props,'36320FA-000092'))/* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			alert(loadMultiLang(this.props,'36320FA-000093'))/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		let buluCheckedData = this.props.table.getCheckedRows(this.tableId);
		//数据校验
		if (buluCheckedData.length != 1) {
			toast({ color: 'warning', content: loadMultiLang(this.props,'36320FA-000085') });/* 国际化处理： 请选择一条数据操作！*/
			return;
		}
		let bulupk;
		let buluts;
		//处理选择数据
		buluCheckedData.forEach((val) => {
			if (val.data.values.pk_allocate_h && val.data.values.pk_allocate_h.value) {
				bulupk = val.data.values.pk_allocate_h.value;
			}
			if (val.data.values.ts && val.data.values.ts.value) {
				buluts = val.data.values.ts.value;
			}
		});
		let buluData = {
			pk: bulupk,
			ts: buluts,
			results: retMsg,
			pageid: link_list_page_id,
		}
		ajax({
			url: '/nccloud/sf/allocation/allocatebuluretmsg.do',
			data: buluData,
			success: (res) => {
				if (res.success) {
					if (res && res.data) {
						//刷新当前单据
						// let row = res.data.head[list_table_id].rows[0];
						// let updateDataArr = [{
						// 	index: rowIndex,
						// 	data: { values: row.values }
						// }]
						// props.table.updateDataByIndexs(list_table_id, updateDataArr);
					} else {
						this.props.table.setAllTableData(list_table_id, { rows: [] });
					}
				}
			}
		});
	}

	/**
	 * 获取state中的数据
	 * @param {*} key 
	 */
	getState(key) {
		return this.state[key];
	};
	// //页签筛选
	// navChangeFun = (groupKey, className, e) => {
	// 	searchBtnClick.call(this, this.props, null, groupKey);
	// 	this.props.button.setButtonDisabled(button.refreshdisable, true);
	// };
	render() {
		let numvalues = this.state.numvalues;
		if (!numvalues) {
			numvalues = this.state.groupCount;
		}
		let { table, button, ncmodal, modal, BillHeadInfo  } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createButton, getButtons, createButtonApp } = button;
		let { showUploader, target, billno, billId, ts, assignData, assignShow, rowIndex, show, billtype, billid } = this.state;
		let { createModal } = modal;
		let createNCModal = ncmodal.createModal;
		return (
			<div className="nc-bill-list">
				{/**创建websocket连接 */}
				{createListWebSocket(this.props, {
                    tableAreaCode: list_table_id,
                    tablePkName: allocatePk,
					billtype: allocateBillType,
					dataSource: dataSource
                })}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
				
						<div className="header-title-search-area">
							{/*页面大图标*/}
							{createBillHeadInfo(
                                {
                                    title: loadMultiLang(this.props, '36320FA-000058'),//标题
                                    initShowBackBtn: false
                                }
                            )}
						</div>
						<div className="header-button-area">

							{createButtonApp({ area: "list_head", onButtonClick: buttonClick.bind(this) })}
						</div>
					
				</NCDiv>

				{/* <div style={{ borderTop: '1px solid #CCC' }}></div> */}

				<div className="nc-bill-table-area">
					{createSimpleTable(list_table_id, {
						pkname: 'pk_allocate_h',
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						onRowDoubleClick: this.onRowDoubleClick.bind(this),
						showCheck: true,
						showIndex: true,
						dataSource: dataSource,
						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props)
					})}
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader &&
						<NCUploader
							billId={billId}
							target={target}
							placement={'bottom'}
							billNo={billno}
							onHide={this.onHideUploader}
							// beforeUpload={this.beforeUpload}
							customInterface={
								{
									queryLeftTree: '/nccloud/tmpub/pub/lefttreequery.do',
									queryAttachments: '/nccloud/sf/allocation/allocateattachment.do'
								}
							}
						/>
					}
				</div>
				{/* 输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/sf/allocation/allocateprint.do"
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{createNCModal('delete', {
					title: loadMultiLang(this.props,'36320FA-000059'),/* 国际化处理： 删除*/
					content: loadMultiLang(this.props,'36320FA-000094'),/* 国际化处理： 确定要删除所选数据吗?*/
					beSureBtnClick: listMultiOperator.bind(this, this.props, link_list_page_id, list_table_id, 'pk_allocate_h', '/nccloud/sf/allocation/delete.do', loadMultiLang(this.props,'36320FA-000059'), dataSource)/* 国际化处理： 删除*/
				})}

				{/* 退回模态框 */}
				<Modal
					title={loadMultiLang(this.props,'36320FA-000063')}/* 国际化处理： 退回原因*/
					label={loadMultiLang(this.props,'36320FA-000063')}/* 国际化处理： 退回原因*/
					show={this.state.showReBack || this.state.showReBackinner}
					onOk={(value) => {
						//处理退回
						if (this.state.showReBack) {
							backConfirm.call(this, this.props, value);
						} else {
							backConfirmInner.call(this, this.props, this.state.record, this.state.index, value);
						}

					}}
					onClose={() => {
						this.setState({ showReBack: false, showReBackinner: false })
					}}
				/>


				{/** 联查预算 **/}
				<div>
					<Inspection
						show={this.state.showInspection}
						sourceData={this.state.sourceData}
						cancel={() => {
							this.setState({ showInspection: false })
						}}
						affirm={() => {
							this.setState({ showInspection: false })
						}}
					/>
				</div>

				{/* 支付模态框 */}
				{createModal('payModel', {
					title: loadMultiLang(this.props,'36320FA-000036'),/* 国际化处理： 支付*/
				})}
				{/** 审批流指派 **/}
				<div>
					{assignShow && <ApprovalTrans
						title={loadMultiLang(this.props,'36320FA-000065')}/* 国际化处理： 指派*/
						data={assignData}
						display={assignShow}
						getResult={(value) => {
							let extParam = {};
							if (value) {
								extParam['content'] = JSON.stringify(value);
							}
							//关闭指派框
							this.setState({ assignShow: false, assignData: null });
							listSingleOperatorNoRecord(this.props, link_list_page_id, list_table_id, base_url + 'commit.do', billId, ts, rowIndex, loadMultiLang(this.props,'36320FA-000006'), dataSource, true, extParam);/* 国际化处理： 提交成功！*/
						}}
						cancel={() => {
							this.setState({ assignShow: false, assignData: null })
						}}
					/>}
				</div>
				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={this.closeApprove}
						billtype={'36K2'}
						billid={this.state.billId}
					/>
				</div>

				{/** 网银补录组件 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}  //补录框显示
					modal={modal}
					onLineData={this.state.onLineData}  //补录数据
					moduleType={sourceModel_SF}  //模块编码
					modelType={this.state.modelType} //补录框类型
					//点击确定按钮的回调函数
					onSureClick={(retPayMsg) => {
						//处理补录信息(输出参数：PaymentRetMsg[])
						this.processRetMsg(retPayMsg);
						//关闭对话框
						this.setState({
							showBuLu: false
						})
					}}
					//点击关闭按钮的回调函数
					onCloseClick={() => {
						//关闭对话框
						this.setState({
							showBuLu: false
						});
					}}>
				</PayBuluForm>
			</div>
		);
	};

	//删除确认
	delConfirm = () => {

		let selectDatas = this.props.table.getCheckedRows(this.tableId);
		let { deleteCacheId } = this.props.table;
		//判断是否有选中行
		if (selectDatas == null || selectDatas.length == 0) {
			toast({ color: 'warning', content: loadMultiLang(this.props,'36320FA-000070') });/* 国际化处理： 未选中行！*/
			return;
		}
		let pkMapTs = {};
		let pkMapVbillno = {};
		let index = 0;
		var pks = new Array();
		let pk = null;
		let ts = null;
		let vbillno = null;
		while (index < selectDatas.length) {
			//获取行主键值
			pk = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values['pk_allocate_h'] && selectDatas[index].data.values['pk_allocate_h'].value;
			//获取行ts时间戳
			ts = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values.ts && selectDatas[index].data.values.ts.value;
			//单据编号
			vbillno = selectDatas[index] && selectDatas[index].data && selectDatas[index].data.values && selectDatas[index].data.values['vbillno'] && selectDatas[index].data.values['vbillno'].value;
			//判空
			if (pk && ts && vbillno) {
				pks[index] = pk;
				pkMapTs[pk] = ts;
				pkMapVbillno[pk] = vbillno;
			}
			index++;
		}
		if (Object.keys(pkMapTs).length > 0) {
			ajax({
				url: '/nccloud/sf/allocation/delete.do',
				data: {
					//主键pk与时间戳ts的映射
					pkMapTs,
					//页面编码
					link_list_page_id,
					//主键和单据编号的映射
					pkMapVbillno
				},
				success: (res) => {
					//批量操作直接刷新列表数据，不做数据单条更新操作
					deleteCacheId(list_table_id, pks);

					// this.refresh(1);
					toast({ color: 'success', content: loadMultiLang(this.props,'36320FA-000095') });/* 国际化处理： 批量删除成功！*/
					return;
				},
				error: (res) => {
					toast({ color: 'danger', content: res.message });
					return;
				}
			});
		}
	};


}

List = createPage({

	mutiLangCode: '3632'
})(List);

export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/