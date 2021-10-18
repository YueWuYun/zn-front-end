/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//列表
import React, { Component } from 'react';
import { createPage, ajax, high, base, createPageIcon, toast, cardCache, output, deepClone, getMultiLang } from 'nc-lightapp-front';
import NCTabs from "../../../../tmpub/pub/util/NCTabs/index"//列表中页签底色
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, buttonUsable } from './events';
import { Templatedata } from "../config/Templatedata";//配置的id和area信息
import PayBuluForm from '../../../../obm/ebankbulu/bulu/form/index';
import { sourceModel_CMP, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU, PAYMODEL_COMBINEPAY } from '../../../public/utils/constant';
import Sign from '../../../../tmpub/pub/util/ca';
import { NewBatchToast } from './MessageUtil/NewBatchToast';
import { saveMultiLangRes ,createListWebSocket} from '../../../../tmpub/pub/util';
import appBase from '../../base';
import { cache } from '../../../../tmpub/pub/cons/constant';
import { go2CardCheck } from "../../../../tmpub/pub/util";
const { cons, api } = appBase;
const { NCTabPane } = NCTabs;
const { NCDiv } = base;
const { NCUploader, BillTrack, PrintOutput } = high;
let { setDefData, getDefData } = cardCache;
class List extends Component {
	constructor(props) {
		super(props);
		this.hasCacheData = this.props.table.hasCacheData;
		this.deleteCacheId = this.props.table.deleteCacheId;
		this.addCacheId = this.props.table.addCacheId;
		this.moduleId = Templatedata.list_moduleid;
		this.searchId = Templatedata.list_searchid;
		this.tableId = Templatedata.list_tableid;
		this.pageId = Templatedata.list_pageid;
		this.listDataSource = Templatedata.listDataSource;
		this.statekey = Templatedata.stateCacheKey;
		this.searchKey = Templatedata.searchCacheKey;
		this.printurl = Templatedata.settleprint;
		this.md5key = null;//合并支付使用
		this.yurref = null;//合并支付第二次使用到银行参考号
		this.state = {
			tabKey: '1',
			tabs00: 0, //全部
			tabs01: { num: 0, pks: [] }, //待支付
			tabs02: { num: 0, pks: [] }, //支付中
			tabs03: { num: 0, pks: [] }, //部分成功
			billno: '', 			// 单据编号
			showUploader: false,	//控制附件弹出框
			target: null,			//控制弹出位置
			billId: '',
			showBuLu: false,         //设置显示补录模态框显隐性
			onLineData: [],
			modelType: SHOWMODEL_BULU,//操作类型，本结算业务用的
			modalValue: SHOWMODEL_BULU, //补录框类型，传给网银补录框的
			//             showInspection: false,	//联查预算
			//             sourceData: null,		//联查预算数据源
			showbilltrack: false,	//联查单据
			showbilltrackpk: '',	//联查单据pk
			showbilltracktype: '',	//联查单据类型
			// 当前列表所有单据pks
			pks: [],
			outputdata: {},		// 输出
			paydata: {},    // 网上支付信息暂存，由于需要跳转多个方法，所以此保存着选择的数据
			tradecode: null//用于工资清单支付的标识使用
		}
		//initTemplate.call(this,props);
	}
	componentDidMount() {
		this.restoreData();
	}
	//操作列多语不显示
	componentWillMount() {
		let callback = (json) => {
			this.setState({ json });//批量提示语句必须使用这种方式
			saveMultiLangRes(this.props, json);//缓存多语资源
			initTemplate.call(this, this.props);
		};
		// getMultiLang({ moduleId: [Templatedata.list_moduleid], domainName: 'cmp', callback });
		getMultiLang({
			moduleId: {
				['tmpub']: ['3601'],
				['cmp']: [Templatedata.list_moduleid, '36070']
			},
			callback
		});
	}
	// 查询页面oid
	initOid = () => {
		let queryInfo = this.props.search.getQueryInfo(this.searchId, false);
		if (queryInfo && queryInfo.oid) {
			let oid = queryInfo.oid;
			this.setState({
				oid
			})
		} else {
			// 数组库中的oid
			this.setState({
				oid: '0001Z61000000000UVC5'
			})
		}
	}
	// 还原列表页数据
	restoreData = () => {
		//hasCacheData函数根据缓存数据命名空间进行查询是否有数据,
		// 判断有值就会赋值，没有就不赋值
		// this.hasCacheData(this.listDataSource);
		if (!this.hasCacheData(this.listDataSource)) {
			// 没有值，将所有的按钮置为不可用 - 1024，进入页面将支付、联查、刷新长亮；
			this.props.button.setButtonDisabled(Templatedata.payBtn, true);
			this.props.button.setButtonDisabled('updatePayStatus', true);
			this.props.button.setButtonDisabled(Templatedata.linkNetBankBtn, true);
			this.props.button.setButtonDisabled(Templatedata.linkPayAffirmBtn, true);
			//this.props.button.setButtonDisabled(Templatedata.payGroup,true);
			//this.props.button.setButtonDisabled(Templatedata.linkGroup,true);
			this.props.button.setButtonDisabled(Templatedata.otherGruop, true);
		};
		//获取页签数据
		let cachestate = getDefData(this.statekey, this.listDataSource);
		if (cachestate) {
			let keys = Object.keys(cachestate);
			for (let i = 0, l = keys.length; i < l; i++) {
				let key = keys[i];
				this.state[key] = cachestate[key];
			}
		}
	}
	// 设置缓存数据的方法
	setStateCache = () => {
		let thisstate = this.state;
		setDefData(this.statekey, this.listDataSource, thisstate);
		// 将所有查询条件赋值进缓存
		let searchVal = this.props.search.getAllSearchData(this.searchId);
		if (searchVal) {
			setDefData(this.searchKey, this.listDataSource, searchVal);
		}
	}
	getButtonNames = (codeId) => {
		if (codeId === 'edit' || codeId === 'add' || codeId === 'save') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};
	open = () => {
		// 在你想要触发的事件里面调用output方法，必须传的参数有data， 选择传的参数有url（要打印调用的后台接口），callback（打印后的回调函数）
		output({ data: this.state.outputdata, callback: this.dooutput })
	}
	onOutput = () => {

	}
	// 查询区渲染完成回调函数
	renderCompleteEvent = () => {
		this.initOid();
		let cachesearch = getDefData(this.searchKey, this.listDataSource);
		if (cachesearch && cachesearch.conditions) {
			// this.props.search.setSearchValue(this.searchId, cachesearch);
			for (let item of cachesearch.conditions) {
				if (item.field == 'busi_billdate') {
					// 时间类型特殊处理
					let time = [];
					time.push(item.value.firstvalue);
					time.push(item.value.secondvalue);
					this.props.search.setSearchValByField(this.searchId, item.field,
						{ display: item.display, value: time });
				} else if (item.field == 'primal') {
					// 金额类型特殊处理
					let money = [];
					money.push(item.value.firstvalue);
					money.push(item.value.secondvalue);
					if (money.length > 0) {
						this.props.search.setSearchValByField(this.searchId, item.field,
							{ display: item.display, value: money });
					}
				}
				else {
					this.props.search.setSearchValByField(this.searchId, item.field,
						{ display: item.display, value: item.value.firstvalue });
				}
			}
		}
	}
	/**获取多语方法 */
	getLangCode = (key) => {
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		return multiLang && multiLang.get(this.moduleId + '-' + key);
	};
	/* 添加高级查询区中的页签 */
	addAdvTabs = () => {
		return [
			{
				name: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000051'),   //页签名称/* 国际化处理： 页签1*/
				content: <div>{this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000059')}1{this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000060')}</div> //页签内容/* 国际化处理： 页签,内容*/
			},
			{
				name: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000052'),   //页签名称/* 国际化处理： 页签2*/
				content: <div>{this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000059')}2{this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000060')}</div> //页签内容/* 国际化处理： 页签,内容*/
			},
			{
				name: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000053'),/* 国际化处理： 页签3*/
				content: <div>{this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000059')}3{this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000060')}</div>/* 国际化处理： 页签,内容*/
			}
		]
	};

	/* 替换高级查询body区域 */
	replaceAdvBody = () => {
		return (
			<div>3333</div>
		)
	}

	getData = (serval) => {

		let searchVal = this.props.search.getAllSearchData(this.searchId).conditions;//新盘适配插叙条件
		let sendVal = searchVal.concat(serval);
		let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		let oid = this.state.oid;
		let conditions = this.filterSearchValue(searchVal);
		// 未输入查询条件会返回false
		if (!searchVal) {
			return;
		}
		let searchdata = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions
			},
			// conditions: searchVal.conditions || searchVal,
			pageInfo: pageInfo,
			pageCode: this.pageId,
			queryAreaCode: this.searchId,  //查询区编码
			oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: Templatedata.query,
			data: searchdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data.vos) {
						// 此处提示已成功
						toast({ color: 'success', content: '' });
						this.props.table.setAllTableData(this.tableId, data.vos[this.tableId]);
						this.props.button.setButtonDisabled(Templatedata.payGroup, false);
						this.props.button.setButtonDisabled(Templatedata.linkGroup, false);
						this.props.button.setButtonDisabled(Templatedata.otherGruop, false);
					} else {
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000070') });
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}
					if (data.num) {
						//处理页签值，显示全部数据数量
						//页签赋值
						this.setState({
							tabs01: data.num.waitingsettle,
							tabs02: data.num.paying
						});
					} else {
						let value = { num: 0 };
						this.setState({
							tabs01: value,
							tabs02: value
						});
					}

				}
			}
		});
	};

	refreshByData = (indexs, data) => {

		if (indexs && data && data.vos) {
			let vos = data.vos.table_head_area.rows;
			let datapush = [];
			if (indexs.length == vos.length) {
				//begin tm tangleic 20190712 保留此次更新数据之前的重复支付标志，避免更新冲掉标志
				api.listSynCheckFlag(this.props, { tableCode: this.tableId, indexArr: indexs, datas: vos })
				//end tangleic
				for (let i = 0; i < indexs.length; i++) {
					let bigdata = {};
					let values = {};
					bigdata['index'] = indexs[i];
					values['values'] = vos[i].values;
					bigdata['data'] = values;
					datapush.push(bigdata);
				}
				this.props.table.updateDataByIndexs(this.tableId, datapush);
			} else {
				this.refreshPks();
			}
		} else {
			this.refreshPks();
		}
	}

	// 过滤查询条件，用于页签查询和初始化第一次查询查询待签字的数据
	filterSearchValue = (searchVal) => {
		let tabKey = this.state.tabKey;
		if (tabKey == '0') {
			// 如果是全部的话，则返回
			return;
		}
		let conditions = [];
		let orgcondition = searchVal.conditions.find((e) => e.field === 'pk_org');
		let condition = deepClone(orgcondition);
		// aduitstatus： 业务单据审批状态
		// busistatus ：业务单据状态
		// settlestatus : 结算状态
		condition.field = 'aduitstatus';
		condition.value.firstvalue = 0;
		condition.display = '';
		condition.datatype = "1";  // 1表示输入框类型
		conditions.push(condition);
		let busistatuscon = deepClone(condition);
		busistatuscon.field = 'busistatus';
		let settlestatuscon = deepClone(condition);
		settlestatuscon.field = 'settlestatus';

		if (tabKey == '1') {
			// 待支付
			busistatuscon.value.firstvalue = 8;
			busistatuscon.oprtype = '=';
			conditions.push(busistatuscon);
			settlestatuscon.value.firstvalue = 0;
			conditions.push(settlestatuscon);
		}
		if (tabKey == '2') {
			// 支付中
			settlestatuscon.value.firstvalue = 1;
			conditions.push(settlestatuscon);
		}
		return conditions;
	}
	// 根据pks更新当前列表
	refreshPks = () => {
		let pks = this.state.pks;
		if (!pks || pks.length == 0) {
			return;
		}
		let pageId = this.pageId;
		let data = {
			"pks": pks,
			"pageid": pageId
		};
		ajax({
			url: Templatedata.pkquery,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						//this.props.table.setAllTableData(this.tableId, {rows:[]});
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}

				}
			}
		});
	}
	// 刷新按钮调用
	refreshBtn = () => {
		let pks = this.state.pks;
		if (!pks || pks.length == 0) {
			toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000075') });
			this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
			return;
		}
		let pageId = this.pageId;
		let data = {
			"pks": pks,
			"pageid": pageId
		};
		ajax({
			url: Templatedata.pkquery,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						//此处提示：刷新成功
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000075') });
						this.props.table.setAllTableData(this.tableId, data[this.tableId]);
					} else {
						this.props.table.setAllTableData(this.tableId, { rows: [] });
					}

				}
			}
		});
	}
	//刷新列表
	refresh = () => {
		let table_id = Templatedata.list_tableid;;
		let search_id = Templatedata.list_searchid;
		let page_id = Templatedata.list_pageid;

		let pageInfo = this.props.table.getTablePageInfo(table_id);//分页
		// let searchVal = this.props.search.getAllSearchData(search_id);//查询condition
		// 切页签获取缓存中的查询条件
		let searchVal = getDefData(this.searchKey, this.listDataSource);
		let oid = this.state.oid;
		// 未输入查询条件会返回false
		if (!searchVal) {
			return;
		}
		let conditions = this.filterSearchValue(searchVal);;
		let searchdata = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions
			},
			// conditions: searchVal.conditions || searchVal,
			pageInfo: pageInfo,
			pageCode: this.pageId,
			queryAreaCode: search_id,  //查询区编码
			oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
		ajax({
			url: Templatedata.query,
			data: searchdata,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						if (data.vos) {
							// 此处提示已成功
							this.props.table.setAllTableData(table_id, data.vos[table_id]);
							this.props.button.setButtonDisabled(Templatedata.payGroup, false);
							this.props.button.setButtonDisabled(Templatedata.linkGroup, false);
							this.props.button.setButtonDisabled(Templatedata.otherGruop, true);
						} else {
							this.props.table.setAllTableData(table_id, { rows: [] });
						}
						if (data.num) {
							//处理页签值，显示全部数据数量
							//页签赋值
							this.setState({
								tabs01: data.num.waitingsettle,
								tabs02: data.num.paying
							});
						} else {
							let value = { num: 0 };
							this.setState({
								tabs01: value,
								tabs02: value
							});
						}
						// 保存当前页的pks，用于在操作时候刷新页面数据
						let pks = [];
						if (data && data.vos) {
							data.vos[table_id].rows.forEach((val, index) => {
								let pk = val.values.pk_settlement.value;
								pks.push(pk);
							});
							this.setState({
								pks: pks
							});
						}
					} else {
						this.props.table.setAllTableData(table_id, { rows: [] });
						let value = { num: 0 };
						this.setState({
							tabs01: value,
							tabs02: value
						});
					}
				}
			}
		});
	}

	//页签筛选
	navChangeFun = (status, className, e) => {
		let serval;
		if (status == '1') {
			//未结算
			serval = this.state.tabs01.pks;
		} else if (status == '2') {
			// 支付中
			serval = this.state.tabs02.pks;
		} else if (status == '3') {
			// 部分成功
			serval = this.state.tabs03.pks;
		} else if (status == '0') {
			// 全部
			let tabkey = this.state.tabKey;
			if (tabkey != '0') {
				this.setState({
					tabKey: status,
				}, () => this.refresh());
				//serval = this.state.tabs00.pks;
				// 由其他页签跳到全部页签，需要查询全部数据

				return;
			} else {
				this.setState({
					tabKey: status,
				});
				return;
			}
		}
		// 设置按钮显隐性
		buttonUsable.call(this, this.props, status);
		this.setState({
			tabKey: status,
		}, () => this.refresh());
		// if (!serval || serval.length==0) {
		// 	// 没有数据将其置为空，并不查询数据库
		// 	this.props.table.setAllTableData(this.tableId, { rows: [] });
		// 	return;
		// }
		// this.getChangeData(serval);
	};
	// 切换页签获取数据
	getChangeData = (serval) => {
		let refreshpageInfo = this.props.table.getTablePageInfo(table_id);//分页
		let table_id = Templatedata.list_tableid;;
		let search_id = Templatedata.list_searchid;
		let page_id = Templatedata.list_pageid;

		let oid = this.state.oid;
		let searchdata = {
			pks: serval,
			pageInfo: refreshpageInfo,
			pagecode: page_id,
			queryAreaCode: search_id,  //查询区编码
			oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
			queryType: Templatedata.list_querytype
		};
		ajax({
			url: Templatedata.navchange,
			data: searchdata,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data) {
						this.props.table.setAllTableData(table_id, data[table_id]);
					} else {
						this.props.table.setAllTableData(table_id, { rows: [] });
					}
				}
			}
		});

	}
	// 加载网银补录需要的信息
	loadBuLuInfo = async (data) => {
		// let checkdata = this.props.table.getChecked
		// //let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_payinfochange').value;
		// //let ts = this.props.form.getFormItemsValue(card_from_id, 'ts').value;
		// let pks = [];
		// let tss = [];
		// let data = {
		//   pkMapTs,
		//   ischeckfull: this.state.modelType == SHOWMODEL_LIULAN ? true : false
		// };
		let modelType = this.state.modelType;
		let url = '';
		if (modelType === SHOWMODEL_BULU) {
			url = Templatedata.settlepreparenet;
		} else if (modelType === SHOWMODEL_ZHIFU) {
			url = Templatedata.settlepay;
		} else if (modelType === PAYMODEL_COMBINEPAY) {
			url = Templatedata.settlecombinpay;
			// 原nc后端给传的就是zhifu，所以这里也是传zhifu
			modelType = SHOWMODEL_ZHIFU;
		} else if (modelType === SHOWMODEL_LIULAN) {
			url = Templatedata.linknetbank;
			// 原nc后端给传的就是zhifu，所以这里也是传zhifu
		}
		data.needCheck = true;
		//特殊补录--工资清单要先谈ca然后进行支付
		if (this.state.tradecode && this.state.tradecode == 'DS'
			&& modelType != SHOWMODEL_BULU && modelType != SHOWMODEL_LIULAN) {
			// ca框,只弹框不签名
			let DS_result = await Sign({
				data: null,
				encryptVOClassName: null,
				isSign: false,
				isKey: true
			})
			if (DS_result.isStop) {
				return;
			}
		}
		ajax({
			url: url,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data && data.message && data.message == 'DSOK') {
						// 表示工资转账成功
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000070') });/* 国际化处理： 工资转账成功！*/
						this.refreshPks()
						return;
					}
					if (data) {
						if (data.hint) {
							toast({ color: 'danger', content: data.hint });
							return;
						}
						let onlinevos = data.onlinevos == null ? (data == null ? null : data) : data.onlinevos;
						this.md5key = data.md5key == null ? null : data.md5key
						this.yurref = data.yurrefMap == null ? null : data.yurrefMap;
						this.setState({
							onLineData: onlinevos || []
							// modelType//去掉设置modelType防止合并支付有问题
						}, () => {
							this.setState({
								showBuLu: true
							})
						});
					}

				}
			}
		});
	}

	// 保存网银补录数据
	processRetMsg = async (retPayMsg) => {
		// let selectedData = this.props.table.getCheckedRows(this.tableId);
		// let pks = [];
		// //let tss = [];
		// if (!selectedData || selectedData.length == 0) {
		// 	toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000011') });/* 国际化处理： 请选择一条数据*/
		// 	return;
		// }
		// //处理选择数据
		// let val = selectedData[0];
		// let pk = val.data.values.pk_settlement.value;
		// let ts = val.data.values.ts.value;
		// pks.push(pk);//主键数组
		// //tss.push(ts); 
		// let pkMapTs = {};
		// pkMapTs[pk] = ts;
		// let data = {
		// 	pktsmap:pkMapTs,
		// 	pks:pks,
		// 	results: retPayMsg,
		// 	pagecode: this.pageId
		// }
		let data = this.state.paydata;
		if (!data) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000011') });/* 国际化处理： 请选择一条数据*/
			return;
		}
		data['results'] = retPayMsg;
		data['pagecode'] = this.pageId;
		data['md5key'] = this.md5key;
		data['yurrefMap'] = this.yurref;//合并支付/网上转账第二次支付使用
		let modelType = this.state.modelType;
		let url = '';
		let operate = '操作';
		// 操作之后的提示信息
		let contents = this.getLangCode('000063'); // 操作成功
		let needPassword = false;
		if (modelType === SHOWMODEL_BULU) {
			url = Templatedata.settlebulusave;
			contents = this.getLangCode('000064');  // 补录成功
			operate = '网银补录';
		} else if (modelType === SHOWMODEL_ZHIFU) {
			url = Templatedata.settlepaysave;
			needPassword = true;
			operate = '网上支付';//网上转账
		} else if (modelType === PAYMODEL_COMBINEPAY) {
			url = Templatedata.settlecombinsave;
			needPassword = true;
			contents = this.getLangCode('000065');  // 合并支付操作成功
			operate = '合并支付';
		} else if (modelType === SHOWMODEL_LIULAN) {
			// 联查网银信息
			return;
		} else {
			return;
		}
		// 签名,只弹框不签名
		// let result = await Sign({
		// 	data: null,
		// 	encryptVOClassName: null,
		// 	isSign: false,
		// 	isKey: needPassword,
		// })
		// if (result.isStop) {
		// 	return;
		// }
		//支付时前台js加签<弹框+签名>
		console.log(data.pks, 'pks');
		let payresult = await Sign({
			isSign: true,
			data: null,
			encryptVOClassName: null,
			isKey: needPassword,
			primaryId: data.pks
		});
		if (payresult.isStop) {
			return;
		}
		data['needCheck'] = false;    // 补录之后不校验ts，因为ts会更新，很显然补录更新了结算信息
		//支付前验签必要参数
		data['signature'] = payresult.data.signText;
		data['sign_strSrc'] = payresult.data.text;
		data['sign_sn'] = payresult.data.userjson;
		ajax({
			url: url,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data) {
						if (modelType === SHOWMODEL_ZHIFU) {//网上转账
							NewBatchToast(operate, data.total, data.successCount, data.failCount, data.mesage, null);//提示信息
						} else {//其他支付方式
							toast({ color: 'success', content: operate + this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000071') });
						}
						// if (data.message) {
						// 	toast({ color: 'success', content:data.message  });
						// }else{
						// 	toast({ color: 'success', content:contents  });
						// }
						this.setState({
							paydata: {}
						})
						this.refreshPks();
					}
				}
			}
		});
	};
	// 支付方法
	netpayZhifuSave = (data) => {
		let url = Templatedata.settlepaysave;
		ajax({
			url: url,
			data,
			success: (res) => {
				let { data, success } = res;
				if (success) {
					if (data) {
						if (data.message) {
							toast({ color: 'warning', content: data.message });
						}
						this.refreshPks();
					}
				}
			}
		});
	}
	// 由buttonclick过来的请求进行数据的组装
	getNetpayCheckedData = () => {
		let selectedData = this.props.table.getCheckedRows(this.tableId);
		let pks = [];
		let tss = [];
		if (!selectedData || selectedData.length == 0) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000012') });/* 国际化处理： 请选择数据*/
			return;
		}
		//处理选择数据
		let pktsmap = {};
		selectedData.forEach((val) => {
			//此处可校验，挑选满足条件的进行操作
			let pk = val.data.values.pk_settlement.value;
			let ts = val.data.values.ts.value;
			pks.push(pk);//主键数组
			tss.push(ts);
			pktsmap[pk] = ts;
		});
		let data = {
			pks: pks,
			tss: tss,
			pktsmap: pktsmap
		};
		return data;
	}
	// 网上转账弹框处理
	netPayProcess = () => {
		this.setState({
			modelType: SHOWMODEL_ZHIFU,
			modalValue: SHOWMODEL_ZHIFU
		}, () => {
			//   let data = this.getCheckedData('netpay');
			let data = this.state.paydata;
			if (!data) {
				data = this.getCheckedData('netpay');
			}
			this.loadBuLuInfo(data);
		});
	}
	// 目前仅给结算红冲使用，所以内部进行红冲的判断
	getCheckedData = (flag) => {
		let selectedData = this.props.table.getCheckedRows(this.tableId);
		let pks = [];
		let tss = [];
		if (!selectedData || selectedData.length != 1) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000038') });/* 国际化处理： 请选择1条数据*/
			return;
		}
		//处理选择数据
		let pktsmap = {};
		let error = [];

		let getout = false;
		switch (flag) {
			case 'redhandle':
				// 红冲
				selectedData.forEach((val) => {
					//此处可校验，挑选满足条件的进行操作
					// 结算失败的才可进行结算红冲操作
					// 结算状态为支付失败的单据才可以进行红冲操作
					let settlestatus = val.data.values.settlestatus.value;
					// 2为支付失败单据,6为部分成功的单据
					if (settlestatus == '2' || settlestatus == '6') {
						let pk = val.data.values.pk_settlement.value;
						let ts = val.data.values.ts.value;
						pks.push(pk);//主键数组
						tss.push(ts);
						pktsmap[pk] = ts;
					} else {
						error.push(val.data.values.billcode.value);
					}
				});
				if (pks.length == 0) {
					let content = this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000039');/* 国际化处理： 您选择的数据不可进行红冲操作！*/
					if (error.length != 0) {
						content = this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000023') + error.join(', ') + this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000054')/* 国际化处理： 单据编号 ,不可进行红冲操作！*/
					}
					toast({ color: 'warning', content: content });
					return;
				}
				break;
			case 'netpay':
				// 网上支付
				selectedData.forEach((val) => {
					//此处可校验，挑选满足条件的进行操作
					let pk = val.data.values.pk_settlement.value;
					let ts = val.data.values.ts.value;
					pks.push(pk);//主键数组
					tss.push(ts);
					pktsmap[pk] = ts;
				});
				break;
			default:
				break;
		}
		if (getout) {
			return;
		}
		let data = {
			pks: pks,
			tss: tss,
			pktsmap: pktsmap
		};
		return data;
	}
	// 结算红冲,弹框的回调函数
	redHandleProcess = () => {
		let data = this.getCheckedData('redhandle');
		// 结算红冲不支持批量操作
		if (!data || JSON.stringify(data) == '{}') {
			return;
		}
		//return;
		ajax({
			url: Templatedata.settleredhandle,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000013') });/* 国际化处理： 红冲成功*/
					//props.table.deleteTableRowsByIndex(table_id, index);
				}
			}
		});
	}
	doubleClick = (record, index, props, e) => {
		this.setStateCache();

		//tm begin lidyu 并发交互跳转卡片检查 20200312
		let ts = record.ts.value;
		go2CardCheck({
			props,
			url: Templatedata.gotocardcheck,
			pk: record.pk_settlement.value,
			ts: ts,
			checkTS: false,
			fieldPK: Templatedata.pkname,
			actionCode : null ,
			permissionCode: null ,
			go2CardFunc: () => {
				props.pushTo("/card",
				{
					status: "browse",
					id: record.pk_settlement.value,
				});
			}
		})
		//tm end lidyu 并发交互跳转卡片检查 20200312  		

	}
	render() {
		let { table, search, modal, } = this.props;
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { showUploader, target, billno, billId } = this.state;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-list">
			 {/**创建websocket连接 */}
			 {createListWebSocket(this.props, {
                    tableAreaCode: Templatedata.list_tableid,
                    tablePkName: Templatedata.pkname,
                    billtype: Templatedata.card_settlebilltype,
                    //serverLocation: '10.16.2.231:9991'
                })}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000020'),//标题
								initShowBackBtn: false
							}
						)}
					</div>
					<div className="header-button-area">
						{/* 小应用注册按钮 */}
						{this.props.button.createButtonApp({
							area: Templatedata.list_head,
							buttonLimit: 8,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}


					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2, //默认显示几个查询条件
						showAdvBtn: true,                           //  显示高级按钮
						// searchBtnName :''                        //    查询按钮名称，默认查询
						// showAdvSearchPlanBtn :false,    //高级面板中是否显示保存方案按钮 ;默认显示
						// replaceAdvBtnEve:()=>{},        // 业务组替换高级面板 (fun)
						// replaceAdvBody: this.replaceAdvBody,          // 业务组替换高级面板中的body (fun),return Dom 
						// addAdvBody: ()=>{},              // 添加高级查询区自定义查询条件Dom (fun) , return Dom 
						// onAfterEvent: this.onAfterEvent.bind(this),  //编辑后事件
						// addAdvTabs: this.addAdvTabs,              // 添加高级查询区自定义页签 (fun), return Dom 
						// oid: Templatedata.list_oid,
						renderCompleteEvent: this.renderCompleteEvent

					})}
				</div>
				<NCTabs activeKey={this.state.tabKey} onChange={(v) => { this.navChangeFun.call(this, v); }}>
					<NCTabPane key={'1'} tab={
						<span>{
						//待签字
						multiLang && multiLang.get('36070OP-000055') + ' (' }<span>{ this.state.tabs01.num}</span> { ')'/* 国际化处理： 待支付*/
						}</span>
					} />
					<NCTabPane key={'2'} tab={
						<span>{
						//待结算
						multiLang && multiLang.get('36070OP-000056') + ' (' }<span>{ this.state.tabs02.num }</span>{ ')'/* 国际化处理： 支付中*/
						}</span>
					} />
					<NCTabPane key={'0'} tab={
						<span>{
						//全部
						multiLang && multiLang.get('36070OP-000058') /**this.state.tabs00**//* 国际化处理： 全部*/
						}</span>
					} />
				</NCTabs>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: pageInfoClick.bind(this),
						tableModelConfirm: tableModelConfirm,
						showCheck: true,
						showIndex: false,
						onSelected: buttonUsable.bind(this, this.props, '5'),
						onSelectedAll: buttonUsable.bind(this, this.props, '5'),
						onRowDoubleClick: this.doubleClick.bind(this),
						dataSource: this.listDataSource,
						pkname: 'pk_settlement',
						componentInitFinished: () => {
							//缓存数据赋值成功的钩子函数
							//若初始化数据后需要对数据做修改，可以在这里处理
						}
					})}
				</div>
				<div className="nc-faith-demo-div2">
					{/* 这里是附件上传组件的使用，需要传入三个参数 */}
					{showUploader && <NCUploader
						billId={billId}
						target={target}
						placement={'bottom'}
						billNo={billno}
					/>
					}
				</div>
				{/* 联查单据 */}
				<div>
					<BillTrack
						show={this.state.showbilltrack}
						close={() => {
							this.setState({ showbilltrack: false })
						}}
						pk={this.state.showbilltrackpk} //单据id
						type={this.state.showbilltracktype} //单据类型
					/>
				</div>
				{/** 网银补录 **/}
				<PayBuluForm
					showmodal={this.state.showBuLu}  //补录框显示
					modal={modal}
					onLineData={this.state.onLineData}  //补录数据
					moduleType={sourceModel_CMP}  //模块编码
					modelType={this.state.modalValue} //补录框类型
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
				<PrintOutput
					ref='printOutput'
					url={this.printurl}
					data={this.state.outputdata}
					callback={this.onOutput}
				>
				</PrintOutput>
			</div>
		);
	}
}

List = createPage({
	//initTemplate: initTemplate,
	mutiLangCode: Templatedata.list_moduleid
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/