/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, getMultiLang, ajax, base, high, cardCache, toast, createPageIcon } from 'nc-lightapp-front';
import { constant, requesturl } from '../config/config';
import { buttonClick, initTemplate, searchBtnClick, pageInfoClick, tableModelConfirm, setButtonUsability } from './events';
import PayBuluForm from'../../../../obm/ebankbulu/bulu/form/index';
import NCCOriginalBalance from'../../../public/restmoney/list/index';
import { sourceModel_CMP, SHOWMODEL_BULU, SHOWMODEL_LIULAN, SHOWMODEL_ZHIFU, commondata } from'../../../public/utils/constant'
import { BatchToast } from '../../../public/CMPMessage';
import Sign from '../../../../tmpub/pub/util/ca';
import { saveMultiLangRes } from '../../../../tmpub/pub/util';
let { NCTabsControl,NCButton, NCDiv} = base;
let {setDefData, getDefData,hasCacheData } = cardCache;
const { NCUploader, BillTrack, PrintOutput  } = high;

class List extends Component {
	constructor(props) {
		super(props);
		this.moduleId = constant.mutiLangCode;
		this.pagecode = constant.advancesearch_list_pagecode;
		this.searchId = constant.searchcode; 
		// initTemplate.call(this, props);
		this.state = {
			json: {},
			inlt: null
		}
	}

	//操作列多语不显示
	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				//console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
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
		let { search, BillHeadInfo } = this.props;
	
		let { NCCreateSearch } = search;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				{/** 渲染标题栏 **/}
                <NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo(
							{
								title: this.state.json['36070TBR-000023'],
								// loadMultiLang(this.props, '36070DC-000018'),//国际化处理： 划账结算
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