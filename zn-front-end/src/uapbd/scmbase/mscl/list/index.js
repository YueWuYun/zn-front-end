//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * 计量器具级别
 * @Author: zhngzh 
 * @Date: 2019-05-08 13:54:27 
 * @Last Modified by: zhengxinm
 * @Last Modified time: 2020-03-23 14:06:20
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
const { NCAffix, NCDiv, NCCheckbox } = base;
import { PAGECODE, BUTTONAREA, PAGEAREA, UISTATE, FIELDS } from './constance';
import { initTemplate } from './init';
import { btnClick } from './btnClicks';
import { buttonController } from './viewController';
import { getLangByResId, initLang } from '../../pub/tool/multiLangUtil';
import MainOrgRef from '../../pub/components/mainOrgRef';
import { commonSearch } from './btnClicks';
import { orgAfterEvent } from './afterEvents';
import { createListTitle } from '../../pub/tool/titleUtil';
class Mscl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pk_org: { display: '', value: '' }, //主组织
			showStop: false, //显示停用
			disabled: false //显示停用是否可用
		};
		initLang(this, [ '4001mscl', '4001mst' ], 'uapbd', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(PAGEAREA.list);
			if (status == UISTATE.edit) {
				return getLangByResId(this, '4001MSCL-000011'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	/**
	 * 整行默认值
	 */
	addRowDefaultValue() {
		let pk_org = this.state.pk_org;
		return {
			pk_org,
			enablestate: { display: getLangByResId(this, '4001MSCL-000000'), value: '2' } /* 国际化处理： 已启用*/
		};
	}
	//显示停用改变
	changeCheck = (value) => {
		this.state.showStop = value;
		commonSearch.call(this, this.props);
	};
	render() {
		const { editTable, button } = this.props;
		const { createEditTable } = editTable;
		const { createButtonApp } = button;
		let status = this.props.editTable.getStatus(PAGEAREA.list);
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createListTitle(this)}
							<MainOrgRef
								ref="mainOrg"
								placeholder={getLangByResId(this, '4001MSCL-000013')} /* 国际化处理： 库存组织*/
								refCode={FIELDS.pk_org}
								refPath="org/StockOrgGridRef/index.js"
								queryGridUrl={'/nccloud/uapbd/org/StockOrgGridRef.do'}
								disabled={status == UISTATE.edit}
								value={{ refpk: this.state.pk_org.value, refname: this.state.pk_org.display }}
								refName={getLangByResId(this, '4001MSCL-000013')} /* 国际化处理： 库存组织*/
								required={true}
								onChange={orgAfterEvent.bind(this)}
								queryCondition={() => {
									return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
								}}
							/>
							<div className="title-search-detail">
								<NCCheckbox
									disabled={this.state.disabled}
									onChange={this.changeCheck}
									checked={this.state.showStop}
								>
									{getLangByResId(this, '4001MST-000026') /* 国际化处理： 显示停用*/}
								</NCCheckbox>
							</div>
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: BUTTONAREA.list_head,
								onButtonClick: btnClick.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-table-area">
					{createEditTable(PAGEAREA.list, {
						showCheck: true,
						showIndex: true,
						isAddRow: true,
						addRowDefaultValue: this.addRowDefaultValue.bind(this),
						adaptionHeight: true,
						onSelected: buttonController.bind(this, this.props, true),
						onSelectedAll: buttonController.bind(this, this.props, true),
						pkname: FIELDS.cmeainstruclid
					})}
				</div>
			</div>
		);
	}
}
Mscl = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: PAGEAREA.list
	}
})(Mscl);
export default Mscl;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65