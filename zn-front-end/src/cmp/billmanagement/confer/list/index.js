/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, getMultiLang, createPageIcon, toast } from 'nc-lightapp-front';
let { Message } = base;
let { NCMessage } = base;
const { NCBreadcrumb } = base;
const { NCDiv } = base;
const NCBreadcrumbItem = NCBreadcrumb.NCBreadcrumbItem;
import { buttonClick, initTemplate, buttonDisable } from './events';
let tableid = 'table';
class ConferTable extends Component {

	constructor(props) {
		super(props);
		this.props = props;
	}

	getButtonNames = (codeId) => {
		if (codeId === 'add' || codeId === 'delete') {
			return 'main-button';
		} else {
			return 'secondary - button';
		}
	};

	//删除单据
	delConfirm = () => {
		const selectedData = this.props.table.getCheckedRows(tableid);
		if (selectedData.length == 0) return;
		let indexArr = [];
		let deleteArr = [];
		selectedData.forEach((val) => {
			let pk;
			let ts;
			ts = val.data.values.ts.value;
			pk = val.data.values.pk_bconfer.value;
			let data = { pk: pk, ts: ts }
			deleteArr.push(data);
			indexArr.push(val.index);
		});
		let data = { deldata: deleteArr };
		let that = this;
		ajax({
			url: '/nccloud/cmp/billmanagement/conferdelete.do',
			data,
			success: function (res) {
				let { success, data } = res;
				if (success) {
					that.props.table.deleteTableRowsByIndex(tableid, indexArr);
					NCMessage.create({ content: that.props.MutiInit.getIntl("360701BCS") && that.props.MutiInit.getIntl("360701BCS").get('360701BCS-000007'), color: 'success', position: 'bottom' });/* 国际化处理： 删除成功*/
				}
			}
		});
	};

	DoubleClick=(record, index,props,e)=> {
		props.pushTo("/card", {
			status: 'browse',
			from: 'list',
			id: record.pk_bconfer.value
		});
	};

	componentWillMount() {
		let callback = (json) => {
			initTemplate.call(this, this.props);
		};
		getMultiLang({ moduleId: '360701BCS', domainName: 'cmp', callback });
	}
	componentDidMount() {
		this.getData();
		this.props.button.setButtonDisabled([
			'delete', 'print'
		], true);
	}
	//请求列表数据
	getData = () => {
		ajax({
			url: '/nccloud/cmp/billmanagement/conferquery.do',
			data: {
				pageid: '360701BCS_L01'
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data && data[tableid]) {
						this.props.table.setAllTableData(tableid, data[tableid]);
						// toast({
						// 	content: this.state.json['360701BCS-000017'],/* 国际化处理： 查询成功！*/
						// 	color: 'success'
						// })
						let message = this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000017') + data[tableid].rows.length + this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000019');
						toast({ 
							// content: this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000017'), 
							content: message,
							color: 'success' 
						});
					} else {
						this.props.table.setAllTableData(tableid, { rows: [] });
					}
				}
			}
		});
	};

	render() {
		let { button, table, ncmodal, BillHeadInfo } = this.props;
		let { createSimpleTable } = table;
		let { createModal } = ncmodal;
		let { createButtonApp } = button;
		let buttons = this.props.button.getButtons();
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area" style={{ borderBottom: 0 }}>
					<div className="header-title-search-area">
						{/* {createPageIcon()}
						<h2 className="title-search-detail">{this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000000')}</h2> */}
						{createBillHeadInfo(
							{
								title: this.props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000000'),//标题
								initShowBackBtn: false
							}
                        )}
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
				<div className="nc-bill-table-area">
					{createSimpleTable(tableid, {//列表区
						showCheck: true,
						showIndex: true,
						onSelected: buttonDisable.bind(this),
						onSelectedAll: buttonDisable.bind(this),
						onRowDoubleClick:  this.DoubleClick.bind(this),//双击事件
					})}
				</div>
			</div>
		);
	}
}

ConferTable = createPage({
	initTemplate: initTemplate,
	mutiLangCode: '360701BCS'
})(ConferTable);

export default ConferTable;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/