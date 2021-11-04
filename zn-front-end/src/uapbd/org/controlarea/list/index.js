//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65

import React, { Component } from 'react';
import { createPage, base ,getMultiLang} from 'nc-lightapp-front';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, doubleClick } from './events';
import { tableId, searchId,pkname,dataSource,multiLangCode,module} from './constants';
import {onListButtonControl} from '../common/buttonVisible'; 
import MyModal from "../component/modal";
import {menue} from "../component/menue/menud";
const { NCDiv } = base;

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageId = this.props.getSearchParam("p");
		this.Info = {
			allButtonsKey :[],//保存所有头部按钮
		}
		this.state = {
			json:{}
		}
	}


	componentWillMount(){
		//进入界面先加载多语，然后渲染界面模板
		let callback = (json) => {
			this.setState({json:json},() => {
				initTemplate.call(this, this.props,this.initShow);
			});
		}
		getMultiLang({moduleId: [multiLangCode], currentLocale: 'simpchn',domainName:module,callback})
	}

	initShow =()=>{
		//如果列表有缓存数据，就会先将缓存数据渲染到表格，然后调用componentInitFinished中的方法
		if(!this.props.table.hasCacheData(dataSource)){
			this.onSelected();//没有缓存的话，就直接控制按钮
        }
        //更新按钮状态
        // let headButton = {
        //     Add: 'resa_Add',//新增
        //     Delete: 'resa_Del',//删除
        //     Edit: 'resa_Edit',//修改
        
        // }
        // let selectData = this.props.table.getCheckedRows('controlarea_table');
        // let param = selectData.length ? false: true;
        // this.props.button.setButtonDisabled({[headButton.Delete]: param});
	}


	//列表控制按钮
	onSelected = () => {
		onListButtonControl.call(this,this.props);
	};


	//模态框取消按钮点击事件
	handleClose(){
		this.setState({modalOne: false})
		// this.props.syncTree.delNodeSuceess('treeId', 'root');
		this.selectRefer="";
	}


	
	render() {
		let { table, search } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER}>
				<div className="nc-bill-header-area">
					<div className="header-title-search-area" >
						{createBillHeadInfo({
							title: this.state.json['38200CA-000000'],//国际化处理： 期初在产共用材料
							initShowBackBtn: false
							})}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
                            area: 'page_header',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId,{
						clickSearchBtn: searchBtnClick.bind(this),//   点击按钮事件
						showAdvBtn: true,                         //  显示高级按钮
					})}
				</div>
				
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						dataSource: dataSource,//单页应用缓存key
						pkname: pkname,//单页应用缓存主键名字(该名字为表的主键名字)
						handlePageInfoChange: pageInfoClick.bind(this),//翻页事件
						showCheck: true,//显示复选框
						showIndex: true,//显示序号
						onRowDoubleClick: doubleClick.bind(this),//行双击事件
						onSelected: this.onSelected.bind(this),//单选事件
						onSelectedAll:this.onSelected.bind(this),//全选事件
						componentInitFinished:()=>{//表格渲染完之后处理事件
							this.onSelected();
						}
					})}
				</div>

				{/** 弹框区域 */}
					<MyModal
                        style={{
                            minHeight: '400px'
                        }}
                        fieldid='voucher_list_modal'
                        size= {this.modalSize}
                        title={this.referModalTitle} //'常用凭证'
                        showModal={this.state.modalOne}
                        showFooter={this.trueButton}
                        closeFn = {() => this.handleClose()}
                        sureFn = {() => this.handleSure()}
                        minHeight={400}
                    >
                        <div>
                            {
                                menue.call(this,this.selectBtn)
                            }
                        </div>
                       
                    </MyModal>



			</div>
		);
	}
}

List = createPage({
})(List);

export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65