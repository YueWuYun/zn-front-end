//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, cacheTools, base ,toast, high, promptBox, createPageIcon, getMultiLang} from 'nc-lightapp-front';
const {NCPopconfirm,NCCheckbox, NCIcon,NCTabs}=base;
const NCTabPane=NCTabs.NCTabPane;
import { print } from 'nc-lightapp-front';
const {PrintOutput} = high
const { NCDiv } = base;
const dataSource = 'upabd.taxinfo.taxregion.data'
const pageId = '10140TAXRE_list';        //pagecode
const searchId = 'taxregionsearch';              //查询区id
const tableId = 'taxregion';                 //表头id
const oId = '1001ZP1000000001RCV5';     //查询区oid
const appid = '0001Z01000000000190Z';   //注册按钮id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_taxregion';           //列表主键
const queryListUrl = '/nccloud/uapbd/taxregion/queryTaxregionList.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/taxregion/ProjectQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/taxregion/delTaxregion.do';                 //删除url
const printUrl = '/nccloud/uapbd/taxregion/printTaxregion.do'
const changeEnableStatus = '/nccloud/uapbd/taxregion/changeEnableTaxregion.do'; 

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.selectedRowRecord = null
		this.state = {
			showOffDisable:false,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false
		};

		this.searchVal = null

		this.changeEnableInfo = {
			title: '',
			content: ''
		}
	}

	initTemplate =(props) =>{

		let _this = this;
		props.createUIDom(
			{
				pagecode: pageId//页面id
				// appid: appid,//注册按钮的id
				// appcode: '10140TAXRE'
			},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						meta = this.modifierMeta(props, meta)
						props.meta.setMeta(meta);
						let searchVal = cacheTools.get('searchParams')
						let tempSearchVal = searchVal == null || !searchVal ? {conditions:[],logic: 'and'} : searchVal
						let OID = data.template.taxregionsearch.oid
						let taxregionData = {
							querycondition: tempSearchVal,
							pageInfo: {
								pageIndex: 0,
								pageSize: 10,
								total: 0,
								totalPage: 0
							},
							pagecode: pageId,
							queryAreaCode: searchId,  //查询区编码
							oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
							querytype:'tree'
						};

						ajax({
							url: queryListUrl,
							data: taxregionData,
							success: (res) => {
								if(res.data){
									//构建一下分页组件需要的数组
									let allPks = []
									res.data[tableId].rows.forEach(row => {
										allPks.push(row.values[pk_item].value)
									})
									props.button.setButtonDisabled({
										Print: false,
										Output: false
									})
									res.data[tableId].allpks = allPks
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
									//toast({content:this.state.json ? this.state.json['10140TAXRE-000030'] : '10140TAXRE-000030',color:"warning"});/* 国际化处理： 无数据*/
								}

								if(res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
									this.props.dealFormulamsg(
										res.formulamsg,{
											[tableId]: 'editTable'
										}
									)
								}
							}
						});
						if(searchVal && searchVal != false){
							props.search.setSearchValue('taxregionsearch',searchVal)
							
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
	
	modifierMeta(props, meta) {
		meta[searchId].items = meta[searchId].items.map((item, key) => {
			item.col = '3';
			return item;
		})

		//修正查询区国家地区参照使其支持多选
		meta[searchId].items.find(item => item.attrcode == 'pk_country').isMultiSelectedEnabled=true

		//meta[tableId].pagination = true;
		meta[tableId].items = meta[tableId].items.map((item, key) => {
			//item.width = 150;
			if (item.attrcode == linkItem) {
				item.render = (text, record, index) => {
					return (
						<span
							style={{ textDecoration: 'underline', cursor: 'pointer' }}
							onClick={() => {
								let searchVal = props.search.getAllSearchData(searchId);
								cacheTools.set("searchParams",searchVal);
								props.pushTo('/card', {
									status: 'browse',
									pagecode:'10140TAXRE_card',
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
		//添加操作列
		meta[tableId].items.push({
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['10140TAXRE-000000'] : '10140TAXRE-000000',/* 国际化处理： 操作*/
			width: 200,
			fixed: 'right',
			className : 'table-opr',
			visible: true,
			render: (text, record, index) => {
				return (
					<span>
						<span
							style={{cursor: 'pointer' }}
							onClick={() => {
								props.pushTo('/card', {
									status: 'edit',
									pagecode:'10140TAXRE_card',
									id: record[pk_item].value
								});
							}}
						>
							{this.state.json ? this.state.json['10140TAXRE-000038'] : '10140TAXRE-000038'/* 国际化处理： 修改*/}
						</span><span>&nbsp; &nbsp;</span>
						<NCPopconfirm
							trigger="click"
							placement="top"
							content={this.state.json ? this.state.json['10140TAXRE-000031'] : '10140TAXRE-000031'/* 国际化处理： 确定删除？*/}
							onClose={() => {
								let id = record[pk_item].value
								ajax({
									url: deleteUrl,
									data: {
										id: record[pk_item].value,
										ts: record.ts.value
									},
									success: (res) => {
										if (res.success) {
											toast({ color: 'success', content: this.state.json['10140TAXRE-000032'] });/* 国际化处理： 删除成功*/
											//单页缓存方案-删除
											let {deleteCacheId} = props.table;
											deleteCacheId(tableId, id)
											props.table.deleteTableRowsByIndex(tableId, index);
										}
									}
								});
							}}
						>
							<span style={{cursor: 'pointer' }}>{this.state.json ? this.state.json['10140TAXRE-000025'] : '10140TAXRE-000025'/* 国际化处理： 删除*/}</span>
						</NCPopconfirm>
					</span>
				);
			}
		});
		return meta;
	}

	componentDidMount() {
		// let searchVal = this.props.search.getAllSearchData(this.searchId);
		// this.getData(searchVal, this.state.isShowOff); //平台考虑效率，打开节点不直接加载数据
		//console.log('component did mount ')
		//应产品要求：列表态头部修改按钮不显示
		//this.props.button.setButtonVisible(['Disable','Enable','Edit'],false)

		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
					this.initTemplate(this.props)
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
		this.props.MultiInit.getMultiLang({moduleId: '10140TAXRE', domainName: 'uapbd',callback})

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
	}

	getButtonNames = (codeId) => {
		if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
			return 'main-button'
		}else {
			return 'secondary - button'
		}
	};

    buttonClick(props, id) {
        switch(id) {
		case 'Add':
			let searchVal = props.search.getAllSearchData(searchId);
			cacheTools.set("searchParams",searchVal);
			props.pushTo('/card',{
				pagecode:'10140TAXRE_card',
				status:'add'
			})
			break;
		case 'Edit':
			searchVal = props.search.getAllSearchData(searchId);
			cacheTools.set("searchParams",searchVal);
			if(this.selectedRowRecord == null) {
				toast({content:this.state.json['10140TAXRE-000033'],color:'warning'})/* 国际化处理： 请选择需要编辑的数据！*/
				return
			}
			props.pushTo('/card',{
				status:'edit',
				pagecode:'10140TAXRE_card',
				id: this.selectedRowRecord[pk_item].value
			})
			break;	
		case 'Refresh':
			this.refreshAction(props,true);
			break;
		case 'Delete':
			//this.props.modal.show('delete');
			//this.deleteAction(props);
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140TAXRE-000004'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
				content: this.state.json['10140TAXRE-000005'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.deleteAction.bind(this)   // 确定按钮点击调用函数,非必输
			})
			break;
		case 'Print':
			this.output('print')
			break;
		case 'Enable':
			//this.props.modal.show('enable')
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140TAXRE-000014'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认启用*/
				content: this.state.json['10140TAXRE-000015'],             // 提示内容,非必输/* 国际化处理： 是否确认要启用？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.changeEnableClick.bind(this)   // 确定按钮点击调用函数,非必输
			})
			break
		case 'Disable':
			//this.props.modal.show('disable')
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140TAXRE-000016'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认停用*/
				content: this.state.json['10140TAXRE-000017'],             // 提示内容,非必输/* 国际化处理： 是否确认要停用？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.changeEnableClick.bind(this)   // 确定按钮点击调用函数,非必输
			})
			break
		case 'Output':
			let allData = this.props.table.getAllTableData(tableId);
			let pks = [];
			allData.rows.forEach((row)=>{
				pks.push(row.values[pk_item].value);
			});
			this.setState({
				pks: pks
			},() => {
				this.refs.printOutput.open()
			})
			break;
		default:
			break;
        }
	}

	changeEnableClick() {
		let idPk = this.selectedRowRecord[pk_item].value
		ajax({
			url: changeEnableStatus,
			data: {
				id: idPk
			},
			success: res => {
				//this.selectedRowRecord.enablestate.value = res.data
				//更正一下界面的启用状态以及相关字段
				if(res.data) {
					let allData = this.props.table.getAllTableData(this.tableId)
					allData.rows.forEach(row => {
						if(row.values[pk_item].value == res.data.pk) {
							row.values.enablestate = {
								value: res.data.enableState,
								display: res.data.enableState == 2 ? this.state.json['10140TAXRE-000002'] : this.state.json['10140TAXRE-000034']/* 国际化处理： 已启用,已停用*/
							}

							row.values.modifier = {
								value: res.data.modifier,
								display: res.data.modifierName
							}

							row.values.modifiedtime = {
								value: res.data.modifyTime,
								display: res.data.modifyTime
							}
						}
					})

					this.props.table.setAllTableData(this.tableId, allData)
				}
				// if(res.data == 2) {
				// 	this.props.button.setButtonVisible(['Enable'],false)
				// 	this.props.button.setButtonVisible(['Disable'],true)
				// }
				// else if(res.data == 3) {
				// 	this.props.button.setButtonVisible(['Enable'],true)
				// 	this.props.button.setButtonVisible(['Disable'],false)
				// }
				if(res.data.enableState == 2) {
					this.props.button.setButtonDisabled({Enable: true,Disable: false})
					toast({color: 'success', title: this.state.json['10140TAXRE-000020']})/* 国际化处理： 启用成功！*/
				}
				else {
					this.props.button.setButtonDisabled({Enable: false,Disable: true})
					toast({color: 'success', title: this.state.json['10140TAXRE-000021']})/* 国际化处理： 停用成功！*/
				}
			}
		})
	}
	
	output(type=''){
        let allData = this.props.table.getAllTableData(tableId);
        let pks = [];
        allData.rows.forEach((row)=>{
            pks.push(row.values[pk_item].value);
        });
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if(type!=''){
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode:/*this.props.config.funcode*/'10140TAXRE',     //功能节点编码
                    nodekey:'list',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
        }
    }

	doubleClick = (record, index, e, props)=>{
        let searchVal = this.props.search.getAllSearchData(searchId);
        cacheTools.set("searchParams", searchVal);
		//this.props.CacheTools.set('preid',this.props.getUrlParam('id'));
		//cacheTools.set('preid',this.props.getUrlParam('id'));
        this.props.pushTo('/card', {
			status: 'browse',
			pagecode:'10140TAXRE_card',
            id: record[pk_item].value
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
                toast({color:"success",title: this.state.json['10140TAXRE-000019']});/* 国际化处理： 删除成功！*/
                this.refreshAction(props);
            }
        });
	}
	
	onRowClick(props,moduleId,record,index) {
		this.selectedRowRecord = record
		// if(record.enablestate.value == 2) {
		// 	props.button.setButtonVisible(['Enable'],false);
		// 	props.button.setButtonVisible(['Disable'],true);
		// }
		// else if(record.enablestate.value == 3) {
		// 	props.button.setButtonVisible(['Enable'],true);
		// 	props.button.setButtonVisible(['Disable'],false);
		// }

		if(record.enablestate.value == 2) {
			props.button.setButtonDisabled({Enable: true,Disable: false})
		}
		else {
			props.button.setButtonDisabled({Enable: false,Disable: true})
		}
	}

    refreshAction =(props, isClickRef = false)=>{
		this.getData({}, this.state.isShowOff,false, () => {
			if(isClickRef) {
				toast({title: this.state.json['10140TAXRE-000013'], color: 'success'});/* 国际化处理： 刷新成功！*/
			}
		})
    }

    pageInfoClick = (props, config, pks)=>{
        
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        //let searchVal = props.search.getAllSearchData(searchId);
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
		this.searchVal = searchVal
		cacheTools.set('searchParams',searchVal)
        this.getData(searchVal,this.state.isShowOff,true)
	}
	
	getData(searchVal,isShowOff, showToast = false, callback) {
		//获取查询模板信息
		let queryInfo = this.props.search.getQueryInfo('taxregionsearch')
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
			querytype:'tree',
			showDisable: isShowOff
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
				//this.props.button.setButtonVisible(['Enable','Disable'],false)
				this.props.button.setButtonDisabled({Enable: true,Disable: true})
                if(res.data){
					//构建一下分页组件需要的数组
					let allPks = []
					res.data[tableId].rows.forEach(row => {
						allPks.push(row.values[pk_item].value)
					})
					this.props.button.setButtonDisabled({
						Print: false,
						Output: false
					})
					res.data[tableId].allpks = allPks
					this.props.table.setAllTableData(this.tableId, res.data[tableId]);
					let count = allPks.length;
					let {inlt} = this.state
					if(showToast) {
						toast({title:this.state.json['10140TAXRE-000035'],content:inlt.get('10140TAXRE-000042',{count:count}),color:'success'})/* 国际化处理： 已成功！,查询成功,共,条*/
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
						toast({content:this.state.json['10140TAXRE-000036'],color:"warning", title: this.state.json['10140TAXRE-000037']});/* 国际化处理： 未查询出符合条件的数据！,请注意！*/
					}
				}

				// if(res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				// 	this.props.dealFormulamsg(
				// 		res.formulamsg,{
				// 			[tableId]: 'table'
				// 		}
				// 	)
				// }
				
				if(callback && typeof callback == 'function') {
					callback()
				}
            }
        });
	}

	//显示停用数据
	showOffChange(){
		let isShowOff = !this.state.isShowOff
		this.setState({
			isShowOff : !this.state.isShowOff
		});
		this.getData(this.searchVal,isShowOff);
	}

	render() {
		let { table, button, search, base, modal,BillHeadInfo } = this.props;
		const {createBillHeadInfo} = BillHeadInfo;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createModal } = modal
		let { createButtonApp , getButtons } = button;
		return (<div className="nc-bill-list">
				<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
					<div className='header-title-search-area' >
						{createBillHeadInfo({
								title:(this.state.json ? this.state.json['10140TAXRE-000029'] : '10140TAXRE-000029'),
								initShowBackBtn:false
							}
						)}
					</div>
					{/* 显示停用数据 */}
					<div className="title-search-detail">
						<span>
							<NCCheckbox
								checked={this.state.isShowOff}
								onChange={this.showOffChange.bind(this)}
								disabled={this.state.showOffDisable}
							>{this.state.json ? this.state.json['10140TAXRE-000041'] : '10140TAXRE-000041'/* 国际化处理： 显示停用*/}</NCCheckbox>
						</span>
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
				<div className="nc-bill-search-area" fieldid='nc-bill-searchId'>
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this)
					})}
				</div>
				{/* <div style={{height:'10px'}}></div> */}
				<div className="nc-bill-table-area" fieldid='tableId'>
					{createSimpleTable(this.tableId, {
						//handlePageInfoChange: this.pageInfoClick,
						dataSource: dataSource,
						pkname: pk_item,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:false,
						onRowClick: this.onRowClick.bind(this),
						//showCheck:true,
						onRowDoubleClick: this.doubleClick.bind(this)
					})}
				</div>

				{createModal('delete', {
					title: this.state.json ? this.state.json['10140TAXRE-000004'] : '10140TAXRE-000004',/* 国际化处理： 注意*/
					content: this.state.json ? this.state.json['10140TAXRE-000005'] : '10140TAXRE-000005',/* 国际化处理： 确认删除？*/
					beSureBtnClick: this.deleteAction.bind(this)
				})}

				{createModal('enable',{
					title: this.state.json ? this.state.json['10140TAXRE-000014'] : '10140TAXRE-000014',/* 国际化处理： 确认启用*/
					content: this.state.json ? this.state.json['10140TAXRE-000015'] : '10140TAXRE-000015',/* 国际化处理： 是否确认要启用？*/
					beSureBtnClick: this.changeEnableClick.bind(this)
				})}

				{createModal('disable',{
					title: this.state.json ? this.state.json['10140TAXRE-000016'] : '10140TAXRE-000016',/* 国际化处理： 确认停用*/
					content: this.state.json ? this.state.json['10140TAXRE-000017'] : '10140TAXRE-000017',/* 国际化处理： 是否确认要停用？*/
					beSureBtnClick: this.changeEnableClick.bind(this)
				})}

				<PrintOutput
					ref='printOutput'
					url={printUrl}
					data={{
						funcode: '10140TAXRE',
						nodekey:'list',
						oids: this.state.pks,
						outputType: 'output'
					}}
				/>
			</div>
		);
	}
}

List = createPage({
	initTemplate: [],
	mutiLangCode: '10140TAXRE'
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65