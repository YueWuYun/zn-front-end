//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, pageTo, toast, getMultiLang, gzip ,createPageIcon} from 'nc-lightapp-front';
import { buttonClick, initTemplate, buttonVisible, bodyBeforeEvent, bodyAfterEvent, tableButtonClick ,buttonDisabled} from './events';
import { tableId, multiLangCode, module,nodeType } from './constants';
import ReferLoader from '../../../public/excomponents/ReferLoader';
const { NCCheckbox,NCDiv } = base;

/**
 * author kangjjd
 */
class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.tableId = tableId ;
		this.nodeType =nodeType;
		this.pageId = props.getSearchParam("p");
		this.Info = {
			allButtonsKey: [],//保存所有的按
			index: null,//当前选中行号
		}
		this.state = {
			pk_org:{},
		//	checked: false,//是否显示失效
			disabled:false,//控制参照是否可以编辑
			json: {}
		}
	}
	componentDidMount() {
		let callback = (json) => {
			this.setState({ json: json }, () => {
				initTemplate.call(this, this.props, this.getTableData);
			});
		}
		getMultiLang({ moduleId: [multiLangCode], domainName: module, currentLocale: 'simpchn', callback });
	}

	//请求列表数据
	getTableData = (btnName) => {
		ajax({
			url: '/nccloud/uapbd/bdcostcomponent/querytabledata.do',
			data: {
				appcode: this.props.getSearchParam("c"),
			//	isLegal: !this.state.checked,
				pk_org :this.state.pk_org.refpk
			},
			success: (res) => {
				if (btnName == 'Refresh') {
					toast({ color: 'success', content: this.state.json['10140CECF-000003'] });/* 国际化处理： 刷新成功*/
				}
				if (res.data) {
					this.props.editTable.setTableData(this.tableId, res.data[this.tableId]);
				}else{
					this.props.editTable.setTableData(this.tableId, {rows: []});
				}		
				this.setEditTableByPkOrg();
				this.toggleShow();
			}
		});

	};

	//设置不可编辑的行，以及不可选中的行
	setEditTableByPkOrg = () =>{
		let pk_org = this.state.pk_org.refpk;
		let allRows = this.props.editTable.getAllRows(this.tableId);
		let noEditIndexs = [];//不允许编辑的行
		allRows.forEach(function( item,index) {
			let itempk_org = item.values.pk_org.value;
			if(pk_org !=itempk_org){
				noEditIndexs.push(index);
			}
		});
		this.props.editTable.setEditableRowByIndex(this.tableId,noEditIndexs,false);
		this.props.editTable.setCheckboxDisabled(this.tableId,noEditIndexs,false);//选中按钮不可用
	}


	//保存数据
	save = () => {
		
		let status = this.props.editTable.getStatus(this.tableId);
		let newRows = [];
		if (status == 'browse') {//如果是浏览态就是走删除的逻辑
			let checkRows = this.props.editTable.getCheckedRows(this.tableId);
			let newCheckRows = JSON.parse(JSON.stringify(checkRows));
			let delIndex =[];
			newCheckRows.forEach(item => {//需要删除的行
				delIndex.push(item.index)
			});
			let allRows = this.props.editTable.getAllRows(this.tableId);
			let newallRows = JSON.parse(JSON.stringify(allRows));
			newallRows.forEach((item,index) => {
				if (delIndex.indexOf(index)!=-1) {
					item.status ='3' //上面拷贝一份，防止修改了原来界面的数据
				}
				newRows.push(item);
			});	
		} else {//保存的逻辑
			let allRows = this.props.editTable.getAllRows(this.tableId);
			//过滤空白行
			allRows.forEach(item => {
				//编码存在的话，不为新增的，就可以走保存的逻辑
				if (item.values.vcostcomponentcode.value || item.status !='2') {
					newRows.push(item);
				}
			});
			//必输项检验
			if (!this.props.editTable.checkRequired(this.tableId, newRows)) {
				return;
			}
		}
		let set = new Set();
		let tableRows = this.props.editTable.getAllRows(this.tableId);
		let count = 0;
		tableRows.forEach(item=>{
			if(item.values.pk_org.value == this.state.pk_org.refpk && item.status != '3'){
				count++;
				set.add(item.values.vcostcomponentcode.value);
			}
		});
		console.log("count=",count)
		console.log("set.size =",set.size)
		if(count != set.size){
			toast({ color: 'warning', content: this.state.json['10140CECF-000017'] });/* 国际化处理： 成本组件的编码不能重复！*/
			return;
		}
		let grid = {
			model: {
				areacode:this.tableId,
				rows: newRows
			},
			pageid: this.pageId
		}
		ajax({
			url: '/nccloud/uapbd/bdcostcomponent/save.do',
			data: {
				grid: grid,
				pk_org: this.state.pk_org.refpk
			},
			success: (res) => {
				if (res.success) {
					if (status == 'browse') {
						toast({ color: 'success', content: this.state.json['10140CECF-000013'] });/* 国际化处理： 删除成功*/
					} else {
						toast({ color: 'success', content: this.state.json['10140CECF-000014'] });/* 国际化处理： 保存成功*/
					}
					//保存成功重新查询一遍数据
					this.props.editTable.setStatus(this.tableId, 'browse');
					this.getTableData();
				}
			}
		});


	}

	//新增行
	addLine = (autoFocus) => {
		let flag = true;
		let tableData = this.props.editTable.getAllRows(this.tableId);
		for (let i = 0; i < tableData.length; i++) {
			if (tableData[i].status != "3") {
				flag = false;
				break;
			}
		}
		ajax({
			url: '/nccloud/uapbd/bdcostcomponent/addline.do',
			data: {
				flag: flag,
				pageId: this.pageId,
				pk_org: this.state.pk_org.refpk
			},//获取form表单中的pk_org,集团节点为空,
			success: (res) => {
				let { data } = res;
				if (data) {
					data[this.tableId].rows[0].values.pk_org.value = this.state.pk_org.refpk;
					this.props.editTable.addRow(this.tableId, undefined, autoFocus, data[this.tableId].rows[0].values);
				}
			}
		});
	}


	//控制按钮
	toggleShow = () => {
		let status = this.props.editTable.getStatus(this.tableId);
		if (!status) {
			status = 'browse';
		}
		let trueBtn = []; //可见的按钮
		let falseBtn = []; //不可见的按钮
		let disabledtrue =[];//不可操作按钮
		let disabledfalse =[];//可操作按钮
		for (let i = 0; i < this.Info.allButtonsKey.length; i++) {
			let flag = buttonVisible.call(this,this.props,status,this.Info.allButtonsKey[i]);
			if (flag) {
				trueBtn.push(this.Info.allButtonsKey[i]);
			} else {
				falseBtn.push(this.Info.allButtonsKey[i]);
			}

			let disabledFlag = buttonDisabled.call(this,this.props,status,this.Info.allButtonsKey[i]);
			if (disabledFlag) {
				disabledtrue.push(this.Info.allButtonsKey[i]);
			} else {
				disabledfalse.push(this.Info.allButtonsKey[i]);
			}

		}
		if(status == 'browse'){//控制删除提示框
			this.props.button.setPopContent('Delete_inner', this.state.json['10140CECF-000006']);/* 国际化处理： 确定删除吗？*/
		}else{
			this.props.button.setPopContent('Delete_inner', null);
		}
		this.props.button.setButtonVisible(trueBtn, true);
		this.props.button.setButtonVisible(falseBtn, false);
		this.props.button.setButtonDisabled(disabledtrue, true);
		this.props.button.setButtonDisabled(disabledfalse, false);
		//跟新参照的可编辑性状态
		if(status == 'browse'){//浏览态参照可以修改
			this.props.button.setMainButton('Add',true);
			if(this.state.disabled!=false){
				this.setState({disabled:false})
			}
		}else{//编辑态参照不可以修改
			this.props.button.setMainButton('Add',false);
			if(this.state.disabled!=true){
				this.setState({disabled:true})
			}
		}
	};

	onRowClick = (props, moduleId, record, index, e) => {
		//this.Info.record = record;
		this.toggleShow();
	}
	//点击是否失效
	// changeCheck = () => {
	// 	this.state.checked = !this.state.checked
	// 	this.getTableData();
	// }



	render() {
		let { table, button, search, cardTable } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { createEditTable } = this.props.editTable;
		let { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER}>
					<div className="nc-bill-header-area" >
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: this.state.json['10140CECF-000000'],//国际化处理： 成本组件
								initShowBackBtn: false
							})}
							<ReferLoader
								tag="test"
								refName={this.state.json['10140CECF-000016']}
								placeholder={this.state.json['10140CECF-000016']}
								refcode="/uapbd/refer/org/OrgWithGlobalAllDataTreeRef/index.js"//uapbd/refer/org/FactoryGridRef/index.js
								value={this.state.pk_org}
								showStar={true}
								fieldid={'pk_org'}
								disabled={this.state.disabled}
								onChange={function (value) {
									this.setState({
										pk_org: value
									}, () => {
										this.props.editTable.setStatus(this.tableId, 'browse');
										this.getTableData();
									})

								}.bind(this)
								}
								isMultiSelectedEnabled={false}
								queryCondition={{
									AppCode: this.props.getSearchParam('c'),
									isDataPowerEnable: 'Y',//是否启用数据权限
									TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder,nccloud.web.uapbd.bdcostcomponent.handler.PkOrgBeforeSqlBuilder'
								}}
							/>

							{/* {this.state.disabled ? null ://参照可编辑的时候才可以看到该框
								//显示失效
								<div className="title-search-detail" style={{ lineHeight: '30px' }}>
									<NCCheckbox
										checked={this.state.checked}
										onChange={this.changeCheck}>
										{this.state.json['10140CECF-000004']}</NCCheckbox>
								</div>
							} */}


						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: 'list_head_area',
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</div>
				</NCDiv>
				<div className="nc-bill-table-area">
					{createEditTable(tableId, {
						onSelected: this.onRowClick.bind(this),
						onSelectedAll: this.onRowClick.bind(this),
						onBeforeEvent: bodyBeforeEvent.bind(this),
						onAfterEvent: bodyAfterEvent.bind(this),
						showCheck: true,
						showIndex: true,
						adaptionHeight: true,
					})}
				</div>



			</div>
		);
	}
}

SingleTable = createPage({})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65