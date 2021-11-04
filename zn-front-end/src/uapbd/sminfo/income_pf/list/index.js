//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { print } from 'nc-lightapp-front';
import { createPage, ajax, base, toast, high, cacheTools, getMultiLang, promptBox, createPageIcon } from 'nc-lightapp-front';
// import ApprovalTrans from '../../../../uap/public/excomponents/approvalTrans';
const { PrintOutput, ApproveDetail, ApprovalTrans } = high
const { NCPopconfirm, NCIcon, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
const { NCDiv } = base;

const dataSource = 'uapbd.sminfo.income_org.data'
const pageId = '10140INCPF_list';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'sminfoPf';                 //表头id
const appCode = '10140INCPF';
const linkItem = 'billno';        //列表卡片跳转字段
const pk_item = 'pk_income_pf';           //列表主键
const queryListUrl = '/nccloud/uapbd/incomeapply/queryIncomeapplyList.do';            //通过查询区域查询url
const deleteUrl = '/nccloud/uapbd/incomeapply/deleteIncomeApply.do'	//删除
const commitUrl = '/nccloud/uapbd/incomeapply/commitIncomeApply.do' //提交
const printUrl = '/nccloud/uapbd/incomeapply/printIncomeApply.do'
const callbackUrl = '/nccloud/uapbd/incomeapply/callbackIncomeApply.do' //收回
const checkDataPermUrl = '/nccloud/uapbd/incomeapply/checkDataPerm.do' //编辑数据权限校验功能
const pageInfoClickUrl = '/nccloud/uapbd/incomeapply/pageInfoClick.do' //分页点击事件

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.selectedRowRecord = null;
		this.enableNumber = 0;
		this.disableNumber = 0
		this.state = {
			pks: [],
			billId: '',
			showApprInfo: false,
			compositedisplay: false,
			compositedata: null
		}
	}
	initTemplate(props) {
		props.createUIDom({
			pagecode: pageId  //页面id
		},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						meta = this.modifierMeta(props, meta)
						props.meta.setMeta(meta, () => {
							if (data.context) {
								if (data.context.pk_org && data.context.org_Name) {
									props.search.setSearchValByField(searchId, "pk_org", { value: data.context.pk_org ? data.context.pk_org : null, display: data.context.org_Name ? data.context.org_Name : null });
								}
							}
						});
						let searchVal = cacheTools.get("searchParams")
						if (searchVal && searchVal != false) {
							props.search.setSearchValue('search', searchVal)
							let queryInfo = props.search.getQueryInfo('search')
							let OID = queryInfo.oid
							let data = {
								...queryInfo,
								pageInfo: {
									pageIndex: 0,
									pageSize: 10,
									total: 0,
									totalPage: 0
								},
								pagecode: pageId,
								queryAreaCode: searchId,  //查询区编码
								oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
								queryType: 'tree'
							};

							ajax({
								url: queryListUrl,
								data,
								success: (res) => {
									if (res.data) {
										//构建一下分页组件需要的数组
										// let allPks = []
										// res.data[tableId].rows.forEach(row => {
										// 	allPks.push(row.values[pk_item].value)
										// })
										// res.data[tableId].allpks = allPKs
										// props.button.setButtonDisabled({
										//     Print: true,
										//     Output: true
										// })
										//前端记录一下分页所需的所有主键，避免后端重复查询
										this.totalPks = res.data[tableId].allpks
										props.table.setAllTableData(tableId, res.data[tableId]);
									} else {
										//同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
										let tableData = {
											allpks: [],
											rows: []
										}
										props.button.setButtonDisabled({
											Print: true,
											Output: true
										})
										this.totalPks = []
										props.table.setAllTableData(tableId, tableData);
										toast({ content: this.state.json['10140INCPF-000044'], color: "warning" });/* 国际化处理： 无数据*/

									}
								},
								error: (res) => {
									console.log(res.message);
								}
							});
						}

					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button, () => {
							console.log("123123")

							this.updateButtonStatus()
						});
						// "10140INCPF-000024": "确定要删除吗？",
						props.button.setPopContent('RowDel', this.state.json['10140INCPF-000024']); /* 设置操作列上删除按钮的弹窗提示 */
					}
				}
			}
		)
	}

	modifierMeta(props, meta) {
		meta[searchId].items = meta[searchId].items.map((item, key) => {
			item.col = '3';
			return item;
		})

		//修正，收款申请单申请类型字段去掉停用和启用选项
		let applyTypeItem = meta[searchId].items.find(item => item.attrcode == 'apply_type')
		let originOptions = applyTypeItem.options
		let newOptions = [originOptions[0], originOptions[1], originOptions[2]]
		applyTypeItem.options = newOptions

		//修正查询区，增加申请组织、参照的多选操作
		let fixQueryConditions = ['pk_org']
		meta[searchId].items.forEach(item => {
			if (fixQueryConditions.indexOf(item.attrcode) >= 0) {
				item.isMultiSelectedEnabled = true
				item.isShowDisabledData = true
			}
		})

		meta[tableId].pagination = true;
		meta[tableId].items = meta[tableId].items.map((item, key) => {
			//item.width = 150;
			if (item.attrcode == linkItem) {
				item.render = (text, record, index) => {
					return (
						<span
							style={{ color: '#007ace', cursor: 'pointer' }}
							onClick={() => {
								let searchVal = props.search.getAllSearchData(searchId);
								cacheTools.set("searchParams", searchVal);
								cacheTools.set('preid', record[pk_item].value);
								props.pushTo('/card', {
									status: 'browse',
									id: record[pk_item].value,//列表卡片传参
									//必须先转为字符串
									errParam: JSON.stringify(record)
								});
							}}
						>
							{record && record[linkItem] && record[linkItem].value}
						</span>
					);
				};
			}
			return item;
		});
		//添加操作列
		meta[tableId].items.push({
			itemtype: "customer",
			attrcode: 'opr',
			label: this.state.json['10140INCPF-000019'],/* 国际化处理： 操作*/
			width: 200,
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			render: (text, record, index) => {

				let btnArray = []
				let BillStatus = record && record.billstatus ? record.billstatus.value : -1

				//根据单据状态来判定下显示哪些按钮

				// NOSTATE: '-1',                                                   //自由 态
				// NOPASS: '0',                                                     //未通过 态
				// PASSING: '1',                                                    //通过 态
				// GOINGON: '2',                                                    //进行中 态
				// COMMIT: '3'                                                     //提交 态
				if (BillStatus == -1) {
					btnArray = ['RowEdit', 'RowDel']
				}
				else {
					btnArray = ['RowApprInfo']
				}

				return props.button.createErrorButton({
					record,
					sucessCallBack: () => {
						return props.button.createOprationButton(
							btnArray,
							{
								area: "row-action",
								buttonLimit: 3,
								onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
							}
						)
					}
				})
			}
		});
		return meta
	}

	tableButtonClick(props, id, text, record, index) {
		switch (id) {
			case 'RowEdit':
				//  const pk_item = 'pk_income_pf';           //列表主键
				let primaryKey = record[pk_item].value
				//getAllSearchData   id(查询区组件id)| 获取当前查询区所有字段的值
				let searchVal = props.search.getAllSearchData(searchId);
				cacheTools.set("searchParams", searchVal);
				ajax({
					url: checkDataPermUrl,
					data: { pks: [primaryKey] },
					success: (res) => {
						searchVal = props.search.getAllSearchData(searchId);
						cacheTools.set("searchParams", searchVal);
						props.pushTo('/card', {
							status: 'edit',
							//codeedit  里面是各种方法
							codeedit: res && res.data ? res.data.codeedit : true,
							// billnumedit  RowEdit
							billnumedit: res && res.data ? res.data.billnumedit : true,
							id: primaryKey,
							errParam: JSON.stringify(record)
						})
					}
				})
				break;
			case 'RowDel':
				let primaryKeys = []
				//const pk_item: "pk_income_pf"
				primaryKeys.push(record[pk_item].value)
				ajax({
					url: deleteUrl,
					data: { primaryKeys },
					success: (res) => {
						if (res.success) {
							toast({ color: 'success', content: this.state.json['10140INCPF-000046'] });/* 国际化处理： 删除成功*/
							//deleteTableRowsByIndex**(moduleId, index) |	通过index删除行
							props.table.deleteTableRowsByIndex(tableId, index);
						}
					}
				});
				break;
			case 'RowApprInfo':
				//打开审批详情页
				this.setState({
					billId: record[pk_item].value,
					showApprInfo: true
				})
				break;
		}
	}


	//生命周期
	componentDidMount() {
		let callback = (json) => {
			this.setState({ json }, () => {
				this.initTemplate(this.props)
			})
		}
		getMultiLang({ moduleId: '10140INCPF', domainName: 'uapbd', callback })

		this.props.button.setButtonVisible(['Edit'], false)
		this.updateButtonStatus()
	}


	buttonClick(props, id) {
		let primarykey = null
		switch (id) {
			case 'Add':
				//*getAllSearchData** |   id(查询区组件id)| 获取当前查询区所有字段的值
				let searchVal = props.search.getAllSearchData(searchId);
				//多页应用中跨页签传递数据规范
				//使用前端缓存方案WebStorage，也就是平台提供的cacheTools API 
				cacheTools.set("searchParams", searchVal);
				props.pushTo('/card', {
					status: 'add'
				})
				break;
			case 'Delete':
				//getCheckedRows**(moduleId) | 获取选中行数据
				let checkedData = props.table.getCheckedRows(this.tableId)
				if (checkedData.length <= 0) {
					toast({ color: "warning", content: this.state.json['10140INCPF-000048'], })/* 国际化处理： 请选择需要删除的数据！*/
					return
				}
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140INCPF-000023'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.state.json['10140INCPF-000017'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140INCPF-000010'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140INCPF-000011'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: () => {
						let primaryKeys = []
						checkedData.forEach(item => {
							primaryKeys.push(item.data.values[pk_item].value)
						})
						ajax({
							url: deleteUrl,
							data: { primaryKeys },
							success: res => {
								toast({ color: "success", title: this.state.json['10140INCPF-000033'] });/* 国际化处理： 删除成功！*/
								this.refreshAction(props);
							}
						})
					}
				})

				break
			case 'Commit':
				let pks = []
				let tss = {}
				//getCheckedRows**(moduleId) | 获取选中行数据
				checkedData = props.table.getCheckedRows(this.tableId)
				checkedData.forEach(item => {
					if (item.data.values.billstatus.value == -1) {
						pks.push(item.data.values[pk_item].value)
						tss[item.data.values[pk_item].value] = item.data.values['ts'].value
					}
				})
				this.pks = pks
				if (pks.length == 0) {
					toast({ color: 'warning', content: this.state.json['10140INCPF-000071'] });/* 国际化处理： 提交失败*/
					return
				}
				ajax({
					url: commitUrl,
					data: { content: null, pks: pks, tss },
					success: res => {
						//工作流和审批流
						if (res.data && res.data.workflow && (res.data.workflow == 'approveflow')) {
							this.setState({
								compositedata: res.data,
								compositedisplay: true
							});
						}
						else if (res.data) {
							toast({ color: 'warning', content: `${this.state.json['10140INCPF-000056']}: ${res.data}` })/* 国际化处理： 部分单据提交失败*/
							this.refreshAction(props)
						} else {
							toast({ color: 'success', content: this.state.json['10140INCPF-000026'] });/* 国际化处理： 提交成功*/
							this.refreshAction(props);
						}
					}
				})
				break
			case 'Callback':
				pks = []
				checkedData = props.table.getCheckedRows(this.tableId)
				checkedData.forEach(item => {
					//自由=-1,审批未通过=0,审批通过=1,审批中=2,已提交=3
					let tempStatus = item.data.values.billstatus.value
					if (tempStatus == 1 || tempStatus == 3) {
						pks.push(item.data.values[pk_item].value)
					}
				})

				if (pks.length == 0) {
					toast({ color: 'success', content: this.state.json['10140INCPF-000049'] });/* 国际化处理： 收回成功！*/
					return
				}
				ajax({
					url: callbackUrl,
					data: pks,
					success: res => {
						if (res && res.data) {
							toast({ color: 'danger', content: res.data })
						}
						else {
							this.refreshAction(props);
							toast({ color: 'success', content: this.state.json['10140INCPF-000049'] });/* 国际化处理： 收回成功！*/
						}
					}
				})
				break
			case 'Refresh':
				this.refreshAction(props, true);
				break;
			case 'Print':
				this.output('print')
				break;
			case 'Output':
				let allData = this.props.table.getAllTableData(tableId);
				pks = [];
				allData.rows.forEach((row) => {
					pks.push(row.values[pk_item].value)
				});
				this.setState({
					pks
				}, () => {
					this.refs.printOutput.open()
				})
				break;


		}
	}

	//更新按钮状态
	updateButtonStatus() {
		let checkedRows = this.props.table.getCheckedRows(this.tableId)
		let disableActionSet = {}

		disableActionSet.Print = false
		disableActionSet.Output = false
		if (checkedRows == null || checkedRows.length == 0) { 
			disableActionSet.Edit = true
			disableActionSet.Delete = true
			disableActionSet.Commit = true
			disableActionSet.Callback = true
			disableActionSet.Print = true
			disableActionSet.Output = true
		}
		else {
			let fCheckedRow = checkedRows[0]
			if (fCheckedRow.data.values.billstatus.value == -1) { //自由态
				disableActionSet.Edit = false
				disableActionSet.Delete = false
				disableActionSet.Commit = false
				disableActionSet.Callback = true
			}
			else if (fCheckedRow.data.values.billstatus.value == 3) {   //提交态
				disableActionSet.Edit = true
				disableActionSet.Delete = false
				disableActionSet.Commit = true
				disableActionSet.Callback = false
			}
			else if (fCheckedRow.data.values.billstatus.value == 1) { //审批通过
				disableActionSet.Delete = true
				disableActionSet.Commit = true
				disableActionSet.Callback = false
			}
			else {
				disableActionSet.Edit = true
				disableActionSet.Delete = true
				disableActionSet.Commit = true
				disableActionSet.Callback = true
			}
		}
		// setButtonDisabled|设置按钮的禁用状态
		this.props.button.setButtonDisabled(disableActionSet)
	}

	onRowClick(props, moduleId, record, index) {
		console.log(record)
		this.selectedRowRecord = record
	}
	onSelectedChange() {
		this.updateButtonStatus()
	}

	refreshAction = (props, isClickRef) => {
		let searchVal = props.search.getAllSearchData(searchId);
		if (isClickRef) {
			this.getData(searchVal, false, () => {
				toast({ color: 'success', title: this.state.json['10140INCPF-000050'] })/* 国际化处理： 刷新成功！*/
			})
		}
		else {
			this.getData(searchVal)
		}
	}
	//输出
	output(type = '') {
		let allData = this.props.table.getAllTableData(tableId);
		let pks = [];
		allData.rows.forEach((row) => {
			pks.push(row.values[pk_item].value)
		});
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print(
				'pdf',
				printUrl,
				{
					funcode:/*this.props.config.funcode*/'10140INCPF',     //功能节点编码
					nodekey: 'incomelist',     //模板节点标识
					oids: pks,
					outputType: type
				}
			)
		}
	}


	getData(searchVal, showToast = false, callback) {
		//获取查询模板信息
		// queryInfo: 经过包装的queryCondition
		let queryInfo = this.props.search.getQueryInfo('search')
		//高级查询框当中，上面的方法是不能够获取相应的查询条件的，所以合并一下searchVal的查询条件
		let finalSearchVal = { ...queryInfo }
		// finalSearchVal.querycondition.conditions  查询的条件  组织、申请类型等
		finalSearchVal.querycondition.conditions = searchVal.conditions
		let OID = queryInfo.oid
		let data = {
			...finalSearchVal,
			//getTablePageInfo**(moduleId)| 获取simpleTable表格的page信息 | moduleId 页面对应的区域ID  String  | {pageSize, pageIndex}：{当前页码，每页数量} | getTablePageInfo('tableDemo') |
			pageInfo: this.props.table.getTablePageInfo(this.tableId) ? this.props.table.getTablePageInfo(this.tableId) : {
				pageIndex: 0,
				pageSize: 10,
				total: 0,
				totalPage: 0
			},
			pagecode: pageId,
			queryAreaCode: searchId,  //查询区编码
			oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType: 'tree'
		};

		ajax({
			url: queryListUrl,
			data,
			success: (res) => {
				console.log(res);
				if (res.data) {
					//构建一下分页组件需要的数组
					// let allPks = []
					// res.data[tableId].rows.forEach(row => {
					// 	allPks.push(row.values[pk_item].value)
					// })
					// res.data[tableId].allpks = allPks
					this.props.button.setButtonDisabled({
						Print: false,
						Output: false
					})
					//前端记录一下分页所需的所有主键，避免后端重复查询
					this.totalPks = res.data[tableId].allpks
					this.props.table.setAllTableData(tableId, res.data[tableId]);
					this.updateButtonStatus()
					let count = this.totalPks.length;
					if (showToast) {
						toast({ content: this.props.MutiInit.getIntl("10140INCPF").get('10140INCPF-000057', { count: count }), color: 'success' })/* 国际化处理： 已成功！,查询成功，共,条。*/
					}
				} else {
					let tableData = {
						allpks: [],
						rows: []
					}
					this.props.button.setButtonDisabled({
						Print: true,
						Output: true
					})
					this.totalPks = []
					this.props.table.setAllTableData(tableId, tableData);
					if (showToast) {
						toast({ content: this.state.json['10140INCPF-000054'], color: "warning", title: this.state.json['10140INCPF-000055'] });/* 国际化处理： 未查询出符合条件的数据！,请注意！*/
					}
				}

				if (callback && typeof callback == 'function') {
					callback()
				}
			},
			error: (res) => {
				console.log(res.message);
			}
		});

	}

	pageInfoClick = (props, config, pks) => {
		//getTablePageInfo**(moduleId)| 获取simpleTable表格的page信息 | moduleId 页面对应的区域ID  String  | {pageSize, pageIndex}：{当前页码，每页数量} | getTablePageInfo('tableDemo') | 
		let pageInfo = props.table.getTablePageInfo(this.tableId);
		let searchVal = props.search.getAllSearchData(searchId);
		// 后台还没更新，暂不可用
		let data = {
			"allpks": pks,
			"pageid": pageId,
			...pageInfo,
			totalPage: this.totalPks.length
		};
		//得到数据渲染到页面
		let that = this;
		ajax({
			url: pageInfoClickUrl,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data) {
						//点击分页时设置一下分页信息
						data[tableId].allpks = this.totalPks
						//setAllTableData**(moduleId, data, isTop)| 设置简单表格显示内容
						props.table.setAllTableData(tableId, data[tableId]);
					} else {
						props.table.setAllTableData(tableId, { rows: [] });
					}
				}
			}
		});
	}

	clickSearchBtn = (props, searchVal) => {
		//searchVal: '', // 搜索框的value
		cacheTools.set('searchParams', searchVal)
		this.getData(searchVal, true)
	}
	doubleClick = (record, index, e, props) => {
		let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set("searchParams", searchVal);
		let linkConf = {
			status: 'browse',
			errParam: JSON.stringify(record)
		}
		linkConf.id = record[pk_item].value
		this.props.pushTo('/card', linkConf);
	}
	getAssginUsedr = (value) => {
		ajax({
			url: commitUrl,
			data: { content: value, pks: this.primaryKeys },
			success: res => {
				if (res.data && res.data.workflow && (res.data.workflow == 'approveflow')) {
					this.setState({
						compositedata: res.data,
						compositedisplay: true
					});
				}
				else {
					this.setState({
						compositedata: null,
						compositedisplay: false
					});
					toast({ color: 'success', content: this.state.json['10140INCPF-000026'] });/* 国际化处理： 提交成功*/
					this.refreshAction(this.props)
				}
			}
		})
	}
	onApprTransClose() {
		this.setState({
			compositedata: null,
			compositedisplay: false
		});
	}

	closeApprove = () => {
		this.setState({
			showApprInfo: false
		})
	}

	render() {
		let { table, button, search, BillHeadInfo, socket } = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp, getButtons } = button;
		return (<div className="nc-bill-list">
			<NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
				{socket.connectMesg({
					tableAreaCode: this.tableId,//'表格区域编码', 
					billpkname: pk_item,//'表格行主键名',
					billtypeFromList: 'billtypecode', //列表每条数据单据类型不相同时，可传billtypeFromList 从列表行数据中获取单据类型，值为单据类型字段名
					isShowView: true, // 显示立即查看按钮
				})}
				<div className='header-title-search-area'>
					{createBillHeadInfo({
						title: "收款协议申请单",
						initShowBackBtn: false
					})}
				</div>
				<div className="header-button-area">
					{createButtonApp({
						area: 'header-action',
						buttonLimit: 3,
						onButtonClick: this.buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')

					})}
				</div>
			</NCDiv>
			<div className="nc-bill-search-area">
				{NCCreateSearch(this.searchId, {
					clickSearchBtn: this.clickSearchBtn.bind(this)
				})}
			</div>
			<div className="nc-bill-table-area">
				{createSimpleTable(this.tableId, {
					dataSource: dataSource,
					pkname: pk_item,
					//handlePageInfoChange | 分页器操作的回调函数 
					handlePageInfoChange: this.pageInfoClick,
					tableModelConfirm: this.tableModelConfirm,//弹窗确认事件回调
					showIndex: true,
					onRowClick: this.onRowClick.bind(this),
					onSelected: this.onSelectedChange.bind(this),
					onSelectedAll: this.onSelectedChange.bind(this),
					showCheck: true,			//显示复选框
					onRowDoubleClick: this.doubleClick.bind(this)
				})}
			</div>
			<PrintOutput
				ref='printOutput'
				url={printUrl}
				data={{
					funcode: '10140INCPF',
					oids: this.state.pks,
					nodekey: 'incomelist',
					outputType: 'output'
				}}
			/>

			{/* 指派组件 */}
			{this.state.compositedisplay ? <ApprovalTrans
				title={this.state.json ? this.state.json['10140INCPF-000037'] : '10140INCPF-000037'}/* 国际化处理： 指派*/
				data={this.state.compositedata}
				display={this.state.compositedisplay}
				getResult={this.getAssginUsedr.bind(this)}
				cancel={this.onApprTransClose.bind(this)}
			/> : ""}

			<ApproveDetail
				show={this.state.showApprInfo}
				close={this.closeApprove}
				//billtype**| 单据类型
				billtype='10SX'
				billid={this.state.billId}
			/>
		</div>)
	}

}
List = createPage({
	initTemplate: [],
	mutiLangCode: '10140INCPF'
})(List);
// ReactDOM.render(<List />, document.querySelector('#app'));

export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65