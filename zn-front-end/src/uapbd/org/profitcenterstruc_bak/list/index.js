//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, cacheTools, print, high, getBusinessInfo, promptBox, createPageIcon, excelImportconfig } from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
import { initTemplate, searchBtnClick,buttonClick} from './event';
const { NCPopconfirm, NCIcon, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
const { PrintOutput, ExcelImport } = high;
const { NCDiv } = base;
const dataSource = 'uapbd.pfc.struct.data'
const pageId = '10100PFCS_LIST';        //pagecode
const searchId = 'resapfcsearch';              //查询区id
const tableId = 'resapfcs';                 //表头id
const linkItem = 'code';        		//列表卡片跳转字段
const pk_item = 'pk_pfconstruct';       //列表主键
const queryListUrl = '/nccloud/uapbd/profitcenterstruc/ListQuery.do'; 
const saveUrl = '/nccloud/uapbd/profitcenterstruc/SaveAction.do';          //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/profitcenterstruc/QueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/profitcenterstruc/DelAction.do';                 //删除url
const printUrl = '/nccloud/uapbd/profitcenterstruc/Print.do';                  //列表打印url
const validUrl = '/nccloud/uapbd/profitcenterstruc/Valid.do';                   //权限校验
const tableBtnAry = ["editline", "delline"];		//表格列操作按钮
const globalId = 'GLOBLE00000000000000';            //全局常量值




class ProfitCenterstrucTable extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageId = pageId;
		this.urls = {
			save:saveUrl
		}
		this.state = {
			title: '',
			json: {}
		};

	}


	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				debugger
				this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
			}

		}
		this.props.MultiInit.getMultiLang({ 'moduleId': 'resa-profitcenter', 'domainName': 'uapbd', callback });
	}

	componentDidMount() {
		// UE 要求打印下拉只有输出，确认规范后按钮注册再改。！！！
		this.props.button.setButtonsVisible({
			'print': false
		});
	}

	setStatus(props,tableid,status) {
        let all = this.props.editTable.getAllRows(tableid);
        let tableStatus = this.props.editTable.getStatus(tableid);

        //设置编辑态
        if (status == 'add' || status == 'edit') {
            //当前组件不是编辑态时才执行转换
            if (tableStatus != 'add' && tableStatus != 'edit') {
                props.editTable.setStatus(tableid,status);
            }
        }else{
            props.editTable.setStatus(tableid,status);
        }
    }

	// 行选中事件
	onSelected = () => {
		let rows = this.props.table.getCheckedRows(tableId);
		if (rows && rows.length > 0) {
			//this.props.button.setButtonDisabled(['delete', 'printGrp', 'output'], false);
			//打印使用都能使用列表态
			this.props.button.setButtonDisabled(['delete'], false);
		} else {
			//this.props.button.setButtonDisabled(['delete', 'printGrp', 'output'], true);
			this.props.button.setButtonDisabled(['delete'], true);
		}
		this.setState(this.state);
	}

	
	//输出
	onOutput = () => {

		let allData = this.props.table.getAllTableData(tableId);
		if (allData.length === 0) {
			toast({ content: this.state.json['10140INCMG-000007'], color: 'warning' });/* 国际化处理： 无可输出的数据！*/
			return;
		}
		let pks = [];

		allData.rows.forEach((item, key) => {
			pks.push(item.values[pk_item].value);
		});
		this.setState({
			ids: pks
		}, this.refs.printOutput.open());
	}

	doubleClick = (record, index, e) => {
		
		console.log(this.state.json['10140INCMG-000021']);/* 国际化处理： 双击*/
		console.log(this)
		let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set("searchParams", searchVal);
		cacheTools.get("searchParams");
		cacheTools.set('preid', this.props.getUrlParam('id'));
		this.props.pushTo(this.props.cardUrl, {
			appcode: this.props.appcode,
			pagecode: this.props.pagecode_card,
			status: 'browse',
			id: record[pk_item].value
		});
	}

	deleteAction = () => {
		let data = this.props.table.getCheckedRows(tableId);
		let that = this;
		let params = {
			pk_org: cacheTools.get('pk_org'),
			deleteinfo: data.map((v) => {
				let id = v.data.values[pk_item].value;
				let ts = v.data.values.ts.value;
				return {
					id, ts
				}
			})
		}
		console.log(params)
		ajax({
			url: deleteUrl,
			data: params,
			success: (res) => {
				toast({ color: "success", title: that.state.json['10140INCMG-000015'] });/* 国际化处理： 删除成功！*/
				that.props.button.setButtonDisabled(['delete'], true);
				that.refreshAction(that.props);
			}
		});
	}

	refreshAction = (props, callback = null) => {
		let searchVal = props.search.getAllSearchData(searchId);
		console.log(searchVal);
		if (searchVal != false) {

			//获取查询模板信息
			let queryInfo = this.props.search.getQueryInfo(this.searchId);
			let OID = queryInfo.oid;

			let data = {
				querycondition: searchVal,
				custcondition: {},
				pagecode: props.pagecode_list,
				nodeType: props.nodeType,
				queryAreaCode: searchId,
				pageInfo: props.table.getTablePageInfo(tableId),
				querytype: 'tree',
				oid: OID,//cacheTools.get('orgunit_searchoid')
			};
			ajax({
				url: queryListUrl,
				data,
				success: (res) => {
					console.log(res);
					if (res.data) {
						props.table.setAllTableData(tableId, res.data[tableId]);
						props.button.setButtonDisabled(['printGrp', 'output'], false);
						//toast({title:this.state.json['10140INCMG-000010'],color:"success"});/* 国际化处理： 刷新成功！*/
						callback && callback();
					} else {
						props.table.setAllTableData(tableId, { rows: [] });
						props.button.setButtonDisabled(['printGrp', 'output'], true);
						//toast({title:this.state.json['10140INCMG-000010'],color:"success"});/* 国际化处理： 刷新成功！*/
						callback && callback();
					}

					//查询时执行显示公式前端适配
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg,  //参数一：返回的公式对象
							{                //参数二：界面使用的表格类型
								[tableId]: "table"
							}
						);
					}

					props.button.setButtonDisabled(['delete'], true);
				},
				error: (res) => {
					console.log(res.message);
				}
			});
		}
	}

	pageInfoClick = (props, config, pks) => {

		let pageInfo = props.table.getTablePageInfo(this.tableId);
		let searchVal = props.search.getAllSearchData(searchId);

		cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));

		let data = {
			'pk_org': cacheTools.get('pk_org'),
			'allpks': pks,
			'pageid': props.pagecode_list
		};
		//得到数据渲染到页面
		let that = this;
		ajax({
			url: queryPageUrl,
			data: data,
			success: function (res) {
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
		let { editTable, button, search, modal, BillHeadInfo } = this.props;
		let { createModal } = modal;
		let buttons = this.props.button.getButtons();
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp, getButtons } = button;
		const { createBillHeadInfo } = BillHeadInfo;
		return (<div className="nc-bill-list">
			<NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
				<div className='header-title-search-area'>
					{createBillHeadInfo({
						title: this.state.title,
						initShowBackBtn: false
					})}
				</div>
				<div className="header-button-area">
					{createButtonApp({
						area: 'list_btn',
						buttonLimit: 3,
						onButtonClick: buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')

					})}
				</div>
			</NCDiv>
			<div className="nc-bill-search-area" fieldid='nc-bill-searchId'>
				{NCCreateSearch(this.searchId, {
					clickSearchBtn: searchBtnClick.bind(this)
				})}
			</div>
			{/* <div style={{height:'10px'}}></div> */}
			<div className="nc-bill-table-area" fieldid='nc-bill-tableId'>
				{createEditTable(this.tableId, {
					handlePageInfoChange: this.pageInfoClick,
					tableModelConfirm: this.tableModelConfirm,
					dataSource: dataSource,
					pkname: pk_item,
					showIndex: true,
					showCheck: true,
					onRowDoubleClick: this.doubleClick.bind(this),
					onSelected: this.onSelected.bind(this),
					onSelectedAll: this.onSelected.bind(this)
				})}
			</div>
			{createModal('delete', {
				title: this.state.json['10140INCMG-000012'],/* 国际化处理： 注意*/
				content: this.state.json['10140INCMG-000013'],/* 国际化处理： 确认删除？*/
				beSureBtnClick: this.deleteAction.bind(this)
			})}
			<PrintOutput
				ref='printOutput'
				url={printUrl}
				data={{
					appcode: this.props.appcode,
					funcode: this.props.printFunCode,//功能节点编码
					nodekey: this.props.printNodeKey,//模板节点编码
					oids: this.state.ids,
					outputType: 'output'
				}}
			/>
		</div>
		);
	}
}

ProfitCenterstrucTable = createPage({
	initTemplate: initTemplate
})(ProfitCenterstrucTable);
export default ProfitCenterstrucTable;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65