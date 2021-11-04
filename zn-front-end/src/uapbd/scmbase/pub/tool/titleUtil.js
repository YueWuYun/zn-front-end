//434658v14a2OY4RYVWsthiZdsbPE2nGrITMrnOnc6q7t5cP+m3bQPoljoy0m2Zxj
/*
 * @PageInfo: 创建APP应用标题工具 
 * @Author: guozhq 
 * @Date: 2019-08-22 08:37:27 
 * @Last Modified by: guozhq
 * @Last Modified time: 2019-08-22 08:42:43
 */

/**
 * 创建列表标题 （默认不带返回按钮）（基于BillHeadInfo）
 * @param {*} _this this
 * @param {*} params 参数对象 默认为 {} ，title 不传默认取应用菜单名称
 */
export function createListTitle(_this, params = {}) {
	let { BillHeadInfo } = _this.props;
	const { createBillHeadInfo } = BillHeadInfo;
	return createBillHeadInfo({
		...params,
		title: getAPPTitle(_this, params.title),
		initShowBackBtn: false
	});
}

/**
 * 创建卡片标题（基于BillHeadInfo）
 * @param {*} _this this
 * @param {*} params 参数对象 默认为 {} ，title 不传默认取应用菜单名称
 */
export function createCardTitle(_this, params = {}) {
	let { BillHeadInfo } = _this.props;
	const { createBillHeadInfo } = BillHeadInfo;
	return createBillHeadInfo({
		...params,
		title: getAPPTitle(_this, params.title)
	});
}

function getAPPTitle(_this, title) {
	if (title) {
		return title;
	} else {
		// 取菜单标题
		return _this.props.getSearchParam('n');
	}
}

//434658v14a2OY4RYVWsthiZdsbPE2nGrITMrnOnc6q7t5cP+m3bQPoljoy0m2Zxj