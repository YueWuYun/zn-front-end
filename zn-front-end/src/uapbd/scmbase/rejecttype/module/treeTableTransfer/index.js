//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: yinliang 
 * @PageInfo: 树-表，穿梭框
 * @Date: 2019-03-27 09:26:17 
 * @Last Modified by: zhaoypm
 * @Last Modified time: 2019-09-19 13:59:56
 */
import { Component } from 'react';
import { base } from 'nc-lightapp-front';
import { getLangByResId, initLang } from '../../../pub/tool/multiLangUtil';

import './index.less';
const { NCCheckbox } = base;

/**
 * 这个组件用到的常量，数量不多，就放这里了
 */
const CONSTANCE = {
	AREA: { tree: 'treeTableTransfer_tree', table: 'rigtTable' },
	FIELD: { id: 'refpk', pid: 'pid', code: 'refcode', name: 'refname' },
	OTHER: {
		rootId: '-1',
		add: 'add',
		del: 'del',
		treeTableSelectTree: 'treeTableSelectTree'
	}
};

export default class TreeTableTransfer extends Component {
	constructor(props) {
		super(props);
		this.state = { checked: false };
		initLang(this, [ 'C010rejecttype' ], 'uapbd/scmbase');
		this.root = {
			children: props.treeData.left ? props.treeData.left : [],
			// pid: CONSTANCE.OTHER.rootId,
			isleaf: false,
			refcode: 'jyxm',
			refname: getLangByResId(this, 'C010REJECTTYPE-000010') /* 国际化处理： 检验项目*/,
			refpk: CONSTANCE.OTHER.rootId
		}; // 初始根节点
		this.data = { areacode: CONSTANCE.AREA.table, rows: [] };

		this.tableDataArr = []; // 右边数据的主键数组，关联时只需要将这个数组传到后台即可
		// 拼装一个表结构
		this.table = {
			areaVisible: true,
			code: CONSTANCE.AREA.table,
			isnotmeta: false,
			isunfold: false,
			items: [
				{
					attrcode: CONSTANCE.FIELD.id,
					label: getLangByResId(this, 'C010REJECTTYPE-000011') /* 国际化处理： 主键*/,
					visible: false,
					itemtype: 'input',
					isSort: false
				},
				{
					attrcode: CONSTANCE.FIELD.pid,
					label: getLangByResId(this, 'C010REJECTTYPE-000012') /* 国际化处理： 父主键*/,
					visible: false,
					itemtype: 'input',
					isSort: false
				},
				{
					attrcode: CONSTANCE.FIELD.code,
					label: getLangByResId(this, 'C010REJECTTYPE-000013') /* 国际化处理： 编码*/,
					visible: true,
					width: '200px',
					itemtype: 'input',
					isSort: false,
					render: (text, record, index) => {
						return <span>{record[CONSTANCE.FIELD.code]}</span>;
					}
				},
				{
					attrcode: CONSTANCE.FIELD.name,
					label: getLangByResId(this, 'C010REJECTTYPE-000014') /* 国际化处理： 名称*/,
					visible: true,
					width: '200px',
					itemtype: 'input',
					isSort: false,
					render: (text, record, index) => {
						return <span>{record[CONSTANCE.FIELD.name]}</span>;
					}
				},
				{
					attrcode: 'operation',
					label: getLangByResId(this, 'C010REJECTTYPE-000015') /* 国际化处理： 操作*/,
					visible: true,
					width: '100px',
					isSort: false,
					// fixed: 'right',
					itemtype: 'customer',
					// itemtype: 'input',
					render: (text, record, index) => {
						return (
							// <NCButton onClick={this.delLine.bind(this, record[CONSTANCE.FIELD.id], null)}>
							// 	{'删除'}
							// </NCButton>
							<a
								style={{ cursor: 'pointer' }}
								onClick={() => {
									this.delLine.call(this, record[CONSTANCE.FIELD.id], null);
								}}
							>
								{getLangByResId(this, 'C010REJECTTYPE-000016')}
								{/* 国际化处理： 删除*/}
							</a>
						);
					}
				}
			],
			moduletype: 'table',
			name: getLangByResId(this, 'C010REJECTTYPE-000017') /* 国际化处理： 右边表格*/,
			oid: '123',
			pagination: false
		};

		let meta = this.props.meta.getMeta();
		meta.rigtTable = this.table;
		this.props.meta.setMeta(meta, this.aftetSetMeta.bind(this));
	}

	/**
     * 渲染页面时，初始化数据使用
     */
	aftetSetMeta = () => {
		// 初始化
		this.props.syncTree.setSyncTreeData(CONSTANCE.AREA.tree, [ this.root ]);
		// 默认展开第一级节点
		this.props.syncTree.openNodeByPk(CONSTANCE.AREA.tree, CONSTANCE.OTHER.rootId);

		this.props.table.setAllTableData(CONSTANCE.AREA.table, {
			areacode: CONSTANCE.AREA.table,
			rows: this.props.treeData.right
		});
		// 将表中数据初始化给tableDataArr
		if (this.props.treeData.right && this.props.treeData.right.length > 0) {
			this.data.rows = this.props.treeData.right;
			this.props.treeData.right.map((item) => {
				this.tableDataArr.push(item.values[CONSTANCE.FIELD.id]);
				this.props.setRightOrigins(item.values[CONSTANCE.FIELD.id]);
			});
		}
		// 选中左侧树
		this.props.syncTree.setNodeChecked(CONSTANCE.AREA.tree, this.tableDataArr);
	};

	/**
     * 鼠标悬浮在树上的事件
     * refpk 鼠标悬浮节点的refpk
	 * nodeprops 鼠标悬浮节点的所有数据，以及方法
     * 这个树不需要编辑，所以所有编辑按钮隐藏
     */
	onMouseEnterEve = (refpk) => {
		let iconSet = {
			addIcon: false,
			editIcon: false,
			delIcon: false
		};
		this.props.syncTree.hideIcon(CONSTANCE.AREA.tree, refpk, iconSet);
	};

	/**
     * 右边表格的删行按钮事件
     * refpk 主键
     * index 下标
     */
	delLine = (refpk, index) => {
		if (index != null && index >= 0) {
			// 有下标信息时，直接删除
			this.tableDataArr.splice(index, 1);
			this.data.rows.splice(index, 1);
			// 如果初始时，右边表格中有相应的关联项，再讲删除的数据放入删除关联项的数组中
			if (this.props.rightOrigins.includes(refpk)) {
				this.props.setDelIDs(refpk, CONSTANCE.OTHER.add);
			}
			// 如果添加的关联项目，不是已经关联的，就将删除数据从新增数组中删除，以保证数据的正确性
			if (this.props.addIDs.includes(refpk)) {
				this.props.setAddIDs(refpk, CONSTANCE.OTHER.del);
			}
		} else {
			// 没有下标信息时，遍历删除
			for (let i = 0; i < this.data.rows.length; i++) {
				if (this.data.rows[i].values[CONSTANCE.FIELD.id] == refpk) {
					this.tableDataArr.splice(i, 1);
					this.data.rows.splice(i, 1);
					// 如果初始时，右边表格中有相应的关联项，再讲删除的数据放入删除关联项的数组中
					if (this.props.rightOrigins.includes(refpk)) {
						this.props.setDelIDs(refpk, CONSTANCE.OTHER.add);
					}
					// 如果添加的关联项目，不是已经关联的，就将删除数据从新增数组中删除，以保证数据的正确性
					if (this.props.addIDs.includes(refpk)) {
						this.props.setAddIDs(refpk, CONSTANCE.OTHER.del);
					}
					break;
				}
			}
			this.props.table.setAllTableData(CONSTANCE.AREA.table, this.data);
			this.cancelTreeSelect.call(this);
		}
	};

	/**
	 * 选择节点回调方法，这里执行的是查询选中节点数据的功能，这个方法底层封装了四个参数
	 * refpk 节点的refpk
	 * item 每个节点的数据
	 * isChange 与上次选中是否不同，不同为true，按照现象来说，如果选择相同的节点，这个方法就不会被调用
	 * node 选中节点的信息，各种信息都有
	 * 
	 * 这里这个方法时屏蔽树选中方法，否则，有引起树表左右选中数据不一致的问题
	 */
	selectTree = (refpk, item, isChange, node) => {
		this.onCheckEve.call(this, null, null, {
			checked: false,
			checkedNodes: undefined,
			node: undefined,
			event: CONSTANCE.OTHER.treeTableSelectTree
		});
	};

	/**
     * 选中树复选框的回调
     * props
     * checkedKeys 选中的refpk数组
     * checked 选中状态，true、false
     * checkedNodes 可以获取选中节点的数据
     * node 很多信息，不知道用处
     * event 动作名称，这里是check
     */
	onCheckEve = (props, checkedKeys, { checked, checkedNodes, node, event }) => {
		if (checked) {
			// 选中操作
			if (this.state.checked) {
				let allCheckNodes = [];
				allCheckNodes = this.getAllTreePK(node.props, allCheckNodes);
				allCheckNodes = allCheckNodes.concat(this.tableDataArr);
				// 选中左侧树
				this.props.syncTree.setNodeChecked(CONSTANCE.AREA.tree, allCheckNodes);
			} else {
				this.onCheckEveAfter(node.props);
			}
		} else if (event == CONSTANCE.OTHER.treeTableSelectTree) {
			// 屏蔽树选中方法，否则，有引起树表左右选中数据不一致的问题
			this.cancelTreeSelect.call(this);
		} else {
			/**
             * 取消选中操作 
             * privateRefpk 选中树，本节点的主键
             * childrens 选中树节点的子节点
             * cancelChecks 需要取消选中的子节点的数组
             * 通过获取需要取消选中的子节点主键的数组，通过删行方法将数据从table中删除，并且取消左边树的选中状态
             */
			let childrens = node.props.children;
			let cancelChecks = [];
			if (this.state.checked && childrens && childrens.length > 0) {
				cancelChecks = this.getAllTreePK(node.props, cancelChecks);
			} else {
				cancelChecks = [ node.props[CONSTANCE.FIELD.id] ];
			}
			cancelChecks.map((item) => {
				let index = this.tableDataArr.indexOf(item);
				if (index > -1) {
					this.delLine.call(this, item, index);
				}
			});
			this.cancelTreeSelect.call(this);
		}
		this.props.table.setAllTableData(CONSTANCE.AREA.table, this.data);
	};
	/**
     * 获取选中树节点的所有子节点
     */
	getAllTreePK = (arrOrigin, arrResult) => {
		arrResult.push(arrOrigin[CONSTANCE.FIELD.id]);
		if (this.state.checked) {
			this.onCheckEveAfter(arrOrigin);
		}
		if (arrOrigin.children && arrOrigin.children.length > 0) {
			arrOrigin.children.map((item) => {
				this.getAllTreePK.call(this, item.props, arrResult);
			});
		}
		return arrResult;
	};

	/**
	 * 左边树选中后事件
	 */
	onCheckEveAfter = (params) => {
		// 不是根节点在进行选中操作
		if (
			!this.tableDataArr.includes(params[CONSTANCE.FIELD.id]) &&
			params[CONSTANCE.FIELD.id] != CONSTANCE.OTHER.rootId
		) {
			let tableData = {
				values: {
					[CONSTANCE.FIELD.id]: '',
					[CONSTANCE.FIELD.code]: '',
					[CONSTANCE.FIELD.name]: ''
				}
			};
			tableData.values[CONSTANCE.FIELD.id] = params[CONSTANCE.FIELD.id];
			tableData.values[CONSTANCE.FIELD.code] = params[CONSTANCE.FIELD.code];
			tableData.values[CONSTANCE.FIELD.name] = params[CONSTANCE.FIELD.name];
			this.tableDataArr.push(params[CONSTANCE.FIELD.id]);
			// 如果右侧初始关联项目中没有新增的数据，再添加到新增的数组中
			if (!this.props.rightOrigins.includes(params[CONSTANCE.FIELD.id])) {
				this.props.setAddIDs(params[CONSTANCE.FIELD.id], CONSTANCE.OTHER.add);
			}
			// 如果删除的关联项目，不是已经关联的，就将新增数据从删除数组中删除，以保证数据的正确性
			if (this.props.delIDs.includes(params[CONSTANCE.FIELD.id])) {
				this.props.setDelIDs(params[CONSTANCE.FIELD.id], CONSTANCE.OTHER.del);
			}
			this.data.rows.push(tableData);
		}
	};

	/**
     * 取消树选中的方法
     */
	cancelTreeSelect = () => {
		this.props.syncTree.setNodeChecked(CONSTANCE.AREA.tree, this.tableDataArr);
	};

	/**
     * 包含所有下级CheckBox，监听改变事件
     * 设置页面样式，CheckBox是否选中的样式
     * 设置选中树之后的操作标志
     */
	changeCheck = () => {
		this.setState({ checked: !this.state.checked });
	};

	render() {
		let { syncTree, table } = this.props;
		const { createSyncTree } = syncTree;
		const { createSimpleTable } = table;
		return (
			<div className="tree_table_transfer">
				{/* 左边区域，包含树和CheckBox */}
				<div className="left-area">
					<div className="nc-theme-common-font-c">{this.props.leftTitle ? this.props.leftTitle : ''}</div>
					<div className="left-area-border">
						{/* 树 */}
						<div className="tree-area">
							{createSyncTree({
								treeId: CONSTANCE.AREA.tree, //树组件id
								needSearch: true, // 是否树上的查询框
								searchType: 'location', // 搜索框查询方式，定位/过滤  location/filtration，默认定位
								onMouseEnterEve: this.onMouseEnterEve.bind(this), // 鼠标悬浮事件
								checkable: true, //是否显示复选框
								onCheckEve: this.onCheckEve.bind(this), //选中复选框的回调
								onSelectEve: this.selectTree.bind(this) //节点点击事件
							})}
						</div>
						{/* CheckBox */}
						<div className="left-checkbox">
							<NCCheckbox
								onChange={this.changeCheck}
								checked={this.state.checked}
								fieldid="rejecttypeCheck_area"
							>
								{getLangByResId(this, 'C010REJECTTYPE-000018')}
								{/* 国际化处理： 包含所有下级*/}
							</NCCheckbox>
						</div>
					</div>
				</div>
				{/* 右边区域，包含表格 */}
				<div className="right-area">
					<div className="nc-theme-common-font-c">{this.props.rightTitle ? this.props.rightTitle : ''}</div>
					{createSimpleTable(CONSTANCE.AREA.table, { height: 310 , cancelCustomRightMenu: true})}
				</div>
			</div>
		);
	}
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65