//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * 计量器具维护
 * @Author: yangls7 
 * @Date: 2019-05-30 15:26:10 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2019-08-28 10:04:59
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { PAGECODE, BUTTONAREA, PAGEAREA, UISTATE, FIELDS } from './constance';
import { initTemplate } from './init';
import { btnClick, searchBtnClick } from './btnClicks';
import MainOrgRef from '../../pub/components/mainOrgRef';
import { getLangByResId, initLang } from '../../pub/tool/multiLangUtil';
import { buttonController } from './viewController';
import { orgAfterEvent, listAfterEvent } from './afterEvents';
import { createListTitle } from '../../pub/tool/titleUtil';
import { listBeforeEvent } from './beforeEvents';
import './index.less';
const { NCCheckbox, NCAffix, NCDiv } = base;

class Mst extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pk_org: { display: '', value: '' }, //主组织
			showSeal: true //是否显示停用
		};
		initLang(this, [ '4001mst' ], 'uapbd', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(PAGEAREA.list);
			if (status == UISTATE.edit) {
				return getLangByResId(this, '4001MST-000023'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	addRowDefaultValue() {
		let pk_org = this.state.pk_org;
		return {
			pk_org,
			enablestate: { display: getLangByResId(this, '4001MST-000000'), value: '2' } /* 国际化处理： 已启用*/
		};
	}

	render() {
		const { editTable, button, search } = this.props;
		const { createEditTable } = editTable;
		const { createButtonApp } = button;
		const { NCCreateSearch } = search;
		let status = this.props.editTable.getStatus(PAGEAREA.list);
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createListTitle(this)}
							{/* 国际化处理：计量器具维护*/}
							<MainOrgRef
								ref="mainOrg"
								placeholder={getLangByResId(this, '4001MST-000025')} /* 国际化处理： 库存组织*/
								refCode={FIELDS.pk_org}
								refPath="org/StockOrgGridRef/index.js"
								disabled={status == UISTATE.edit}
								value={{ refpk: this.state.pk_org.value, refname: this.state.pk_org.display }}
								required={true}
								onChange={orgAfterEvent.bind(this)}
								queryCondition={() => {
									return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
								}}
							/>
							<NCCheckbox
								colors="info"
								checked={this.state.showSeal}
								className="isSealCheckBox"
								disabled={status == UISTATE.edit}
								onChange={() => {
									this.setState({
										showSeal: !this.state.showSeal
									});
								}}
							>
								{getLangByResId(this, '4001MST-000026') /* 国际化处理： 显示停用*/}
							</NCCheckbox>
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: BUTTONAREA.list_head,
								onButtonClick: btnClick.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div
					className="nc-bill-search-area"
					style={{
						display: status === UISTATE.browse ? 'block' : 'none'
					}}
				>
					{NCCreateSearch(PAGEAREA.search, {
						clickSearchBtn: searchBtnClick.bind(this),
						statusChangeEvent: () => {
							//把组织赋值给查询区的组织字段
							this.props.search.setSearchValByField(PAGEAREA.search, FIELDS.pk_org, this.state.pk_org);
							//根据显示停用设置
						}
					})}
				</div>

				<div className="nc-bill-table-area">
					{createEditTable(PAGEAREA.list, {
						showCheck: true,
						showIndex: true,
						adaptionHeight: true,
						isAddRow: true,
						addRowDefaultValue: this.addRowDefaultValue.bind(this),
						onSelected: buttonController.bind(this, this.props),
						onSelectedAll: buttonController.bind(this, this.props),
						onBeforeEvent: listBeforeEvent.bind(this),
						onAfterEvent: listAfterEvent.bind(this),
						pkname: FIELDS.cmeainstruclid
					})}
				</div>
			</div>
		);
	}
}
Mst = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: PAGEAREA.list
	}
})(Mst);
ReactDOM.render(<Mst />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65