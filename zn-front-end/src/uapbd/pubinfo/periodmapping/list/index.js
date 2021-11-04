//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, cacheTools, base ,toast, high, promptBox, createPageIcon, getMultiLang} from 'nc-lightapp-front';

const dataSource = 'upabd.pubinfo.periodmapping.data'
const pageId = '10140ACMAP_list';        //pagecode
const tableId = 'periodmapping';                 //表头id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_peiodmapping';           //列表主键
const queryListUrl = '/nccloud/uapbd/periodmapping/queryPeriodMappingList.do';           //通过查询区域查询url
const deleteUrl = '/nccloud/uapbd/periodmapping/delete.do';                 //删除url

class List extends Component {
	constructor(props) {
		super(props);
		this.tableId = tableId;
        this.selectedRowRecord = null
        
        this.state = {
            json: {}
        }
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
				// appcode: '10140ACMAP'
			},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						meta = this.modifierMeta(props, meta)
						props.meta.setMeta(meta);
						ajax({
							url: queryListUrl,
							data: {},
							success: (res) => {
								if(res.data){
									//构建一下分页组件需要的数组
									props.table.setAllTableData(tableId, res.data[tableId]);
								}else{
									//同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
									let tableData = {
										allpks: [],
										rows: []
									}
									props.table.setAllTableData(tableId, tableData);
									//toast({content:this.state.json ? this.state.json['10140ACMAP-000030'] : '10140ACMAP-000030',color:"warning"});/* 国际化处理： 无数据*/
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
					}
					if (data.button) {
						let button = data.button;
                        props.button.setButtons(button, () => {
                            this.updateButtonStatus()
                        });
                        props.button.setPopContent('RowDel', this.state.json['10140ACMAP-000043']); /* 设置操作列上删除按钮的弹窗提示 */
					}
				}
			}
		)
	}
	
	modifierMeta(props, meta) {
		// 添加超链接(固定为code字段)
		meta[tableId].items = meta[tableId].items.map((item, key) => {
			//item.width = 150;
			if (item.attrcode == 'code') {
				item.render = (text, record, index) => {
					return (
						<span
                            style={{color: '#007ace', cursor: 'pointer' }}
							onClick={() => {
								props.pushTo('/card', {
									pagecode:'10140ACMAP_card',
									status: 'browse',
									id: record[pk_item].value//列表卡片传参
								});
							}}
						>
							{record && record.code && record.code.value}
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
			label: this.state.json ? this.state.json['10140ACMAP-000000'] : '10140ACMAP-000000',/* 国际化处理： 操作*/
			width: 200,
			fixed: 'right',
			className : 'table-opr',
			visible: true,
			render: (text, record, index) => {
	
				let btnArray = []
				let vBillStatus = record && record.vbillstatus ? record.vbillstatus.value : -1

				btnArray = ['RowEdit','RowDel']
	
				return props.button.createOprationButton(
					btnArray,
					{
						area: "row-action",
						buttonLimit: 3,
						onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
					}
				)
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
		this.props.MultiInit.getMultiLang({moduleId: '10140ACMAP', domainName: 'uapbd',callback})

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
    
    tableButtonClick(props, id, text, record, index) {
        switch(id) {
            case 'RowEdit':
                let primaryKey = record[pk_item].value
                props.pushTo('/card',{
					status: 'edit',
					pagecode:'10140ACMAP_card',
                    id: primaryKey
                })
                break;
            case 'RowDel':
                let deleteInfo = [{
                    id: record[pk_item].value,
                    ts: record.ts.value
                }]
                ajax({
                    url: deleteUrl,
                    data: {deleteInfo},
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', content: this.state.json['10140SPF-000046'] });/* 国际化处理： 删除成功*/
                            props.table.deleteTableRowsByIndex(tableId, index);
                        }
                    }
                });
                break;
            }
    }

    buttonClick(props, id) {
        switch(id) {
		case 'Add':
			props.pushTo('/card',{
				pagecode:'10140ACMAP_card',
				status:'add'
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
				title: this.state.json['10140ACMAP-000004'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
				content: this.state.json['10140ACMAP-000005'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140ACMAP-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140ACMAP-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.deleteAction.bind(this)   // 确定按钮点击调用函数,非必输
			})
			break;
		default:
			break;
        }
	}

	doubleClick = (record, index, e, props)=>{
        this.props.pushTo('/card', {
			pagecode:'10140ACMAP_card',
            status: 'browse',
            id: record[pk_item].value
        });
	}

    deleteAction = (props) =>{
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
                toast({color:"success",title: this.state.json['10140ACMAP-000019']});/* 国际化处理： 删除成功！*/
                this.refreshAction(props);
            }
        });
	}
	
	onRowClick(props,moduleId,record,index) {
	}

    refreshAction =(props, isClickRef = false)=>{
		this.getData({}, this.state.isShowOff,false, () => {
			if(isClickRef) {
				toast({title: this.state.json['10140ACMAP-000013'], color: 'success'});/* 国际化处理： 刷新成功！*/
			}
		})
    }

    updateButtonStatus() {
        let checkedRows = this.props.table.getCheckedRows(this.tableId)
        if(checkedRows == null || checkedRows.length == 0) {
            this.props.button.setButtonDisabled({Delete: true})
        }
        else {
            this.props.button.setButtonDisabled({Delete: false})
        }
    }

    clickSearchBtn = (props,searchVal)=>{
		this.searchVal = searchVal
		cacheTools.set('searchParams',searchVal)
        this.getData(searchVal,this.state.isShowOff,true)
	}
	
	getData(searchVal,isShowOff, showToast = false, callback) {
        ajax({
            url: queryListUrl,
            data: {},
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
						toast({title:this.state.json['10140ACMAP-000035'],content:inlt.get('10140ACMAP-000042',{count:count}),color:'success'})/* 国际化处理： 已成功！,查询成功,共,条*/
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
						toast({content:this.state.json['10140ACMAP-000036'],color:"warning", title: this.state.json['10140ACMAP-000037']});/* 国际化处理： 未查询出符合条件的数据！,请注意！*/
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

	render() {
		let { table, button, search, modal,BillHeadInfo } = this.props;
        const { NCDiv} = base;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
        const {createBillHeadInfo} = BillHeadInfo;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createModal } = modal

		let { createButtonApp , getButtons } = button;
		return (<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
					<div className='header-title-search-area'>
                        {
                            createBillHeadInfo(
                                {
                                    title :this.state.json ? this.state.json['10140ACMAP-000029'] : '10140ACMAP-000029'/* 国际化处理： 税收地区*/,             //标题
                                    initShowBackBtn:false
                                }
                            )}
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
				{/* <div style={{height:'10px'}}></div> */}
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						//handlePageInfoChange: this.pageInfoClick,
						dataSource: dataSource,
						pkname: pk_item,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:false,
                        //onRowClick: this.onRowClick.bind(this),
                        showCheck:true,
                        onRowDoubleClick: this.doubleClick.bind(this),
                        onSelected: this.updateButtonStatus.bind(this),
						onSelectedAll: this.updateButtonStatus.bind(this),
						adaptionHeight:true
					})}
				</div>

                {createModal('delete', {
					title: this.state.json ? this.state.json['10140ACMAP-000004'] : '10140ACMAP-000004',/* 国际化处理： 注意*/
					content: this.state.json ? this.state.json['10140ACMAP-000005'] : '10140ACMAP-000005',/* 国际化处理： 确认删除？*/
					beSureBtnClick: this.deleteAction.bind(this)
				})}
			</div>
		);
	}
}

List = createPage({
	initTemplate: [],
	mutiLangCode: '10140ACMAP'
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65