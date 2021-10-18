/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import  { constant }  from '../config/config';
import {  initTemplate } from './events';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
const { NCDiv } = base;
class List extends Component {
	// 构造器
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pagecode = constant.advancesearch_list_pagecode;
		this.searchId = constant.searchcode;
		// initTemplate.call(this, props);
		this.state = {
			json: {}, // 多语
			inlt: null
		};
	}

	// 
	componentWillMount() {

		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
			}
		}
		// getMultiLang({ moduleId: constant.mutiLangCode, domainName: 'cmp', callback });
		getMultiLang({ 
			moduleId: {
			[constant.module_tmpub_name]: [constant.module_tmpub_id],
			[constant.module_name]: [constant.module_id,constant.mutiLangCode]
			}, 
		callback });
	}



	render() {
		let { search,BillHeadInfo } = this.props;
		let { NCCreateSearch } = search;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.state.json['36070WC-000019'],
								// loadMultiLang(this.props, '36070DC-000018'),//国际化处理： 现金支取
								initShowBackBtn: false
							}
						)}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						showAdvBtn: true, // 显示高级按钮
						searchBtnName: '高级',
						onlyShowAdvArea: true
					})}
				</div>
			</div>
		);
	}
}

List = createPage({
	// initTemplate: initTemplate,
	// mutiLangCode: constant.mutiLangCode
})(List);

ReactDOM.render(<List />, document.querySelector('#app'));
// export default List;

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/