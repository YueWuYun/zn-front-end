//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast, cacheTools, print, high, promptBox ,cardCache, createPageIcon,excelImportconfig,output} from 'nc-lightapp-front';
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';
import createUIDom from '../../../public/utils/BDCreateUIDom';
const { NCDiv } = base;
let {setDefData,getDefData} = cardCache;
const {NCPopconfirm, NCIcon,NCTabs,NCCheckbox}=base;
const NCTabPane=NCTabs.NCTabPane;
const {PrintOutput,ExcelImport} = high
/****************默认参数  开始***********************/
let urls={
	queryTemplateUrl:'/nccloud/platform/templet/querypage.do',
	addUrl:'',
	listDelUrl:'/nccloud/uapbd/stordoc/StordocListDelete.do',
	queryListUrl:'/nccloud/uapbd/stordoc/StordocListQuery.do',
	saveUrl:'',
	listEnableUrl:'/nccloud/uapbd/stordoc/StordocListEnable.do',
	listDisableUrl:'/nccloud/uapbd/stordoc/StordocListDisable.do',
	queryPageUrl:'/nccloud/uapbd/stordoc/StordocQueryPageGridByPks.do',
	printUrl: '/nccloud/uapbd/stordoc/printStordoc.do',
	checkModelUrl:'/nccloud/uapbd/stordoc/StordocCheckDataModel.do',//这个用来检查数据权限
	checkOrgUrl:'/nccloud/uapbd/stordoc/OrgCheckAction.do'//检查是否是库存组织
};

let templateElements={
	pageId:'10140WARH_list',
	searchId:'search',
	tableId:'stordoc',
	oId:'1009Z0100000000020LD',
	appid:'0001Z010000000000LN4',//按钮注册中的关联appid
	linkItem:'code',//仓库编码
	pk_item:'pk_stordoc',
	pk_org:'pk_org',
};


let dataSource = 'upabd.busiinfo.stordoc.data'

/***************默认参数  结束********************/

let totalPks = [];//用来装载本地页面的pks



class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pks: [],
			isShowOff: false,
			json:{},
			inlt:null,
		}

		this.enableNumber = 0
		this.disableNumber = 0
		this.initTemplate(this.props);
	}

/*单据模板修改部分*/
initTemplate(props) {


	createUIDom(props)(
		{
			pagecode: templateElements.pageId//页面id
			//appid: templateElements.appid,//注册按钮的id
		},
        {
            moduleId: "10140WARH",domainName: 'uapbd'
        },     		
		(data,langData,inlt)=>{
            if(langData){
                this.state.json = langData
                if(inlt){
                    this.state.inlt = inlt
                }
            }

			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = this.modifierMeta(props, meta)

					props.meta.setMeta(meta,() => {
						props.button.setButtonDisabled({deleteAction: true,disableAction: true,enableAction: true})
						//props.button.setButtonDisabled(['deleteAction','disableAction','enableAction'],true)
					});

					//在这里处理一下默认组织加载：
					let ccontext = data.context || {};
					//
					if(ccontext.pk_org){
					let searchTemplateCode = props.meta.getMeta().search.code ;//search
					
					ajax({
						url:urls.checkOrgUrl,
						data:{"mainorg":ccontext.pk_org},
						success:(res)=>{
							console.log(res);
							if(res.success && "Y" ==res.data){
							props.search.setSearchValByField(searchTemplateCode,

							
								"pk_org",
								{
									"value":ccontext.pk_org,
									"display":ccontext.org_Name,
								}
								
							
						)
							}
						}
					});

		}


					let searchVal = cacheTools.get("searchParams");
					console.log(searchVal);
					if(searchVal && searchVal != false){
						props.search.setSearchValue(templateElements.searchId,searchVal);
						let queryInfo = props.search.getQueryInfo('search',false)
						if(queryInfo) {
							let pageInfo = props.table.getTablePageInfo(templateElements.tableId)
							let data = {
								querycondition:searchVal,
								pagecode:templateElements.pageId,
								queryAreaCode:templateElements.searchId,
								oid: queryInfo.oid , 
								pageInfo: pageInfo,
								querytype:'tree',
								custcondition:{
									conditions:[{field:'showDisable',oprtype:'like',value:{firstvalue:false}}],
									logic:"and",
								},
							}						
					
							ajax({
								url: urls.queryListUrl,
								data,
								success: (res) => {
									if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
										this.props.dealFormulamsg(res.formulamsg,
											{
												"stordoc":"table",
											})
									}									

									if(res.data){
										totalPks = res.data[templateElements.tableId].allpks
										props.table.setAllTableData(templateElements.tableId, res.data[templateElements.tableId]);
									}else{
										let tableData = {
											allpks: [],
											rows: []
										}
										totalPks = []
										props.table.setAllTableData(tableId, tableData);
										//toast({content:languageRes.noData,color:"warning"});
									}

									props.button.setButtonDisabled(['deleteAction','enableAction','disableAction','Print','Output'], true)
								},
								error : (res)=>{
									console.log(res.message);
								}
							});
						}
					}
					else {
						let tableData = {
							allpks: [],
							rows: []
						}
						totalPks = []
						props.table.setAllTableData(templateElements.tableId, tableData);
						//toast({content:languageRes.noData,color:"warning"});
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					let excelimportconfig = excelImportconfig(props,'uapbd','stordoc_org',true,'',{appcode: '10140WARH',pagecode: "10140WARH_card"},()=>{this.refreshAction(props)});
                	props.button.setUploadConfig("import",excelimportconfig);
				}
			}
		}
	)
}

modifierMeta(props, meta) {
	meta[templateElements.searchId].items = meta[templateElements.searchId].items.map((item, key) => {
		item.col = '3';
		return item;
	})

	//查询区的库存组织增加主组织过滤权限以及多选
	let pkOrgCond = meta[templateElements.searchId].items.find(item => item.attrcode == 'pk_org')
	pkOrgCond.isMultiSelectedEnabled = true
	pkOrgCond.isShowDisabledData = true;
	pkOrgCond.queryCondition = () => {
		return {
			GridRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder",
			
		}
	}

	let addressCond = meta[templateElements.searchId].items.find(item => item.attrcode == 'pk_address')
	addressCond.isShowDisabledData = true;
	
	let profitCond = meta[templateElements.searchId].items.find(item => item.attrcode == 'profitcentre')
	profitCond.isShowDisabledData = true;
	profitCond.isRunWithChildren = true;
	
	let operatorCond = meta[templateElements.searchId].items.find(item => item.attrcode == 'operatesupplier')
	operatorCond.isShowDisabledData = true;
	
	meta[templateElements.tableId].pagination = true;
	meta[templateElements.tableId].items = meta[templateElements.tableId].items.map((item, key) => {
		//item.width = 150;
		if (item.attrcode == templateElements.linkItem) {
			item.render = (text, record, index) => {
				return (
					<span
						style={{color: '#007ace', cursor: 'pointer' }}
						onClick={() => {
							let searchValues = props.search.getAllSearchData('search',false) || {};
							cacheTools.set("searchParams",searchValues);

							//设置缓存值
							cacheTools.set('preid',record[templateElements.pk_item].value);
							props.pushTo('/card', {
								status: 'browse',
								pagecode:'10140WARH_card',
								id: record[templateElements.pk_item].value,//列表卡片传参
								org:record[templateElements.pk_org].value,
							});
						}}
					>
						{record && record[templateElements.linkItem] && record[templateElements.linkItem].value}
					</span>
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[templateElements.tableId].items.push({
		attrcode: 'opr',
		label: this.state.json['10140WARH-000000'],/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className : 'table-opr',
		visible: true,
		itemtype:"customer",
		render: (text, record, index) => {
			return (
				<span>
					<span
						style={{cursor: 'pointer' }}
						onClick={() => {
							//在这里加载一下数据权限的校验类；
							let cpk_org = record[templateElements.pk_org].value;
							let pk_stordocs =[];
							pk_stordocs.push(record[templateElements.pk_item].value);
							ajax({
								loading: true,
								url: urls.checkModelUrl,
								data:{
									"pk_org":cpk_org,
									"pk_stordocs":pk_stordocs,
									mdOperateCode:'edit',//增加一个修改参数，用来标志数据权限；
								},
								success: (res) => {
									if(res.success && res.data){//如果有修改权限才跳转到卡片页面
										props.pushTo('/card', {
											status: 'edit',
											pagecode:'10140WARH_card',
											id: record[templateElements.pk_item].value,
											org:record[templateElements.pk_org].value,
										});
									}

								}
							});							
							//===============================
						}}
					>
						{this.state.json['10140WARH-000026']}{/* 国际化处理： 修改*/}
					</span><span>&nbsp; &nbsp;</span>
					<NCPopconfirm
						trigger="click"
						placement="top"
						content={this.state.json['10140WARH-000006']}/* 国际化处理： 确定删除？*/
						onClose={() => {
							ajax({
								url: urls.listDelUrl,
								data: {
									pk_org: record.pk_org.value,
									pk_stordocs: [record.pk_stordoc.value],
									ts: record.ts.value,
									mdOperateCode:'delete',//增加一个参数，用来标志数据权限；
									},
								success: (res) => {
									if (res.success) {
										//列表态删除时调用一下平台方法更新缓存
										let {deleteCacheId} = props.table
										deleteCacheId(templateElements.tableId, record.pk_stordoc.value)

										toast({ color: 'success', title: this.state.json['10140WARH-000027'] });/* 国际化处理： 删除成功！*/
										props.table.deleteTableRowsByIndex(templateElements.tableId, index);
									}
								}
							});
						}}
					>
						<span style={{cursor: 'pointer' }}>{this.state.json['10140WARH-000002']}</span>{/* 国际化处理： 删除*/}
					</NCPopconfirm>
				</span>
			);
		}
	});
	return meta;
}
	
	componentDidMount() {
		//this.getData(); 平台考虑效率，打开节点不直接加载数据
		this.initButtonStatus();//added by liusenc 20180927
	}
	initButtonStatus(){
		let buttonStatus = {};
		buttonStatus.Print = true;
		buttonStatus.Output = true;//默认进入系统打印按钮不可用
		buttonStatus.Copy = true;//默认进入系统不可用赋值按钮
		this.props.button.setButtonDisabled(buttonStatus)
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
			case 'addAction':
			setDefData('cpk_stordoc',dataSource,'add');
                props.pushTo('/card',{
					pagecode:'10140WARH_card',
                    status:'add'
                })
                cacheTools.remove('preid');
                
                break;
			case 'Edit':
				let checkedRows = props.table.getCheckedRows(templateElements.tableId)
				let pushToParam = {
					id: checkedRows[0].data.values[templateElements.pk_item].value,
					org: checkedRows[0].data.values[templateElements.pk_org].value
				}

				ajax({
					loading: true,
					url: urls.checkModelUrl,
					data:{
						"pk_org":pushToParam.org,
						"pk_stordocs":[pushToParam.id],
						mdOperateCode:'edit',//增加一个修改参数，用来标志数据权限；
					},
					success: (res) => {
						if(res.success && res.data){//如果有修改权限才跳转到卡片页面
							this.props.pushTo('/card', {
								status: 'edit',
								pagecode:'10140WARH_card',
								id: this.props.getUrlParam('id'),
								org:this.props.getUrlParam('org'),
							})
						}

					}
				});	
                break;	
            case 'Refresh':
                this.refreshAction(props);
                break;
			case 'deleteAction':
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140WARH-000005'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.state.json['10140WARH-000028'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140WARH-000029'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140WARH-000030'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.deleteAction.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break;
			case 'enableAction':
				//this.props.modal.show('enable')
				promptBox({
					color:"warning",
					title:this.state.json['10140WARH-000010'],/* 国际化处理： 提示*/
					size:'lg',
					content:  this.state.json['10140WARH-000011'],/* 国际化处理： 确认是否启用数据*/
					beSureBtnClick: this.enableAction.bind(this)
				});
				break;
			case 'disableAction':
				//this.props.modal.show('disable')
				promptBox({
					color:"warning",
					title:this.state.json['10140WARH-000010'],/* 国际化处理： 提示*/
					size:'lg',
					content:  this.state.json['10140WARH-000012'],/* 国际化处理： 确认是否停用数据*/
					beSureBtnClick: this.disableAction.bind(this)
				});
				break;
			case 'Print':
				let allData = this.props.table.getAllTableData(templateElements.tableId);
				let tableorder = this.props.table.getSortParam(templateElements.tableId);
				print(
					'pdf',
					urls.printUrl,
					{
						funcode:/*this.props.config.funcode*/'10140WARH',     //功能节点编码
						nodekey:'list',     //模板节点标识
						oids:allData.allpks,
						outputType:'print',
						userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`
					}
				)
				break
			case 'Output':
				// allData = this.props.table.getAllTableData(templateElements.tableId);
				// this.setState({
				// 	pks: allData.allpks
				// },() => {
				// 	this.refs.printOutput.open()
				// })

				//zhangchik start 排序输出
				allData = this.props.table.getAllTableData(templateElements.tableId);
                let outorder = this.props.table.getSortParam(templateElements.tableId);
                output({
                    url: urls.printUrl,
                    data: {
                        funcode: '10140WARH',      //功能节点编码，即模板编码
                        outputType: 'output',
                        nodekey: 'list',
                        oids: allData.allpks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                        userjson:`{order:${outorder  && outorder.sortParam[0].order},field:${outorder  && outorder.sortParam[0].field}}`,
                    }
                });
				//zhangchik end
				break
			case 'Copy':
				//let record = this.selectedRowRecord
				let record  = props.table.getCheckedRows(templateElements.tableId)
				if(!record) {
					toast({content:this.state.json['10140WARH-000031'],color:'warning'})/* 国际化处理： 请选择需要复制的数据！*/
					return
				}
				setDefData('cpk_stordoc',dataSource,record[0].data.values[templateElements.pk_item].value);
				props.pushTo('/card', {
					status: 'copy',
					pagecode:'10140WARH_card',
					id: record[0].data.values[templateElements.pk_item].value,
					org:record[0].data.values[templateElements.pk_org].value,
				});
				break
			case 'export':
				this.props.modal.show('exportFileModal');
				break;
            default:
                break;
        }
	}
	
	updateButtonStatus() {
		let allRows = this.props.table.getCheckedRows(templateElements.tableId)
		let allData = this.props.table.getAllTableData(templateElements.tableId)
		let selData = this.selectedRowRecord;
		let buttonStatus = {}
		/*
		if(selData  && selData[templateElements.pk_item] && selData[templateElements.pk_item].value){
			buttonStatus.Copy = false;//判断复制态的时候按钮是否可用
		}else{
			buttonStatus.Copy = true;
		}
		*/
		if(allRows && allRows.length == 1){//当且仅当选中了一条数据的时候才能可用复制按钮；
			buttonStatus.Copy = false;
		}else{
			buttonStatus.Copy = true;
		}

		if(allRows.length > 0) {
			buttonStatus.deleteAction = false
		}
		else {
			buttonStatus.deleteAction = true
		}

		if(allData && allData.rows.length > 0) {
			buttonStatus.Print = false
			buttonStatus.Output = false
		}
		else {
			buttonStatus.Print = true
			buttonStatus.Output = true
		}

		this.enableNumber = 0
		this.disableNumber = 0
		//控制一下停用以及启用按钮的状态
		if(allRows.length > 0) {
			allRows.forEach(row => {
				let recordStatus = row.data.values.enablestate.value
				if(recordStatus == 2) {
					this.enableNumber++
				}
				else {
					this.disableNumber++
				}
			})
		}

		buttonStatus.enableAction = this.disableNumber > 0 ? false : true
		buttonStatus.disableAction = this.enableNumber > 0 ? false : true
		this.props.button.setButtonDisabled(buttonStatus)
	}

	enableAction = ()=>{
		//前台校验，过滤出来停用数据传到后台；
		//管控范围和对对象是否有操作权限在后台校验；
		//传递参数需要：1,当前pk_org(因为现在后台还没有方案，加上单个人能打开的组织数据)
		//2，选中的数据的主键
		let curSels = this.props.table.getCheckedRows(templateElements.tableId);
		let curTableData = this.props.table.getAllTableData(templateElements.tableId);
		let curFilterValues = new Map();//放到一个map中，pk_stordoc为key，index为value
		let pk_stordocs = [];
		let cpk_org = "";
		curSels.forEach(element => {
			if("2" !== element.data.values.enablestate.value)//如果已经启用，
			{	
				if("" === cpk_org){
					cpk_org = element.data.values.pk_org.value;
				}			
				pk_stordocs.push(element.data.values.pk_stordoc.value);
				//curFilterValues.push(element);
				curFilterValues.set(element.data.values.pk_stordoc.value,element.index);
			}
		});
		if(curFilterValues.size === 0){
			toast({content:this.state.json['10140WARH-000032'],color:"warning"});/* 国际化处理： 所选数据都已启用,请重新选择数据！*/
			return
		}
		ajax({
            loading: true,
            url:urls.listEnableUrl, 
            data:{
				"pk_org":cpk_org,
				"pk_stordocs":pk_stordocs,
				mdOperateCode:'enable',//增加一个参数，用来标志数据权限；
			},
            success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg,
						{
							"stordoc":"table",
						})
				}					
				res.data.stordoc.rows.forEach(element =>{
					let ipk = element.values.pk_stordoc.value;
					let ind = curFilterValues.get(ipk);
					curTableData.rows[ind].values = element.values;
				});
				this.props.table.setAllTableData(templateElements.tableId,curTableData);
				//鉴于对停用启用按钮的处理，此处对所有数据行取消选中，然后设置停用启用按钮置灰
				this.props.button.setButtonDisabled({disableAction: true,enableAction: true})
				this.props.table.selectAllRows(templateElements.tableId,false)
				toast({title : this.state.json['10140WARH-000014'],color : 'success'});/* 国际化处理： 启用成功！*/
            }
        }); 

	}
	disableAction = ()=>{
		//前台校验，过滤出来停用数据传到后台；
		//管控范围和对对象是否有操作权限在后台校验；
		//传递参数需要：1,当前pk_org(因为现在后台还没有方案，加上单个人能打开的组织数据)
		//2，选中的数据的主键
		let curSels = this.props.table.getCheckedRows(templateElements.tableId);
		let curTableData = this.props.table.getAllTableData(templateElements.tableId);
		let curFilterValues = new Map();//放到一个map中，pk_stordoc为key，index为value
		let pk_stordocs = [];
		let cpk_org = "";
		curSels.forEach(element => {
			if("3" !== element.data.values.enablestate.value)//如果已经启用，
				{	
					if("" === cpk_org){
						cpk_org = element.data.values.pk_org.value;
					}			
					pk_stordocs.push(element.data.values.pk_stordoc.value);
					//curFilterValues.push(element);
					curFilterValues.set(element.data.values.pk_stordoc.value,element.index);
		}
		});
		if(curFilterValues.size === 0){
			toast({content:this.state.json['10140WARH-000033'],color:"warning"});/* 国际化处理： 所选数据都已停用,请重新选择数据！*/
		}
		ajax({
            loading: true,
            url:urls.listDisableUrl, 
            data:{
				"pk_org":cpk_org,
				"pk_stordocs":pk_stordocs,
				mdOperateCode:'disable',//增加一个参数，用来标志数据权限；
			},
            success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg,
						{
							"stordoc":"table",
						})
				}					
				res.data.stordoc.rows.forEach(element =>{
					let ipk = element.values.pk_stordoc.value;
					let ind = curFilterValues.get(ipk);
					curTableData.rows[ind].values = element.values;
				});
				this.props.table.setAllTableData(templateElements.tableId,curTableData);
				//鉴于对停用启用按钮的处理，此处对所有数据行取消选中，然后设置停用启用按钮置灰
				this.props.button.setButtonDisabled({disableAction: true,enableAction: true})
				this.props.table.selectAllRows(templateElements.tableId,false);
				toast({title : this.state.json['10140WARH-000015'],color : 'success'});/* 国际化处理： 停用成功！*/
            }
        }); 

	}
	doubleClick = (record, index, props, e)=>{
            
		let searchValues = props.search.getAllSearchData('search', false) || {};
		cacheTools.set("searchParams",searchValues);
	
		//缓存查询值
		cacheTools.set('preid',record[templateElements.pk_item].value);
		cacheTools.set('preorg',record[templateElements.pk_org].value);
        this.props.pushTo('/card', {
			status: 'browse',
			pagecode:'10140WARH_card',
			id: record[templateElements.pk_item].value,
			org:record[templateElements.pk_org].value,
        });
	}

    deleteAction = (props) =>{
		let curSels = this.props.table.getCheckedRows(templateElements.tableId);
		let cpk_org = "";
		let pk_stordocs =[];
		curSels.forEach(element => {
	
					if("" === cpk_org){
						cpk_org = element.data.values.pk_org.value;
					}			
					pk_stordocs.push(element.data.values.pk_stordoc.value);

		});

        ajax({
			loading: true,
            url: urls.listDelUrl,
			data:{
				"pk_org":cpk_org,
				"pk_stordocs":pk_stordocs,
				mdOperateCode:'delete',//增加一个参数，用来标志数据权限；
			},
            success: (res) => {
				toast({color:"success",title:this.state.json['10140WARH-000027']});/* 国际化处理： 删除成功！*/
				//优化效率（SQL数量问题），删除之后不再刷新了，从后台返回删除的PK，直接前端合并
				let allData = this.props.table.getAllTableData(templateElements.tableId)
				res.data.forEach(key => {
					allData.rows.forEach((row,index) => {
						if(key == row.values[templateElements.pk_item].value) {
							allData.rows.splice(index,1)
							allData.allpks.splice(index,1)
						}
					})
				})
				this.props.table.setAllTableData(templateElements.tableId, allData)
                //this.refreshAction(this.props);
            }
        });
    }

    refreshAction =(props)=>{

		let searchValues = props.search.getAllSearchData('search',false) || {};
		cacheTools.set("searchParams",searchValues);
		let data = this.getQueryData(props,searchValues)			
    
		ajax({
			url: urls.queryListUrl,
			data,
			success: (res) => {
				console.log(res);
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg,
						{
							"stordoc":"table",
						})
				}					
				if(res.data){
					totalPks = res.data[templateElements.tableId].allpks
					props.table.setAllTableData(templateElements.tableId, res.data[templateElements.tableId]);
					toast({ color: 'success', title: this.state.json['10140WARH-000009'] });/* 国际化处理： 刷新成功！*/
				}else{
					let tableData = {
						allpks: [],
						rows: []
					}
					totalPks = []
					props.table.setAllTableData(templateElements.tableId, tableData);
					toast({content:this.state.json['10140WARH-000034'],color:"warning"});/* 国际化处理： 无数据！*/
				}

				//更新一下按钮状态
				this.updateButtonStatus()
			},
			error : (res)=>{
				console.log(res.message);
			}
		});
    }


    pageInfoClick = (props, config, pks)=>{

        let pageInfo = props.table.getTablePageInfo(templateElements.tableId);
		let searchVal = this.props.search.getAllSearchData(templateElements.searchId);
		// //后台暂时还没有提供当前人所能打开的组织代码，现在先从前台传递过去
		let cpk_org = "";
		 searchVal.conditions.forEach(element=>{
		 	if("pk_org" === element.field){
		 		cpk_org = element.value.firstvalue;
		 	}
		 })
        // 后台还没更新，暂不可用
        let data = {
            "allpks": pks,
			"pageid": templateElements.pageId,
			"pk_org":cpk_org,//暂时先从前台向后台传递一下：
			...pageInfo
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: urls.queryPageUrl,
            data: data,
            success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg,
						{
							"stordoc":"table",
						})
				}					
                let { success, data } = res;
                if (success) {
                    if (data) {
						//点击分页时设置一下分页信息
						data[templateElements.tableId].allpks = totalPks
                        props.table.setAllTableData(templateElements.tableId, data[templateElements.tableId]);
                    } else {
						let tableData = {
							allpks: [],
							rows: []
						}
                        props.table.setAllTableData(templateElements.tableId, tableData);
                    }
				}
				this.selectedRowRecord = undefined;
				this.updateButtonStatus();//added by liusenc 20181008
            }
        });
	}
	
	getQueryData(props,cacheQueryCondition,isShowWarning = false){
		let queryInfo = props.search.getQueryInfo('search',isShowWarning)
		let pageInfo  = props.table.getTablePageInfo(templateElements.tableId);	
		return{
			querycondition:cacheQueryCondition,
			pagecode:templateElements.pageId,
			queryAreaCode:templateElements.searchId,
			oid: queryInfo.oid , 
			pageInfo: pageInfo,
			querytype:'tree',
			custcondition:{
				conditions:[{field:'showDisable',oprtype:'like',value:{firstvalue:this.state.isShowOff}}],
				logic:"and",
			},
		}
	}

    clickSearchBtn = (props,searchVal)=>{

		if(!searchVal) {
			return
		}
		
		let searchValues = props.search.getAllSearchData('search') || {};
		cacheTools.set("searchParams",searchValues);
		let data = this.getQueryData(props,searchValues,true)
		
        ajax({
            url: urls.queryListUrl,
            data,
            success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(res.formulamsg,
						{
							"stordoc":"table",
						})
				}					
                console.log(res);
                if(res.data){
					totalPks = res.data[templateElements.tableId].allpks
                    props.table.setAllTableData(templateElements.tableId, res.data[templateElements.tableId]);
					toast({ color: 'success', content: this.state.json['10140WARH-000035']+totalPks.length+this.state.json['10140WARH-000018'] });/* 国际化处理： 查询成功,共,条*/
                }else{
					totalPks = []
                    props.table.setAllTableData(templateElements.tableId, {rows:[]});
                    toast({content:this.state.json['10140WARH-000036'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据!*/
				}
				this.updateButtonStatus()
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
	}

	onSelectedChange(props,moduleId,record,index,status) {
		this.updateButtonStatus()
	}
	
	onRowClick(props,moduleId,record,index) {
		this.selectedRowRecord = record;
		this.updateButtonStatus();//added by liusenc 20181008
	}

    //加判断
    /**按钮响应事件 */
    onShowDisable(val){
		let isShowOff = this.state.isShowOff
		this.setState({
			isShowOff: !isShowOff
		},() => {
			this.refreshAction(this.props)
		})
    }	
	
	render() {
		let { table, button, search, modal ,BillHeadInfo} = this.props;
		let { createModal } = modal
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp , getButtons } = button;
		const {createBillHeadInfo} = BillHeadInfo;
		return (<div className="nc-bill-list">
				<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
					<div className='header-title-search-area'>
						{createBillHeadInfo({
								title:( this.state.json['10140WARH-000021']),
								initShowBackBtn:false
						})}	
					</div>
					<span className="showOff">
						<NCCheckbox 
							onChange={this.onShowDisable.bind(this)}
							checked={this.state.isShowOff}>
							{this.state.json['10140WARH-000037']}{/* 国际化处理： 显示停用*/}
						</NCCheckbox>
			        </span>
					<div className="header-button-area">
						{createButtonApp({
							area: 'header-button-area',
							buttonLimit: 3, 
							onButtonClick: this.buttonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}						
					</div>
				</NCDiv>
				<div className="nc-bill-search-area" fieldid='nc-bill-searchId'>
					{NCCreateSearch(templateElements.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this)
					})}
				</div>
				<div className="nc-bill-table-area" fieldid='nc-bill-tableId'>
					{createSimpleTable(templateElements.tableId, {
						dataSource: dataSource,
						pkname: templateElements.pk_item,
						handlePageInfoChange: this.pageInfoClick,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:true,
						onRowClick: this.onRowClick.bind(this),
						showCheck:true,
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.onSelectedChange.bind(this),
						onSelectedAll: this.onSelectedChange.bind(this)
					})}
				</div>
				<PrintOutput
					ref='printOutput'
					url={urls.printUrl}
					data={{
						funcode: '10140WARH',
						oids: this.state.pks,
						nodekey: 'list',
						outputType: 'output'
					}}
				/>
				<ExcelImport
					{...Object.assign(this.props)}
					moduleName ='uapbd'//模块名
					billType = 'stordoc_org'//单据类型
					selectedPKS = {[]}
					appcode='10140WARH'
					pagecode="10140WARH_card"
            	/>

				{createModal('enable', {
					title: this.state.json['10140WARH-000022'],/* 国际化处理： 询问*/
					content: this.state.json['10140WARH-000024'],/* 国际化处理： 您确定要启用所选数据吗？*/
					beSureBtnClick: this.enableAction.bind(this)
				})}

				{createModal('disable', {
					title: this.state.json['10140WARH-000022'],/* 国际化处理： 询问*/
					content: this.state.json['10140WARH-000025'],/* 国际化处理： 您确定要停用所选数据吗？*/
					beSureBtnClick: this.disableAction.bind(this)
				})}

			</div>
		);
	}
}

List = createPage({
	//initTemplate: initTemplate
	billinfo:{
		billtype:'grid',
		pagecode:'10140WARH_list',
		bodycode:'stordoc'
	},
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));
export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65