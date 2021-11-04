//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,toast,createPageIcon,cardCache } from 'nc-lightapp-front';
let {  NCBackBtn } = base;
import { buttonClick, initTemplate, afterEvent } from './events';
let { getCacheById, updateCache } = cardCache

import './index.less';
//let dataSource = 'uapbd.formatdocdata.cache';
class Card extends Component {

	constructor(props) {
		super(props);
		this.formId = 'formatdocform';
		this.tableId = 'formatdoccard';
		this.status = props.getUrlParam('status');
		// this.props.form.setFormStatus('exsystem', this.status);
		this.setButtonStatus();
		this.id = props.getUrlParam('pk');
		if (this.status != 'add') {
			this.getData();
		} else {
			this.setButtonStatus();
			this.props.form.setFormStatus('formatdocform', 'add');
			this.props.editTable.setStatus('formatdoccard', 'edit');
		}
		this.state = {
			backbtnstatus: (this.props.getUrlParam('status') != 'browse') ? 'none' : '',
			json: {},
			inlt: null
		};

	}

	componentDidMount() {
	}

	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			if (status) {
				this.setState({ json, inlt });// 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源');   // 未请求到多语资源的后续操作
			}
		}
		this.props.MultiInit.getMultiLang({ 'moduleId': 'xi-exsystem-card', 'domainName': 'uap', callback });
	}

	getData = () => {
		if(this.props.getUrlParam('pk') == null){
			this.props.button.setButtonsVisible({
				add: true,
				editor: false,
				del: false,
				save: false,
				cancel: true
			});
			this.props.button.setDisabled({
				add: false,
				editor: true,
				del: true
			});
			return;
		}
		let _this=this;
		let data = { pk: this.props.getUrlParam('pk'), pageid: this.props.getUrlParam('pageid') };
		debugger;
		ajax({
			url: '/nccloud/uapbd/formatdoc/cardquery.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (_this.status == 'add') {
					addCache('pk_formatdoc', res.data, 'formatdocdata', dataSource);
				}
				
				if (res.success) {
					 
					_this.setButtonStatus();
					_this.props.form.setAllFormValue({'formatdocform': data.formatdocform.formatdocform});
					// _this.props.editTable.setTableData('formatdoccard', data && data.formatdoccard ? data.formatdoccard['formatdoccard'] : { rows: [] });
					if (_this.status == 'add') {
						_this.props.form.setFormStatus('formatdocform', 'add');
						_this.props.editTable.setStatus('formatdoccard', 'edit');
					} else if (_this.status == 'browse') {
						_this.props.form.setFormStatus('formatdocform', 'browse');
						_this.props.editTable.setStatus('formatdoccard', 'browse');
					} else if (_this.status == 'edit') {
						_this.props.form.setFormStatus('formatdocform', 'edit');
						_this.props.editTable.setStatus('formatdoccard', 'edit');
					}
				}
			}
		});
	}

	getData2 = (pk_exsystem,status) => {
		debugger;
		let _this = this;
		let data = { pk: pk_exsystem };
		ajax({
			url: '/nccloud/uapbd/formatdoc/cardquery.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (res.success) {
					_this.setButtonStatus(status);
					_this.props.form.setAllFormValue({ 'formatdocform': data.formatdocform.formatdocform });
					_this.props.editTable.setTableData('formatdoccard', data && data.formatdoccard ? data.formatdoccard['formatdoccard'] : { rows: [] });
					_this.props.form.setFormStatus('formatdocform', 'browse');
					_this.props.editTable.setStatus('formatdoccard', 'browse');
				}
			}
		});
	}


	setButtonStatus = (status) => {
		this.status = status != null ? status :this.props.getUrlParam('status');
		if (this.status == 'add' || this.status == 'edit') {
			this.props.button.setButtonsVisible({
				add: false,
				editor: false,
				del: false,
				save: true,
				cancel: true,
				print:false,
			});
			// this.props.button.setDisabled({
			// 	addrows: false,
			// 	delrows: false,
			// });
		} else if (this.status == 'browse') {
			this.props.button.setButtonsVisible({
				add: true,
				editor: true,
				del: true,
				save: false,
				cancel: false,
				print:true,
			});
			// this.props.button.setDisabled({
			// 	addrows: true,
			// 	delrows: true,
			// });
		}
	}

	render() {
		let { editTable, form } = this.props;
		let { createForm } = form;
		let { createEditTable } = editTable;
		return (
				<div className="nc-bill-card">
					<div className='nc-bill-header-area'>
						<NCBackBtn style={{ display: this.state.backbtnstatus }} onClick={() => {
							this.props.pushTo('/list');
						}}
						/>
						<div className='header-title-search-area'>
						{createPageIcon()}
							<h2 className='title-search-detail'>数据格式</h2>
						</div>
						<div className='header-button-area'>
							{this.props.button.createButtonApp({
								area: 'header-button-area',
								buttonLimit: 8,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</div>

					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							// onAfterEvent: afterEvent.bind(this),
							// onBeforeEvent: beforeEvent.bind(this)
						})}
					</div>
					<div className="nc-bill-table-area">
						<div className="shoulder-definition-area" style={{ marginRight: '15px' }}>
							<div className="definition-icons" >
								{this.props.button.createButtonApp({
									area: 'page_body',
									buttonLimit: 2,
									onButtonClick: buttonClick.bind(this),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
						</div>
						{createEditTable(this.tableId, {
							//showCheck: true,
							//showIndex: true,
							onAfterEvent: afterEvent.bind(this)
						})}
					</div>
				</div>
			);
	}
}

Card = createPage({
	initTemplate: initTemplate,
})(Card);
export default Card;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65