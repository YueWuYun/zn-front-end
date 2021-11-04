//C5jwNBnugq1v2iFJc3EUmteEobSm25UXh7fN+7QN3SlZfBOVNfTmPFjPtHTYeA1c
import React, { Component } from 'react';
import { BaseUtils } from '../../../../uapbd/public/utils';

/***********************************************
 *
 * 工作中心分类树
 * @author liuyanp
 *
 ***********************************************/
class BomTree extends Component {
	constructor(props) {
		super(props);
		this.config = this.props.treeConfig || {};
		this.state = {
			selectedNode: null
		};
	}

	componentWillReceiveProps(newProps) {
		let treeConfig = newProps.treeConfig;
		this.config = treeConfig;
	}

	/**
     * 树节点点击事件
     * @param refpk
     */
	onSelectTreeCallBack(refpk, curNode, isCheck, node) {
		if (BaseUtils.isFunction(this.config.onSelectTree)) {
			this.config.onSelectTree(refpk, curNode, isCheck, node);
		}
	}

	/**
     * 鼠标滑过树节点事件
     * @param key
     */
	onMouseEnterEveCallBack(key, node) {
		if (BaseUtils.isFunction(this.config.onMouseEnterEve)) {
			this.config.onMouseEnterEve(key, node);
		}
	}

	render() {
		const { syncTree } = this.props;
		const { createSyncTree } = syncTree; //创建同步树
		return (
			<div className="tree-area">
				{createSyncTree({
					treeId: this.config.treeId, //树组件ID
					needEdit: this.config.needEdit, //启用编辑          默认启用
					showLine: this.config.showLine || false, //显示连线          默认不显示
					needSearch: this.config.needSearch, //是否需要搜索框     默认需要搜索框
					onSelectEve: this.onSelectTreeCallBack.bind(this) ,//点击
					selectedForInit:this.config.selectedForInit.bind(this),
					defaultExpandAll : true
				})}
			</div>
		);
	}
}

export default BomTree;

//C5jwNBnugq1v2iFJc3EUmteEobSm25UXh7fN+7QN3SlZfBOVNfTmPFjPtHTYeA1c