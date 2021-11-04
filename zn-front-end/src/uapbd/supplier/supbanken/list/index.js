//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast, high, cacheTools, getBusinessInfo, promptBox,createPageIcon, getMultiLang } from 'nc-lightapp-front';
import { print } from 'nc-lightapp-front';
const {NCPopconfirm, NCCheckbox, NCIcon,NCTabs}=base;
const NCTabPane=NCTabs.NCTabPane;
const {PrintOutput} = high;
const {NCDiv} = base;

const pageId = '10140SBAE_list';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'supbank';                 //表头id
const oId = '1001Z0100000000005EL';     //查询区oid
const appid = '0001Z010000000001IQ2';   //注册按钮id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_bankaccbas';           //列表主键
const queryListUrl = '/nccloud/uapbd/supbanken/querySupbankenList.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/taxregion/ProjectQueryPageGridByPks.do';  //分页查询url
const enableUrl = '/nccloud/uapbd/supbanken/enableSupbankenCard.do' //启用
const printUrl = '/nccloud/uapbd/supbanken/printSupbanken.do'

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.col = '3';
		return item;
	})

	//修正一下
	// meta[tableId].pagination = true;
	meta[tableId].pagination = false;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		//item.width = 150;
		if (item.attrcode == linkItem) {
			item.render = (text, record, index) => {
				return (
					<span
						style={{ textDecoration: 'underline', cursor: 'pointer' }}
						onClick={() => {
							let searchVal = props.search.getAllSearchData(searchId);
							props.CacheTools.set("searchParams",searchVal);
							props.CacheTools.set('preid',record[pk_item].value);
							props.pushTo('/card', {
								pagecode:'10140SBAE_card',
								status: 'browse',
								id: record[pk_item].value//列表卡片传参
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
	return meta;
}

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.selectedRowRecord = null
		this.enableNumber = 0
		this.disableNumber = 0
		this.state = {
			showOffDisable:false,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:localStorage.getItem("isShowOff") && localStorage.getItem("isShowOff").includes("true")  || false,
			pks: [],
			json: {}
		};
	}

	initTemplate =(props) =>{

		let _this = this;
		props.createUIDom(
			{
				pagecode: pageId//页面id
				// appid: appid,//注册按钮的id
				// appcode: '10140SBAE'
			},
			data => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						//查询区的参照多选
						let fixedSearchItems = ['pk_org','pk_supplier','pk_supplierclass','bankaccsub.pk_currtype','pk_bankdoc','pk_banktype','creator','enableuser']
						//meta[searchId].items.find(item => item.attrcode == 'pk_org').isMultiSelectedEnabled = true
						meta[searchId].items.forEach(item => {
							if(fixedSearchItems.indexOf(item.attrcode) >= 0) {
								item.isMultiSelectedEnabled = true
							}

							//对pk_org应用主组织权限过滤
							if(item.attrcode == 'pk_org') {
								item.queryCondition = () => {
									return {
										nodeType: "supplier",
                                        TreeRefActionExt: "nccloud.web.uapbd.supplier.supbanken.BankenOrgSqlBuilder",
                                        isbusinessunit: 'N'
									}
								}
							}

							if(item.attrcode == 'pk_supplier') {
								item.isShowUnit = true
								item.isShowDisabledData = true
							}

							if(item.attrcode == 'pk_supplierclass') {
								item.isShowUnit = true
							}

							if(item.attrcode == 'pk_bankdoc') {
								item.isShowDisabledData = true
							}
							if(item.attrcode == 'create' || item.attrcode == 'enableuser') {
								item.isShowDisabledData = true
							}
						})
	
						props.meta.setMeta(meta);
						let searchVal = cacheTools.get("searchParams")
						if(searchVal && searchVal != false){
							props.search.setSearchValue(searchId,searchVal)
							let queryInfo = props.search.getQueryInfo(searchId)
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
								queryType:'tree',
								showDisable: _this.state.isShowOff
							};
					
							ajax({
								url: queryListUrl,
								data,
								success: (res) => {
									if(res.data){
										//构建一下分页组件需要的数组
										let allPks = []
										res.data[tableId].rows.forEach(row => {
											let pks = `${row.values.pk_custbank.value}_${row.values.pk_bankaccbas.value}_${row.values.pk_cust.value}`
											allPks.push(pks)
										})
										//下面一行代码是为了拯救平台simpleTable.jsx当中犯傻的componentWillUnmount函数
										res.data[tableId].allpks = allPks
										props.button.setButtonDisabled({
											Print: false,
											Output: false
										})
										props.table.setAllTableData(tableId, res.data[tableId]);
									}else{
										//同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
										let tableData = {
											allpks: [],
											rows: []
										}
										props.button.setButtonDisabled({
											Print: true,
											Output: true
										})
										props.table.setAllTableData(tableId, tableData);
										toast({content:this.state.json['10140SBAE-000024'],color:"warning"});/* 国际化处理： 无数据*/
									}
								},
								error : (res)=>{
									console.log(res.message);
								}
							});
						} else {
							//如果没有查询区内容，自动带出当前集团
							let businessInfo = getBusinessInfo()
							props.search.setSearchValByField(searchId,'pk_org',{value: businessInfo.groupId, display: businessInfo.groupName})
						}
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
					}
				}
			}
		)
	}
	

	componentDidMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
					this.initTemplate(this.props)
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
		this.props.MultiInit.getMultiLang({moduleId: '10140SBAE', domainName: 'uapbd',callback})
		//this.getData(); 平台考虑效率，打开节点不直接加载数据
		let disabledButton = {
			Enable: true,
			Disable: true
		}
		let allData = this.props.table.getAllTableData(this.tableId)
		if(allData.rows.length == 0) {
			disabledButton.Print = true
			disabledButton.Output = true
		}
		this.props.button.setButtonDisabled(disabledButton)
		//this.props.button.setButtonVisible(['Enable','Disable'],false)
	
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
			return 'main-button'
		}else {
			return 'secondary - button'
		}
	};

    buttonClick(props, id) {
        switch (id) {
			case 'Enable': 
				//this.props.modal.show('enable')
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140SBAE-000002'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认启用*/
					content: this.state.json['10140SBAE-000003'],             // 提示内容,非必输/* 国际化处理： 是否确认要启用？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140SBAE-000004'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140SBAE-000005'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.enableSureEventClick.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break;
			case 'Disable':
				//this.props.modal.show('disable')
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140SBAE-000006'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认停用*/
					content: this.state.json['10140SBAE-000007'],             // 提示内容,非必输/* 国际化处理： 是否确认要停用？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140SBAE-000004'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140SBAE-000005'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.disableSureEventClick.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break;
			case 'Print':
				this.output('print')
				break;
			case 'Output':
				let allData = this.props.table.getAllTableData(tableId);
				let pks = [];
				allData.rows.forEach((row)=>{
					pks.push(row.values.pk_custbank.value)
					pks.push(row.values.pk_bankaccbas.value)
					pks.push(row.values.pk_cust.value)
				});
				this.setState({
					pks
				},() => {
					this.refs.printOutput.open()
				})
				break;
            case 'Refresh':
                this.refreshAction(props);
                break;
            default:
                break;
        }
	}
	
	output(type=''){
        let allData = this.props.table.getAllTableData(tableId);
        let pks = [];
        allData.rows.forEach((row)=>{
			pks.push(row.values.pk_custbank.value)
			pks.push(row.values.pk_bankaccbas.value)
			pks.push(row.values.pk_cust.value)
        });
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if(type!=''){
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode:/*this.props.config.funcode*/'10140SBAE',     //功能节点编码
                    nodekey:'suplist',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
        }
    }

	doubleClick = (record, index, e, props)=>{
		let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set("searchParams", searchVal);
		let pks = `${record.pk_custbank.value}_${record.pk_bankaccbas.value}_${record.pk_cust.value}`
        this.props.pushTo('/card', {
			status: 'browse',
			pagecode:'10140SBAE_card',
			id: pks
        });
	}

    deleteAction = (props) =>{
		let params = {
			id: this.selectedRowRecord[pk_item].value,
			ts: this.selectedRowRecord.ts.value
		}
        ajax({
            url: deleteUrl,
            data: params,
            success: (res) => {
                toast({color:"success",title:this.state.json['10140SBAE-000025']});/* 国际化处理： 删除成功！*/
                this.refreshAction(props);
            }
        });
	}
	
	onRowClick(props,moduleId,record,index) {
		this.selectedRowRecord = record
	}

    refreshAction =(props)=>{
        let searchVal = props.search.getAllSearchData(searchId)
		if(!searchVal) {
			return
		}
		this.getData(searchVal,this.state.isShowOff, false, () => {
			toast({color: 'success',title: this.state.json['10140SBAE-000008']})/* 国际化处理： 刷新成功！*/
		})
	}
	
	// onSelected(props,moduleId,record,index,status) {

	// 	let recordStatus = record.enablestate.value
	// 	if(status) {
	// 		if(recordStatus == 2) {
	// 			this.enableNumber++
	// 			// props.button.setButtonDisabled({
	// 			// 	Enable: true,
	// 			// 	Disable: this.disableNumber > 0 ? true : false
	// 			// })
	// 			props.button.setButtonVisible(['Enable'],false)
	// 			props.button.setButtonVisible(['Disable'],this.disableNumber > 0 ? false : true)
	// 		}
	// 		else {
	// 			this.disableNumber++
	// 			// props.button.setButtonDisabled({
	// 			// 	Enable: this.enableNumber > 0 ? true : false,
	// 			// 	Disable: true
	// 			// })

	// 			props.button.setButtonVisible(['Enable'],this.enableNumber > 0 ? false : true)
	// 			props.button.setButtonVisible(['Disable'],false)
	// 		}
	// 	}
	// 	else {
	// 		if(recordStatus == 2) {
	// 			this.enableNumber--
	// 		}
	// 		else {
	// 			this.disableNumber--
	// 		}
	// 		let buttonStatus = {
	// 			Enable: this.enableNumber > 0 ? true : this.disableNumber > 0 ? false : true,
	// 			Disable: this.disableNumber > 0 ? true : this.enableNumber > 0 ? false : true
	// 		}
	// 		//props.button.setButtonDisabled(buttonStatus)
	// 		props.button.setButtonVisible(['Enable'],!buttonStatus.Enable)
	// 		props.button.setButtonVisible(['Disable'],!buttonStatus.Disable)
	// 	}

	// 	if(this.enableNumber > 0) {
	// 		// props.button.setButtonDisabled({
	// 		// 	Enable: true
	// 		// })
	// 		// props.button.setButtonVisible(['Enable'],this.enableNumber > 0 ? true : false)
	// 		// props.button.setButtonVisible(['Disable'],true)
	// 	}
	// }

	onSelected(props,moduleId,record,index,status) {

		let recordStatus = record.enablestate.value
		if(status) {
			if(recordStatus == 2) {
				this.enableNumber++
			}
			else {
				this.disableNumber++
			}
		}
		else {
			if(recordStatus == 2) {
				this.enableNumber--
			}
			else {
				this.disableNumber--
			}
		}

		let buttonStatus = {
			Enable: this.disableNumber > 0 ? false : true,
			Disable: this.enableNumber > 0 ? false : true
		}
		props.button.setButtonDisabled(buttonStatus)
	}

	onSelectedAll(props, moduleId, status, length) {
		let allData = this.props.table.getAllTableData(tableId);
		if(status) {
			allData.rows.forEach(item => {
				if(item.values.enablestate.value == 2) {
					this.enableNumber++
				}
				else {
					this.disableNumber++
				}
			})
		}
		else {
			this.enableNumber = 0
			this.disableNumber = 0
		}
		let buttonStatus = {
			Enable: this.disableNumber > 0 ? false : true,
			Disable: this.enableNumber > 0 ? false : true
		}
		props.button.setButtonDisabled(buttonStatus)
	}

    pageInfoClick = (props, config, pks)=>{
        
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchVal = props.search.getAllSearchData(searchId);
        // 后台还没更新，暂不可用
        let data = {
            "allpks": pks,
            "pageid": pageId
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: queryPageUrl,
            data: data,
            success: function(res) {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
            }
        });
    }

    clickSearchBtn = (props,searchVal)=>{
        if(!searchVal) {
			return
		}
		this.searchVal = searchVal
		cacheTools.set('searchParams',searchVal)
		this.getData(searchVal,this.state.isShowOff, true)
        
	}

	getData(searchVal,isShowDisable, showToast = false, callback) {
		//获取查询模板信息
		let queryInfo = this.props.search.getQueryInfo('search')
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
            queryAreaCode:searchId,  //查询区编码
            oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType:'tree',
			showDisable: isShowDisable
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                if(res.data){
					//构建一下分页组件需要的数组
					let allPks = []
					res.data[tableId].rows.forEach(row => {
						let pks = `${row.values.pk_custbank.value}_${row.values.pk_bankaccbas.value}_${row.values.pk_cust.value}`
						allPks.push(pks)
					})
					cacheTools.set('allpks',allPks)
					//下面一行代码是为了拯救平台simpleTable.jsx当中犯傻的componentWillUnmount函数
					res.data[tableId].allpks = allPks
					this.props.button.setButtonDisabled({
						Print: false,
						Output: false
					})
					this.props.table.setAllTableData(this.tableId, res.data[tableId]);
					let count = allPks.length;
					let {inlt} = this.state
					if(showToast) {
						toast({content:inlt&&inlt.get('10140SBAE-000036', {count: count}),color:'success'})/* 国际化处理： 已成功！,查询成功，共,条。*/
					}
                }else{
                    //同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
					let tableData = {
						allpks: [],
						rows: []
					}
					this.props.button.setButtonDisabled({
						Print: true,
						Output: true
					})
					this.props.table.setAllTableData(tableId, tableData);
                    if(showToast) {
						toast({content:this.state.json['10140SBAE-000029'],color:"warning", title: this.state.json['10140SBAE-000030']});/* 国际化处理： 未查询出符合条件的数据！,请注意！*/
					}
				}
				this.props.button.setButtonDisabled({
					Enable: true,
					Disable: true
				})
				this.enableNumber = 0
				this.disableNumber = 0

				if(callback && typeof callback == 'function') {
					callback()
				}
            }
        });
	}

	enableSureEventClick() {
		let selectedRows = this.props.table.getCheckedRows(this.tableId)
		if(selectedRows.length == 0) {
			toast({color: 'warning',content: this.state.json['10140SBAE-000031']})/* 国际化处理： 请选择需要操作的记录！*/
			return
		}
		let requestData = {
			isEnable: true,
			list: []
		}

		selectedRows.forEach(element => {
			let dataObj = {}
			dataObj.pk_bankaccbas = element.data.values.pk_bankaccbas.value
			dataObj.pk_custbank = element.data.values.pk_custbank.value
			dataObj.pk_cust = element.data.values.pk_cust.value
			requestData.list.push(dataObj)
		});
		ajax({
			url: enableUrl,
			data: requestData,
			success: res => {
				//this.getData(this.searchVal,this.state.isShowOff)
				//this.mergeRetData(res.data[this.tableId].rows)
				//单点效率问题：不再重新请求后台刷新数据了
				this.mergeRetData(res.data,true)
				//console.log(res.data.time)
				toast({color: "success",title: this.state.json['10140SBAE-000009']})/* 国际化处理： 启用成功！*/
			}

		})
	}

	mergeRetData(retRows, isEnable) {
		let allData = this.props.table.getAllTableData(this.tableId)
		allData.rows.forEach((row,index) => {
			// retRows.forEach(retRow => {
			// 	if(row.values.pk_bankaccbas.value == retRow.values.pk_bankaccbas.value &&
			// 		row.values.pk_custbank.value == retRow.values.pk_custbank.value &&
			// 			row.values.pk_cust.value == retRow.values.pk_cust.value) {
			// 				allData.rows[index] = retRow
			// 			}
			// })
			let pk = `${row.values.pk_bankaccbas.value}${row.values.pk_cust.value}${row.values.pk_custbank.value}`
			if(retRows.hasOwnProperty(pk)) {
				let value = retRows[pk].split("_")
				if(isEnable) {
					row.values['pk_bankaccbas.enableuser'] = {
						value: value[0],
						display: value[0]
					}
					row.values['pk_bankaccbas.enabledate'] = {
						value: value[1],
						display: value[1]
					}
					row.values.enablestate = {
						value: 2,
						display: this.state.json['10140SBAE-000032']/* 国际化处理： 已启用*/
					}
				}
				else {
					row.values['pk_bankaccbas.disableuser'] = {
						value: value[0],
						display: value[0]
					}
					row.values['pk_bankaccbas.disabletime'] = {
						value: value[1],
						display: value[1]
					}
					row.values.enablestate = {
						value: 3,
						display: this.state.json['10140SBAE-000033']/* 国际化处理： 已停用*/
					}
				}
			}
		})

		this.props.table.setAllTableData(this.tableId, allData)
		this.props.table.selectAllRows(this.tableId, false)
		this.props.button.setButtonDisabled({
			Enable: true,
			Disable: true
		})

		this.enableNumber = 0
		this.disableNumber = 0
	}

	disableSureEventClick() {
		let selectedRows = this.props.table.getCheckedRows(this.tableId)
		if(selectedRows.length == 0) {
			toast({color: 'warning',content: this.state.json['10140SBAE-000031']})/* 国际化处理： 请选择需要操作的记录！*/
			return
		}
		let requestData = {
			isEnable: false,
			list: []
		}

		selectedRows.forEach(element => {
			let dataObj = {}
			dataObj.pk_bankaccbas = element.data.values.pk_bankaccbas.value
			dataObj.pk_custbank = element.data.values.pk_custbank.value
			dataObj.pk_cust = element.data.values.pk_cust.value
			requestData.list.push(dataObj)
		});
		ajax({
			url: enableUrl,
			data: requestData,
			success: res => {
				//this.getData(this.searchVal,this.state.isShowOff)
				//this.mergeRetData(res.data[this.tableId].rows)
				//单点效率问题：不再重新请求后台刷新数据了
				this.mergeRetData(res.data,false)
				//console.log(res.data.time)
				toast({color: "success",title: this.state.json['10140SBAE-000010']})/* 国际化处理： 停用成功！*/
			}

		})
	}
	
	//显示停用数据
	showOffChange(){
		let isShowOff = !this.state.isShowOff
		this.setState({
			isShowOff : !this.state.isShowOff
		})
		localStorage.setItem("isShowOff", isShowOff);
		let searchVal = this.props.search.getAllSearchData(searchId)
		if(searchVal) {
			this.getData(searchVal,isShowOff);
		}
	}

	render() {
		let { table, button, search, modal,BillHeadInfo} = this.props;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp , getButtons } = button;
		let { createModal } = modal;
		const {createBillHeadInfo} = BillHeadInfo;
		return (<div className="nc-bill-list">
				<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
					<div className='header-title-search-area'>
                    {/* {createPageIcon()} */}
					{/* <h2 className='title-search-detail'>{this.state.json['10140SBAE-000034'] 国际化处理： 供应商银行账户启用}</h2> */}
					{createBillHeadInfo({
						title : this.state.json['10140SBAE-000034'],
						initShowBackBtn:false
                    })}
					</div>
					{/* 显示停用数据 */}
					<div className="title-search-detail">
						<span>
							<NCCheckbox
								checked={this.state.isShowOff}
								onChange={this.showOffChange.bind(this)}
								disabled={this.state.showOffDisable}
							>{this.state.json['10140SBAE-000035']/* 国际化处理： 显示停用*/}</NCCheckbox>
						</span>
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'header-action',
							buttonLimit: 3, 
							onButtonClick: this.buttonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
						{/* {buttons.map( (v) =>{
							return (createButton(v.btncode, {
								name: v.btnname,
								onButtonClick: this.buttonClick.bind(this),
								buttonColor: this.getButtonNames(v.btncode)
							}))
						})}  */}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this),
						clickAdvBtnEve: () => {
							//let queryInfo = this.props.search.getQueryInfo(searchId)
							let businessInfo = getBusinessInfo()
							this.props.search.setSearchValByField(searchId,'pk_org',{value: businessInfo.groupId, display: businessInfo.groupName})
						}
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: this.pageInfoClick,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:true,
						onRowClick: this.onRowClick.bind(this),
						onSelected: this.onSelected.bind(this),
						showCheck:true,			//显示复选框
						//showCheck:true,
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelectedAll: this.onSelectedAll.bind(this)
					})}
				</div>

				{createModal('enable',{
					title: this.state.json['10140SBAE-000002'],/* 国际化处理： 确认启用*/
					content: this.state.json['10140SBAE-000003'],/* 国际化处理： 是否确认要启用？*/
					beSureBtnClick: this.enableSureEventClick.bind(this)
				})}

				{createModal('disable',{
					title: this.state.json['10140SBAE-000006'],/* 国际化处理： 确认停用*/
					content: this.state.json['10140SBAE-000007'],/* 国际化处理： 是否确认要停用？*/
					beSureBtnClick: this.disableSureEventClick.bind(this)
				})}

				<PrintOutput
					ref='printOutput'
					url={printUrl}
					data={{
						funcode: '10140SBAE',
						nodekey: 'suplist',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
			</div>
		);
	}
}

List = createPage({
	initTemplate: []
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65