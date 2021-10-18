/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React, { Component } from 'react';
import { createPage, ajax, toast, cardCache, deepClone, createPageIcon, base } from 'nc-lightapp-front';
const { NCModal,NCDiv,NCDatePicker } = base;
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, buttonDisable,tableModelConfirm, BeginEndDateModal,TrycalModal } from './events';
import * as CONSTANTS from '../const/constants';
import '../css/index.less';
import './index.less';
import { BusinessOperatorHead } from '../action/interest';
const dateFormat = "YYYY-MM-DD";
let { setDefData, getDefData } = cardCache;
let { dataSource, search_key, tableId, searchId, pageCodeList, moudleId, pkname, Query_URL, TryCalInst_URL, PreCalInst_URL } = CONSTANTS;
import { createListWebSocket } from "../../../../tmpub/pub/util/index";
class List extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.pageCodeList = pageCodeList;
		this.moudleId = moudleId;
		this.pkname = pkname;
		this.operarea = '';
		this.state = {
			showWithholdingModal: false, //显示预提弹窗
			showInterestTrialModal: false, //显示试算弹窗
			showTryCalModal: false, //显示试算结果弹窗
			modalInfo: null, //弹窗信息
			startDate: null, //开始日期
			endDate: null, //结束日期
			trycalData: null,
			isListFresh: false,
			json: {},
			inlt: null
		};
		initTemplate.call(this, props);
	}

	componentWillMount() {
		let callback = (json, status, inlt) => {
			// json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				initTemplate.call(this, this.props, json, inlt); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
			} else {
			}
		};
		this.props.MultiInit.getMultiLang({
			moduleId: ["36360ICI", "3636PUBLIC"],
			domainName: "icdmc",
			callback
		});
	}

	//试算，预提
	handleDateModalConfirm = (key, value) => {
		this.setState(
			{
				startDate: value.beginDate,
				endDate: value.endDate
			},
			() => {
				if (key == "tryIntst") {
					// 试算
					BusinessOperatorHead.call(this, key,
						this.state.json['36360ICI-000012'],
						TryCalInst_URL,
						this.state.json['36360ICI-000013']
					);
				} else {
					// 预提
					BusinessOperatorHead.call(this, key,
						this.state.json['36360ICI-000008'],
						PreCalInst_URL,
						this.state.json['36360ICI-000009']
					);
				}
			}
		);
	};

	refresh = () => {
		let refreshpageInfo = this.props.table.getTablePageInfo(tableId);
		//缓存的查询条件{需要先克隆一下}
		let searchVal = deepClone(getDefData(search_key, dataSource));
		if (!searchVal) {
			searchVal = this.props.search.getAllSearchData(searchId);//查询区条件
			if(!searchVal) return ;
			// 将所有查询条件赋值进缓存[查询的时候已经放入缓存]
			setDefData(search_key, dataSource, searchVal);
		}
		searchVal.pageIndex = 0;
		let oid = this.props.meta.getMeta()[searchId].oid;
		let data = {
			querycondition: searchVal,
			pageInfo: refreshpageInfo,
			pageCode: pageCodeList,
			queryAreaCode: searchId,
			oid: oid,
			querytype: 'tree'
		};
		ajax({
			url: Query_URL,
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data.grid.table.rows.length > 0) {
						this.props.table.setAllTableData(tableId, data.grid[tableId]);
						//toast({ color: 'success' });
						toast({
                            duration: 3,
                            title: this.props.MutiInit.getIntl("36360ICI") && this.props.MutiInit.getIntl("36360ICI").get('36360ICI-000023') /**国际化处理：刷新成功 */,
                            color: 'success'
                        })
					} else {
						this.props.table.setAllTableData(tableId, { rows: [] });
						toast({ color: 'warning', content: this.props.MutiInit.getIntl("36360ICI") && this.props.MutiInit.getIntl("36360ICI").get('36360ICI-000022') });
					}
				}

			}
		});
	}

	closeModal = key => {
		this.setState({
			[key]: false
		});
	};

	render() {
		let { table, button, search, form ,BillHeadInfo,modal} = this.props;
		const { createBillHeadInfo } = BillHeadInfo;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let { createForm } = form;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER}  className="nc-bill-header-area">

					<div className="header-title-search-area">
						{createPageIcon()}
						<h2 className="title-search-detail">{this.props.MutiInit.getIntl("36360ICI") && this.props.MutiInit.getIntl("36360ICI").get('36360ICI-000000')}</h2>
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 2, //默认显示几个查询条件
					})}
				</div>

				 {createListWebSocket(this.props, {
					tableAreaCode: this.tableId,
					tablePkName: 'pk_innerloanpay' ,
                    billtype: '36CY'//,
                    //dataSource: dataSource
				})}

				{/* 表单区 */}
				<div className="nc-bill-table-area">
					{createSimpleTable(tableId, {
						pkname: pkname,
						dataSource: dataSource,
						handlePageInfoChange: pageInfoClick,
						tableModelConfirm: tableModelConfirm,
						onSelected: buttonDisable,
						onSelectedAll: buttonDisable,
						showCheck: true,
						showIndex: true
					})}
				</div>
				{/* 试算弹窗 */}
				<BeginEndDateModal
					showModal={this.state.showInterestTrialModal}
					title={
						this.state.json["36360ICI-000012"]
					} /* 国际化处理： 试算利息*/
					begin={{
						label: this.state.json["36360ICI-000016"]
					}} /* 国际化处理： 试算开始日期*/
					end={{
						label: this.state.json["36360ICI-000017"]
					}} /* 国际化处理： 试算结束日期*/
					onClose={this.closeModal.bind(this, "showInterestTrialModal")}
					onConfirm={val =>
						this.handleDateModalConfirm("tryIntst", val)
					}
					{...this.props}
				/>
				{this.state.trycalData && (
					<TrycalModal
						showModal={this.state.showTryCalModal}
						title={
							this.state.json["36360ICI-000018"]
						} /* 国际化处理： 试算结果*/
						onClose={this.closeModal.bind(this, "showTryCalModal")}
						trycalData={this.state.trycalData}
						modalLink={true}
					/>
				)}
				<NCModal
					show={this.state.showWithholdingModal}
					className="preDateModal"
				>
					<NCModal.Header>
						<NCModal.Title>{this.state.json["36360ICI-000008"]}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body>
						<div >
							{createForm("date", {
							})}
						</div>
					</NCModal.Body>

					<NCModal.Footer>
						{createButtonApp({
							area: 'date',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this)
						})}
					</NCModal.Footer>

				</NCModal>

				{createModal('tryinterest', {
					content: this.trycontent(),
					hasCloseBtn: false,
                    className:'senior'
				})}

				{createModal('tryinterest2', {
					content: this.trycontent2(),
					hasCloseBtn: false,
                    className:'senior'
				})}

			</div>
		);
	}

	trycontent () {
		return (
			<div className="addModal">
				<div style={{ height: '20px' }} />
				<div fieldid="startDate">
				<span className="modal-label">{this.state.json['36360ICI-000016']/**国际化处理：开始日期 */}</span>
				<NCDatePicker
					fieldid="startdate"
					format={dateFormat}
					placeholder={this.state.json['36360ICI-000016']/**国际化处理：开始日期 */}
					value={this.state.startdate}
					onChange={val => this.changeStartDate(val)}
				/>
				</div>
				<div style={{ height: '10px' }} />
				<div fieldid="endDate">
				<span className="modal-label">
					{this.state.json['36360ICI-000017']/**国际化处理：结束日期 */}
				</span>	
				<NCDatePicker
					fieldid="endDate"
					format={dateFormat}
					placeholder={this.state.json['36360ICI-000017']/**国际化处理：结束日期 */}
					value={this.state.enddate}
					onChange={val => this.changeEndDate(val)}
				/>
				</div>
			</div>
		)
	};

	trycontent2 () {
		return (
			<div className="addModal">
				<div style={{ height: '20px' }} />
				<div fieldid="startDate">
				<span className="modal-label">{this.state.json['36360ICI-000016']/**国际化处理：开始日期 */}</span>
				<NCDatePicker
					fieldid="startdate"
					format={dateFormat}
					placeholder={this.state.json['36360ICI-000016']/**国际化处理：开始日期 */}
					value={this.state.startdate}
					onChange={val => this.changeStartDate(val)}
					disabled={true}
				/>
				</div>
				<div style={{ height: '10px' }} />
				<div fieldid="endDate">
				<span className="modal-label">
					{this.state.json['36360ICI-000017']/**国际化处理：结束日期 */}
				</span>	
				<NCDatePicker
					fieldid="enddate"
					format={dateFormat}
					placeholder={this.state.json['36360ICI-000017']/**国际化处理：结束日期 */}
					value={this.state.enddate}
					onChange={val => this.changeEndDate(val)}
				/>
				</div>
			</div>
		)
	};

	changeStartDate = (value) => {
		if (value != this.state.startdate) {
            this.setState({
                startdate: value
            })
		}
	}

	changeEndDate = (value) => {
		if (value != this.state.enddate) {
            this.setState({
                enddate: value
            })
        }
	}
}

List = createPage({
	mutiLangCode: moudleId,
	billinfo: {
		billtype: 'grid',
		pagecode: pageCodeList,
		bodycode: tableId
	}
})(List);

export default List;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/