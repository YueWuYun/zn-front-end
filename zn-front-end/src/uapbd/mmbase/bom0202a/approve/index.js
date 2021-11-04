//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, print } from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
let { NCFormControl, NCAnchor, NCScrollLink, NCScrollElement, NCAffix } = base;
const { NCTabs, NCCol, NCMessage } = base;
const NCTabPane = NCTabs.NCTabPane;
const formId = 'bomcard_h';
const bommaterial = 'bomcard_b'; //材料
const bomoutputs = 'bomcard_outputs'; //联副产品
const bomuseorg = 'bomcard_useorg'; //分配组织
const pageId = '10140BOMMA_approve'; //页面id
const appcode = '10140BOMMA'; //注册按钮的id
let urls = {
	queryCardDataUrl: '/nccloud/mmbd/bom0202/queryCard.do'
};
import { AREA,URL } from '../../bom0202/constance';

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formConfig: null,
			stated: 'browse',
			json: {},
			inlt: null
		};
		this.initTemplate(this.props, () => {
			let id = this.props.getUrlParam('id');
			this.getData(id);
		});
	}

	initTemplate = (props, callback) => {
		createUIDom(props)(
			{
				pagecode: pageId
			},
			{
				moduleId: '10140BOMM',
				domainName: 'uapbd'
			},
			(data, langData, inlt) => {
				if (langData) {
					this.state.json = langData;
					if (inlt) {
						this.state.inlt = inlt;
					}
				}
				if (data) {
					if (data.template) {
						let meta = data.template;
						props.meta.setMeta(meta);
					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
					}
					callback && callback();
				}
			}
		);
	};
	modifierMeta = (props, meta) => {
		let status = 'browse';
		meta[formId].status = status;
		meta[bommaterial].status = status;
		meta[bomoutputs].status = status;
		meta[bomuseorg].status = status;
		return meta;
	};
	//查询数据
	getData = (id) => {
		//查询单据详情
		let data = { pk: id, pageid: pageId };
		ajax({
			url: urls.queryCardDataUrl,
			data: data,
			success: (res) => {
				if (res.data) {
					this.props.form.setAllFormValue({
						[formId]: res.data.head[formId]
					});
					if (res.data.bodys) {
						this.props.cardTable.setTableData(bommaterial, res.data.bodys[bommaterial]);
						this.props.cardTable.setTableData(bomoutputs, res.data.bodys[bomoutputs]);
						this.props.cardTable.setTableData(bomuseorg, res.data.bodys[bomuseorg]);
						// let data = {
						// 	cbomid: this.props.form.getFormItemsValue(formId, 'cbomid').value
						// };
						// ajax({
						// 	url: URL.queryGrand,
						// 	data: data,
						// 	loading: false,
						// 	success: (res) => {
						// 		if (res && res.data) {
						// 			this.props.cardTable.getAllRows(bommaterial).forEach((row) => {
						// 				if (
						// 					res.data[row.values.cbom_bid.value] &&
						// 					res.data[row.values.cbom_bid.value].bodys
						// 				) {
						// 					row.bomwips = res.data[row.values.cbom_bid.value].bodys.bomwips;
						// 					row.bomrepls = res.data[row.values.cbom_bid.value].bodys.bomrepls;
						// 					row.bompos = res.data[row.values.cbom_bid.value].bodys.bompos;
						// 					row.bomloss = res.data[row.values.cbom_bid.value].bodys.bomloss;
						// 				}
						// 			});
						// 		}
						// 	}
						// });
					}
				} else {
					this.props.form.EmptyAllFormValue(formId);
					this.props.cardTable.setTableData(bommaterial, { rows: [] });
					this.props.cardTable.setTableData(bomoutputs, { rows: [] });
					this.props.cardTable.setTableData(bomuseorg, { rows: [] });
				}
			}
		});
	};

	getTableHead = (buttons, tableId) => {
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableId, {
						iconArr: [ 'close', 'open', 'max', 'setCol' ],
						maxDestAreaId: 'nc-bill-form-area'
					})}
				</div>
			</div>
		);
	};

	buttonClicks(props, id) {
		switch (id) {
			case 'Print':
				{
					let cancontinue = false;
				ajax({
					url: URL.checkpermission,
					async: false,
					data: {
						id: this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value,
						actioncode: 'Edit'
					},
					success: (res) => {
						cancontinue = true
					}, error: (err) => {
						toast({ color: 'danger', content: err.message });
					}
				});
				if (!cancontinue) {
					return
				}
				this.output('print');
				}
				break;
			default:
				break;
		}
	}
	output = (type = '') => {
		let pks = this.props.form.getFormItemsValue(AREA.bomcardh, 'cbomid').value;
		//原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
		if (type != '') {
			//打印
			print('pdf', URL.print, {
				funcode: /*this.props.config.funcode*/ '10140BOMM', //功能节点编码/* 国际化处理： 功能节点编码*/
				nodekey: 'bommprint', //模板节点标识
				oids: [pks],
				outputType: type
			});
		}
	};

	render() {
		let { cardTable,button, form } = this.props;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp , getButtons } = button;

		return (
			<div className="nc-bill-card">
				<NCAffix>
					<div className="nc-bill-header-area">
						<div className="header-title-search-area">
							<h2 className="title-search-detail">
								{this.state.json['110140BOMM3001'] /* 国际化处理： BOM维护*/}
							</h2>
						</div>
						<div className="header-button-area">
						{createButtonApp({
							area: 'header',
							buttonLimit: 3,
							onButtonClick: this.buttonClicks.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
					</div>
				</NCAffix>
				<NCAnchor>
					<NCScrollLink to="head" spy={true} smooth={true} duration={300} offset={-100}>
						<p>{this.state.json['110140BOMM3001'] /* 国际化处理： BOM维护*/}</p>
					</NCScrollLink>
					<NCScrollLink to="bommaterial" spy={true} smooth={true} duration={300} offset={-100}>
						<p>{this.state.json['110140BOMM0160'] /* 国际化处理： 材料*/}</p>
					</NCScrollLink>
					<NCScrollLink to="bomoutputs" spy={true} smooth={true} duration={300} offset={-100}>
						<p>{this.state.json['110140BOMM0028'] /* 国际化处理： 联副产品*/}</p>
					</NCScrollLink>
					<NCScrollLink to="bomuseorg" spy={true} smooth={true} duration={300} offset={-50}>
						<p>{this.state.json['110140BOMM0154'] /* 国际化处理： 分配组织*/}</p>
					</NCScrollLink>
				</NCAnchor>
				<NCScrollElement name="head">
					<div className="nc-bill-form-area">{createForm(formId, {})}</div>
				</NCScrollElement>
				<NCScrollElement name="bommaterial">
					<div className="nc-bill-table-area">
						{createCardTable(bommaterial, {
							// tableHead: this.getTableHead.bind(this, buttons, this.tableId3),
							hideModelSave: true
						})}
					</div>
				</NCScrollElement>
				<NCScrollElement name="bomoutputs">
					<div className="nc-bill-table-area">
						{createCardTable(bomoutputs, {
							// tableHead: this.getTableHead.bind(this, buttons, bomoutputs),
							hideModelSave: true
						})}
					</div>
				</NCScrollElement>
				<NCScrollElement name="bomuseorg">
					<div className="nc-bill-table-area">{createCardTable(bomuseorg, {})}</div>
				</NCScrollElement>
			</div>
		);
	}
}
Card = createPage({})(Card);
ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65