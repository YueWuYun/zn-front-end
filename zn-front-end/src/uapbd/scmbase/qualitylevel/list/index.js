//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, createPageIcon } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { AREA, STATUS, BUTTON, URL } from '../constance';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import { getListDisableHotKeyBtn } from '../../pub/tool/hotKeysUtil';
import { onHead_BtnClicks, onBody_BtnClicks, search_BtnClick, onRow_BtnClick, addRow_BtnClick } from './btnClicks';
import { buttonControl } from './viewController/buttonController';
import { createListTitle } from '../../pub/tool/titleUtil';
const { NCFormControl, NCDiv } = base;
import './index.less';
class List extends Component {
	constructor(props) {
		super(props);
		this.pageid = AREA.pageArea;
		this.headTableid = AREA.headTableArea;
		this.bodyTableid = AREA.bodyTableArea;
		//选中第几行
		this.selectIndex = '';
		this.state = {
			//简单查询框可用性
			searchDisable: false,
			value: '',
			//是否显示复选框
			headShowCheck: true,
			bodyShowCheck: false
		};
	}
	// 关闭浏览器提示，2018-08-15
	componentWillMount() {
		initLang(this, [ '1014qualitylevel' ], 'uapbd', initTemplate.bind(this, this.props));
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(this.headTableid);
			if (status == STATUS.edit) {
				return getLangByResId(this, '1014QUALITYLEVEL-000008'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	componentDidMount() {
		this.query();
	}
	query = () => {
		search_BtnClick.call(this, this.props);
	};
	//设置列表肩部信息
	getTableHead = () => {
		return (
			<div className="shoulder-definition-area">
				<div className="definition-search">
					<span className="definition-search-title">
						{getLangByResId(this, '1014QUALITYLEVEL-000010') /* 国际化处理： 质量等级*/}
					</span>
				</div>
				<div className="definition-icons">
					{this.props.button.createButtonApp({
						area: BUTTON.list_body,
						buttonLimit: 3,
						onButtonClick: onBody_BtnClicks.bind(this)
					})}
				</div>
			</div>
		);
	};
	// 根据搜索关键词过滤表头展示信息
	keyWordChange = (value) => {
		this.setState({ value: value }, () => {
			// 调用平台api过滤显示数据
			this.props.editTable.setFiltrateTableData(this.headTableid, [ 'cqlgroupcode', 'cqlgroupname' ], value);
			let visibleRows = this.props.editTable.getVisibleRows(this.headTableid, false, true);
			if (visibleRows.length == 0) {
				this.props.editTable.setTableData(AREA.bodyTableArea, { rows: [] });
				return;
			}
			let pk = visibleRows[0].values.pk_qualitylv.value;
			let this_ = this;
			ajax({
				url: URL.queryBody,
				data: pk,
				success: (res) => {
					if (res.data === undefined || res.data.body === undefined) {
						this_.props.editTable.setTableData(AREA.bodyTableArea, { rows: [] });
					} else {
						this_.props.editTable.setTableData(AREA.bodyTableArea, res.data.body[AREA.bodyTableArea]);
						this_.props.editTable.focusRowByIndex(AREA.headTableArea, 0);
					}
				}
			});
		});
	};
	// 界面组装
	render() {
		let { editTable } = this.props;
		let { createEditTable } = editTable;

		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCDiv areaCode={NCDiv.config.HEADER} div className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createListTitle(this)}
							<div className="title-search-detail">
								<NCFormControl
									placeholder={getLangByResId(this, '1014QUALITYLEVEL-000009')} /* 国际化处理： 质量等级组编码/名称*/
									value={this.state.value}
									onChange={(value) => {
										this.keyWordChange(value);
									}}
									disabled={this.state.searchDisable}
									autoFocus={true}
									// onSearch={searchButton_BtnClick.bind(this, this.props)}
									type="search"
								/>
							</div>
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: BUTTON.list_head,
								buttonLimit: 4,
								onButtonClick: onHead_BtnClicks.bind(this),
								ignoreHotkeyCode: getListDisableHotKeyBtn()
							})}
						</div>
					</NCDiv>
					<div className="left-right-table">
						<div className="table-area left-table-area">
							<div className="table-header">
								<div className="table-title nc-theme-title-font-c">
									{getLangByResId(this, '1014QUALITYLEVEL-000011') /* 国际化处理： 质量等级组*/}
								</div>
							</div>
							{createEditTable(this.headTableid, {
								showIndex: true,
								showCheck: this.state.headShowCheck,
								selectedChange: buttonControl.bind(this),
								adaptionHeight: true,
								onRowClick: onRow_BtnClick.bind(this)
							})}
						</div>
						<div className="table-area right-table-area">
							<div className="table-header">
								<div className="table-title nc-theme-title-font-c">
									{getLangByResId(this, '1014QUALITYLEVEL-000012') /* 国际化处理： 等级列表*/}
								</div>
								<div className="right-table-buttons">
									{this.props.button.createButtonApp({
										area: BUTTON.list_body,
										onButtonClick: onBody_BtnClicks.bind(this),
										ignoreHotkeyCode: getListDisableHotKeyBtn()
									})}
								</div>
							</div>
							<div className="right-table">
								{createEditTable(this.bodyTableid, {
									showIndex: true,
									isAddRow: true,
									showCheck: this.state.bodyShowCheck,
									addRowCallback: addRow_BtnClick.bind(this, this.props),
									adaptionHeight: true,
									selectedChange: buttonControl.bind(this)
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
List = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: AREA.pageArea,
		bodycode: {
			[AREA.headTableArea]: 'editTable',
			[AREA.bodyTableArea]: 'editTable'
		}
	},
	orderOfHotKey: [ AREA.headTableArea, AREA.bodyTableArea ]
})(List);
ReactDOM.render(<List />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65