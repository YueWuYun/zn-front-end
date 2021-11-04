//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/* 
 * 价格模板
 * @Author: zhaopym 
 * @Date: 2019-03-01 13:30:26 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2019-08-28 10:06:58
 */


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, createPageIcon, base } from 'nc-lightapp-front';
import { AREA, PAGECODE, ACTION_URL, STATUS, SAVE_TYPE } from '../constants';
import { initTemplate } from './init';
import { cardCache } from 'nc-lightapp-front';
import { buttonClick, leftSelectClick } from './btnClick';
import { getQueryData } from './common';
import { afterEvent } from './afterEvent';
import { getLangByResId, initLang } from '../../pub/tool/multiLangUtil';
import { headBeforeEvent } from './beforeEvent';
import { setButtonEnable } from '../viewController';
const { getDefData } = cardCache;
const { NCAffix, NCDiv } = base;
import { createListTitle } from '../../pub/tool/titleUtil';

class PriceTemplate extends Component {
	constructor(props) {
		super(props);
		initLang(this, [ '4004pricetemplet' ], 'uapbd', initTemplate.bind(this, this.props));
		this.state = {};
		this.UIStatus = STATUS.browse; //页面是编辑态还是浏览态的全局变量
		this.enableRefresh = false; //控制刷新按钮是否可用
		this.saveAction = ACTION_URL.save; //控制着保存按钮触发时发请求的url
		this.selectIndex = 0; // 单击表头行是选中行的索引
		this.updateIndex = 0; // 要保存的数据的表头行索引
	}
	componentDidMount() {
		getQueryData(this.props);
	}
	// 渲染页面前，执行
	componentWillMount() {
		debugger;
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.UIStatus || STATUS.browse;
			if (status == STATUS.edit) {
				return getLangByResId(this, '4004PRICETEMPLET-000012'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	headRowClick(props, moduleId, record, index, e) {
		// 编辑态点击事件失效
		if (STATUS.edit === this.UIStatus) {
			props.editTable.focusRowByIndex(AREA.table_head, this.updateIndex);
			return;
		}
		this.selectIndex = index;
		let pk_pricetemplet = record.values.pk_pricetemplet;
		if (pk_pricetemplet) {
			let bodyRows = getDefData(pk_pricetemplet.value, 'scm.ct.priceTemplate.bodyData');
			let newBodyRows = JSON.parse(JSON.stringify(bodyRows));
			props.editTable.setTableData(AREA.table_body, { rows: newBodyRows });
		}
	}
	onRowDoubleClick(record, index, props, e) {
		// 编辑态点击事件失效
		if (STATUS.edit === this.UIStatus) {
			props.editTable.focusRowByIndex(AREA.table_head, this.updateIndex);
			return;
		}
	}
	render() {
		let { editTable, DragWidthCom } = this.props;
		let { createEditTable } = editTable;
		return (
			<div className="nc-bill-list" id="costfactor-page">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						<h2 className="title-search-detail">{createListTitle(this)}</h2>
						{/*国际化处理： 价格模板*/}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: AREA.table_head,
							onButtonClick: buttonClick.bind(this)
						})}
					</div>
				</NCDiv>
				<DragWidthCom
					defLeftWid={'65%'}
					leftMinWid={'50%'}
					leftDom={createEditTable(AREA.table_head, {
						showIndex: true,
						showCheck: true,
						onRowClick: this.headRowClick.bind(this),
						onRowDoubleClick: this.onRowDoubleClick.bind(this),
						adaptionHeight: true,
						// onAfterEvent: afterEvent.bind(this)
						selectedChange: setButtonEnable.bind(this, this.props),
						onBeforeEvent: headBeforeEvent.bind(this)
					})}
					rightDom={createEditTable(AREA.table_body, {
						//handlePageInfoChange: pageInfoClick,
						showIndex: true,
						onAfterEvent: afterEvent.bind(this),
						adaptionHeight: true
						// onBeforeEvent: bodybeforeEvent.bind(this)
					})}
				/>
			</div>
		);
	}
}
PriceTemplate = createPage(
	//上下表平台的元数据关联性有问题，我们在编辑后自己调的，这块先这样
	{
		billinfo: {
			billtype: 'grid',
			pagecode: PAGECODE,
			headcode: AREA.table_head,
			bodycode: AREA.table_body
		}
	}
)(PriceTemplate);

ReactDOM.render(<PriceTemplate />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65