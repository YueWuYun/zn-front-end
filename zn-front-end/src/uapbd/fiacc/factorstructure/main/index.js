//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, promptBox, createPageIcon } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
import Version from '../../../fiacc/factorstructure/version';
const { NCDiv } = base;

const tableid = 'factorstructure';
const pagecode = '10140ETS_factorstructure';
const isShowOffEnable = false;			//是否启用“显示停用”功能
const urls = {
	save: '/nccloud/uapbd/factorstructure/save.do',
	query: '/nccloud/uapbd/factorstructure/query.do'
};
let allTableData = {};
const keys = [];  //过来空行时，忽略的字段

//获取并初始化模板



class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			searchValue: '',
			searchDisable: false,				//简单搜索框是否禁用	true：禁用		false：可用
			showOffDisable: false,			//显示停用复选框是否禁用	true：禁用		false：可用
			isShowOff: false,				//列表是否显示停用数据
			ids: []
		}
		this.initTemplate(props, (res) => { this.getData(0) });
	}

	initTemplate(props, callback) {
		let count = 0;
		let result;
		let handleCallBack = () => {
			if (count === 2) {
				callback(result);
			}
		}
		props.createUIDom({
			pagecode: pagecode
		},
			(data) => {
				let meta = data.template;
				meta = this.modifierMeta(props, meta)
				props.meta.setMeta(meta, () => {
					count = count + 1;
					handleCallBack();
				});
				data.button && props.button.setButtons(data.button, () => {
					data.button && props.button.setPopContent('DeleteOpr', props.MutiInit.getIntl("10140ETS") && props.MutiInit.getIntl("10140ETS").get('10140ETS-000004'));/* 国际化处理： 确认删除？*/
					props.button.setButtonsVisible({
						Add: true,
						Copy: true,
						Save: false,
						Cancel: false
	
					});
				});
			});
	
		ajax({
			url: urls['query'],
			data: {
				"pagecode": pagecode,
				"showOfff": false
			},
			success: (res) => {
				result = res;
				count = count + 1;
				handleCallBack();
			}
		})
	}
	
	//对表格模板进行加工操作
	modifierMeta(props, meta) {

	    let that = this
		//添加表格操作列
		let event = {
			label: props.MutiInit.getIntl("10140ETS") && props.MutiInit.getIntl("10140ETS").get('10140ETS-000003'),/* 国际化处理： 操作*/
			attrcode: 'opr',
			key: 'opr',
			itemtype: 'customer',
			visible: true,
			fixed: 'right',
			render(text, record, index) {
				return props.button.createOprationButton(
					['DeleteOpr', 'EditOpr', 'FactorGroup'],
					{
						area: 'table_inner',
						buttonLimit: 3,
						onButtonClick: (props, id) => that.tableButtonClick(props, id, text, record, index)
					}
				);
			}
		};
		meta[tableid].items.push(event);
		return meta;
	}
	
	tableButtonClick(props, id, text, record, index) {
		let tableStatus = props.editTable.getStatus(tableid);
		if (id == 'EditOpr') {
			props.editTable.setStatus(tableid, 'edit');
			this.updateButtonStatus()
		} else if (id == 'DeleteOpr') {
			if (tableStatus == 'browse' || tableStatus == undefined) {
				let delObj = {
					rowId: index,
					status: '3',
					values: {
						ts: {
							display: props.MutiInit.getIntl("10140ETS") && props.MutiInit.getIntl("10140ETS").get('10140ETS-000016'),/* 国际化处理： 时间戳*/
							value: record.values.ts.value
						},
						pk_factorstructure: {
							display: props.MutiInit.getIntl("10140ETS") && props.MutiInit.getIntl("10140ETS").get('10140ETS-000017'),/* 国际化处理： 主键*/
							value: record.values.pk_factorstructure.value
						},
						pk_original: {
							display: props.MutiInit.getIntl("10140ETS") && props.MutiInit.getIntl("10140ETS").get('10140ETS-000023'),/* 国际化处理： 原始版本*/
							value: record.values.pk_original.value
						},
						code: {
							display: props.MutiInit.getIntl("10140ETS") && props.MutiInit.getIntl("10140ETS").get('10140ETS-000018'),/* 国际化处理： 编码*/
							value: record.values.code.value
						},
						name: {
							display: props.MutiInit.getIntl("10140ETS") && props.MutiInit.getIntl("10140ETS").get('10140ETS-000019'),/* 国际化处理： 名称*/
							value: record.values.name.value
						}
					}
				};
				let indexArr = [];
				indexArr.push(index);
				let data = {
					pageid: pagecode,
					model: {
						areaType: 'table',
						pageinfo: null,
						rows: [delObj]
					}
				};
				ajax({
					url: urls['save'],
					data,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							props.editTable.deleteTableRowsByIndex(tableid, indexArr);
							let allD = props.editTable.getAllData(tableid);
							Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
							allTableData = allD;
							props.editTable.setTableData(tableid, allD);
							toast({ content: props.MutiInit.getIntl("10140ETS") && props.MutiInit.getIntl("10140ETS").get('10140ETS-000020'), color: 'success' });/* 国际化处理： 删除成功*/
						}
					}
				});
			} else {
				props.editTable.deleteTableRowsByIndex(tableid, index);
			}
	
		} else {//元素组
			props.openTo("/uapbd/fiacc/factorgroup/main/index.html", {
				appcode: '10140ETSFG',
				pagecode: '10140ETSFG_factorgroup',
				chartid: record.values.pk_factorchart.value,
				chartname: record.values.pk_factorchart.display,
				factorstructure: record.values.pk_factorstructure.value
			})
	
		}
	
	}

	componentWillUpdate() {
		if (this.props.editTable.getStatus(tableid) === 'edit') {
			window.onbeforeunload = () => {
				return this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000007')/* 国际化处理： 页面还没有保存，确定离开页面？*/
			}
		} else {
			window.onbeforeunload = null;
		}
	}

	handleData = (res, query_from) => {
		if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
			this.props.dealFormulamsg(
				res.formulamsg,  //参数一：返回的公式对象
				{                //参数二：界面使用的表格类型
					"tableid": "editTable"
				}
			);
		}
		let { success, data } = res;
		if (!data) {
			return;
		}
		let sum = 0;
		if (success) {
			allTableData = data[tableid];
			this.props.editTable.setTableData(tableid, data[tableid]);
			if (query_from > 0) {
				let sum = data[tableid].rows ? data[tableid].rows.length : 0;
				if (sum === 0) {
					toast({ content: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000010'), color: 'warning', title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-0000011') });/* 国际化处理： 未查询到符合条件的数据！,请注意！*/
				} else {
					if (query_from == 1) {
						toast({ content: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000012', { sum: sum }), color: 'success', title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000013') });/* 国际化处理： 查询成功，共,条数据。,已成功！*/
					} else {
						toast({ color: 'success', title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000011') });/* 国际化处理： 查询成功，共,条数据。,已成功！*/
					}

				}
			}
		} else {
			query_from > 0 && toast({ content: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000008'), color: 'warning', title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000009') });/* 国际化处理： 未查询到符合条件的数据！,请注意！*/
		}
	}

	//请求列表数据
	//0:不提示查询  1：查询数据  2：刷新页面
	getData = (query_from) => {
		let showOff = this.state.isShowOff;
		//如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
		ajax({
			url: urls['query'],
			data: {
				"pagecode": pagecode,
				"showOff": showOff
			},
			success: (res) => {
				this.handleData(res, query_from);
			}
		});
	};

	//按钮点击事件
	onButtonClick(props, id) {
		switch (id) {
			case 'Add':
				this.props.editTable.setStatus(tableid, 'edit');
				this.addTableRow(true);
				break;
			case 'Cancel':
				promptBox({
					color: "warning",               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000005'),                /* 国际化处理： 确认取消*/
					content: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000006'),              /* 国际化处理： 是否确认要取消？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000007'),         /* 国际化处理： 确定*/
					cancelBtnName: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000008'),         /* 国际化处理： 取消*/
					beSureBtnClick: () => {
						this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
					}
				});
				break;
			case 'Save':
				this.props.editTable.filterEmptyRows(tableid, ['islastversion','enablestate']);
				let allTableRows = this.props.editTable.getAllRows(tableid, true);
				if (!this.props.editTable.checkRequired(tableid, allTableRows)) {
					return;
				}
				let tableData = this.props.editTable.getChangedRows(tableid);
				if (!tableData || tableData.length === 0) {
					this.props.editTable.cancelEdit(tableid, this.updateButtonStatus.bind(this));
					toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000009'), color: 'success' });/* 国际化处理： 保存成功！*/
					return;
				}
				tableData = this.props.editTable.getAllRows(tableid);   //此处改成getAllRows获取表格所有数据传递给后台，为了返回正常的提示行号，垃圾的处理方式···················
				let data = {
					pageid: pagecode,
					model: {
						areaType: "table",
						areacode: tableid,
						pageinfo: null,
						rows: []
					}
				};
				data.model.rows = tableData;
				let saveFunction = () => {
					ajax({
						url: urls['save'],
						data,
						success: (res) => {
							let { success, data } = res;
							if (success) {
								toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000015'), color: 'success' });/* 国际化处理： 保存成功！*/
								this.props.editTable.setStatus(tableid, 'browse');//设置表格状态为浏览态
								this.updateButtonStatus()
								if (data) {
									let allD = this.props.editTable.getAllData(tableid);
									Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
									Utils.filterResult(allD, data[tableid].rows);//将保存后返回的数据重新放置到页面
									allTableData = allD;
									this.props.editTable.setTableData(tableid, allD);

								}
							}
						}
					});
				}
				this.props.validateToSave(data, saveFunction, { [tableid]: 'table' }, 'grid');
				break;
			case 'Version':
				let tabledata = this.props.editTable.getCheckedRows('factorstructure')
				if (!tabledata || tabledata.length === 0) {
					toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000021'), color: 'warning' });/* 国际化处理： 需选中数据进行版本化！*/
					return;
				}
				if (tabledata.length > 1) {
					toast({ title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000022'), color: 'warning' });/* 国际化处理： 只能选中一条数据进行版本化！*/
					return;
				}
				let fsdata = tabledata[0].data.values
				let config = {
					pk_factorstructure: fsdata.pk_factorstructure.value,
					pk_factorchart: fsdata.pk_factorchart.value,
					pk_original: !!fsdata.pk_original && !!fsdata.pk_original.value ? fsdata.pk_original.value : fsdata.pk_factorstructure.value,
					code: fsdata.code.value,
					name: fsdata.name.value,
				}
				this.props.modal.show('modal', {
                    userControl: true,
                    title: '要素结构版本化',
                    content: <Version fieldid={"version"} config={config}/>,
                    cancelBtnClick: this.cancelBtnClick.bind(this),
					beSureBtnClick: this.closeModal.bind(this),
					closeBtnClick: this.closeModal.bind(this)
                });
		}
	}

	closeModal(){
		this.props.modal.close('modal')
		this.getData(0)
	}

	cancelBtnClick() {
        promptBox({
            title: '确认取消',/* 国际化处理： 确认取消*/
            content: '是否确认要取消?',/* 国际化处理： 是否确认要取消?*/
            color: 'warning',
            beSureBtnClick: () => {
				this.props.modal.close('modal')
				this.getData(0)
            }
        });
    }

	//表头简单筛选
	onSearch(value) {
		this.setState({ searchValue: value });
		let allData = Utils.clone(allTableData);
		if (value.trim() === '') {
			this.getData(0);
		} else {
			let rows = Array.of();
			for (var row of allData.rows) {
				if (row.values['code'].value.indexOf(value) > -1 || row.values['name'].value.indexOf(value) > -1) {
					rows.push(row);
				}
			}
			allData.rows = rows;
		}
		this.props.editTable.setTableData(tableid, allData);
	}

	//显示停用数据
	showOffChange() {
		this.setState({
			isShowOff: !this.state.isShowOff
		}, () => { this.getData(1) });

	}

	addTableRow(isFocus) {
		let num = this.props.editTable.getNumberOfRows(tableid);
		this.props.editTable.addRow(tableid, num, isFocus);
		this.props.editTable.setValByKeyAndIndex(tableid, num, 'islastversion', { value: true })
		this.updateButtonStatus()
	}

	//更新按钮状态
	updateButtonStatus() {
		if (this.props.editTable.getStatus(tableid) === 'edit') {
			this.props.button.setPopContent('DeleteOpr', '');
			this.props.button.setButtonsVisible({
				Add: true,
				Save: true,
				Cancel: true,
				Copy: false,
				EditOpr: false,
				FactorGroup: false
			});
			this.props.button.setMainButton('Add', false);//编辑态设置新增按钮颜色
			this.props.button.setMainButton('Save', true);//编辑态设置保存按钮颜色
			this.setState({
				searchDisable: true,
				showOffDisable: true
			});
		} else {//浏览态
			this.props.button.setPopContent('DeleteOpr', this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000004'));/* 国际化处理： 确认删除？*/
			this.props.button.setButtonsVisible({
				Add: true,
				Edit: true,
				Save: false,
				Cancel: false,
				Copy: true,
				EditOpr: true,
				FactorGroup: true
			});
			this.props.button.setMainButton('Add', true);//设置新增按钮颜色
			this.setState({
				searchDisable: false,
				showOffDisable: false
			});
		}
	}

	onSelected(){
		this.props.button.setDisabled({
			Version:false
		});
	}



	render() {
		let { button, editTable, BillHeadInfo,modal } = this.props;
		let { createEditTable } = editTable;
		let { createButtonApp } = button;
		let { NCFormControl, NCCheckbox } = base;
		const { createBillHeadInfo } = BillHeadInfo;
		const { createModal } = modal;

		return (
			<div className="nc-single-table">
				{createModal('modal', { noFooter: false })}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">

					{/* 标题 title */}
					<div className="header-title-search-area">
						{/* {createPageIcon()} */}
						{/* <h2 className="title-search-detail">{this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000028')}</h2> */}
						{createBillHeadInfo({
							title: this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000000'),/* 国际化处理： 核算要素结构*/
							initShowBackBtn: false
						})}
						{/* 简单查询 */}
						<div className="title-search-detail">
							<NCFormControl
								placeholder={this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000001')/* 国际化处理： 请输入编码或名称筛选*/}
								value={this.state.searchValue}
								onChange={this.onSearch.bind(this)}
								type="search"
								disabled={this.state.searchDisable}
							/>
						</div>
						{/* 显示停用数据 */}
						{true ? (
							<div className="title-search-detail">
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										disabled={this.state.showOffDisable}
									>{this.props.MutiInit.getIntl("10140ETS") && this.props.MutiInit.getIntl("10140ETS").get('10140ETS-000002')/* 国际化处理： 显示停用*/}</NCCheckbox>
								</span>
							</div>
						) : ('')}
					</div>
					{/* 按钮区  btn-group */}
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3,
							onButtonClick: this.onButtonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')

						})}
					</div>
				</NCDiv>
				{/* 列表区 */}
				<div className='nc-singleTable-table-area'>
					{createEditTable(tableid, {//列表区  
						useFixedHeader: true,
						showIndex: true,				//显示序号
						showCheck: true,			//显示复选框
						isAddRow: true,
						adaptionHeight: true,
						onSelected: this.onSelected.bind(this)

					})}
				</div>
			</div>
		);
	}
}

SingleTable = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: pagecode,
		bodycode: tableid
	},
	initTemplate: () => { },
	mutiLangCode: '10140ETS'
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65