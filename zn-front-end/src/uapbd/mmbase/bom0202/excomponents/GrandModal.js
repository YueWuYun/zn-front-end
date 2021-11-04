//jadLMtv3VjO2jmNPIm8Ditb436jPWz7wE1v5BnJ89GsAOs033M1LkCZCtgWi9M7V
/*
 * @Author: maopch 
 * @PageInfo:  孙表页面模态框
 * @Date: 2018-05-08 13:18:05 
 * @Last Modified by: maopch
 * @Last Modified time: 2019-02-16 16:07:22
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax } from 'nc-lightapp-front';
let { NCButton: Button, NCModal: Modal, NCHotKeys, NCTooltip } = base;
let { Header, Body, Footer } = Modal;
import {
	URL,
	FIELD,
	PAGECODE,
	AREA
  } from "../constance";
//import { initLang, getLangByResId } from '../../tool/multiLangUtil';
import './GrandModal.less';
export default class GrandModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
		//initLang(this, [ '4001components' ], 'scmpub', () => this.setState(this.state));
	}

	closeModal = () => {
		this.setState({ show: false });
	};

	sureBtnClick = () => {
		const { onHide, onOkBtnClick } = this.props;
		let flag = onOkBtnClick();
		if (flag == null || flag === true) {
			onHide();
		}
	};

	addDefaultBtns = () => {
		const { onHide } = this.props;
		let {
			cardTable,
			form,
			button,
			modal,
			cardPagination,
			table,
			editTable
		  } = this.props;
		  let {
			createCardTable,
			createTabsTable
		  } = cardTable;
		return (
			<div className="buttons">
				<NCTooltip
					placement="top"
					inverse
					overlay={`确定  (${NCHotKeys.USUAL_KEYS
						.NC_MODAL_CONFIRM})`}
					trigger={['hover', 'focus']}
					className="model-helper-overlay"
				>
					<Button className="button-primary" onClick={this.sureBtnClick}>
						{"确定" /*确定*/}(<u>Y</u>)
					</Button>
				</NCTooltip>
				<NCTooltip
					placement="top"
					inverse
					overlay={`取消  (${NCHotKeys.USUAL_KEYS
						.NC_MODAL_CALCEL})`}
					trigger={['focus', 'hover']}
					className="model-helper-overlay"
				>
					<Button onClick={onHide}>
						{"取消" /*取消*/}(<u>N</u>)
					</Button>
				</NCTooltip>
			</div>
		);
	};

	render() {
		const { show, title, headBtn = false, footBtn = true, footLeft, onHide } = this.props;
		let {
			cardTable,
			form,
			button,
			modal,
			cardPagination,
			table,
			editTable
		  } = this.props;
		let {
			createCardTable,
			createTabsTable
		  } = cardTable;
		return (
			<Modal className="modal" show={show} ref={(NCModal) => (this.NCModal = NCModal)}>
				<NCHotKeys
					keyMap={{
						confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
						cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
					}}
					handlers={{
						confirmBtnHandler: () => {
							// 确定按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
							if (this.NCModal && this.NCModal.isTopModal()) {
								console.log('createModal  sureBtnHandler 事件回调', this.NCModal.isTopModal());
								this.sureBtnClick();
							}
						},
						cancelBtnHandler: () => {
							// 取消按钮的事件 增加top的判断避免所有弹窗逻辑都被触发
							if (this.NCModal && this.NCModal.isTopModal()) {
								console.log('createModal cancelBtnHandler 事件回调');
								onHide.call(this);
							}
						}
					}}
					className="simpleModal-hotkeys-wrapper"
					focused={true}
					attach={document.body}
					display="inline-block"
				/>
				<Header>
					<div className="head-title">{title}</div>
					<div className="head-center" />
					<div className="head-buttons">{headBtn && this.addDefaultBtns()}</div>
					<i className="iconfont icon-guanbi" onClick={this.props.onHide} />
				</Header>
				<Body>  <div className="nc-bill-table-area" > {
					createCardTable(AREA.bomcardoutputs, {
						//tableHead: this.getOutputsTableHead.bind(this),
						//onTabChange: this.onTabChange.bind(this),
						// modelSave: this.modelSave.bind(this),
						// onBeforeEvent: this.onCardTableBeforeEvent.bind(this),
						// onAfterEvent: this.onCardTableAfterEvent.bind(this),
						//showIndex: true,
						showCheck: true,
						//sisAddRow: true,
						//addRowCallback: this.addRowEvent.bind(this)
					})
				} </div></Body>
				<Footer>
					<div className="footer-left">{footLeft}</div>
					<div className="footer-center" />
					<div className="footer-right">{footBtn && this.addDefaultBtns()}</div>
				</Footer>
			</Modal>
		);
	}
}

//jadLMtv3VjO2jmNPIm8Ditb436jPWz7wE1v5BnJ89GsAOs033M1LkCZCtgWi9M7V