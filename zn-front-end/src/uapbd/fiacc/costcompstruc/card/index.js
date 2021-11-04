//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import { createPage, base, getMultiLang, high } from 'nc-lightapp-front';
import { buttonClick, initTemplate, headAfterEvent, headBeforeEvent, bodyAfterEvent, bodyBeforeEvent, pageInfoClick, tableButtonClick } from './events';
import { multiLangCode, dataSource, formId, tableId, tableId1, pagecode, cardBodyShouler, module, pkname,cmcommon, moduleName, exprotBillType, importPageId } from './constants';
let { NCScrollElement, NCDiv } = base;
import { queryCard, SaveBill } from './events/costCompStruc';
import { onSelectedCardBodyEditControl } from '../../../public/excomponents/pubUtils/buttonVisible';
const { NCUploader, ExcelImport, BillTrack } = high;
import CardSubCF from '../cardsubCF';
import CardCancelDistribute from '../CardCancelDistribute';
/**
 * 页面入口
 */
class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.tableId = tableId;
		this.pageId = pagecode;
		this.Info = {
			allButtonsKey: [],//保存所有按钮
			isModelSave: false,//是否是整单保存，默认为false
			selectedPKS: null,//保存主键
			cmaterialidVbfreeMap: new Map(),//key是物料id，value是物料对应的未启用的自由辅助属性
		}
		this.state = {
			buttonflag: false,
			switchflag: false,//控制展开 收起按钮显隐性
			index: null,//保存当前点击的是第几行的展开
			billtype: null,
			json: {},//页面多语
			showUploader: false,//附件管理参数
			checkValue: null,//附件管理参数
			checkId: null,//附件管理参数
			trackshow: false,//单据追溯模态框显示、隐藏
			forceRender: true,//导出模板懒加载，true为不加载，false为加载
			isModalShow: false,//分配成本组件结构，false不加载模态框，true为加载
            transfershowModal:false, // 快速分配
            cancelDistributeShowModel:false // 快速取消分配
		};
		this.pks;
	}
	componentDidMount() {
	}
	//页面初始化
	initShow = () => {
		queryCard.call(this, this.props);
	}
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.getUrlParam('status');
			if (status != 'browse') {
				return '';
			}
		}
		let callback = (json) => {
			this.setState({ json: json }, () => {
				initTemplate.call(this, this.props, this.initShow);
			})
		}
		getMultiLang({ moduleId: [multiLangCode], currentLocale: 'simpchn', domainName: module, callback });
		// 拦截判断是否离开当前页面《开始》
		window.$this=this;
		window.addEventListener('beforeunload', this.beforeunload);
		// 拦截判断是否离开当前页面《结束》
	}
	componentWillUnmount () {
        // 离开页面时销毁拦截监听，否则返回到列表页时依然在监听浏览器是否关闭
        window.removeEventListener('beforeunload', this.beforeunload);
	}
	beforeunload (e) {
        let status = this.$this.props.getUrlParam('status');
        if (status && status != 'browse') {
            let confirmationMessage = '';
            (e || window.event).returnValue = confirmationMessage;
        }
    }

	handleClick = () => {
		this.props.pushTo(
			'/list',
			{
				appcode: this.props.getSearchParam('c'),
				status:'browse',
				cardFlag: true
			})
	}
	//整单保存事件
	modelSaveClick = (modelIndex) => {
		let that = this;
		that.Info.isModelSave = true;
		SaveBill.call(that, that.props);
	};
	//卡片表体点击行事件
	onSelected = () => {
		onSelectedCardBodyEditControl(this);
		let selectedData = this.props.cardTable.getCheckedRows(this.tableId);
		if (selectedData.length > 0) {
			this.props.button.setButtonDisabled(['AddLine','CopyLine', 'DelLine'], false);
		} else {
			this.props.button.setButtonDisabled(['AddLine'], false);
			this.props.button.setButtonDisabled(['CopyLine', 'DelLine'], true);
		}
	};
	//获取列表肩部信息
	getTableHead = (tableId) => {
		let { createButton } = this.props.button;
		let that = this;

		return (
			<div className="shoulder-definition-area" >
				{
					this.props.button.createButtonApp({
						area: cardBodyShouler,
						onButtonClick: (props, key) => tableButtonClick.call(that, props, key, tableId)
					})
				}
			</div>
		);

	};
	beforeUpload(billId, fullPath, file, fileList) {
		const isLt20M = file.size / 1024 / 1024 < 20;
		if (!isLt20M) {
			toast({ content: `${this.state.json['38301616-000028']}20M！`, color: 'warning' });/* 国际化处理： 上传大小小于*/
		}
		return isLt20M;
		// 备注： return false 不执行上传  return true 执行上传
	}
	//关闭
	onHide = () => {
		this.setState({
			showUploader: false
		})
	}
	 // 分配成本组件结构模态框
	 isModalShow = () =>{
		this.setState({transfershowModal : !this.state.transfershowModal})
	}
  // 取消分配成本组件结构模态框
  	cancelModalShow = () =>{
   	 	this.setState({cancelDistributeShowModel : !this.state.cancelDistributeShowModel})
	}

	// 设置分配组织表体数据
	
	setCardTable(target){
		
		let distriVOs = this.props.cardTable.getAllRows(tableId1);
		let value='';
		let values=[];
		let display='';
		if(target){
			if(target.length>0){
				target.map((item, index) => { 
					values.push(item.key);
					value = value +item.key+',';
					display = display +item.title+',';
				})
				display=display.substring(0,display.length-1);
				value=value.substring(0,value.length-1);
			}
		}
		this.props.cardTable.setDataByIndexs(tableId1,{'distriorg':{value:display,display:display},'distriorgName':{value:value,display:value}});
	}

	setTableDistri(data){
		
		if(!data){
			this.props.cardTable.setTableData(tableId1, {rows: []});
		}else{
			this.props.cardTable.setTableData(tableId1, data);}
		}
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		let { createButtonApp } = button;
		let { showUploader } = this.state;
		let { createModal } = modal;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCDiv areaCode={NCDiv.config.HEADER}>
						<div className="nc-bill-header-area">
							<div className="header-title-search-area">
								<div>
									{
										createBillHeadInfo(
											{
												title: this.state.json['10140CCSC-000000'],/* 国际化处理： 成本组件结构*/
												backBtnClick: () => {
													this.handleClick(); //返回按钮的点击事件
												}
											}
										)}
								</div>
							</div>
							<div className="header-button-area">
								{/* 按钮适配 第三步:在页面的 dom 结构中创建按钮组，传入显示的区域，绑定按钮事件*/}
								{createButtonApp({
									area: 'page_header',
									buttonLimit: 3,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
								<div className="header-cardPagination-area">
									{createCardPagination({
										dataSource: dataSource,
										handlePageInfoChange: pageInfoClick.bind(this)
									})}
								</div>
								{/* 附件*/}
								{/* 这里是附件上传组件的使用，需要传入三个参数 */}
								{showUploader && (
									<NCUploader
										billId={this.state.checkId}
										billNo={this.state.checkValue}
										beforeUpload={this.beforeUpload}
										onHide={this.onHide}
									/>
								)}
							</div>
						</div>
					</NCDiv>
					<div className="nc-bill-form-area" >
						{createForm(formId, {
							//expandArr
							//onAfterEvent: headAfterEvent.bind(this),
						//	onBeforeEvent: headBeforeEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					{/*新增div*/}
					<div className="nc-bill-table-area" >
						{createCardTable(tableId, {
							tableHead: this.getTableHead.bind(this, tableId),
							onAfterEvent: bodyAfterEvent.bind(this),
							//onBeforeEvent: bodyBeforeEvent.bind(this),
							modelSave: this.modelSaveClick.bind(this),
							onSelected: this.onSelected.bind(this),
							onSelectedAll: this.onSelected.bind(this),
							adaptionHeight: false,
							isAddRow: false,
							showCheck: true,
							showIndex: true
						})}
					</div>
					{/*新增div*/}
					<div className="nc-bill-table-area" >
						{createCardTable(tableId1, {
							adaptionHeight: false,
							isAddRow: false,
							showCheck: false,
							showIndex: true
						})}
					</div>
				</div>
				<CardSubCF
					showFormModal={this.state.transfershowModal}
                    parent={this}
                    currentData={this.props.getUrlParam('id')}
               	/>
                <CardCancelDistribute
					cancelShowFormModal={this.state.cancelDistributeShowModel}
					parent={this}
					currentData={this.props.getUrlParam('id')}
					cardparent={this.props}
               	/>
			</div>
		);
	}
}
Card = createPage({
	//initTemplate: initTemplate,
	billinfo: {
		billtype: 'card',
		pagecode: pagecode,
		headcode: formId,
		bodycode: tableId
	},
	orderOfHotKey: [formId, tableId]
})(Card);

//ReactDOM.render(<Card />, document.querySelector('#app'));

export default Card;


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65