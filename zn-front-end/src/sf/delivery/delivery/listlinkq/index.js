/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
//主子表列表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, cacheTools, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability } from './events';
// 网银补录
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form';
import { saveMultiLangRes, loadMultiLang ,createListWebSocket} from "../../../../tmpub/pub/util/index";
import { sourceModel_SF, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU } from '../../../pub/cons/constant.js';
import {
	module_id, module_name, module_tmpub_name, module_tmpub_id, appcode,
	list_page_id, list_search_id, list_table_id, link_list_page_id,
	cachesearchKey, dataSourceLink, cacheTabKey, cacheTabActiveKey,deliveryPk,deliveryBillType,
	card_page_id,
} from './../cons/constant.js';

let { NCTabsControl, NCFormControl, NCDiv } = base;
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index";
let { NCUploader, ApproveDetail, PrintOutput, ApprovalTrans, Inspection } = high;
let { getNextId, getCurrentLastId, deleteCacheById, deleteCacheId, getCacheById, updateCache, addCache, setDefData, getDefData } = cardCache;
const { NCTabPane } = NCTabs;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = module_id;
		this.searchId = list_search_id;
		this.tableId = list_table_id;
		this.pageId = link_list_page_id;

		this.pk_delivery_h = null;
		this.ts = null;

		this.state = {
			// 选中页签的信息
			numvalues: {},
			activeKey: '1',
			returnnote: '',
			// 网银补录 start
			showBuLu: false,
			onLineData: [],
			modelType: SHOWMODEL_BULU,
			// 网银补录 end

			// 附件相关 start
			//单据pk
			billId: '',
			//附件管理使用单据编号
			billno: '',
			//控制附件弹出框
			showUploader: false,
			//控制弹出位置
			target: null,
			// 附件相关 end

			// 联查预算 start
			//是否显示预算计划
			showNtbDetail: false,
			//预算计划数据
			ntbdata: null,
			// 联查预算 end

			//审批意见 start
			//审批意见是否显示
			show: false,
			//审批意见单据pk
			billid: '',
			//审批意见单据类型
			billtype: '',
			//审批意见 end

			//输出用   
			outputData: {
				funcode: '', //功能节点编码，即模板编码
				nodekey: '', //模板节点标识
				printTemplateID: '', //模板id
				oids: [],
				outputType: 'output'
			},

			// 提交即指派 start
			compositedata: null,
			compositedisplay: null,
		};
		initTemplate.call(this, props);
	}

	componentDidMount() {
		// 联查信息
		let srcbilltype = this.props.getUrlParam('srcbilltype');
		if (srcbilltype) {
			// 上游生成上收单，根据pk_srcbill查询
			// 36KC 上收规则设置;36K3 上缴单;36J1 委托付款
			if (srcbilltype === '36KC' || srcbilltype === '36K3'
				|| srcbilltype === '36J1' || srcbilltype === '36J5') {
				this.getLinkQueryBillDataBySrc();
				return;
			} else {
				this.getLinkQueryBillData();
				return;
			}
		}
		if (this.props.getUrlParam('pk_ntbparadimvo')) {
			// 预算联查单据
			this.getNtbLinkBillData();
			return;
		} else {
			// this.getData();
		}
		//src修改为scene
		let src = this.props.getUrlParam('scene');
		if (src) {
			//fip代表会计平台
			if ('fip' == src) {
				this.voucherLinkBill();
				return;
			}
			else if ('linksce' === src) {
				this.getLinkQueryBillData();
			}
		}
		this.restoreData();
		setButtonUsability.call(this, this.props);
	}

	componentWillMount() {
		getMultiLang({
			moduleId: {
				//tmpub模块多语资源
				[module_tmpub_name]: [module_tmpub_id],
				//fts模块多语资源
				[module_name]: [module_id, '36320FDA']
			},
			//回调
			callback: (lang) => {
				this.setState({ lang });
				//将多语资源数据存储到页面级缓存中
				saveMultiLangRes(this.props, lang);
				//初始化模板
				// initTemplate(this.props);
			}
		});
	}

	// 还原列表页数据
	restoreData = () => {
		//获取页签数据
		let cachestate = getDefData(cacheTabKey, dataSourceLink);
		let cachestateTabActiveKey = getDefData(cacheTabActiveKey, dataSourceLink);
		if (cachestate) {
			let keys = Object.keys(cachestate);
			this.setState({ numvalues: cachestate });
			this.setState({ activeKey: cachestateTabActiveKey });
		}
		let tableData = getDefData(list_table_id, dataSourceLink);
		if (tableData) {
			this.props.table.setAllTableData(list_table_id, tableData);
		}
	}

	// 凭证联查单据
	voucherLinkBill = () => {
		let checkedData = [];
		//缓存中的key为’checkedData’,
		checkedData = cacheTools.get('checkedData');
		if (checkedData && checkedData.length > 0) {
			let data = {
				operatingLogVO: checkedData,
				pageCode: link_list_page_id,
			};
			ajax({
				url: '/nccloud/sf/delivery/deliveryvoucherlinked.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
							let rowlenght = data.grid[list_table_id].rows;
							if (rowlenght.length == 1) {
								setDefData(list_table_id, dataSourceLink, data.grid[list_table_id]);
								let record = rowlenght[0];
								//1条数据跳转到卡片页面
								this.props.pushTo("/cardlinkq", {
									status: 'browse',
									id: record.values.pk_delivery_h && record.values.pk_delivery_h.value,
									pagecode: card_page_id,
								});
							} else {
								//多条数据跳转到列表页面
								this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
							}
						} else {
							/* 国际化处理： 未联查到对应的上收单!*/
							toast({
								color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
									&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000097')
							});
							this.props.table.setAllTableData(list_table_id, { rows: [] });
						}
					} else {
						/* 国际化处理： 未联查到对应的上收单!*/
						toast({
							color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
								&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000097')
						});
					}
					setButtonUsability.call(this, this.props);
				}
			});
		}
	}

	// 上游生成上收单，根据pk_srcbill查询
	getLinkQueryBillDataBySrc = () => {
		let srckey = this.props.getUrlParam('srckey');
		let id = this.props.getUrlParam('id');
		let pk;
		if (srckey) {
			pk = srckey;
		} else {
			pk = id;
		}
		if (pk) {
			let pageInfo = this.props.table.getTablePageInfo(list_table_id);
			let data = {
				pk_srcbill: pk,
				pageid: link_list_page_id,
				pageInfo: pageInfo,
			};
			ajax({
				url: '/nccloud/sf/delivery/deliveryquerybysrc.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
							let rowlenght = data.grid[list_table_id].rows;
							if (rowlenght.length == 1) {
								setDefData(list_table_id, dataSourceLink, data.grid[list_table_id]);
								let record = rowlenght[0];
								//1条数据跳转到卡片页面
								this.props.pushTo("/cardlinkq", {
									status: 'browse',
									id: record.values.pk_delivery_h && record.values.pk_delivery_h.value,
									pagecode: card_page_id,
								});
							}
						} else {
							/* 国际化处理： 未联查到对应的上收单!*/
							toast({
								color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
									&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000097')
							});
							this.props.table.setAllTableData(list_table_id, { rows: [] });
						}
					} else {
						/* 国际化处理： 未联查到对应的上收单!*/
						toast({
							color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
								&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000097')
						});
					}
					setButtonUsability.call(this, this.props);
				}
			});
		}
	}

	// 上收单生成下游，根据主键查询
	getLinkQueryBillData = () => {
		let srckey = this.props.getUrlParam('srckey');
		let id = this.props.getUrlParam('id');
		let pk;
		if (srckey) {
			pk = srckey;
		} else {
			pk = id;
		}
		if (pk) {
			let data = {
				pk: pk,
				pks: [pk],
				pageid: link_list_page_id,
			};
			ajax({
				url: '/nccloud/sf/delivery/deliveryquerybypks.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							this.props.table.setAllTableData(list_table_id, data[list_table_id]);
							let rowlenght = data[list_table_id].rows;
							if (rowlenght.length == 1) {
								setDefData(list_table_id, dataSourceLink, data[list_table_id]);
								let record = rowlenght[0];
								//1条数据跳转到卡片页面
								this.props.pushTo("/cardlinkq", {
									status: 'browse',
									id: record.values.pk_delivery_h && record.values.pk_delivery_h.value,
									pagecode: card_page_id,
								});
							}
						} else {
							/* 国际化处理： 未联查到对应的上收单!*/
							toast({
								color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
									&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000097')
							});
							this.props.table.setAllTableData(list_table_id, { rows: [] });
						}
					} else {
						/* 国际化处理： 未联查到对应的上收单!*/
						toast({
							color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
								&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000097')
						});
					}
					setButtonUsability.call(this, this.props);
				}
			});
		}
	}

	// 预算联查单据
	getNtbLinkBillData = (serval) => {
		let pageInfo = this.props.table.getTablePageInfo(list_table_id);
		ajax({
			url: '/nccloud/sf/delivery/deliveryntblinkbill.do',
			data: {
				pk: this.props.getUrlParam('pk_ntbparadimvo'),
				pageCode: this.pageId,
				pageInfo: pageInfo,
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data && data.grid && data.grid[list_table_id]) {
						this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
						let rowlenght = data.grid[list_table_id].rows;
						if (rowlenght.length == 1) {
							setDefData(list_table_id, dataSourceLink, data.grid[list_table_id]);
							let record = rowlenght[0];
							//1条数据跳转到卡片页面
							this.props.pushTo("/cardlinkq", {
								status: 'browse',
								id: record.values.pk_delivery_h && record.values.pk_delivery_h.value,
								pagecode: card_page_id,
							});
						}
					} else {
						/* 国际化处理： 未联查到对应的上收单!*/
						toast({
							color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
								&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000097')
						});
						this.props.table.setAllTableData(list_table_id, { rows: [] });
					}
				} else {
					/* 国际化处理： 未联查到对应的上收单!*/
					toast({
						color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
							&& this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000097')
					});
				}
				setButtonUsability.call(this, this.props);
			}
		});
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	//刷新列表信息
	refresh = () => {
		//分页
		let refreshpageInfo = this.props.table.getTablePageInfo(list_table_id);
		//查询condition
		let refreshsearchVal = this.props.search.getAllSearchData(list_search_id);
		let queryInfo = this.props.search.getQueryInfo(list_search_id, false);
		let oid = queryInfo.oid;
		if (refreshsearchVal && refreshsearchVal.conditions) {
			setDefData(cachesearchKey, dataSourceLink, refreshsearchVal);
			let data = {
				querycondition: refreshsearchVal,
				custcondition: {
					logic: "and",   //逻辑操作符，and、or
					conditions: [
					],
				},
				conditions: refreshsearchVal.conditions || refreshsearchVal,
				pageInfo: refreshpageInfo,
				pagecode: link_list_page_id,
				//查询区编码
				queryAreaCode: list_search_id,
				//查询模板id，手工添加在界面模板json中，放在查询区
				oid: oid,
				querytype: 'tree'
			};

			ajax({
				url: '/nccloud/sf/delivery/deliveryquery.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data.grid) {
							this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
						} else {
							this.props.table.setAllTableData(this.tableId, { rows: [] });
						}
						if (data.numvalues) {
							this.setState({ numvalues: data.numvalues, activeKey: 6 });
						} else {
							this.setState({ numvalues: {} });
						}
					}
				}
			});
			setButtonUsability.call(this, this.props);
		}
	}

	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		let cachesearch = getDefData(cachesearchKey, dataSourceLink);
		if (cachesearch && cachesearch.conditions) {
			for (let item of cachesearch.conditions) {
				if (item.value && item.value.firstvalue) {
					if (item.field == 'dbilldate') {
						// 时间类型特殊处理
						let time = [];
						time.push(item.value.firstvalue);
						time.push(item.value.secondvalue);
						this.props.search.setSearchValByField(this.searchId, item.field,
							{ display: item.display, value: time });
					} else {
						this.props.search.setSearchValByField(this.searchId, item.field,
							{ display: item.display, value: item.value.firstvalue });
					}
				}
			}
		}
	}

	getData = (serval) => {
		let servalTemp = serval && serval[0] ? serval[0] : null;
		//分页
		let datapageInfo = this.props.table.getTablePageInfo(list_table_id);
		//查询condition
		let datasearchVal = this.props.search.getAllSearchData(list_search_id);
		let queryInfo = this.props.search.getQueryInfo(list_search_id, false);
		let oid = queryInfo.oid;
		if (datasearchVal && datasearchVal.conditions) {
			let data = {
				querycondition: datasearchVal,
				custcondition: {
					conditions: [servalTemp],
					logic: "and"
				},
				pagecode: this.pageId,
				pageInfo: datapageInfo,
				queryAreaCode: this.searchId,
				oid: oid,
				querytype: 'tree'
			};
			ajax({
				url: '/nccloud/sf/delivery/deliveryquery.do',
				data: data,
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if (data) {
							if (data.grid) {
								this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
							} else {
								this.props.table.setAllTableData(this.tableId, { rows: [] });
							}
							if (data.numvalues) {
								this.setState({ numvalues: data.numvalues });
							}
							setDefData(cacheTabKey, dataSourceLink, this.state.numvalues);
							setDefData(cacheTabActiveKey, dataSourceLink, this.state.activeKey);
							// this.setState({ activeKey: 5 });
						} else {
							this.props.table.setAllTableData(this.tableId, { rows: [] });
							this.setState({ numvalues: {} });
						}
					}
				}
			});
			setButtonUsability.call(this, this.props);
		}
	};
	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
		switch (status) {
			case '1':
				serval = [
					{
						field: 'billstatus',
						value: {
							firstvalue: '6',
							secondvalue: null
						},
						oprtype: '=',
						datatype: 203,
					}
				];
				this.getData(serval);
				this.setState({ activeKey: '1' });
				break;
			// 待审批
			case '2':
				serval = [
					{
						field: 'billstatus',
						value: {
							firstvalue: '1',
							secondvalue: null
						},
						oprtype: '=',
						datatype: 203,
					}
				];
				this.setState({ activeKey: '2' });
				this.getData(serval);
				break;
			// 待支付
			case '3':
				serval = [
					{
						field: 'billstatus',
						value: {
							firstvalue: '2',
							secondvalue: null
						},
						oprtype: '=',
						datatype: 203,
					}
				];
				this.setState({ activeKey: '3' });
				this.getData(serval);
				break;
			// 全部
			case '4':
				serval = [
					{
						field: 'billstatus',
						value: {
							firstvalue: null,
							secondvalue: null
						},
						oprtype: '=',
						datatype: 203,
					}
				];
				this.setState({ activeKey: '4' });
				this.getData(serval);
				break;
			default:
				break;
		}
	};

	//处理网银补录返回信息
	processRetMsg = (retMsg) => {
		let buluCheckedData = this.props.table.getCheckedRows(this.tableId);
		//数据校验
		if (buluCheckedData.length != 1) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000070') });/* 国际化处理： 请选择一条数据操作！*/
			return;
		}
		let bulupk = [];
		let buluts = [];
		//处理选择数据
		buluCheckedData.forEach((val) => {
			if (val.data.values.pk_delivery_h && val.data.values.pk_delivery_h.value) {
				let pk = val.data.values.pk_delivery_h.value;
				//主键
				bulupk.push(pk);
			}
			if (val.data.values.ts && val.data.values.ts.value) {
				let pk = val.data.values.ts.value;
				//主键
				buluts.push(pk);
			}
		});
		let buluData = {
			pk: bulupk,
			ts: buluts,
			results: retMsg,
			pageid: link_list_page_id,
		}
		ajax({
			url: '/nccloud/sf/delivery/deliverybuluretmsg.do',
			data: buluData,
			success: (res) => {
				if (res.success) {
					if (res && res.data) {
						//刷新当前单据
						this.props.table.setAllTableData(list_table_id, data[list_table_id]);
						this.refresh();
					} else {
						this.props.table.setAllTableData(list_table_id, { rows: [] });
					}
				}
			}
		});
	}

	//删除单据
	delConfirm = () => {
		const selectedData = this.props.table.getCheckedRows(this.tableId);
		let dataArr = [];
		let tsArr = [];
		if (selectedData.length == 0) {
			NCMessage.create({ content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000068'), color: 'warning', position: 'top' });/* 国际化处理： 请选择数据*/
			return;
		}

		//处理选择数据
		selectedData.forEach((val) => {
			//主键数组
			dataArr.push(val.data.values.pk_delivery_h.value);
			tsArr.push(val.data.values.ts.value);
		});
		//自定义请求数据
		let data = {
			pks: dataArr,
			tss: tsArr
		};

		ajax({
			url: '/nccloud/sf/delivery/deliverydel.do',
			data: data,
			success: (res) => {
				if (res.success) {
					if (res.data && res.data.errormsg) {
						toast({ color: 'warning', content: res.data.errormsg });
						if (res.data && res.data.successpks) {
							const selecteDelData = this.props.table.getCheckedRows(list_table_id);
							let successpks = res.data.successpks.split(',');
							for (let index = 0; index < selecteDelData.length; index++) {
								const pk_delivery_h = selecteDelData[index].data.values.pk_delivery_h.value
								if (successpks.indexOf(pk_delivery_h) >= 0) {
									deleteCacheId(list_table_id, pk_delivery_h);
									this.props.table.deleteTableRowsByIndex(list_table_id, selecteDelData[index].index);
								}
							}
						}
					} else {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000050') });/* 国际化处理： 删除成功*/
						if (res.data && res.data.successpks) {
							const selecteDelData = this.props.table.getCheckedRows(list_table_id);
							let successpks = res.data.successpks.split(',');
							for (let index = 0; index < selecteDelData.length; index++) {
								const pk_delivery_h = selecteDelData[index].data.values.pk_delivery_h.value
								if (successpks.indexOf(pk_delivery_h) >= 0) {
									deleteCacheId(list_table_id, pk_delivery_h);
									this.props.table.deleteTableRowsByIndex(list_table_id, selecteDelData[index].index);
								}
							}
						}
					}
					// this.refresh();
				}
			}
		});
	};

	// 退回原因
	returnnoteModelContent() {
		return (
			<div className="addModal">
				<NCFormControl
					className="demo-input"
					value={this.state.returnnote}
					onChange={this.changeReturnnoteEvent}
					size="sm"
				/>
			</div>
		)
	};

	// 退回原因改变事件
	changeReturnnoteEvent = (value) => {
		if (value != this.state.returnnote) {
			this.setState({
				returnnote: value
			})
		}
	}

	// 附件的关闭点击
	onHideUploader = () => {
		this.setState({
			showUploader: false
		})
	}

	beforeUpload(billId, fullPath, file, fileList) {
		// 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
		//console.log(billId, fullPath, file, fileList);

		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			// alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000053'))/* 国际化处理： 只支持jpg格式图片*/
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			// alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000054'))/* 国际化处理： 上传大小小于2M*/
		}
		return isJPG && isLt2M;
		// 备注： return false 不执行上传  return true 执行上传
	}

	// 提交即指派
	getAssginUsedr = (value) => {
		let that = this;
		ajax({
			url: '/nccloud/sf/delivery/deliverycommit.do',
			data: {
				pks: [this.pk_delivery_h],
				tss: [this.ts],
				pageid: link_list_page_id,
				userObj: value,
			},
			success: function (res) {
				let { success, data } = res;
				if (success) {
					if (data && data.errormsg) {
						toast({ color: 'warning', content: data.errormsg });
					} else {
						toast({ color: 'success', content: that.props.MutiInit.getIntl("36320FDA") && that.props.MutiInit.getIntl("36320FDA").get('36320FDA--000007') });/* 国际化处理： 提交成功*/
						that.setState({
							compositedata: res.data,
							compositedisplay: false,
						});
						that.refresh();
					}
				} else {
					props.table.setAllTableData(list_table_id, { rows: [] });
				}
			}
		});
	}

	// 提交即指派取消
	compositeTurnOff = (value) => {
		this.setState({
			compositedata: null,
			compositedisplay: false,
		});
	}

	DoubleClick = (record, index, props, e) => {
		props.pushTo("/cardlinkq", {
			status: "browse",
			id: record.pk_delivery_h && record.pk_delivery_h.value,
			pagecode: card_page_id,
		});
	}

	render() {
		let numvalues = this.state.numvalues;
		let { table, button, search, modal, ncmodal, BillHeadInfo } = this.props;
		let buttons = this.props.button.getButtons();
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton, getButtons, createButtonApp } = button;
		let { createModal } = modal;
		const { createBillHeadInfo } = BillHeadInfo;
		let createNCModal = ncmodal.createModal;
		// 附件相关内容变量
		let { showUploader, target, billno, billId, showNtbDetail, ntbdata } = this.state;
		return (
			<div className="nc-bill-list">
			   {/**创建websocket连接 */}
			   {createListWebSocket(this.props, {
                    tableAreaCode: list_table_id,
                    tablePkName: deliveryPk,
					billtype: deliveryBillType,
					dataSource: dataSourceLink
                })}	
				{/** 渲染标题栏 **/}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000079'),//标题
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 7,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				{/* <div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						//默认显示几个查询条件
						defaultConditionsNum: 5,
						// 显示高级按钮
						showAdvBtn: true, 
						// 添加高级查询区自定义页签 (fun), return Dom 
						addAdvTabs: this.addAdvTabs, 
//						oid: oid,
						// 查询区渲染完成回调函数
						renderCompleteEvent: this.renderCompleteEvent
					})}
				</div> */}
				{/* <div style={{borderTop: '1px solid #CCC'}}></div> */}
				{/* <div className="tab-definInfo-area">
					<NCTabs activeKey={this.state.activeKey} 
						onChange={(v) => {
							this.navChangeFun.call(this, v);
						}}> */}
				{/* 国际化处理： 待提交*/}
				{/* <NCTabPane key={'1'} tab={
							this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000080')
							+ '(' + (numvalues && numvalues.DTJ || 0) + ')'}
						/> */}
				{/* 国际化处理： 待审批*/}
				{/* <NCTabPane key={'2'} tab={
							this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000081')
							+ '(' + (numvalues && numvalues.DSP || 0) + ')'}
						/> */}
				{/* 国际化处理： 待支付*/}
				{/* <NCTabPane key={'3'} tab={
							this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000082')
							+ '(' + (numvalues && numvalues.DZF || 0) + ')'}
						/> */}
				{/* 国际化处理： 全部*/}
				{/* <NCTabPane key={'4'} tab={
							this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000083')
						} */}
				{/* />
					</NCTabs>
				</div> */}
				{/* <div style={{ height: '10px' }} /> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: true,

						onSelected: setButtonUsability.bind(this, this.props),
						onSelectedAll: setButtonUsability.bind(this, this.props),
						onRowDoubleClick: this.DoubleClick.bind(this),

						dataSource: dataSourceLink,
						//给表格加pkname: 表格数据的主键名字(key)
						pkname: 'pk_delivery_h',
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
						}
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
									queryAttachments: '/nccloud/sf/delivery/deliveryattachment.do'
								}
							}
						/>
					}
				</div>

				{/* 输出 */}
				<div>
					<PrintOutput
						ref="printOutput"
						url="/nccloud/sf/delivery/deliveryprint.do"
						data={this.state.outputData}
						callback={this.onSubmit}
					/>
				</div>

				{createModal('delete', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000055'),/* 国际化处理： 删除确认*/
					content: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000056'),/* 国际化处理： 你确定要删除吗?*/
					beSureBtnClick: this.delConfirm
				})}

				{/* 退回模态框 */}
				{createModal('backModel', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000059'),/* 国际化处理： 退回*/
					content: this.returnnoteModelContent(),
				})}

				{/* 支付模态框 */}
				{createModal('payModel', {
					title: this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000012'),/* 国际化处理： 支付*/
				})}

				{/** 网银补录组件 **/}
				<div>
					<PayBuluForm
						showmodal={this.state.showBuLu}
						modal={modal}
						onLineData={this.state.onLineData}
						moduleType={sourceModel_SF}
						modelType={this.state.modelType}
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
							})
						}}>
					</PayBuluForm>
				</div>

				{/* 审批意见 */}
				<div>
					<ApproveDetail
						show={this.state.approveshow}
						close={() => {
							this.setState({
								approveshow: false
							})
						}}
						billtype={'36K4'}
						billid={billId}
					/>
				</div>
				<div>
					{/* 提交即指派 */}
					{this.state.compositedisplay ? <ApprovalTrans
						title={'指派'}
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr.bind(this)}
						cancel={this.compositeTurnOff}
					/> : ""}
				</div>

				{/* 联查预算 */}
				<div>
					<Inspection
						show={showNtbDetail}
						sourceData={ntbdata}
						cancel={() => {
							this.setState({ showNtbDetail: false })
						}}
						affirm={() => {
							this.setState({ showNtbDetail: false })
						}}
					/>
				</div>
			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	billinfo: {
		billtype: 'grid',
		pagecode: link_list_page_id,
	},
	mutiLangCode: appcode
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/