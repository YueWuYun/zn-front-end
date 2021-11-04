//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,high,toast, promptBox,createPageIcon } from 'nc-lightapp-front';
import  Utils from '../../../public/utils'
let { NCPopconfirm,NCMenu: Menu } = base;
import './index.less';

const searchid = '10140UDDDBQ';
const tableid = 'priceaccuracy';
const pagecode = '10140PRACY_list';
const appid = '0001Z010000000000NZF'
const urls = {
	save : '/nccloud/uapbd/priceaccuracy/saveAllPriceAccuracy.do',
	query : '/nccloud/uapbd/priceaccuracy/queryAllPriceAccuracy.do',
	queryTemplet : '/nccloud/platform/templet/querypage.do'
};
const isShowOffEnable = false;			//是否启用“显示停用”功能
let allTableData = {};
const keys = ['doclevel','isgrade','isrelease','mngctlmode'];  //过来空行时，忽略的字段

//后端为refer，前端是input的字段
const refer2input = ['pk_currtype_code','pk_currtype_name','pk_currtype_unitcurrdigit','pk_currtype_unitroundtype']

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.message = ''
		this.props.button.setButtonsVisible({
			editButton: false,
			saveButton: false,
			cancelButton: false
		});
		this.state={
			searchValue:'',
			searchDisable:true,				//简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable:true,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff:false,				//列表是否显示停用数据
			json: {}
		}
	}

	//获取并初始化模板
	initTemplate = (props) => {

		props.createUIDom({
			pagecode : pagecode
			// appid : appid,
			// appcode: '10140PRACY'
		},
		(data)=>{
			let meta = data.template;
			meta = this.modifierMeta(props, meta)
			props.meta.setMeta(meta);
			data.button && props.button.setButtons(data.button);
		});

	}

	//对表格模板进行加工操作
	modifierMeta(props,meta) {
		//更改item类型，避免参照在编辑态的奇怪显示
		let items = meta[tableid].items;
		items.forEach((item,index) => {
			let keys = item.attrcode
			if(refer2input.indexOf(keys) >= 0) {
				item.itemtype = 'input'
				delete item.refcode
			}
		})
		return meta;
	}

	componentDidMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt},() => {
					this.initTemplate(this.props)
					this.getData()
				})       // 保存json和inlt到页面state中并刷新页面
			}
        }
		this.props.MultiInit.getMultiLang({moduleId: '10140PRACY', domainName: 'uapbd',callback})
	}

	//请求列表数据
	getData = (showOff = false, isRefresh = false) => {
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data:{
				"pagecode": pagecode,
				"showOfff":showOff
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					allTableData = data[tableid];
					this.props.editTable.setTableData(tableid, data[tableid]);

					this.updateButtonStatus()
					if(isRefresh) {
						toast({title: this.state.json['10140PRACY-000001'],color: 'success'})/* 国际化处理： 刷新成功！*/
					}
				}

				if(res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg,{
							[tableid]: 'editTable'
						}
					)
				}
			}
		});
	};

	//表格编辑后事件
	onAfterEvent(props, moduleId , key, changerows, value, index, data) {
		//props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
		//表格的编辑后事件，暂时没用到，处理表格字段编辑后业务及验证使用
		let length = this.props.editTable.getNumberOfRows(moduleId);
		if(((length-1)===index)&&data.status==='2'){
			this.props.editTable.filterEmptyRows(tableid,keys);
			this.onButtonClick('add');
		}
		if(key === 'isgrade' && data.values['doclevel'].value === '0'){
			let allRows = props.editTable.getAllRows(moduleId);
			data.status = '1';
			let reqData= [];
			reqData.push(data);
			let changDdata = {
				pageid:pagecode,
				model: {
					areaType: 'table',
					pageinfo: null,
					rows: reqData
				}
			};
			ajax({
				url: urls['save'],
				data:changDdata,
				success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success, data } = res;
					if (success) {
						()=>{
							//操作成功，更新页面当前行数据
							let retData = data[moduleId];
							allRows[index] = retData.rows[0];
							let allData = props.editTable.getAllData(moduleId);
							allData.rows = allRows;
							props.editTable.setTableData(moduleId, allData);
						}
					}else{
						this.props.editTable.setValByKeyAndRowId(tableid,data.rowId,'isgrade',{value:!(data.values['isgrade'].value)});
					}
				}
			});
		}
	}

	//更新按钮状态
	updateButtonStatus(){
		//此处控制按钮的隐藏显示及启用状态
		let tableData = this.props.editTable.getCheckedRows(tableid);
		let length = tableData.length;//获取列表页选择数据的行数
		if(this.props.editTable.getStatus(tableid) === 'edit'){//编辑状态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: false,
				Save: true,
				Cancel: true,
				Delete: true,
				Refresh:false
			});
			this.setState({
				searchDisable:true,
				showOffDisable:true
			});
		}else{//浏览态
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Delete: true,
				Save: false,
				Cancel: false,
				Refresh:true
			});
			this.setState({
				searchDisable:false,
				showOffDisable:false
			});
		}
	}

	//显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
		});
		this.getData(this.state.isShowOff);
	}

	componentDidUpdate(){
        let tableStatus = this.props.editTable.getStatus(tableid);
        if(tableStatus != 'add' && tableStatus != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

	//按钮点击事件
	onButtonClick(props,id) {
		switch (id) {
			case 'Edit':
				this.props.editTable.setStatus(tableid, 'edit');
				//this.props.editTable.hideColByKey(tableid,'opr');//隐藏操作列
				break;
			case 'Cancel':
				//this.props.modal.show('cancel')
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140PRACY-000002'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.state.json['10140PRACY-000003'],             // 提示内容,非必输/* 国际化处理： 是否取消编辑？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140PRACY-000004'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140PRACY-000005'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.onCancelSureEvent.bind(this)   // 确定按钮点击调用函数,非必输
				})
				//this.props.editTable.showColByKey(tableid,'opr');//显示操作列
				break;
			case 'Save':
				this.props.editTable.filterEmptyRows(tableid,keys);
				let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
				if(!tableData || tableData.length === 0) {
					this.onCancelSureEvent()
					return
				}
		
				//判定单价小数位数和单价进舍规则同时为空或同时不为空
				let notAllNullCode = []
				let notAllNullName = []
				let allNullCode = []
				let allNullName = []
				tableData.forEach(item => {
					let grpunitroundtype = item.values.grpunitroundtype.value
					grpunitroundtype = grpunitroundtype == '-1' || grpunitroundtype == null ? null : grpunitroundtype
					let grpunitcurrdigit = item.values.grpunitcurrdigit.value
					grpunitcurrdigit = grpunitcurrdigit == '-1' || grpunitcurrdigit == null ? null : grpunitcurrdigit
					if((!grpunitroundtype || !grpunitcurrdigit) && (grpunitroundtype || grpunitcurrdigit)) {
						//两个字段当中的一个为空的情况
						notAllNullCode.push(item.values.pk_currtype_code.display)
						notAllNullName.push(item.values.pk_currtype_name.display)
					} else if(!grpunitroundtype && !grpunitcurrdigit && item.values.pk_priceaccuracy.value) {
						//两个字段都是空，并且确保数据库当中存在这条记录，不是未保存成功的记录
						allNullCode.push(item.values.pk_currtype_code.display)
						allNullName.push(item.values.pk_currtype_name.display)
					}
				})
				
				if(notAllNullCode.length > 0) {
					let notAllNullCodeStr = notAllNullCode.join(",")
					let notAllNullNameStr = notAllNullName.join(",")
					let message = this.state.inlt && this.state.inlt.get('10140PRACY-000025',{codeStr: notAllNullCodeStr, nameStr: notAllNullNameStr})
					//this.message = `${this.state.json['10140PRACY-000013']}['${notAllNullCode.join(",")}']，${this.state.json['10140PRACY-000014']}['${notAllNullName.join(",")}']${this.state.json['10140PRACY-000015']}！`/* 国际化处理： 币种编码,币种名称,的单价精度的集团单价小数位数和集团单价进舍规则只能同时为空或者同时不为空*/
					toast({color:'warning',content: message})
					return
				} else if(allNullCode.length > 0) {
					let allNullCodeStr = allNullCode.join(",")
					let allNullNameStr = allNullName.join(",")
					this.message = this.state.inlt && this.state.inlt.get('10140PRACY-000026',{codeStr: allNullCodeStr, nameStr: allNullNameStr})
					//this.message = `${this.state.json['10140PRACY-000013']}[${allNullCode.join(",")}]，${this.state.json['10140PRACY-000014']}[${allNullName.join(",")}]${this.state.json['10140PRACY-000016']}，${this.state.json['10140PRACY-000017']}，${this.state.json['10140PRACY-000018']}，${this.state.json['10140PRACY-000019']}[${this.state.json['10140PRACY-000020']}]${this.state.json['10140PRACY-000021']}，${this.state.json['10140PRACY-000022']}？`/* 国际化处理： 币种编码,币种名称,的单价精度的集团单价小数位数和集团单价进舍规则同时修改为空时将删除单价精度设置的数据,如果确定要修改,将清空审计信息,操作信息需要到,业务日志,节点查询,是否确认修改*/
				} else {
					//应产品和UI需求，保存的时候如果没有报错信息那么直接保存即可，不再弹出提示对话框
					this.message = false
					//this.message = '是否确认保存？'
				}
				if(this.message) {
					this.props.modal.show('save')
				}
				else {
					this.onSaveSureEvent()
				}
				break;
			case 'Refresh':
				this.getData(this.state.isShowOff,true)
				break;
		}
	
	}

	onSelectMoreButton({ key }) {
		toast({content:this.state.json['10140PRACY-000006'],color:'warning'});/* 国际化处理： 努力开发中......*/
	 
	}
	
	//表头简单筛选
	onSearch(value){
		this.setState({ searchValue:value });
		let allData =   Utils.clone(allTableData);
		if(value.trim()===''){
			
		}else{
			let rows = Array.of();
			for(var row of allData.rows){
				if(row.values['pk_currtype_code'].display.indexOf(value)>-1 || row.values['pk_currtype_name'].display.indexOf(value)>-1){
					rows.push(row);
				}
			}
			allData.rows = rows;
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
						display: this.state.json['10140PRACY-000007'],/* 国际化处理： 时间戳*/
					},
					pk_defdoclist: {
						display: this.state.json['10140PRACY-000008'],/* 国际化处理： 主键*/
					}
				}
			};
			delObj.rowId=val.data.rowId;
			delObj.values.ts.value=val.data.values.ts.value;
			delObj.values.pk_defdoclist.value=val.data.values.pk_defdoclist.value;
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
					()=>{
						this.props.editTable.deleteTableRowsByIndex(tableid, indexArr);
						toast({content:this.state.json['10140PRACY-000009'],color:'success'});/* 国际化处理： 删除成功*/
					}
				}
			}
		});
	}

	onCancelSureEvent() {
		this.props.editTable.cancelEdit(tableid)
		this.updateButtonStatus()
	}

	onSaveSureEvent() {
		this.props.editTable.filterEmptyRows(tableid,keys);
		let tableData = this.props.editTable.getChangedRows(tableid);   //保存时，只获取改变的数据行而不是table的所有数据行，减少数据传输
		//额外做下过滤，适配下列情况：完全空的一条记录（相当于数据库当中没有记录），只修改集团单价小数位数，点击保存，然后将集团单价小数位数清空，点保存
		//上述情况会导致向后台传送一条空记录，然后保存的时候转换成VO时报错
		let hasModify = tableData && tableData.length > 0
		if(hasModify) {
			tableData = tableData.filter((row) => {
				let grpunitroundtype = row.values.grpunitroundtype.value
				grpunitroundtype = grpunitroundtype == '-1' || grpunitroundtype == null ? null : grpunitroundtype
				let grpunitcurrdigit = row.values.grpunitcurrdigit.value
				grpunitcurrdigit = grpunitcurrdigit == '-1' || grpunitcurrdigit == null ? null : grpunitcurrdigit
				//过滤掉不存在于数据库当中的空行
				if(!grpunitroundtype && !grpunitcurrdigit && !row.values.pk_priceaccuracy.value) {
					return false
				}
				else {
					return true
				}
			})
		}
		
		if(!hasModify) return

		if(hasModify && tableData.length === 0) {
			this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
			toast({title: this.state.json['10140PRACY-000010'], color: 'success'})/* 国际化处理： 保存成功！*/
			return
		}

		let isAllEmpty = false
		let data = {
			pageid:pagecode,
			model : {
				areaType: "table",
				pageinfo: null,
				rows: [],
				areacode: tableid
			}
		};
		data.model.rows = tableData;
		this.props.validateToSave(data, () => {
			ajax({
				url: urls['save'],
				data,
				success: function (res)  {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
					let { success,data} = res;
					if (success) {
						this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
						if(data){
							let allD = this.props.editTable.getAllData(tableid);
							Utils.filterResult(allD,data[tableid].rows);
							this.props.editTable.setTableData(tableid,allD);
						}
						toast({title: this.state.json['10140PRACY-000010'], color: 'success'})/* 国际化处理： 保存成功！*/
						//this.props.editTable.showColByKey(tableid,'opr');//显示操作列
					}
				}.bind(this)
			});
		}, {[tableid]: "editTable"})
		
	}

	render() {
		let { table, button, search,editTable,modal,BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButton,createButtonApp } = button;
		let {NCFormControl,NCCheckbox} = base;
        const { NCDiv } = base;
		let {createModal} = modal;
		const { Item } = Menu;
		return (
			<div className="nc-single-table">
				<NCDiv areaCode={NCDiv.config.HEADER}  className="nc-singleTable-header-area" style={{borderBottom: 'none'}} >
					{/* 标题 title */}
					<div className="header-title-search-area" >
                        {
                            createBillHeadInfo(
                                {
                                    title :this.state.json['10140PRACY-000023']/* 国际化处理： 单价精度设置*/,             //标题
									initShowBackBtn:false
                                }
                            )}
						{/* 简单查询 */}
						<div className="title-search-detail" fieldid = "search">
							<NCFormControl
								placeholder={this.state.json['10140PRACY-000011']/* 国际化处理： 请输入编码或名称筛选*/}
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								className="search-box"
								disabled={this.state.searchDisable}
							/>
						</div>
						{/* 显示停用数据 */}
						<div className="title-search-detail">
							{isShowOffEnable?(
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>{this.state.json['10140PRACY-000024']/* 国际化处理： 显示停用*/}</NCCheckbox>
								</span>
							):('')}
						</div>
					</div>
					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'header-action',
							buttonLimit: 3, 
							onButtonClick: this.onButtonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</NCDiv>
				
				{/* 列表区 */}
				<div className="nc-singleTable-table-area">
					{createEditTable(tableid, {//列表区
						//onCloseModel: onCloseModelFn,                    // 弹窗控件点击关闭事件 
						onAfterEvent: this.onAfterEvent.bind(this),                      // 控件的编辑后事件  
						useFixedHeader:true,    
						//onSelected: onSelectedFn,                        // 左侧选择列单个选择框回调
						//onSelectedAll: onSelectedAllFn,                  // 左侧选择列全选回调
						selectedChange: this.updateButtonStatus.bind(this),                // 选择框有变动的钩子函数
						statusChange: () => {setTimeout(this.updateButtonStatus.bind(this),3)},				//表格状态监听
						showIndex:true,				//显示序号
                        showCheck:false,			//显示复选框
                        adaptionHeight: true
						//params: 'test',                                  // 自定义传参

					})}
				</div>
				{createModal('save',{
					title: this.state.json['10140PRACY-000012'],/* 国际化处理： 确认保存*/
					content: this.message,
					beSureBtnClick: this.onSaveSureEvent.bind(this)
				})}
				{createModal(('cancel'),{
					title: this.state.json['10140PRACY-000002'],/* 国际化处理： 确认取消*/
					content: this.state.json['10140PRACY-000003'],/* 国际化处理： 是否取消编辑？*/
					beSureBtnClick: this.onCancelSureEvent.bind(this)
				})}
			</div>
		);
	}
}

SingleTable = createPage({
	billinfo:{
        billtype: 'grid',
        pagecode: pagecode,
        bodycode: tableid
    },
	initTemplate: []
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65