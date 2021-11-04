//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,output,print ,toast,cacheTools,promptBox} from 'nc-lightapp-front';
const {NCPopconfirm, NCIcon,NCTabs}=base;
const NCTabPane=NCTabs.NCTabPane;
import './index.less';

const pageId = '10140LFOR_dataformat';        //pagecode
const tableId = 'dataformat';                 //表头id
const linkItem = 'code';        		//列表卡片跳转字段
const pk_item = 'pk_formatdoc';           //列表主键
const queryListUrl = '/nccloud/uapbd/formatdoc/formatdocquery.do';           //通过查询区域查询url
//const queryPageUrl = '/nccloud/uapbd/sminfo/PaymentQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/formatdoc/formatdocdelete.do';    //删除url
const setDefaultUrl = '/nccloud/uapbd/formatdoc/formatdocdefault.do';
const printurl ="/nccloud/uapbd/formatdoc/formatdocPrint.do"
const tableBtnAry = ["EditLine","DelLine","SetToDefault","Copy"];		//表格列操作按钮

let initTemplate =(props) =>{

	// let _this = this;
	let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		if (status) {
			props.createUIDom(
				{
					pagecode: pageId//页面id
				},
				function (data) {
					if (data) {
						if (data.template) {
							let meta = data.template;
							meta = modifierMeta(props, meta,json)
							props.meta.setMeta(meta);
							data.button && props.button.setButtons(data.button);
							ajax({
								url: queryListUrl,
								data:{
									pagecode: pageId
								},
								success: (res) => {
									if(res.data){
										props.table.setAllTableData(tableId, res.data[tableId]);
									}else{
										toast({content:_this.state.json['10140FORMATDOC-000050'],color:"warning"});/* 国际化处理： 无数据*/
									}
								},
								error : (res)=>{
									console.log(res.message);
								}
							});
						}
					
					}
				}
			)
			
		} else {
			console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
		}
	}
	props.MultiInit.getMultiLang({ 'moduleId': '10140Farmat', 'domainName': 'uapbd', callback });
}

function modifierMeta(props, meta,json) {
	
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: json['10140FORMATDOC-000051'],/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className : 'table-opr',
		visible: true,
		render: (text, record, index) => {

			return props.button.createOprationButton(
				tableBtnAry,
				{
					area: "table-opr-area",
					buttonLimit: 3,
					onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index,json)
				}
			)
		}
	});
	return meta;
}

function tableButtonClick(props, id, text, record, index,json){
	switch(id){

		case 'EditLine':
			
			props.pushTo('/card', {
				status: 'edit',
				pagecode: '10140LFOR_card',
				id: record[pk_item].value
			});
			break;
		
		case "SetToDefault":
			let data = {
				pageid:pageId,
				id: record[pk_item].value,
				model : {
					areaType: "table",
					pageinfo: null,
					rows: []
				}
			};
			//data.model.rows = tableData;
			ajax({
				url: setDefaultUrl,
				data:data,
				success: (res) => {
					toast({color:"success",content:json['10140FORMATDOC-000052']});/* 国际化处理： 成功*/
					//this.refreshAction(props);
					let data1 = {
						pageInfo: props.table.getTablePageInfo(tableId),
						pagecode: pageId,
					};
			
					ajax({
						url: queryListUrl,
						data1,
						success: (res) => {
							console.log(res);
							if(res.data){
								props.table.setAllTableData(tableId, res.data[tableId]);
							}
						}
					});
				}
			});

			


			break;
		case 'DelLine':
			promptBox({
				color:"warning",               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: json['10140FORMATDOC-000057'],                // 提示标题,  国际化处理： 确认取消*/
				content: json['10140FORMATDOC-000058'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: json['10140FORMATDOC-000059'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: json['10140FORMATDOC-000060'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: () => {
					ajax({
						url: deleteUrl,
						data: 
						{
							pk_formatdoc: record[pk_item].value
						},
						success: (res) => {
							if (res.success) {
								toast({ color: 'success', content: json['10140FORMATDOC-000053'] });/* 国际化处理： 删除成功*/
								props.table.deleteTableRowsByIndex(tableId, index);
							}
						}
					});
				}
			});
			
			break;
		
		default:
            console.log(id, index);
            break;

	}
}

class List extends Component {
	constructor(props) {
		super(props);
		//this.searchId = searchId;
		this.state={
			json :{}
		}
		this.tableId = tableId;
	}
	componentDidMount() {

    }
    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
            }
        }
        this.props.MultiInit.getMultiLang({ 'moduleId': '10140Farmat', 'domainName': 'uapbd', callback });
    }



    buttonClick(props, id) {
        switch (id) {
            case 'add':
                props.pushTo('/card',{
					pagecode:'10140LFOR_card',
					appcode:'10140LFOR',
					status:'add'
				})
				
                break;
			case 'edit':
				props.pushTo('/card',{
					pagecode:'10140LFOR_card',
					appcode:'10140LFOR',
					status:'edit',
					id:props.table.getCheckedRows("dataformat")[0]["data"].values.pk_formatdoc.value,
					pk:props.table.getCheckedRows("dataformat")[0]["data"].values.pk_formatdoc.value
				})
				toggleShow(this.props);
				break;
			case 'print':
				let allD = this.props.table.getAllTableData("dataformat");
				let pks = [];
				allD.rows.forEach((item, index) => {
					pks.push(item.values['pk_formatdoc'].value);
				});
				
				print('pdf',
				printurl,
				{
					funcode:'10140LFOR',
					appcode:'10140LFOR',
					nodekey:'formatdoc_card',
					oids:pks
				});
				
				break;
			case 'output':
				let allData = this.props.table.getAllTableData("dataformat");
				let outputpks = [];
				let rows = allData.rows;
				if (rows && rows.length > 0) {
	                rows.map((item) => {outputpks.push(item.values['pk_formatdoc'].value) })
	                let outputdata = {
	                    funcode: '10140LFOR',
	                    appcode: '10140LFOR',
	                    nodekey: 'formatdoc_card',
	                    oids:outputpks,
	                    outputType: 'output'
	                }
	                output({
	                    url: printurl,
	                    data: outputdata
	                });
	            } else {
	                toast({ content: this.state.json['10140FORMATDOC-000055'], color: 'warning' });/* 国际化处理： 不存在输出的数据！*/
	            }
				break;
            case 'refresh':
                this.refreshAction(props);
                break;
            case 'del':
				this.props.modal.show('del');
                break;
            default:
                break;
        }
    }

	doubleClick = (record, index, e)=>{
		
        this.props.pushTo('/card', {
			status: 'browse',
			pagecode: '10140LFOR_card',
            id: record[pk_item].value
        });
	}

    deleteAction = () =>{
		let _this = this;
        let data = this.props.table.getCheckedRows(tableId);
		console.log(data)
		let pk_formatdoc = data[0].data.values.pk_formatdoc.value;
		let ts = data[0].data.values.ts.value;
        let params = {
				pk_formatdoc:pk_formatdoc,
				ts:ts
		}
        console.log(params)
        ajax({
            url: deleteUrl,
            data: params,
            success: (res) => {
                toast({color:"success",content:_this.state.json['10140FORMATDOC-000053']});/* 国际化处理： 删除成功*/
                _this.refreshAction(_this.props);
            }
        });
    }

    refreshAction =(props)=>{
        // let searchVal = props.search.getAllSearchData(searchId);
        // console.log(searchVal);
			let _this = this;
            let data = {
				pageInfo: props.table.getTablePageInfo(tableId),
                pagecode: pageId,
            };
    
            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);
                    if(res.data){
						props.table.setAllTableData(tableId, res.data[tableId]);
						toast({color:"success",content:_this.state.json['10140FORMATDOC-000061']});/* 国际化处理： 刷新成功*/
                    }else{
                        toast({content:_this.state.json['10140FORMATDOC-000050'],color:"warning"});/* 国际化处理： 无数据*/
                    }
                },
                error : (res)=>{
                    console.log(res.message);
                }
            });
        
    }

    pageInfoClick = (props, config, pks)=>{
        
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchVal = props.search.getAllSearchData(searchId);
	   
		cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
		
        let data = {
			//'pk_org':cacheTools.get('pk_org'),
            'allpks': pks,
            'pageid': pageId
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


	render() {
		let { table, button, search, editTable, modal ,BillHeadInfo} = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
		let {createModal} = modal;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp , getButtons } = button;
		return (<div className="nc-bill-list">
				<div className='nc-bill-header-area'>
					<div className='header-title-search-area'>
					<h2 className='title-search-detail'>
					{
						createBillHeadInfo(
							{
								title :this.state.json['10140FORMATDOC-000002'],/* 国际化处理： 数据格式*/             //标题
								initShowBackBtn:false
							}
						)
					}</h2></div>
					<div className="header-button-area">
						{createButtonApp({
                            area: 'header-button-area',//按钮注册中的按钮区域
                            buttonLimit: 1,
                            onButtonClick: this.buttonClick.bind(this), 
                            popContainer: document.querySelector('.header-button-area')
                        })}
						
					</div>
				</div>
			
				<div style={{height:'10px'}}></div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: this.pageInfoClick,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:true,
						showCheck:false,
						onRowDoubleClick: this.doubleClick.bind(this)
					})}
				</div>
				{createModal('del', {
							title: this.state.json['10140FORMATDOC-000016'],/* 国际化处理： 注意*/
							content: this.state.json['10140FORMATDOC-000017'],/* 国际化处理： 确认删除？*/
							beSureBtnClick: this.deleteAction
				})}
			</div>
		);
	}
}

List = createPage({
	initTemplate: initTemplate
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65