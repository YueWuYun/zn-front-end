//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast, print, high, cacheTools,promptBox, getBusinessInfo,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const {PrintOutput}=high;
import  Utils from '../../../public/utils';
const {NCPopconfirm, NCCheckbox, NCIcon,NCTabs,NCDiv}=base;
const NCTabPane=NCTabs.NCTabPane;
import './index.less';

const funcode = '10140CBAE';
const pageId = '10140CBAE_list';        //pagecode
const pageIdCard = '10140CBAE_card';        //pagecode
const searchId = '10140CBAEQRY';              //查询区id
const tableId = 'pk_bankaccsub';                 //表头id
const oid = '0001Z010000000008MYJ';     //查询区oid
const appid = '0001Z010000000002EF0';   //注册按钮id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_bankaccbas';           //列表主键
const queryListUrl = '/nccloud/uapbd/custaccen/custenqueryList.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/taxregion/ProjectQueryPageGridByPks.do';  //分页查询url
const enableUrl = '/nccloud/uapbd/custaccen/custaccenable.do' //启用
const printUrl = '/nccloud/uapbd/custaccen/custenlistprint.do' //打印

let initTemplate =(props) =>{

	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId//页面id
			// appid: appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//查询区的参照多选
					let fixedSearchItems = ['pk_org','pk_customer','pk_custclass','bankaccsub.pk_currtype','pk_bankdoc','pk_banktype','creator','enableuser']
					// 客户，客户基本分类参照
					let orgItems = ['pk_customer','pk_custclass'];
					meta = modifierMeta(props, meta)
					// meta[searchId].items.find((item) => item.attrcode == 'pk_org').isMultiSelectedEnabled = true;
					meta[searchId].items.forEach(item => {
						if(fixedSearchItems.indexOf(item.attrcode) >= 0) {
							item.isMultiSelectedEnabled = true
						}
						// 显示业务单元选择
						if(orgItems.indexOf(item.attrcode) >= 0) {
							item.isShowUnit = true;
						}
					})
					//对客户银行账户启用的组织添加主组织权限过滤
                    meta[searchId].items.find(item => item.attrcode == 'pk_org').queryCondition = () => {
	                        return {
								nodeType: 'customer',
                                TreeRefActionExt: "nccloud.web.uapbd.supplier.supbanken.BankenOrgSqlBuilder",
                                isbusinessunit: 'N'
	                        }
	                    }

					props.meta.setMeta(meta);
					
					let searchVal = cacheTools.get("searchParams")
					// let searchVal = null
					// console.log("缓存查询条件")
					// console.log(searchVal);
					if(searchVal && searchVal != false){
						// searchVal.map((v)=>{
						// 	props.search.setSearchValByField('searchArea',v.field,v.display);
						// 	return v;
						// })
						props.search.setSearchValue(searchId,searchVal);
						let queryInfo = props.search.getQueryInfo(searchId);
						let OID = queryInfo.oid;

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
										let pks = `${row.values.pk_custbank.value}_${row.values.pk_bankaccbas.value}_${row.values.pk_cust.value}`
										allPks.push(pks)
									})
									// cacheTools.set('allpks',allPks)
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
					
					props.button.setMainButton('Enable', true);
					// props.button.setMainButton({Enable:true, Disable:false});
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.col = '3';
		return item;
	})
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
							// props.linkTo('/uapbd/customer/custbanken/card/index.html', {
							props.pushTo('/card', {
								status: 'browse',
								pagecode: pageIdCard,
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
			isShowOff:false,
			pks: [],
			json:{},
			inlt:null
		}
	}
	componentDidMount() {
		//this.getData(); 平台考虑效率，打开节点不直接加载数据
		// this.props.button.setButtonDisabled({
		// 	Enable: true,
		// 	Disable: true
		// })
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

	componentWillMount() {
    	let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
       		if (status) {
       			this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			}
		}
    	// getMultiLang({moduleId: '10140CBAE',domainName: 'uapbd',callback})
		this.props.MultiInit.getMultiLang({moduleId: '10140CBAE',domainName: 'uapbd',callback})
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
				// this.props.modal.show('enable');
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140CBAE-000002'],/* 国际化处理： 确认启用*/
					content:this.state.json['10140CBAE-000003'],/* 国际化处理： 是否确认要启用？*/
					beSureBtnClick:()=>{this.enableSureEventClick()}
					})
				break;
			case 'Disable':
				// this.props.modal.show('disable');
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title:this.state.json['10140CBAE-000004'],/* 国际化处理： 确认停用*/
					content:this.state.json['10140CBAE-000005'],/* 国际化处理： 是否确认要停用？*/
					beSureBtnClick:()=>{this.disableSureEventClick()}
					})
				break;
            case 'Refresh':
                this.refreshAction(props);
                break;
			case 'Print':
				this.output('print')
				break;
			case 'Output':
				this.output('output');
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
        if(type === "print"){
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode: funcode,     //功能节点编码
                    nodekey: 'custlist',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
		}
		//输出
		if(type === "output"){
			this.setState({
				pks: pks
				},this.refs.printOutput.open());	
		}
    }
	
	doubleClick = (record, index, e)=>{
            
        console.log(this.state.json['10140CBAE-000027']);/* 国际化处理： 双击*/
		console.log(this)
		
        // let searchVal = this.props.search.getAllSearchData(searchId);
		// this.props.CacheTools.set("searchParams", searchVal);
		// this.props.CacheTools.get("searchParams");
		// this.props.CacheTools.set('preid',this.props.getUrlParam('id'));
		
        //let searchVal = this.props.search.getAllSearchData(searchId);
        //this.props.CacheTools.set("searchParams", searchVal);
		//this.props.CacheTools.set('preid',this.props.getUrlParam('id'));
		let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set("searchParams", searchVal);
		let pks = `${record.pk_custbank.value}_${record.pk_bankaccbas.value}_${record.pk_cust.value}`
        this.props.pushTo('/card', {
			pagecode: pageIdCard,
        // this.props.linkTo('/uapbd/customer/custbanken/card/index.html', {
			status: 'browse',
			id: pks
			// pk_custbank: record.pk_custbank.value,
			// pk_bankaccbas: record.pk_bankaccbas.value,
			// pk_cust: record.pk_cust.value
        });
	}

	
	onRowClick(props,moduleId,record,index) {
		console.log(record)
		this.selectedRowRecord = record
	}

    refreshAction =(props)=>{
        let searchVal = props.search.getAllSearchData(searchId);
        
		this.getData(searchVal,this.state.isShowOff,()=>{
			toast({ color: 'success', title: this.state.json['10140CBAE-000006'] });/* 国际化处理： 刷新成功！*/
		});

	}

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

		this.getData(searchVal,this.state.isShowOff,(data)=>{
			if (data) {
				let count = data[this.tableId].allpks.length;
				toast({content:this.state.inlt&&this.state.inlt.get('10140CBAE-000023', { count: count}),color:'success'})/* 国际化处理： 已成功！,查询成功，共,条。*/
			} else {
				toast({content:this.state.json['10140CBAE-000025'],color:"warning"});/* 国际化处理： 请注意！,未查询出符合条件的数据！*/

			}
		})
		
	}
	
	getData(searchVal,isShowDisable,callback) {
		// 校验不通过 
		// if(!searchVal) return;
		//获取查询模板信息
		let queryInfo = this.props.search.getQueryInfo(searchId);
		let OID = queryInfo.oid;
		
        // console.log(searchVal);
        // //props.CacheTools.set("searchParams",searchVal);
        // let metaData = this.props.meta.getMeta();
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
                // console.log(res);
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

                    // this.props.table.setAllTableData(this.tableId, {rows:[]});
					// toast({content:"无数据",color:"warning"});
					// toast({title:"请注意！",content:"未查询出符合条件的数据！",color:"warning"});
				}

				callback&&callback(res.data);
				this.props.button.setButtonDisabled({
					Enable: true,
					Disable: true
				})
				this.enableNumber = 0
				this.disableNumber = 0
            // },
            // error : (res)=>{
            //     console.log(res.message);
            }
        });
	}


	enableSureEventClick() {
		let selectedRows = this.props.table.getCheckedRows(this.tableId)
		if(selectedRows.length == 0) {
			toast({color: 'warning',content: this.state.json['10140CBAE-000026']})/* 国际化处理： 请选择需要操作的记录！*/
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
				// this.clickSearchBtn(props, true);
				//单点效率问题：不再重新请求后台刷新数据了
				this.mergeRetData.bind(this)(res.data,true, ()=>{
					toast({ color: 'success', title: this.state.json['10140CBAE-000007'] });/* 国际化处理： 启用成功！*/
				});
				// this.getData(this.searchVal,this.state.isShowOff,()=>{
				// 	toast({ color: 'success', title: this.state.json['10140CBAE-000007'] });/* 国际化处理： 启用成功！*/
				// });

			}

		})
	}
	
	
	mergeRetData(retRows, isEnable, callback) {
		let allData = this.props.table.getAllTableData(this.tableId)
		allData.rows.forEach((row,index) => {
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
					row.values['pk_bankaccbas.enablestate'] = {
						value: 2,
						display: this.state.json['10140CBAE-000030']/* 国际化处理： 已启用*/
					}
					row.values.enablestate = {
						value: 2,
						display: this.state.json['10140CBAE-000030']/* 国际化处理： 已启用*/
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
					row.values['pk_bankaccbas.enablestate'] = {
						value: 3,
						display: this.state.json['10140CBAE-000031']/* 国际化处理： 已停用*/
					}
					row.values.enablestate = {
						value: 3,
						display: this.state.json['10140CBAE-000031']/* 国际化处理： 已停用*/
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
		callback&&callback();
	}

	disableSureEventClick() {
		let selectedRows = this.props.table.getCheckedRows(this.tableId)
		if(selectedRows.length == 0) {
			toast({color: 'warning',content: this.state.json['10140CBAE-000026']})/* 国际化处理： 请选择需要操作的记录！*/
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
				// this.clickSearchBtn(props, true);
				
				//单点效率问题：不再重新请求后台刷新数据了
				this.mergeRetData.bind(this)(res.data,false,()=>{
					toast({ color: 'success', title: this.state.json['10140CBAE-000008'] });/* 国际化处理： 停用成功！*/
				});
				// this.getData(this.searchVal,this.state.isShowOff,()=>{
				// 	toast({ color: 'success', title: this.state.json['10140CBAE-000008'] });/* 国际化处理： 停用成功！*/
				// });

			}

		})
	}
	//显示停用数据
	showOffChange(){
		// let isShowOff = !this.state.isShowOff
		this.setState({
			isShowOff : !this.state.isShowOff
		},()=>{
			this.getData(this.searchVal,this.state.isShowOff);
		});
	}
	render() {
		let { table, button, search , modal,BillHeadInfo} = this.props;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp , getButtons } = button;
		let { createModal } = modal;
		const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
		return (
			<div className="nc-bill-list">
				{/* <div className='nc-bill-header-area'> */}
					<NCDiv  areaCode={NCDiv.config.HEADER}>
				<div className='nc-bill-header-area' style={{borderBottom: '1px solid #ccc'}}>
						<div className='header-title-search-area' >
							{createBillHeadInfo(
								{
									title:this.state.json['10140CBAE-000028'],
									initShowBackBtn  :false,
									backBtnClick:()=>{}
								}
							)}
							{/* {createPageIcon()}  */}
							{/* <h2 fieldid ={this.state.json['10140CBAE-000028']+'_title'} className='title-search-detail'>{this.state.json['10140CBAE-000028']}</h2> */}
						</div>
						{/* 显示停用数据 */}
						<div className="title-search-detail">
							<span>
								<NCCheckbox
									checked={this.state.isShowOff}
									onChange={this.showOffChange.bind(this)}
									disabled={this.state.showOffDisable}
								>{this.state.json['10140CBAE-000029']/* 国际化处理： 显示停用*/}</NCCheckbox>
							</span>
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: 'list_head',
								buttonLimit: 3, 
								onButtonClick: this.buttonClick.bind(this), 
								popContainer: document.querySelector('.header-button-area')
		
							})}

						</div>	
					
				</div>
					</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this)
					})}
				</div>
				{/* <div style={{height:'10px'}}></div> */}
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

				<PrintOutput
					ref = 'printOutput'
					url = {printUrl}
					data = {{
						funcode: funcode,      //功能节点编码，即模板编码
						nodekey: 'custlist',     //模板节点标识
						oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
						outputType: "output"
					}}
					//callback={this.onSubmit}
				>
				</PrintOutput>
			</div>
		);
	}
}

List = createPage({
	initTemplate: initTemplate,
    mutiLangCode: '10140CBAE'
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65