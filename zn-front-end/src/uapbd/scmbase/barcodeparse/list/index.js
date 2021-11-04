//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: qiaobb 
 * @PageInfo: 物料编码解析  
 * @Date: 2019-03-22 13:30:24 
 * @Last Modified by: qiaobb
 * @Last Modified time: 2019-08-27 15:04:29
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, createPageIcon, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { btnClick } from './btnClicks';
import MainOrgRef from '../../pub/components/mainOrgRef';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import { BUTTONID, AREA, UISTATE, URL, FIELD, BUTTON_AREA, PAGECODE } from '../constance';
import { createListTitle } from '../../pub/tool/titleUtil';
import { btnStatusToggle } from './events';
import './index.less';
const { ExcelImport } = high;
const { NCAffix } = base;
class BarCodeParse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mainorg: {},
			selectedPKS: null,
			vos: null
		};
		initLang(this, [ '4017barcodeparse' ], 'uapbd', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(AREA.tableArea);
			if (status == 'edit') {
				return getLangByResId(this, '4017BARCODEPARSE-000002'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	onChange = (refValue) => {
		let pk_org = refValue.refpk;
		let orgValue = refValue.refname;
		this.setState({ mainorg: { refpk: pk_org, refname: orgValue } });
		if (pk_org) {
			this.props.button.setDisabled({ [BUTTONID.add]: false });
		}
	};

	render() {
		let { editTable, button, search, form, modal } = this.props;
		let { createEditTable } = editTable;
		let { createButtonApp } = button;
		const { NCDiv } = base;
		return (
			<div className="nc-single-table">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						<MainOrgRef
							refName={getLangByResId(this, '4017BARCODEPARSE-000003')} /* 国际化处理： 库存组织*/
							refPath="org/StockOrgGridRef/index.js"
							placeholder={getLangByResId(this, '4017BARCODEPARSE-000003')} /* 国际化处理： 库存组织*/
							ref="mainorg"
							required={true}
							queryGridUrl={'/nccloud/uapbd/org/StockOrgGridRef.do'}
							value={this.state.mainorg}
							queryCondition={() => {
								return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
							}}
							onChange={this.onChange}
							isShowDisabledData={true}
						/>
					</div>

					<div className="header-button-area">
						{createButtonApp({
							area: BUTTON_AREA.list_head,
							onButtonClick: btnClick.bind(this)
							// onAfterEvent: searchAfterEvent.bind(this)
						})}
					</div>
					<ExcelImport
						{...Object.assign(this.props)}
						moduleName="uapbd" //模块名
						billType="barcodeparse" //单据类型
						selectedPKS={this.state.selectedPKS}
						vos={this.state.vos}
						appcode="401700412"
						pagecode="401700412_list"
					/>
				</NCDiv>
				<div className="nc-singleTable-table-area">
					{createEditTable(AREA.tableArea, {
						showCheck: true,
						showIndex: true,
						adaptionHeight: true,
						onSelected: btnStatusToggle.bind(this),
						onSelectedAll: btnStatusToggle.bind(this)
					})}
				</div>
			</div>
		);
	}
}

BarCodeParse = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: {
			[AREA.tableArea]: 'editTable'
		}
	}
})(BarCodeParse);

ReactDOM.render(<BarCodeParse />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65