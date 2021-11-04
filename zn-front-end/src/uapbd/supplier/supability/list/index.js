//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast, high, cacheTools, promptBox, getMultiLang,createPageIcon } from 'nc-lightapp-front';
import { print } from 'nc-lightapp-front';
const {PrintOutput} = high
const {NCPopconfirm, NCIcon,NCTabs}=base;
const NCTabPane=NCTabs.NCTabPane;
//import './index.less';

const dataSource = 'upabd.supplier.supability.data'
const pageId = '10140SACLSO_list';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'supplyabilityset';                 //表头id
const oId = '1001Z01000000000TTB6';     //查询区oid
const appid = '0001Z010000000002YR3';   //注册按钮id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_supabilityset';           //列表主键
const queryListUrl = '/nccloud/uapbd/supability/querySupabilityList.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/taxregion/ProjectQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/supability/deleteSupability.do';                 //删除url
const printUrl = '/nccloud/uapbd/supability/printSupability.do'

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.selectedRowRecord = null
		this.state = {
			pks: [],
			json: {}
		}
	}

	initTemplate =(props) =>{

		let _this = this;
		props.createUIDom(
			{
				pagecode: pageId//页面id
				// appid: appid,//注册按钮的id
				// appcode: '10140SACLSO'
			},
			data => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						meta = this.modifierMeta(props, meta)
						props.meta.setMeta(meta,()=>{
							if(data.context){
								if(data.context.pk_org&&data.context.org_Name){
									props.search.setSearchValByField(searchId,"pk_org", {value:data.context.pk_org?data.context.pk_org:null,display:data.context.org_Name?data.context.org_Name:null});
								}
							}
						});
						
						let searchVal = cacheTools.get("searchParams");
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
								queryType:'tree'
							};
					
							ajax({
								url: queryListUrl,
								data,
								success: (res) => {
									if(res.data){
										//构建一下分页组件需要的数组
										let allPks = []
										res.data[tableId].rows.forEach(row => {
											allPks.push(row.values[pk_item].value)
										})
										cacheTools.set('allpks',allPks)
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
										toast({content:this.state.json['10140SACLSO-000022'],color:"warning"});/* 国际化处理： 无数据*/
									}
								},
								error : (res)=>{
									console.log(res.message);
								}
							});
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
		let showDisableSwitchItems = ['pk_org','pk_supabclass','pk_mategrade.pk_material']
		meta[searchId].items = meta[searchId].items.map((item, key) => {
			item.col = '3';

			if(showDisableSwitchItems.indexOf(item.attrcode) >= 0) {
				item.isShowDisabledData = true
			}
			return item;
		})
		
		//修正查询区，增加业务单元、供货能力分类等参照的多选操作
		let fixQueryConditions = ['pk_org','pk_supabclass','pk_supplyname','pk_supgradesys','pk_mategrade.pk_material']
		meta[searchId].items.forEach(item => {
			if(fixQueryConditions.indexOf(item.attrcode) >= 0) {
				item.isMultiSelectedEnabled = true
			}
		})
	
		//对于业务单元增加主组织权限过滤
		meta[searchId].items.find(item => item.attrcode == 'pk_org').queryCondition = () => {
			return {
				TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
			}
		}
	
		//meta[tableId].pagination = true;
		meta[tableId].items = meta[tableId].items.map((item, key) => {
			//item.width = 150;
			if (item.attrcode == linkItem) {
				item.render = (text, record, index) => {
					return (
						<span
							style={{color: '#007ace', cursor: 'pointer' }}
							onClick={() => {
								//let searchVal = props.search.getAllSearchData(searchId);
								//props.CacheTools.set("searchParams",searchVal);
								//props.CacheTools.set('preid',record[pk_item].value);
								let searchVal = props.search.getAllSearchData(searchId);
								cacheTools.set("searchParams",searchVal);
								props.pushTo('/card', {
									status: 'browse',
									pagecode:'10140SACLSO_card',
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
			label: this.state.json['10140SACLSO-000000'],/* 国际化处理： 操作*/
			width: 200,
			fixed: 'right',
			className : 'table-opr',
			visible: true,
			render: (text, record, index) => {
				return (
					<span>
						{/* <NCIcon
							type="uf-pencil-s"
							onClick={() => {
								props.pushTo('../card/index.html', {
									status: 'edit',
									id: record.crevecontid.value
								});
							}}
						/> */}
						<span
							style={{cursor: 'pointer' }}
							onClick={() => {
								props.pushTo('/card', {
									status: 'edit',
									pagecode:'10140SACLSO_card',
									id: record[pk_item].value
								});
							}}
						>
							{this.state.json['10140SACLSO-000034']/* 国际化处理： 修改*/}
						</span><span>&nbsp; &nbsp;</span>
						<NCPopconfirm
							trigger="click"
							placement="top"
							content={this.state.json['10140SACLSO-000023']/* 国际化处理： 确定删除？*/}
							onClose={() => {
								let id = record[pk_item].value
								let data = {deleteInfo: []}
								data.deleteInfo.push({
									id: record[pk_item].value,
									ts: record.ts.value
								})
								ajax({
									url: deleteUrl,
									data,
									success: (res) => {
										if (res.success) {
											//单页缓存方案-删除
											let {deleteCacheId} = props.table;
											deleteCacheId(tableId, id)
											toast({ color: 'success', content: this.state.json['10140SACLSO-000011'] });/* 国际化处理： 删除成功！*/
											props.table.deleteTableRowsByIndex(tableId, index);
										}
									}
								});
							}}
						>
							<span style={{cursor: 'pointer' }}>{this.state.json['10140SACLSO-000015']/* 国际化处理： 删除*/}</span>
						</NCPopconfirm>
					</span>
				);
			}
		});
		return meta;
	}

	componentDidMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
					this.initTemplate(this.props)
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
		this.props.MultiInit.getMultiLang({moduleId: '10140SACLSO', domainName: 'uapbd',callback})
		//this.getData(); 平台考虑效率，打开节点不直接加载数据
		//判定下列表当中是否有数据，如果没有数据的话，那么打印按钮置灰处置
		let disabledButton = {
			Delete: true
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
        switch (id) {
			case 'Add':
				let searchVal = props.search.getAllSearchData(searchId);
				cacheTools.set("searchParams",searchVal);
                props.pushTo('/card',{
					pagecode:'10140SACLSO_card',
                    status:'add'
                })
                break;
			case 'Edit':
				searchVal = props.search.getAllSearchData(searchId);
				cacheTools.set("searchParams",searchVal);
				let checkedRows = this.props.table.getCheckedRows(this.tableId)
				let dataid = null
				if(checkedRows.length > 0) {
					dataid = checkedRows[0].data.values[pk_item].value
				}
				else {
					toast({content:this.state.json['10140SACLSO-000024'],color:"warning"})/* 国际化处理： 请勾选需编辑的数据!*/
					return
				}
                props.pushTo('/card',{
					status:'edit',
					pagecode:'10140SACLSO_card',
					id: dataid
                })
                break;	
            case 'Refresh':
				this.refreshAction(props,true);
				this.props.button.setButtonDisabled({Delete: true})
                break;
            case 'Delete':
				//this.props.modal.show('delete')
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140SACLSO-000025'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
					content: this.state.json['10140SACLSO-000026'],             // 提示内容,非必输/* 国际化处理： 您确定要删除所选数据吗*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140SACLSO-000005'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140SACLSO-000006'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.deleteAction.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break;
			case 'Print':
				this.output('print')
				break;
			case 'Output':
				let allData = this.props.table.getAllTableData(tableId);
				let pks = [];
				allData.rows.forEach((row)=>{
					pks.push(row.values[pk_item].value)
				});
				this.setState({
					pks
				},() => {
					this.refs.printOutput.open()
				})
				break;
            default:
                break;
        }
	}
	
	output(type=''){
        let allData = this.props.table.getAllTableData(tableId);
        let pks = [];
        allData.rows.forEach((row)=>{
			pks.push(row.values[pk_item].value)
        });
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if(type!=''){
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode:/*this.props.config.funcode*/'10140SACLSO',     //功能节点编码
                    nodekey:'supplyset-list',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
        }
    }

	doubleClick = (record, index, e, props)=>{
		let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set("searchParams",searchVal);
        this.props.pushTo('/card', {
			status: 'browse',
			pagecode:'10140SACLSO_card',
            id: record[pk_item].value
        });
	}

    deleteAction() {
        // let data = props.table.getCheckedRows(tableId);
        // console.log(data)
        // let params = {deleteinfo:data.map((v)=>{
        //     let id = v.data.values[pk_item].value;
        //     let ts = v.data.values.ts.value;
        //     return {
        //         id,ts
        //     }
        // })}
		// console.log(params)
		let data = this.props.table.getCheckedRows(tableId);
		let params = []

		if(!data || data.length == 0) {
			taost({color: 'warning',content: this.state.json['10140SACLSO-000027']})/* 国际化处理： 请勾选需要删除的数据！*/
			return
		}

		data.forEach(item => {
			params.push({
				id: item.data.values[pk_item].value,
				ts: item.data.values.ts.value
			})
		})
        ajax({
            url: deleteUrl,
            data: {deleteInfo: params},
            success: (res) => {
                toast({color:"success",title:this.state.json['10140SACLSO-000011']});/* 国际化处理： 删除成功！*/
				this.refreshAction(this.props);
				this.props.button.setButtonDisabled({Delete: true})
            }
        });
	}
	
	onRowClick(props,moduleId,record,index) {
		this.selectedRowRecord = record
	}

    refreshAction =(props, isClickRef = false)=>{
        let searchVal = props.search.getAllSearchData(searchId);
		if(searchVal) {
			this.getData(searchVal,false, () => {
				if(isClickRef) {
					toast({title: this.state.json['10140SACLSO-000009'], color: 'success'});/* 国际化处理： 刷新成功！*/
				}
			})
		}
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

	onSelectChange() {
		//应UE要求：如果是没有选中行的话，顶部删除按钮置灰
		if(this.props.table.getCheckedRows(this.tableId).length > 0) {
			this.props.button.setButtonDisabled(['Delete'],false)
		}
		else {
			this.props.button.setButtonDisabled(['Delete'],true)
		}
	}
	
	getData(searchVal, showToast, callback) {
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
            queryType:'tree'
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if(res.data){
					//构建一下分页组件需要的数组
					let allPks = []
					res.data[tableId].rows.forEach(row => {
						allPks.push(row.values[pk_item].value)
					})
					res.data[tableId].allpks = allPks
					this.props.button.setButtonDisabled({
						Print: false,
						Output: false
					})
					this.props.table.setAllTableData(this.tableId, res.data[tableId]);
					let count = allPks.length;
					let {inlt} = this.state
					if(showToast) {
						toast({title:this.state.json['10140SACLSO-000028'],content:inlt&&inlt.get('10140SACLSO-000035',{count:count}),color:'success'})/* 国际化处理： 已成功！,查询成功，共,条。*/
					}
                }else{
                    //同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
					let tableData = {
						allpks: [],
						rows: []
					}
					//如果没有数据的话，打印和输出按钮置灰
					this.props.button.setButtonDisabled({
						Print: true,
						Output: true
					})
					this.props.table.setAllTableData(tableId, tableData);
					if(showToast) {
						toast({content:this.state.json['10140SACLSO-000031'],color:"warning", title: this.state.json['10140SACLSO-000032']});/* 国际化处理： 未查询出符合条件的数据！,请注意！*/
					}
				}
				
				if(res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg,{
							[tableId]: 'table'
						}
					)
				}

				if(callback && typeof callback == 'function') {
					callback()
				}
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
	}

    clickSearchBtn = (props,searchVal)=>{
            
		//console.log(searchVal);
		//应产品要求：如果没有选择必输项-业务单元，就不能够点击查询
		if(!searchVal) {
			return
		}
        cacheTools.set("searchParams",searchVal);
        this.searchVal = searchVal
        this.getData(searchVal, true)
    }

	render() {
		let { table, button, search, modal } = this.props;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createModal } = modal
		let { createButtonApp , getButtons } = button;
		return (<div className="nc-bill-list">
				<div className='nc-bill-header-area'>
					<div className='header-title-search-area'>
                    {createPageIcon()}
					<h2 className='title-search-detail'>{this.state.json['10140SACLSO-000021']/* 国际化处理： 供应商供货能力分类设置*/}</h2></div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'header-action',
							buttonLimit: 3, 
							onButtonClick: this.buttonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this)
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: dataSource,
						pkname: pk_item,
						handlePageInfoChange: this.pageInfoClick,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:true,
						onRowClick: this.onRowClick.bind(this),
						showCheck:true,
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.onSelectChange.bind(this),
						onSelectedAll: this.onSelectChange.bind(this)
					})}
				</div>

				<PrintOutput
					ref='printOutput'
					url={printUrl}
					data={{
						funcode: '10140SACLSO',
						oids: this.state.pks,
						nodekey:'supplyset-list',
						outputType: 'output'
					}}
				/>

				{createModal('delete',{
					title: this.state.json['10140SACLSO-000025'],/* 国际化处理： 确认删除*/
					content: this.state.json['10140SACLSO-000033'],/* 国际化处理： 您确定要删除所选数据吗?*/
					beSureBtnClick: this.deleteAction.bind(this)
				})}
			</div>
		);
	}
}

List = createPage({
	initTemplate: [],
	mutiLangCode: '10140SACLSO'
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65