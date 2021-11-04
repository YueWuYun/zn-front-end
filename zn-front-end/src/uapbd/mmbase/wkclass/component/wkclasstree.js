//Unu+Bj2A2WAK5xKbzwkEohbFCcu8k69ibbKBk3BiVrQnkX0isjbQ4SYj4MbmVSXk
import React, { Component } from 'react';
import { BaseUtils } from '../../../../uapbd/public/utils';

/***********************************************
 *
 * 工作中心分类树
 * @author zhaopeih
 *
 ***********************************************/
class WkClassTree extends Component {
	constructor(props) {
		super(props);
		this.config = this.props.treeConfig || {};
		this.state = {
			selectedNode: null
		};
		/********************外放方法************************/
		//获得选中节点
		this.getSelectedData = this.getSelectedData.bind(this);
	}

	componentWillReceiveProps(newProps) {
		let treeConfig = newProps.treeConfig;
		this.config = treeConfig;
	}

	/**
     * 获得选中的树节点
     * @returns {null|{}}
     */
	getSelectedData() {
		return this.state.selectedNode || {};
	}

	/**
     * 树节点选中事件
     * @param refpk
     */
	onSelectTreeCallBack(refpk) {
		//记录选中节点
		this.state.selectedNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, refpk);
		this.setState(this.state);
		if (BaseUtils.isFunction(this.config.onSelectTree)) {
			this.config.onSelectTree(refpk);
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

	/**
     * 鼠标点击树节点新增图标事件
     * @param node
     */
	clickAddIconEveCallBack(node) {
		//记录选中节点
		this.state.selectedNode = node;
		this.setState(this.state);
		if (BaseUtils.isFunction(this.config.clickAddIconEve)) {
			this.config.clickAddIconEve(node);
		}
	}

	/**
     * 鼠标点击树节点编辑图标事件
     * @param node
     */
	clickEditIconEveCallBack(node) {
		//记录选中节点
		this.state.selectedNode = node;
		this.setState(this.state);
		if (BaseUtils.isFunction(this.config.clickEditIconEve)) {
			this.config.clickEditIconEve(node);
		}
	}

	/**
     * 鼠标点击树节点删除图标事件
     * @param node
     */
	clickDelIconEveCallBack(node) {
		//记录选中节点
		this.state.selectedNode = node;
		this.setState(this.state);
		if (BaseUtils.isFunction(this.config.clickDelIconEve)) {
			this.config.clickDelIconEve(node);
		}
	}

	/**
     * 选择改变事件
     * @param node
     */
	onSelectedChanged(node) {
		if (this.config.hasOwnProperty('onSelectedChanged') && BaseUtils.isFunction(this.config.onSelectedChanged)) {
			if (node.refpk !== this.state.selectedNode.refpk) {
				this.config.onSelectedChange(node);
			}
		}
	}

	render() {
		const { syncTree } = this.props;
		const { createSyncTree } = syncTree; //创建同步树
		return (
			<div className="tree-area">
				{createSyncTree({
					treeId: this.config.treeId, //树组件ID
					needEdit: this.config.needEdit || true, //启用编辑          默认启用
					showLine: this.config.showLine || false, //显示连线          默认不显示
					needSearch: this.config.needSearch || true, //是否需要搜索框     默认需要搜索框
					onSelectEve: this.onSelectTreeCallBack.bind(this), //选择
					onMouseEnterEve: this.onMouseEnterEveCallBack.bind(this),
					clickAddIconEve: this.clickAddIconEveCallBack.bind(this), //新增点击 回调
					clickEditIconEve: this.clickEditIconEveCallBack.bind(this), //编辑点击 回调
					clickDelIconEve: this.clickDelIconEveCallBack.bind(this), // 删除点击 回调
					showModal: this.config.showModal || false, //是否弹层编辑      默认不弹出
					onSelectedChange: this.onSelectedChanged.bind(this),
					disabledSearch: this.config.disabledSearch
				})}
			</div>
		);
	}
}

export default WkClassTree;

//Unu+Bj2A2WAK5xKbzwkEohbFCcu8k69ibbKBk3BiVrQnkX0isjbQ4SYj4MbmVSXk