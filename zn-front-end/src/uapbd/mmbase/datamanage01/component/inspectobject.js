//yHyMsXNCLiDN+DXFi1yqIMJdbZfdEauYPi8LE3984+coPNr+f030S+ZM439i/x+a
import React, { Component } from 'react';
import { BaseUtils } from '../../../../uapbd/public/utils';

/***********************************************
 *
 * 工作中心分类树
 * @author liuyanp
 *
 ***********************************************/
class DataManageTree extends Component {
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
     * 树节点选中事件
     * @param refpk
     */
	onCheckTreeCallBack(props, refpk, data) {
		if (BaseUtils.isFunction(this.config.onCheckTree)) {
			this.config.onCheckTree(props, refpk, data);
		}
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
					checkable: this.config.checkable, //显示复选框
					needEdit: this.config.needEdit, //启用编辑          默认启用
					showLine: this.config.showLine || false, //显示连线          默认不显示
					needSearch: this.config.needSearch, //是否需要搜索框     默认需要搜索框
					onCheckEve: this.onCheckTreeCallBack.bind(this), //选中
					onSelectEve: this.onSelectTreeCallBack.bind(this) //点击
				})}
			</div>
		);
	}
}

export default DataManageTree;

//yHyMsXNCLiDN+DXFi1yqIMJdbZfdEauYPi8LE3984+coPNr+f030S+ZM439i/x+a