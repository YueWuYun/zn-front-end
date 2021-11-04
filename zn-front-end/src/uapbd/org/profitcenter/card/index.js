//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import { createPage, ajax, toast, promptBox, base ,cardCache} from 'nc-lightapp-front';
import './index.less'
//导入导出功能适配
//初始化模板适配
import { buttonClick, initTemplate } from './event';

const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
const dataSource = 'uapbd.reas.profitcenter.data'


class ProfitcenterCard extends Component {

	constructor(props) {

		super(props);

		this.config = Object.assign({
			formId: "profitcenter",
			pageCode: "10100PFC_profitcenter",
			tableIds: ['pfinaorgs', 'pforgs', 'pfdepts'],
			urls: {
				ccdeptrefqrycondition: "/nccloud/uapbd/costcenter/ccdeptrefqrycondition.do",
				queryCardUrl: '/nccloud/uapbd/profitcenter/loadcarddata.do',
				savePFCUrl: '/nccloud/uapbd/profitcenter/saveprofitcenter.do',
				delCostUrl:'/nccloud/uapbd/profitcenter/delprofitcenter.do'
			}
		}, props.config);

		this.state = {
			selectedPK:"",
			json: {},//多语资源文件数据
			pk_factory: '',//关联工作中心根据所属工厂过滤数据
			status: 'browse',//标记页面状态，控制参照查询区 的显隐性
			checked: false,//停启用复选框
			pfinaorgs: [],
			enablestate: 'N',
			curOrg: { pk_org: '', name: '' },
			showBaseInfo: false,
			title_code: 'title_code',
			cacheRefPk: this.props.cacheRefPk//卡片跳转列表，再跳转到卡片的情况下，cacheRefPk维护第一次卡片页面左侧树选中节点pk
		}

	}

	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
			} else {
				console.log(未加载到多语资源);   // 未请求到多语资源的后续操作/* 国际化处理： 未加载到多语资源,未加载到多语资源*/
			}
		}
		this.props.MultiInit.getMultiLang({ 'moduleId': 'user-001', 'domainName': 'uap', callback });
	}

	componentDidMount() {
		debugger

		if (this.props.getUrlParam('status') == 'add') {
			this.props.form.setFormStatus("profitcenter", this.props.getUrlParam('status'));
			this.updateButtonStatus();
			this.setState({
				selectedPK:''
			});
		}
		if (this.props.getUrlParam('status') == 'edit') {
			this.props.form.setFormStatus(this.config.formId, this.props.getUrlParam('status'));
			this.updateButtonStatus();
			let sel = this.props.getUrlParam('pk_profitcenter');
			debugger
			this.getData(sel);
		}

	}

	getData = (pk) => {
		let data = { pk_profitcenter: pk};
		let that = this;
		ajax({
			data: data,
			url: '/nccloud/uapbd/profitcenter/loadcarddata.do',
			success: function (result) {
				let { success} = result;
				if (success) {
					debugger
					//适配显示公式
					if (result.formulamsg && result.formulamsg instanceof Array && result.formulamsg.length > 0) {
						that.props.dealFormulamsg(
							result.formulamsg,
							{
								formId: "form"
							}
						);
					}
					let formId = that.config.formId;
					let tableIds = that.config.tableIds;
					//表单数据
					let headData = result.data.head[formId];
					let pfinaorgsdata = result.data.bodys[tableIds[0]] ? result.data.bodys[tableIds[0]] : {
						areacode: tableIds[0],
						rows: []
					};
					let pfiorgdata = result.data.bodys[tableIds[1]] ? result.data.bodys[tableIds[1]] : {
						areacode: tableIds[1],
						rows: []
					};
					let pfdeptdata = result.data.bodys[tableIds[2]] ? result.data.bodys[tableIds[2]] : {
						areacode: tableIds[2],
						rows: []
					};
	
					//清空表单
					that.props.form.EmptyAllFormValue(formId);
					let meta = that.props.meta.getMeta();
					debugger
					meta['profitcenter'].items.map(item => {
						if (item.attrcode === 'principal') {//处理负责人
							item.queryCondition = {
								pk_org: headData.rows[0].values.pk_manageorg.value
							}
						}
					});
					//设置表单
					that.props.form.setAllFormValue({ [formId]: headData });

					that.props.cardTable.setTableData(tableIds[0], pfinaorgsdata);

					that.props.cardTable.setTableData(tableIds[1], pfiorgdata);

					that.props.cardTable.setTableData(tableIds[2], pfdeptdata);
					// //查询时转换启用状态
					that.setState({selectedPK:that.props.getUrlParam('pk_profitcenter')})

				}
			}
		});
	}

	setDefaultValue = () => {
		//this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:'自由态'}});
	}


	//卡片区状态监听，用于调整按钮状态
	updateButtonStatus ()  {
		debugger
		if (this.props.form.getFormStatus(this.config.formId) == 'edit' || this.props.form.getFormStatus(this.config.formId) == 'add') {//编辑状态
			this.props.button.setButtonsVisible({
				add:false,
				edit:false,
				save:true,
				saveadd: true,
				cancel: true,
			});
			this.props.button.setButtonDisabled({
				addline: false,
				delline: false,
				addorgline: false,
				delorgline: false,
				adddeptline: false,
				deldeptline: false,
			});
		} else {//浏览态
			this.props.button.setButtonsVisible({
				add:true,
				edit:true,
				save: false,
				saveadd: false,
				cancel: false,
			});

			this.props.button.setButtonDisabled({
				addline: true,
				delline: true,
				addorgline: true,
				delorgline: true,
				adddeptline: true,
				deldeptline: true,

			});
		}
	}

	 //从缓存获取信息
    //added by tangcht 2019.2.27
    getDataForCache(pk, callback) {
		debugger
		if(!pk) {
			this.props.form.EmptyAllFormValue(this.config.formId);
			this.props.cardTable.setTableData(this.config.tableIds[0], {rows: []});
			this.props.cardTable.setTableData(this.config.tableIds[1], {rows: []});
			this.props.cardTable.setTableData(this.config.tableIds[2], {rows: []});
        }else{ 
            let cardData = getCacheById(pk, dataSource);
            if(cardData) {
                this.props.form.setAllFormValue({ [this.config.formId]:cardData.head[this.config.formId] });
                if(cardData.bodys && cardData.bodys[this.config.tableIds[0]]) {
                    this.props.cardTable.setTableData(this.config.tableIds[0], cardData.bodys[this.config.tableIds[0]]);
                }
                else {
                    this.props.cardTable.setTableData(this.config.tableIds[0], {rows: []})
				}
				if(cardData.bodys && cardData.bodys[this.config.tableIds[1]]) {
                    this.props.cardTable.setTableData(this.config.tableIds[1], cardData.bodys[this.config.tableIds[1]]);
                }
                else {
                    this.props.cardTable.setTableData(this.config.tableIds[1], {rows: []})
				}
				if(cardData.bodys && cardData.bodys[this.config.tableIds[2]]) {
                    this.props.cardTable.setTableData(this.config.tableIds[2], cardData.bodys[this.config.tableIds[2]]);
                }
                else {
                    this.props.cardTable.setTableData(this.config.tableIds[2], {rows: []})
                }
                this.props.setUrlParam(pk)//动态修改地址栏中的id的值
            }
            else {
                this.getData(pk)
                this.props.setUrlParam(pk)//动态修改地址栏中的id的值
            }
        }
		
		if(callback && typeof callback == 'function') {
			callback.call(this)
		}
    }



	isDelBtnEnable() {
		//判断子表数据，控制子表增删行按钮可用性
		if (this.props.cardTable.getNumberOfRows(tableIds[0]) > 0/*获取列表总行数*/) {
			this.props.button.setDisabled({
				delccdept: false
			});
		} else {
			this.props.button.setDisabled({
				delccdept: true
			});
		};
		//判断子表数据，控制子表增删行按钮可用性
		if (this.props.cardTable.getNumberOfRows(tableIds[1]) > 0/*获取列表总行数*/) {
			this.props.button.setDisabled({
				delccwork: false
			});
		} else {
			this.props.button.setDisabled({
				delccwork: true
			});
		};
	}



	onPageInfoClick() {
		alert('PageInfoClick');
	}


	//主表编辑后事件
	afterEvent = (props, moduleId, key, value, oldValue) => {
		debugger
		//编辑后时间目前主要处理停启用开关编辑事件
		if (key == 'pk_manageorg') {
			let pk_org = this.props.form.getFormItemsValue(this.config.formId, 'pk_manageorg');
			if (pk_org && pk_org.value) {
				let meta = this.props.meta.getMeta();
				debugger
				meta['profitcenter'].items.map(item => {
					if (item.attrcode === 'principal') {//负责人
						item.queryCondition = {
							pk_org: pk_org.value
						}
					}
				});
				this.props.meta.setMeta(meta);
			}
		}

	}

	//子表按钮点击事件
	onPFButtonClick(props, id) {
		let that = this;
		switch (id) {
			case 'addline':
				that.props.cardTable.addRow(that.config.tableIds[0]);//新增行
				break;
			case 'delline':
				let data1 = props.cardTable.getCheckedRows(that.config.tableIds[0]);
				if (data1.length == 0) {
					toast({ content: that.state.json['10100RESA-000002'], color: 'warning' })/* 国际化处理： 删除失败：请选中数据后重新操作！*/
					return;
				}
				let arr = data1.map(item => item.index);
				that.props.cardTable.delRowsByIndex(that.config.tableIds[0], arr);
				break;
			case 'addorgline':
				that.props.cardTable.addRow(that.config.tableIds[1]);//新增行
				break;
			case 'delorgline':
				let data2 = props.cardTable.getCheckedRows(that.config.tableIds[1]);
				if (data2.length == 0) {
					toast({ content: that.state.json['10100RESA-000002'], color: 'warning' })/* 国际化处理： 删除失败：请选中数据后重新操作！*/
					return;
				}
				let arr2 = data2.map(item => item.index);
				that.props.cardTable.delRowsByIndex(that.config.tableIds[1], arr2);
				break;
			case 'adddeptline':
				that.props.cardTable.addRow(that.config.tableIds[2]);//新增行
				break;
			case 'deldeptline':
				let data3 = props.cardTable.getCheckedRows(that.config.tableIds[2]);
				if (data3.length == 0) {
					toast({ content: that.state.json['10100RESA-000002'], color: 'warning' })/* 国际化处理： 删除失败：请选中数据后重新操作！*/
					return;
				}
				let arr3 = data3.map(item => item.index);
				that.props.cardTable.delRowsByIndex(that.config.tableIds[2], arr3);
				break;
		}
	}

	render() {
		let { form, cardTable, button } = this.props;
		let { createForm } = form;
		const { createCardTable } = this.props.cardTable;
		let { createButtonApp } = button;
		let { NCDiv } = base;
		let { createBillHeadInfo } = this.props.BillHeadInfo;
		if (this.transImgModalShow) {
			document.getElementById('dd').style.display = 'block'
		}
		return (
			<div className="nc-bill-card rbac-user-card">
				<div className="nc-bill-top-area">
					<NCDiv areaCode={NCDiv.config.HEADER}>
						<div className="nc-bill-header-area">
							<div className="header-title-search-area">
								<span>
									{createBillHeadInfo({
										title: this.state.json['10100RESA-000001'],
										backBtnClick: () => {
											this.props.pushTo('/list', { pagecode: '10100PFC_listView' });
										}
									})}
								</span>
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: 'header_area',
									buttonLimit: 10,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
						</div>
					</NCDiv>
					<div className="nc-bill-form-area">
						{createForm(this.config.formId, {
							onAfterEvent: this.afterEvent,
						})}
					</div>
				</div>
				<div className="nc-bill-table-area">
					{createCardTable(this.config.tableIds[0], {
						showIndex: true,
						showCheck: true,
						tableHead: () => {
							return <div className="shoulder-definition-area">
								{createButtonApp({
									area: 'pfina_area',
									buttonLimit: 3,
									onButtonClick: this.onPFButtonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
						}
					})}
				</div>
				<div className="nc-bill-table-area">
					{createCardTable(this.config.tableIds[1], {
						showIndex: true,
						showCheck: true,
						tableHead: () => {
							return <div className="shoulder-definition-area">
								{createButtonApp({
									area: 'pforg_area',
									buttonLimit: 3,
									onButtonClick: this.onPFButtonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
						}
					})}
				</div>
				<div className="nc-bill-table-area">
					{createCardTable(this.config.tableIds[2], {
						showIndex: true,
						showCheck: true,
						tableHead: () => {
							return <div className="shoulder-definition-area">
								{createButtonApp({
									area: 'pfdept_area',
									buttonLimit: 3,
									onButtonClick: this.onPFButtonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
						}
					})}
				</div>
			</div>

		)
	}
}

export default ProfitcenterCard = createPage({
	initTemplate: initTemplate
})(ProfitcenterCard);
















//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65