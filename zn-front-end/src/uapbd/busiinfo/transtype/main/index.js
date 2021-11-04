//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast,promptBox,createPageIcon,excelImportconfig } from 'nc-lightapp-front';
import  Utils from '../../../public/utils';
let { NCPopconfirm,NCModal } = base;
const { NCDropdown:Dropdown, NCIcon:Icon, NCMenu:Menu, NCButton:Button }=base;
import { print } from 'nc-lightapp-front';
import filterTableData from '../tableutil';
const {PrintOutput,ExcelImport} = high;
const { NCDiv } = base;
import './index.less'

//const searchid = '10140UDDDBQ';
const tableid = 'transporttype';
const pagecode = '10140TRAT_list';
const urls = {
	print: '/nccloud/uapbd/transtype/print.do',
	save : '/nccloud/uapbd/transtype/save.do',
	query : '/nccloud/uapbd/transtype/query.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};
let allTableData = {rows:[]};
const keys = ['doclevel','isgrade','isrelease','mngctlmode'];  //过来空行时，忽略的字段

class TransType extends Component {
	constructor(props) {
		super(props);
		this.state={
			json:{},//多语资源文件数据
			ids:[],
			searchValue:'',
			searchDisable:false				//简单搜索框是否禁用	true：禁用		false：可用
		}

		//加载多语资源
		this.initTemplate(
			props,
			pagecode,
			'10140TRAT',//多语资源编码
			()=>{
				return this.modifierMeta(props, this.props.meta.getMeta(),this)
			},
			()=>{
				this.getData();
				this.updateButtonStatus();
			},
			this
		);
	}

	initTemplate(props,pageCode,nodeResourceCode,modifierMeta,initData,_this){
		let callback=(json,status,inlt)=>{
			_this.setState({json:json});
			props.createUIDom(
				{
					pagecode: pageCode
				}, 
				function (data){
					if(data){
						if(data.button){
							let button = data.button;
							props.button.setButtons(button);
							let excelimportconfig = excelImportconfig(props,'uapbd','transporttype_grp',true,'',{appcode: '10140TRAT',pagecode: "10140TRAT_list"},()=>{_this.getData();});
        					props.button.setUploadConfig("import",excelimportconfig);
						}
						if(data.template){
							let meta = data.template;
							props.meta.setMeta(meta);//设置两次，用于回调使用
							if(modifierMeta instanceof Function){
								meta=modifierMeta(data);
								if(meta){
									props.meta.setMeta(meta);
								}
							}                       
						}
						if(initData instanceof Function){
							initData();
						}
					}   
				}
			)
		}
		props.MultiInit.getMultiLang({moduleId:nodeResourceCode,/*currentLocale:'zh-CN',*/domainName:'uapbd',callback});
	}

	modifierMeta(props,meta,_this) {
		//添加表格操作列
		let event = {
			label: _this.state.json['10140TRAT-000000'],/* 国际化处理： 操作*/
			attrcode: 'opr',
			fixed:'right',
			key: 'opr',
			itemtype: 'customer',
			visible:true,
			render(text, record, index) {
				let tableStatus = props.editTable.getStatus(tableid);
				return tableStatus == 'browse' || tableStatus == undefined ? (
					<div className="currency-opr-col">
						<NCPopconfirm
							trigger="click"
							placement="top"
							content={_this.state.json['10140TRAT-000001']/* 国际化处理： 确认删除?*/}
							onClose={() => {
								if(props.editTable.getStatus(tableid) === 'edit'){//编辑状态
									props.editTable.deleteTableRowsByIndex(tableid, index);
								}else{//浏览态
									let delObj = {
										rowId: index,
										status: '3',
										values: record.values,
									};
									let indexArr=[];
									indexArr.push(index);
									let data = {
										model: {
											areaType: 'table',
											pageinfo: null,
											rows: [ delObj ]
										}
									};
									ajax({
										url: urls['save'],
										data,
										success: function(res) {
											let { success, data } = res;
											if (success) {
												//props.editTable.deleteTableRowsByIndex(tableid, indexArr,true);
												//浏览态删除考虑维护表单数据
												allTableData=filterTableData(allTableData,data[tableid],'pk_transporttype');
												props.editTable.setTableData(tableid, Utils.clone(allTableData));
	
												toast({title:_this.state.json['10140TRAT-000004'],color:'success'});/* 国际化处理： 删除成功！*/
												if(props.editTable.getAllData(tableid)&&props.editTable.getAllData(tableid).rows.length==0){
													props.button.setDisabled({
														add: false,
														edit: true,
														refresh:false,
														print:true,
														export:true
													});
												}else{
													props.button.setDisabled({
														add: false,
														edit: false,
														refresh:false,
														print:false,
														export:false
													});
												}
											}
										}.bind(this)
									});
								}
							}}
						>
							<span style={{cursor:'pointer'}} className='operator'>{_this.state.json['10140TRAT-000014']/* 国际化处理： 删除*/}</span>
						</NCPopconfirm>
					</div>
				):(
					<div className="currency-opr-col">
						<span style={{cursor:'pointer'}} className='operator' 
							onClick={() => {
								props.editTable.deleteTableRowsByIndex(tableid, index);
							}}
						>{_this.state.json['10140TRAT-000014']/* 国际化处理： 删除*/}</span>
					</div>
				);
			}
		};
		meta[tableid].items.push(event);
		//props.renderItem('table',tableid,'creator',refer('creator'));
		return meta;
	}

	componentDidUpdate(){
		if(this.props.editTable.getStatus(tableid) === 'edit'||this.props.editTable.getStatus(tableid) === 'add'){
			window.onbeforeunload=()=>{
				return '';
			}
		}else{
			window.onbeforeunload=null;
		}
	}

	//请求列表数据
	getData = (prompt) => {
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:{
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if(data){
						//适配显示公式
						if(res.formulamsg&&res.formulamsg instanceof Array&&res.formulamsg.length>0){
							this.props.dealFormulamsg(
								res.formulamsg,
								{
									tableid:"editTable"
								}
							);
						}
						allTableData =   Utils.clone(data[tableid]);
						//allTableData = data[tableid];
						this.props.editTable.setTableData(tableid, data[tableid]);
					}else{
						allTableData={rows:[]};
						this.props.editTable.setTableData(tableid, {rows:[]});
					}
					//如果刷新成功，需要给出提示
					if(prompt&&(prompt instanceof Function)){
						prompt();
					}
				}
				this.setButtonsdisable();
			}
		});
	};

	setButtonsdisable(){
		if(this.props.editTable.getAllData(tableid)&&this.props.editTable.getAllData(tableid).rows.length==0){
			this.props.button.setDisabled({
				add: false,
				edit: true,
				refresh:false,
				print:true,
				export:true
			});
		}else{
			this.props.button.setDisabled({
				add: false,
				edit: false,
				refresh:false,
				print:false,
				export:false
			});
		}
	}

	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(length === 0){//未选择数据
			this.props.button.setDisabled({
				del: true
			});
		}else {//选择多行数据
			this.props.button.setDisabled({
				del: false
			});
		}
		if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			this.props.button.setMainButton('add',false);
			this.props.button.setButtonsVisible({
				add: true,
				edit: false,
				save: true,
				cancel: true,
				del: true,
				refresh:false,
				print:false,
				import:false,
				Export:false
			});
			this.setState({
				searchDisable:true
			});
		}else{//浏览态
			this.props.button.setMainButton('add',true);
			this.props.button.setButtonsVisible({
				add: true,
				edit: true,
				save: false,
				cancel: false,
				del: true,
				refresh:true,
				print:true,
				import:true,
				Export:true
			});
			this.setState({
				searchDisable:false
			});
		}
	}

	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'add':
				let num = this.props.editTable.getNumberOfRows(tableid); //获取列表总行数
				this.props.editTable.addRow(tableid,num,true);
				this.updateButtonStatus();
				break;
			case 'edit':
				this.props.editTable.setStatus(tableid, 'edit');
				this.updateButtonStatus();
				break;
			case 'cancel':
				promptBox({
					color:'warning',
					title : this.state.json['10140TRAT-000005'],/* 国际化处理： 确认取消*/
					content : this.state.json['10140TRAT-000006'],/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick : ()=>{
						this.props.editTable.filterEmptyRows(tableid,keys);//新增取消时将空行去掉
						this.props.editTable.setStatus(tableid, 'browse');
						this.props.editTable.setTableData(tableid, Utils.clone(allTableData));
						this.setButtonsdisable();
						this.updateButtonStatus();
					}
				});
				break;
			case 'save':
				this.props.editTable.filterEmptyRows(tableid,keys);
				//let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
				//加上前台校验逻辑
				let tableData = this.props.editTable.getChangedRows(tableid,true); 
				if(!this.props.editTable.checkRequired(tableid,this.props.editTable.getAllRows(tableid,true))){
					return;
				}

				if(!tableData || tableData.length === 0){
					toast({title:this.state.json['10140TRAT-000007'],color:'success'});/* 国际化处理： 保存成功！*/
					this.props.editTable.setStatus(tableid, 'browse');
					this.updateButtonStatus();
					break;
				}
				let data = {
					pageid:pagecode,
					model : {
						areacode:tableid,//适配校验公式
						areaType: "table",
						pageinfo: null,
						rows: []
					}
				};
				data.model.rows = tableData;
				let saveCallBack=()=>ajax({
					url: urls['save'],
					data,
					success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
						let { success,data} = res;
						if (success) {
							this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
							if(data){
								toast({title:this.state.json['10140TRAT-000007'],color:'success'});/* 国际化处理： 保存成功！*/
								allTableData=filterTableData(allTableData,data[tableid],'pk_transporttype');
								this.props.editTable.setTableData(tableid, Utils.clone(allTableData));
								//this.getData();//此处为刷新页面数据，可考虑对页面数据遍历筛选赋值更新，减少远程调用次数
							}
							this.setButtonsdisable();//设置按钮可用性
							this.updateButtonStatus();
						}
					}.bind(this)
				});
				this.props.validateToSave(data,saveCallBack,{tableid:'editTable'});
				break;
			case "del":
				let selectedData=this.props.editTable.getCheckedRows(tableid);
				if(selectedData.length==0){
					toast({content:this.state.json['10140TRAT-000008'],color:'warning'});/* 国际化处理： 请选择要删除的数据！*/
					return 
				}
				if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
					let indexArr=[];
					selectedData.forEach((val) => {
						indexArr.push(val.index);
					});
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
				}else{
					promptBox({
						color:'warning',
						title : this.state.json['10140TRAT-000009'],/* 国际化处理： 确认删除*/
						content : this.state.json['10140TRAT-000010'],/* 国际化处理： 您确认删除所选数据？*/
						beSureBtnClick : this.onDelForBrowse.bind(this)
					});
					/*this.props.modal.show('modal',{
						title : '确认删除',
						content : '您确认删除所选数据？',
						beSureBtnClick : this.onDelForBrowse.bind(this)
					});*/
				}
				break;
			case 'refresh':
				//清空简单查询区数据
				this.setState({searchValue:''});

				this.getData(()=>{
					toast({title:this.state.json['10140TRAT-000011'],color:'success'});/* 国际化处理： 刷新成功！*/
				});
				break;
			case 'print':
				let printParam={
					funcode:'10140TRAT'
				};
				this.pintFunction(printParam);
				break;
			case 'export':
				let allData=this.props.editTable.getAllData(tableid);
				let pks=[];
				allData.rows.forEach((item)=>{
					pks.push(item.values['pk_transporttype'].value);
				});
				this.setState({
					ids : pks
				},this.refs.printOutput.open());
				/*let exportParam={
					funcode:'10140TRAT',//功能节点编码（模板编码）
					outputType:'output'
				};
				this.pintFunction(exportParam);*/
				break;
			case 'Export':
				this.props.modal.show('exportFileModal');
				break;
		}
	
	}

	//输出和打印功能函数
	pintFunction(param){
		let allData=this.props.editTable.getAllData(tableid);
		let pks=[];
		allData.rows.forEach((item)=>{
			pks.push(item.values['pk_transporttype'].value);
		});
		param.oids=pks;
		print(
			'pdf',
			urls['print'],
			param
		);
	}

	onSelectMoreButton({ key }) {
		//this.getData();
	}
	
	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData =   Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['code'].value.indexOf(value)>-1 || row.values['name'].value.indexOf(value)>-1){
					rows.push(row);
				}
			}
			allData.rows = rows;
		}

		//判断打印输出按钮是否可用
		if(allData.rows&&allData.rows.length>0){
			this.props.button.setDisabled({
				edit: false,
				print:false,
				export:false
			});
		}else{
			this.props.button.setDisabled({
				edit: true,
				print:true,
				export:true
			});
		}

		this.props.editTable.setTableData(tableid,allData);
	}

	//浏览态确认删除事件
	onDelForBrowse(){
		let selectedData=this.props.editTable.getCheckedRows(tableid);
		let indexArr=[];
		let dataArr=[];
		selectedData.forEach((val) => {
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.state.json['10140TRAT-000002'],/* 国际化处理： 时间戳*/
					},
					pk_transporttype: {
						display: this.state.json['10140TRAT-000003'],/* 国际化处理： 主键*/
					}
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values.ts.value=val.data.values.ts.value;
			delObj.values.pk_transporttype.value=val.data.values.pk_transporttype.value;
			dataArr.push(delObj);
			indexArr.push(val.index);
		});
		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: urls['save'],
			data,
			success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
				let { success, data } = res;
				if (success) {
					//allTableData=filterTableData(allTableData,data[tableid],'pk_transporttype');//该函数有问题，下标删除没考虑下表变动情况
					this.props.editTable.setRowStatus(tableid,indexArr,'3');
					allTableData=this.props.editTable.getAllData(tableid);
					Utils.filterDelRows(allTableData.rows);
					this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);

					this.props.editTable.setTableData(tableid, Utils.clone(allTableData));
					this.setButtonsdisable();//设置按钮可用性
					toast({title:this.state.json['10140TRAT-000004'],color:'success'});/* 国际化处理： 删除成功！*/
				}
			}
		});
	}

	render() {
		let { button, search,editTable,modal ,BillHeadInfo} = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButton } = button;
		let {NCFormControl} = base;
		let {createModal} = modal;
		let { createButtonApp } = button;
		const {createBillHeadInfo} = BillHeadInfo;
		return (
			<div className="nc-single-table">
				{/* 头部 header */}
				<NCDiv  areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area" style={{borderBottom:'none'}}>
					{/* 标题 title */}
					<div className="header-title-search-area">
						{createBillHeadInfo({
								title:(this.state.json['10140TRAT-000015']),
								initShowBackBtn:false
                        })}	
						{/* 简单查询 */}
						<div className="title-search-detail">								
							<NCFormControl
								placeholder={this.state.json['10140TRAT-000012']/* 国际化处理： 请输入编码或名称筛选*/}
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								disabled={this.state.searchDisable}
							/>
						</div>
					</div>

					<div className="header-button-area">
						{createButtonApp({
							area: 'list_btn',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>		
						
				</NCDiv>	
				
				{/* 列表区 */}
				<div className='nc-singleTable-table-area busiinfo-table-del-jinhua' fieldid='tableId'>
					{createEditTable(tableid, {//列表区
						isAddRow:true,
						useFixedHeader:true,    
						selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						showIndex: true,				//显示序号
						adaptionHeight: true,
						showCheck:true			//显示复选框
					})}
				</div>

				{/* 删除前确认模态框 */}
				{createModal('modal',{
					title : this.state.json['10140TRAT-000009'],										//标题/* 国际化处理： 确认删除*/
					content : this.state.json['10140TRAT-000013'],							//内容/* 国际化处理： 确认删除所选数据？*/
					beSureBtnClick : this.onDelForBrowse.bind(this)		//确定按钮事件回调
				})}
				<PrintOutput
					ref='printOutput'
					url={urls['print']}
					data={{
						funcode : '10140TRAT',
						nodekey : '',
						oids : this.state.ids,
						outputType : 'output'
					}}
				/>
				<ExcelImport
                {...Object.assign(this.props)}
					moduleName ='uapbd'//模块名
					billType = 'transporttype_grp'//单据类型
					selectedPKS = {[]}
					appcode='10140TRAT'
					pagecode="10140TRAT_list"
            	/>
			</div>
		);
	}
}

TransType = createPage({
	billinfo:{
        billtype:'grid',
        pagecode:pagecode,
        bodycode:tableid
    },
	initTemplate: ()=>{}
})(TransType);

ReactDOM.render(<TransType />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65