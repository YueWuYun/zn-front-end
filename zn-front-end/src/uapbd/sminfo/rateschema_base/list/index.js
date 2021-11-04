//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,cacheTools,print,high,getBusinessInfo,promptBox,getMultiLang,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
const {NCPopconfirm, NCIcon,NCTabs,NCMessage}=base;
const NCTabPane=NCTabs.NCTabPane;
const {PrintOutput, ExcelImport} = high;
import './index.less';
const { NCDiv } = base;
let dataSource = 'uapbd.sminfo.rateschema';//缓存的标识
const pageId = '10140RATEG_ratelistview';        //pagecode
const searchId = 'rateschemaqry';              //查询区id
const tableId = 'rateschema';                 //表头id
const oId = '1004Z01000000001GNU7';     //查询区oid
const appid = '0001Z010000000001RAJ';   //注册按钮id
const appcode = '10140RATEG';   //注册按钮id
const linkItem = 'pk_rateschema';        //列表卡片跳转字段
const pk_item = 'pk_rateschema';           //列表主键
const queryListUrl = '/nccloud/uapbd/rateschema/querylistrateschema.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/rateschema/rateschemaquerypagegridbypks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/rateschema/deleterateschema.do';                 //删除url
const printUrl =  '/nccloud/uapbd/rateschema/rateschemaprint.do';                  //列表打印url
const validUrl = '/nccloud/uapbd/rateschema/rateschemavalid.do';                   //权限校验
const tableBtnAry = ["editline","delline"];     //表格列操作按钮


let initTemplate =(props) =>{

	let _this = this;
	props.createUIDom(
		{
			pagecode: props.pagecode_list//页面id
			//appcode: props.appcode//注册按钮的id
			//appid: props.appid//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta)
					props.meta.setMeta(meta, () => {
						if (data.button) {
							let button = data.button;
							props.button.setButtons(button);
							props.button.setButtonDisabled(['delete',, 'print', 'output'], true);
							props.button.setPopContent('delline',props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000017'))/* 国际化处理： 确认要删除该信息吗？*/
						}
						let hasSearched = cacheTools.get("hasSearched");
						let searchVal =cacheTools.get("searchParams");
						let businessInfo = getBusinessInfo();
						if(businessInfo != null){
							let pkGroup = businessInfo.groupId;
							if(props.nodeType == 'group'){
								console.log(props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000019'));
								props.search.setSearchValByField(searchId, 'pk_org',{value: pkGroup,display:props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000019')})/* 国际化处理： 当前集团*/
							}
						}
						if(hasSearched && hasSearched === 1){//hasSearched 为1表示有过查询，从缓存获取查询模板条件
							// searchVal.map((v)=>{
							// 	props.search.setSearchValByField('searchArea',v.field,v.display);
							// 	return v;
							// })
							if(searchVal && searchVal != false){
								props.search.setSearchValue(searchId,searchVal.conditions);
							}
							//获取查询模板信息
							let queryInfo = props.search.getQueryInfo(searchId);
							let OID = queryInfo.oid;

							let data = {
								querycondition: searchVal==null?null:searchVal,
								pageInfo: cacheTools.get('pageInfo')?cacheTools.get('pageInfo'):props.table.getTablePageInfo(tableId),
								// {
								// 	pageIndex: 0,
								// 	pageSize: 10,
								// 	total: 0,
								// 	totalPage: 0
								// },
								pagecode: props.pagecode_list,//页面id
								queryAreaCode: searchId,  //查询区编码
								oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
								querytype:'tree',
								nodeType:props.nodeType
							};
					
							ajax({
								url: queryListUrl,
								data,
								success: (res) => {
									if(res.data){
										props.table.setAllTableData(tableId, res.data[tableId]);
										props.button.setButtonDisabled(['print','output'], false);
									}else{
										props.button.setButtonDisabled(['print','output'], true);
										toast({title:props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000020'),content:props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000021'),color:"warning"});/* 国际化处理： 请注意！,未查询出符合条件的数据！*/
									}
								},
								error : (res)=>{
									console.log(res.message);
								}
							});
						}
					})	
					}
					// if (data.button) {
					// 	let button = data.button;
					// 	props.button.setButtons(button);
					// 	props.button.setButtonDisabled(['delete'], true);
					// 	props.button.setPopContent('delline','确认要删除该信息吗？') /* 设置操作列上删除按钮的弹窗提示 */
					// }
			}
		}
	)
	
}

function modifierMeta(props, meta) {
	// let businessInfo = getBusinessInfo();
	// let pkGroup = businessInfo.groupId;
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.col = '3';
		if((item.attrcode == 'pk_org')){
								
			item.isMultiSelectedEnabled = true;
			if(props.nodeType == 'org')
			{
				item.queryCondition = function () {
					return {
						//"pk_org": pkGroup,
						//"pk_group":pkGroup,
						AppCode:'10140RATEO',
						TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder'
					}
                }
                item.isRunWithChildren = true
			}
			else{
				item.queryCondition = function () {
					return {
						// "pk_org": pkGroup,
						// "pk_group":pkGroup
						AppCode:'10140RATEG',
						TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
					}
				}
			}
		}
		return item;
	})
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
							cacheTools.set("searchParams",searchVal);
							cacheTools.set('preid',record[pk_item].value);
							cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
							props.pushTo(props.cardUrl, {
								status: 'browse',
								id: record[pk_item].value,//列表卡片传参
								pagecode:props.pagecode_card,
								appcode:props.appcode
								
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
		attrcode: 'opr',
		label: props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000001'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className : 'table-opr',
		itemtype:'customer',
		visible: true,
		render: (text, record, index) => {
			let btnArray = [];
			if (record['pk_org'].value == record['pk_group'].value && props.nodeType == 'group') {
				btnArray = ['editline', 'delline'];
			}
			else if (record['pk_org'].value != record['pk_group'].value && props.nodeType == 'org') {
				btnArray = ['editline', 'delline'];
			}
			return props.button.createOprationButton(
				btnArray,
				{
					area: "table-opr-area",
					buttonLimit: 3,
					onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
				}
			)

			// return (
			// 	<span>
			// 		{/* <NCIcon
			// 			type="uf-pencil-s"
			// 			onClick={() => {
			// 				props.linkTo('../card/index.html', {
			// 					status: 'edit',
			// 					id: record.crevecontid.value
			// 				});
			// 			}}
			// 		/> */}
			// 		<span
			// 			style={{cursor: 'pointer' }}
			// 			onClick={() => {
			// 				props.linkTo('../card/index.html', {
			// 					status: 'edit',
			// 					id: record[pk_item].value
			// 				});
			// 			}}
			// 		>
			// 			修改
			// 		</span><span>&nbsp; &nbsp;</span>
			// 		<NCPopconfirm
			// 			trigger="click"
			// 			placement="top"
			// 			content='确定删除？'
			// 			onClose={() => {
			// 				ajax({
			// 					url: deleteUrl,
			// 					data: {deleteinfo:[{
			// 						id: record[pk_item].value,
			// 						ts: record.ts.value
			// 					}]},
			// 					success: (res) => {
			// 						if (res.success) {
			// 							toast({ color: 'success', content: '删除成功' });
			// 							props.table.deleteTableRowsByIndex(tableId, index);
			// 						}
			// 					}
			// 				});
			// 			}}
			// 		>
			// 			<span style={{cursor: 'pointer' }}>删除</span>
			// 		</NCPopconfirm>
			// 	</span>
			// );
		}
	});
	return meta;
}

function tableButtonClick(props, id, text, record, index){
	switch(id){

		case 'editline':
			valid(props,record,()=>{props.pushTo(props.cardUrl,{
				status:'edit',
				id: record[pk_item].value,
				pagecode:props.pagecode_card,
				appcode:props.appcode
				});
			})
			break;
		case 'delline':
			valid(props,record,()=> {
				ajax({
					url: deleteUrl,
					data: 
					{
						pk_org: cacheTools.get('pk_org'),
						deleteinfo:[
							{
								id: record[pk_item].value,
								ts: record.ts.value
							}
						]
					},
					success: (res) => {
						if (res.success) {
							toast({ color: 'success', title: props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000012') });/* 国际化处理： 删除成功！*/
							let {deleteCacheId} = props.table;
							deleteCacheId(tableId, record[pk_item].value)
							props.table.deleteTableRowsByIndex(tableId, index);
						}
						var allData = props.table.getAllTableData(tableId);
						if(!allData||allData.rows.length === 0){
							props.button.setButtonDisabled(['print','output'],true);
							return;
						}else{
							props.button.setButtonDisabled(['print','output'],false);
						}
					}
				});
			})
			break;
		default:
            console.log(id, index);
            break;

	}
}

//权限校验
function valid(props,record,callback){

    let pks = [];

    if(record){

        pks.push(record[pk_item].value);
    }
    else{

        let rows = props.table.getCheckedRows(tableId);

        if(rows.length === 0){
            toast({content:props.MutiInit.getIntl("10140RATEG") && props.MutiInit.getIntl("10140RATEG").get('10140RATEG-000016'),color:'warning'});/* 国际化处理： 勾选操作数据*/
            return;
        }

        rows.forEach((item,key)=>{
            pks.push(item.data.values[pk_item].value);
        });
    }

    let data = {
        pks,
        nodeType:props.nodeType
    }
    ajax({
        url:validUrl,
        data,
        success:(res)=>{
            callback && callback();
        }
    })
}

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.state = {
			json:{},
			inlt: null
		};
		let excelimportconfig = excelImportconfig(props,'uapbd',props.billType,true,'',{appcode: props.appcode,pagecode: props.pagecode_card},()=>{
			var searchPkorg=this.props.search.getSearchValByField( this.searchId, 'pk_org' );
			searchPkorg && searchPkorg.display && this.refreshAction(props);
		});
		props.button.setUploadConfig("import",excelimportconfig);//增加Excel导入配置
	}
	
	componentDidMount() {}

	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		  if (status) {
			  this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
		  } else {
			  console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
		  }
	
		}
		this.props.MultiInit.getMultiLang({moduleId: appcode,domainName:'uapbd',callback})
	  }

	// getButtonNames = (codeId) => {
	// 	if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
	// 		return 'main-button'
	// 	}else {
	// 		return 'secondary - button'
	// 	}
	// };

    buttonClick(props, id) {
        switch (id) {
            case 'add':
                props.pushTo(props.cardUrl,{
					status:'add',
					pagecode:props.pagecode_card,
					appcode:props.appcode
                })
                //cacheTools.remove('preid');
                
                break;
            // case 'editline':
            //     props.linkTo(props.cardUrl,{
			// 		status:'edit',
			// 		id: props.record[pk_item].value,
			// 		pagecode:props.pagecode_card,
			// 		appcode:props.appcode,
            //     })
            //     break;	
            case 'refresh':
				this.refreshAction(props,()=>{
                    toast({ color: 'success', title: this.state.json['10140RATEG-000006'] });/* 国际化处理： 刷新成功！*/
                });
                break;
			case 'delete':
				
				valid(props,null,()=>{
					promptBox({
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title:this.state.json['10140RATEG-000002'],/* 国际化处理： 确认删除*/
						content:this.state.json['10140RATEG-000003'],/* 国际化处理： 您确定要删除所选数据吗?*/
						beSureBtnClick:()=>{this.deleteAction()}
					})
				})	
				break;
			case 'printGrp':
                this.onPrint();
                break;
            case 'print':
                this.onPrint();
                break;
            case 'output':
                this.onOutput();
				break;
			case 'export':
				this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
				});
				break;
            default:
                break;
        }
	}
	
	// 行选中事件
    onSelected(props,moduleId,record,index){
		let tableData = this.props.table.getCheckedRows(tableId);
		if(tableData && tableData.length > 0){
			this.props.button.setButtonDisabled(['delete'], false);
		}else {
			this.props.button.setButtonDisabled(['delete'], true);
		}
		this.setState(this.state);
	}

	//打印
    onPrint=()=>{

        let allData = this.props.table.getAllTableData(tableId);

        if(allData.rows.length === 0){
            toast({content:this.state.json['10140RATEG-000007'],color:'warning'});/* 国际化处理： 无可打印数据*/
            return;
        }

        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        print(
            'pdf',
            printUrl,
            {
				appcode:this.props.printFunCode,
                funcode:this.props.printFunCode,//功能节点编码
                nodekey:this.props.printNodeKey,//模板节点编码
                oids:pks
            }
        )
    }
    //输出
    onOutput=()=>{

        let allData = this.props.table.getAllTableData(tableId);
        if(allData.rows.length === 0){
            toast({content:this.state.json['10140RATEG-000008'],color:'warning'});/* 国际化处理： 无可输出的数据*/
            return;
        }
        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        this.setState({
            ids : pks
        },this.refs.printOutput.open());
    }

	doubleClick = (record, index, e)=>{
		
            
        console.log(this.state.json['10140RATEG-000022']);/* 国际化处理： 双击*/
        console.log(this)
        let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set("searchParams", searchVal);
		cacheTools.get("searchParams");
        cacheTools.set('preid',this.props.getUrlParam('id'));
        this.props.pushTo(this.props.cardUrl, {
            status: 'browse',
			id: record[pk_item].value,
			appcode: this.props.appcode,
			pagecode:this.props.pagecode_card
        });
	}

    deleteAction = () =>{
        let data = this.props.table.getCheckedRows(tableId);
        console.log(data)
        let params = {
			pk_org: cacheTools.get('pk_org'),
			deleteinfo:data.map((v)=>{
            let id = v.data.values[pk_item].value;
            let ts = v.data.values.ts.value;
            return {
                id,ts
            }
			})
		}
        console.log(params)
        ajax({
            url: deleteUrl,
            data: params,
            success: (res) => {
				this.refreshAction(this.props,()=>{
                    toast({ color: 'success', title: this.state.json['10140RATEG-000012'] });/* 国际化处理： 删除成功！*/
                });
            }
        });
    }

    refreshAction =(props,callback)=>{
        let searchVal = props.search.getAllSearchData(searchId);
        console.log(searchVal);
        if(searchVal != false){
			 //获取查询模板信息
			let queryInfo = props.search.getQueryInfo(searchId);
			let OID = queryInfo.oid;

            let data = {
                querycondition: searchVal==null?null:searchVal,
				pageInfo: props.table.getTablePageInfo(tableId),
				// {
                //     pageIndex: 0,
                //     pageSize: 10,
                //     total: 0,
                //     totalPage: 0
                // },
                pagecode: props.pagecode_list,
                queryAreaCode:searchId,  //查询区编码
                oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
				querytype:'tree',
				nodeType:props.nodeType
            };
    
            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);
                    if(res.data){
						props.table.setAllTableData(tableId, res.data[tableId]);
						props.button.setButtonDisabled(['print', 'output'], false);
                    }else{
						props.table.setAllTableData(tableId, {rows:[]});
						props.button.setButtonDisabled(['print', 'output'], true);
					}

					//查询时执行显示公式前端适配
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg,  //参数一：返回的公式对象
							{                //参数二：界面使用的表格类型
								[tableId]:"table"
							}
						);
					}
					
					this.props.button.setButtonDisabled(['delete'], true);
					this.setState(this.state);
					callback&&callback(res.data);
                },
                error : (res)=>{
                    console.log(res.message);
                }
            });
        }
    }

    // pageInfoClick = (props, config, pks)=>{
        
    //     let pageInfo = props.table.getTablePageInfo(this.tableId);
    //     let searchVal = props.search.getAllSearchData(searchId);
	   
	// 	cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
		
    //     let data = {
	// 		pk_org:cacheTools.get('pk_org'),
    //         allpks: pks,
	// 		pageid: props.pagecode_list,
	// 		 nodeType:props.nodeType
    //     };
    //     //得到数据渲染到页面
    //     let that = this;
    //     ajax({
    //         url: queryPageUrl,
    //         data: data,
    //         success: function(res) {
    //             let { success, data } = res;
    //             if (success) {
    //                 if (data) {
    //                     props.table.setAllTableData(tableId, data[tableId]);
    //                 } else {
    //                     props.table.setAllTableData(tableId, { rows: [] });
    //                 }
    //             }
    //         }
    //     });
    // }

    clickSearchBtn = (props,searchVal)=>{
            
		console.log(searchVal);
		
		searchVal.conditions.map((cond)=>{
				if(cond.field == 'pk_org'){
					cacheTools.set('pk_org',cond.value.firstvalue);
				}
			})
		cacheTools.set("hasSearched",1);
		cacheTools.set("searchParams",searchVal);
		cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
		let metaData = props.meta.getMeta();
		//获取查询模板信息
		let queryInfo = props.search.getQueryInfo(searchId);
		let OID = queryInfo.oid;
        let data = {
            querycondition: searchVal==null?null:searchVal,
			pageInfo: props.table.getTablePageInfo(tableId),
			// {
            //     pageIndex: 0,
            //     pageSize: 10,
            //     total: 0,
            //     totalPage: 0
            // },
			pagecode: props.pagecode_list,
            queryAreaCode:searchId,  //查询区编码
            oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype:'tree',
			nodeType:props.nodeType
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if(res.data){
					let count = res.data[this.tableId].allpks.length;
					props.table.setAllTableData(this.tableId, res.data[tableId]);
					props.button.setButtonDisabled(['print', 'output'], false);
					toast({content:this.state.inlt&&this.state.inlt.get('10140RATEG-000024', { count: count}),color:'success'})/* 国际化处理： 已成功！,查询成功，共,条。*/
                }else{
					props.table.setAllTableData(this.tableId, {rows:[]});
					props.button.setButtonDisabled(['print', 'output'], true);
					toast({content:this.state.json['10140RATEG-000021'],color:"warning"});/* 国际化处理： 请注意！,未查询出符合条件的数据！*/
                }
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }

	render() {
		let { table, button, search,modal ,BillHeadInfo} = this.props;
		const {createBillHeadInfo} = BillHeadInfo;
		let {createModal} = modal;
		let buttons  = this.props.button.getButtons();
		// buttons = buttons.sort((a,b)=>{
		// 	return b.btnorder - a.btnorder;
		// });
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp , getButtons } = button;
		return (<div className="nc-bill-list">
				<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
					<div className='header-title-search-area'>
						{createBillHeadInfo({
								title:(this.state.json[this.props.nodeName]),
								initShowBackBtn:false
							}
						)}
					</div>
					<div className="header-button-area btn-list">
						{createButtonApp({
							area: 'header-button-area',
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
						clickSearchBtn: this.clickSearchBtn.bind(this)
					})}
				</div>
				<div className="nc-bill-table-area" fieldid='nc-bill-tableId'>
					{createSimpleTable(this.tableId, {
						//handlePageInfoChange: this.pageInfoClick,
						tableModelConfirm: this.tableModelConfirm,
						onSelected:this.onSelected.bind(this),
						onSelectedAll:this.onSelected.bind(this),
						//selectedChange: this.updateButtonStatus.bind(this),
						showIndex:true,
						showCheck:true,
						dataSource: dataSource,//缓存的标识
						pkname: pk_item,
						onRowDoubleClick: this.doubleClick.bind(this)
					})}
				</div>
				{/* {createModal('delete', {
							title: "确认删除",
							content: '您确定要删除所选数据吗?',
							beSureBtnClick: this.deleteAction
				})} */}
				<PrintOutput
                    ref='printOutput'
                    url={printUrl}
                    data={{
						appcode:this.props.printFunCode,
                        funcode:this.props.printFunCode,//功能节点编码
                        nodekey:this.props.printNodeKey,//模板节点编码
                        oids : this.state.ids,
                        outputType : 'output'
                    }}
                />
				<ExcelImport
                    {...this.props}
                    moduleName ='uapbd'//模块名
                    billType = {this.props.billType}//单据类型
                    selectedPKS = {[]}
                    appcode={this.props.appcode}
                    pagecode={this.props.pagecode_card}
                />				
			</div>
		);
	}
}

export default List = createPage({
	billinfo:{
        billtype: 'grid',
        pagecode: pageId,
        headcode: tableId
    },
	initTemplate: initTemplate,
	mutiLangCode: appcode
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65