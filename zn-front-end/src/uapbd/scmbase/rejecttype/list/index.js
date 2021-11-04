//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
 * @Author: yinliang 
 * @PageInfo: 质量不合格类型
 * @Date: 2019-03-15 10:52:28 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2020-03-06 10:35:04
 */
import React, { Component } from 'react';
import { createPage, ajax, base } from 'nc-lightapp-front';
import { showSuccessInfo, showSingleDeleteDialog } from '../../pub/tool/messageUtil';
import { initTemplate } from './init';
import { btnClickController, buttonController } from './viewController';
import { PAGECODE, AREA, OTHER, UISTATE, URL, BUTTONID, FIELD } from '../constance';
import TreeTableTransfer from '../module/treeTableTransfer';
import { formAfterEvent } from './afterEvents';
import { getLangByResId, initLang } from '../../pub/tool/multiLangUtil';
import { createListTitle } from '../../pub/tool/titleUtil';

import './index.less';
let { NCAffix, NCDiv, EmptyAreaTip } = base;

class Rejecttype extends Component {
	constructor(props) {
		super(props);
		// state中的status属性，目前只是控制树上面的搜索框是否可用的标志，编辑态，不可用。
		this.state = { status: UISTATE.browse, cardEmpty: true };
		initLang(this, [ 'C010rejecttype' ], 'uapbd/scmbase', initTemplate.bind(this, this.props));
		this.root = {
			children: [],
			pid: OTHER.rootId, // 这个属性本来可以没有，同步树组件会自动给树节点添加根节点的PID，但是这个是个虚根，如果不加这个，搜索的时候，和收起整个树
			isleaf: false,
			refcode: 'zlbhglx',
			refname: getLangByResId(this, 'C010REJECTTYPE-000019') /* 国际化处理： 质量不合格类型 */,
			refpk: OTHER.rootId
		}; // 初始根节点
		this.selectTreePID = ''; // 当前树节点PID缓存，用于新增保存后定位树节点，进行展开树的操作
		this.changePIDFlag = false; // 修改上级检验项目的标志true-修改，false-未修改，用于修改保存，如果对上级检验项目进行了操作，需要刷新树，修改名称、编码也是需要刷新树的
		this.treeData = { left: {}, right: {} }; //这个是关联按钮使用的树结构，是查询的检验项目的树结构
		this.allTreePKs = []; // 树所有节点的pk
		this.formDataCache = undefined; // form表单数据缓存，用于取消后页面的展示
		this.addIDs = []; // 关联，弹窗右侧新增的关联项
		this.delIDs = []; //关联，弹窗右侧删除的关联项
		this.rightOrigins = []; //关联，弹窗弹出时，初始的关联项
	}

	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(AREA.head);
			if (status == UISTATE.add || status == UISTATE.edit) {
				return getLangByResId(this, 'C010REJECTTYPE-000002'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	/**
	 * 获取树数据
	 * refresh 刷新标志
	 */
	getTreeDatas = (refresh) => {
		let data = {};
		ajax({
			url: URL.querytree,
			data: data,
			method: 'post',
			success: (res) => {
				if (res.success) {
					// 单据模板用例添加，当查询完成之后，执行以下代码 add by yinl 20180822 begin
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						this.props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					/**
					 * 刷新操作
					 * 清空表单数据，原NC始清空的
					 * 给出提示
					 */
					if (refresh) {
						this.props.form.EmptyAllFormValue(AREA.head);
						showSuccessInfo(getLangByResId(this, 'C010REJECTTYPE-000003')); /* 国际化处理： 刷新成功！*/
					}
					// 将所有的树的主键放在一个数组里，用于删除后自动检索下一条使用
					this.allTreePKs = res.data.allpks;
					let defaultSelectNode = '';
					this.root.children = res.data.tree;
					if (res.data && res.data.tree) {
						defaultSelectNode = this.root.children[0].id;
					}
					this.props.syncTree.setSyncTreeData(AREA.tree, [ this.root ]);
					// 默认展开第一级节点
					this.props.syncTree.openNodeByPk(AREA.tree, OTHER.rootId);
					// 设置按钮状态及页面状态
					buttonController.setButtonStatus.call(this, this.props, UISTATE.browse);
					// 如果有树节点，则查询第一个树节点的数据显示在右边卡片上，并让第一个树节点高亮
					if (defaultSelectNode) {
						this.selectTree(defaultSelectNode);
						this.props.syncTree.setNodeSelected(AREA.tree, defaultSelectNode);
					}
				}
			}
		});
	};

	/**
	 * 鼠标滑过事件
	 * refpk 鼠标悬浮节点的refpk
	 * nodeprops 鼠标悬浮节点的所有数据，以及方法
	 */
	onMouseEnterEve = (refpk, nodeprops) => {
		if (refpk == OTHER.rootId) {
			/**
			 * 根节点，检验项目根节点是个并不是一个数据，只是一个展示的名字，因此只有新增
			 * value中的元素：addIcon(新增),delIcon(删除),editIcon(修改),默认为true显示,隐藏设为false,stopUpIon(显示停用，配'up','down')
			 * root为根节点，没有修改和删除
			 */
			let iconSet = {
				editIcon: false,
				delIcon: false
			};
			this.props.syncTree.hideIcon(AREA.tree, refpk, iconSet);
		} else if (
			refpk != OTHER.rootId &&
			nodeprops &&
			nodeprops[OTHER.children] &&
			nodeprops[OTHER.children].length > 0
		) {
			/**
			 * 非检验项目的节点，如果包含子节点，则不允许删除
			 * addIcon(新增),delIcon(删除),editIcon(修改),默认为true显示,隐藏设为false,stopUpIon(显示停用，配'up','down')
			 */
			let iconSet = {
				delIcon: false
			};
			this.props.syncTree.hideIcon(AREA.tree, refpk, iconSet);
		} else if (refpk != OTHER.rootId && nodeprops && !nodeprops[OTHER.children]) {
			/**
			 * 末级叶子节点全部展示
			 * addIcon(新增),delIcon(删除),editIcon(修改),默认为true显示,隐藏设为false,stopUpIon(显示停用，配'up','down')
			 */
			let iconSet = {
				addIcon: true,
				editIcon: true,
				delIcon: true
			};
			this.props.syncTree.hideIcon(AREA.tree, refpk, iconSet);
		}
	};

	/**
	 * 选择节点回调方法，这里执行的是查询选中节点数据的功能，这个方法底层封装了四个参数
	 * refpk 节点的refpk
	 * item 每个节点的数据
	 * isChange 与上次选中是否不同，不同为true，按照现象来说，如果选择相同的节点，这个方法就不会被调用
	 * node 暂时没有发现用处
	 */
	selectTree = (refpk, callback) => {
		// 需要控制关联、打印按钮的可用性
		if (refpk == OTHER.rootId) {
			/**
			 * 控制打印按钮、关联按钮不可用
			 * 选中虚根节点时，需要清空表单数据
			 * 表单区缓存清空
			 */
			this.props.button.setButtonDisabled([ BUTTONID.Relation, BUTTONID.Print ], true);
			this.props.form.EmptyAllFormValue(AREA.head);
			this.formDataCache = undefined; // form表单数据缓存，用于取消后页面的展示
		} else {
			this.props.button.setButtonDisabled([ BUTTONID.Relation, BUTTONID.Print ], false);
			let metaTemp = this.props.meta.getMeta();
			// let data = `{${OTHER.id}:${refpk},${OTHER.pagecode}:${metaTemp.code},${OTHER.templetid}:${metaTemp.pageid}}`;
			let data = { [OTHER.id]: refpk, [OTHER.pagecode]: metaTemp.code, [OTHER.templetid]: metaTemp.pageid };
			ajax({
				url: URL.querynode,
				data: data,
				method: 'post',
				success: (res) => {
					if (res.success) {
						this.props.form.setFormItemsValue(AREA.head, res.data.head.rows[0].values);
						this.formDataCache = res.data.head.rows[0].values;
						this.setState({ cardEmpty: false });
						if (typeof callback == 'function') {
							callback.call(this);
						}
					}
				}
			});
		}
	};

	/**
	 * 新增图标点击事件
	 * item 点击新增之后，点击节点的所有数据
	 */
	addClickEve = (item) => {
		this.setState({ status: UISTATE.add, cardEmpty: false }); // 点击新增之后，需要设置cardEmpty为false
		/**
		 * form动作，清空form数据，并改变其状态为新增态
		 */
		buttonController.setButtonStatus.call(this, this.props, UISTATE.add);

		/**
		 * 补充信息，这里只补充“上级质量不合格类型”
		 * 选中树枝节点点新增，表示在这个节点下增加子节点
		 * 新增的节点的“上级质量不合格类型”就是该节点的信息
		 */
		let pid = item.id;
		let name = item.refname;
		if (pid && pid != OTHER.rootId) {
			this.props.form.setFormItemsValue(AREA.head, {
				[FIELD.pid]: { value: pid, display: name }
			});
		}

		// 当前树节点ID缓存，用于新增保存后定位树节点
		this.selectTreePID = pid ? pid : OTHER.rootId;
	};

	/**
	 * 修改图标点击事件，先校验数据是否被引用，如果被引用直接提示，不可修改
	 * item 点击修改之后，点击节点的所有数据
	 */
	editClickEve = (item) => {
		let id = item[OTHER.id];
		let ts = item[FIELD.ts];
		let data = {
			[OTHER.id]: id, // 主键
			[FIELD.ts]: ts // 时间戳
		};
		ajax({
			url: URL.edit,
			data: data,
			method: 'post',
			success: (res) => {
				if (res.success) {
					/**
					 * 1、获取选中节点的ID
					 * 2、获取form中的主键
					 * 这两个属性如果不同，则说明form中的数据不是同一条数据，需要重新查询一下数据
					 */
					let id = item.id;
					let formID = this.props.form.getFormItemsValue(AREA.head, FIELD.id);
					if (id != formID) {
						this.selectTree.call(this, id, this.editClickEveFunction.bind(this));
					} else {
						editClickEveFunction.call(this);
					}
					this.setState({ status: UISTATE.edit });
				}
			}
		});
	};

	/**
	 * 修改按钮调用的方法
	 */
	editClickEveFunction = () => {
		/**
		 * form动作，清空form数据，并改变其状态为新增态
		 */
		buttonController.setButtonStatus.call(this, this.props, UISTATE.edit);
	};

	/**
	 * 删除图标点击事件
	 * item 点击删除之后，点击节点的所有数据
	 */
	delClickEve = (item) => {
		// 删除提示框
		showSingleDeleteDialog({
			beSureBtnClick: () => {
				/**
				 * 组装删除需要的数据，id和ts，如果没有ts，后台直接删除
				 */
				let id = item[OTHER.id];
				let ts = item[FIELD.ts];
				let refpk = item[OTHER.refpk];

				// 获取下一条数据的主键
				let nextid = OTHER.rootId;
				let index = this.allTreePKs.indexOf(id);
				if (this.allTreePKs[index + 1]) {
					nextid = this.allTreePKs[index + 1];
				} else if (this.allTreePKs[index - 1]) {
					nextid = this.allTreePKs[index - 1];
				}

				// 获取页面模板信息，用于后台翻译
				let metaTemp = this.props.meta.getMeta();
				let pagecode = metaTemp.code;
				let templetid = metaTemp.pageid;

				let data = {
					[OTHER.id]: id, // 主键
					[FIELD.ts]: ts, // 时间戳
					[OTHER.nextid]: nextid, // 删除成功之后检索的下一条数据的主键
					[OTHER.pagecode]: pagecode, // 页面编码
					[OTHER.templetid]: templetid // 页面ID
				};
				ajax({
					url: URL.delete,
					data: data,
					method: 'post',
					success: (res) => {
						if (res.success) {
							/**
							 * 删除节点
							 */
							this.props.syncTree.delNodeSuceess(AREA.tree, refpk);
							// 默认展开之前展开的节点
							this.props.syncTree.openNodeByPk(AREA.tree, nextid);

							// 删除全pk数组中的数据
							this.allTreePKs.splice(index, 1);
							// 将查询回来的下一条数据渲染在界面上
							if (
								res.data &&
								res.data.head &&
								res.data.head.rows &&
								res.data.head.rows[0] &&
								res.data.head.rows[0].values
							) {
								this.props.form.setFormItemsValue(AREA.head, res.data.head.rows[0].values);
								/**
								 * 选中变化的树节点，给一个高亮的样式，方便用户直接找到操作节点的位置
								 */
								this.props.syncTree.setNodeSelected(
									AREA.tree,
									res.data.head.rows[0].values[FIELD.id].value
								);
							} else {
								// 当删除后没有树节点数据时，卡片区域展示初始的新增按钮
								this.setState({ cardEmpty: true });
							}
							// 提示
							showSuccessInfo(getLangByResId(this, 'C010REJECTTYPE-000004')); /* 国际化处理： 删除成功！*/
							/**
							 * 设置页面状态为浏览态
							 */
							buttonController.setButtonStatus.call(this, this.props, UISTATE.browse);
						}
					}
				});
			}
		});
	};

	/**
	 * 关联按钮弹窗，当对穿梭框进行操作时，右边数组的值
	 * targetKeys 右边的数组
	 * flag allToRight-触发全部右移的标志,allToLeft-触发全部左移的标志
	 */
	onTargetKeysChange = (targetKeys, flag) => {
		if (OTHER.allToRight == flag) {
			// 全部右移
			targetKeys = dataSource1;
		} else if (OTHER.allToLeft == flag) {
			// 全部左移
			targetKeys = [];
		}
		this.setState({
			targetKeys
		});
	};

	/**
	 * 关联按钮弹窗，确认按钮
	 */
	beSureBtnClick = () => {
		let params = this.props.form.getFormItemsValue(AREA.head, [ FIELD.id, FIELD.pk_group, FIELD.pk_org ]);
		// let data = `{${OTHER.id}:${params[0].value},${FIELD.pk_group}:${params[1].value},${FIELD.pk_org}:${params[2]
		// 	.value},${OTHER.rightOrigins}:[${this.rightOrigins}],${OTHER.addIDs}:[${this
		// 	.addIDs}],${OTHER.delIDs}:[${this.delIDs}],${OTHER.type}:'1'}`;
		let data = {
			[OTHER.id]: params[0].value,
			[FIELD.pk_group]: params[1].value,
			[FIELD.pk_org]: params[2].value,
			[OTHER.rightOrigins]: this.rightOrigins,
			[OTHER.addIDs]: this.addIDs,
			[OTHER.delIDs]: this.delIDs,
			[OTHER.type]: '1'
		};
		ajax({
			url: URL.relation,
			data: data,
			method: 'post',
			success: (res) => {
				if (res.success) {
					// 关联成功之后，清空所有的数组
					this.addIDs = []; // 关联，弹窗右侧新增的关联项
					this.delIDs = []; //关联，弹窗右侧删除的关联项
					this.rightOrigins = []; //关联，弹窗弹出时，初始的关联项
				}
			}
		});
	};
	/**
	 * 关联按钮弹窗，取消按钮
	 */
	cancelBtnClick = () => {
		this.addIDs = []; // 关联，弹窗右侧新增的关联项
		this.delIDs = []; //关联，弹窗右侧删除的关联项
		this.rightOrigins = []; //关联，弹窗弹出时，初始的关联项
		this.props.modal.close(OTHER.relationModel);
	};

	/**
	 * 设置关联弹窗，右侧初始数据
	 * value 数据
	 */
	setRightOrigins = (value) => {
		if (value && value.length > 0) {
			this.rightOrigins.push(value);
		}
	};

	/**
	 * 设置关联弹窗，新增的关联项目
	 * value 数据
	 * action 动作：add-添加元素，del-删除元素
	 */
	setAddIDs = (value, action) => {
		if (action == OTHER.add) {
			this.addIDs.push(value);
		} else if (action == OTHER.del) {
			let index = this.addIDs.indexOf(value);
			this.addIDs.splice(index, 1);
		}
	};

	/**
	 * 设置关联弹窗，删除的关联项目
	 * value 数据
	 * action 动作：add-添加元素，del-删除元素
	 */
	setDelIDs = (value, action) => {
		if (action == OTHER.add) {
			this.delIDs.push(value);
		} else if (action == OTHER.del) {
			let index = this.delIDs.indexOf(value);
			this.delIDs.splice(index, 1);
		}
	};

	render() {
		let { DragWidthCom, syncTree, form, button, modal, BillHeadInfo } = this.props;
		const { createSyncTree } = syncTree;
		const { createForm } = form;
		const { createButtonApp } = button;
		const { createModal } = modal;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/* {createBillHeadInfo({
								title: getLangByResId(this, 'C010REJECTTYPE-000001'),
								initShowBackBtn: false
							})} */}
							{createListTitle(this)}
							{/*国际化处理： 质量不合格类型*/}
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: AREA.list_head,
								onButtonClick: btnClickController.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* leftDom 树元素，rightDom 表单元素 */}
				<div style={{ height: 'calc(100% - 48px)' }}>
					<DragWidthCom
						defLeftWid={'30%'} // 默认左侧区域宽度，px/百分百
						leftMinWid={'20%'} //左侧最小宽度默认为50px, px/百分百
						leftDom={
							<div style={{ paddingLeft: 20, paddingTop: 10, height: '100%' }}>
								{createSyncTree({
									treeId: AREA.tree, //树组件id
									needSearch: true, // 是否树上的查询框
									disabledSearch: this.state.status != UISTATE.browse, // 是否禁用搜索框，编辑态需要禁用搜索框
									searchType: 'location', // 搜索框查询方式，定位/过滤  location/filtration，默认定位
									onMouseEnterEve: this.onMouseEnterEve.bind(this), // 鼠标悬浮事件
									onSelectEve: this.selectTree.bind(this), //节点点击事件
									showModal: false, // 是否使用弹出式编辑，false为不使用
									clickAddIconEve: this.addClickEve.bind(this), //新增点击 回调
									clickEditIconEve: this.editClickEve.bind(this), //编辑点击 回调
									clickDelIconEve: this.delClickEve.bind(this) // 删除点击 回调
								})}
							</div>
						}
						rightDom={
							<div style={{ height: '100%' }}>
								<EmptyAreaTip
									type="btn"
									onClick={this.addClickEve.bind(this, this.root)}
									show={this.state.cardEmpty}
								/>
								<span style={{ display: this.state.cardEmpty ? 'none' : 'block' }}>
									{createForm(AREA.head, { onAfterEvent: formAfterEvent.bind(this) })}
								</span>
							</div>
						}
					/>
				</div>
				{/* 关联树-表穿梭框 */}
				{createModal(OTHER.relationModel, {
					title: getLangByResId(this, 'C010REJECTTYPE-000005') /* 国际化处理： 关联检验项目*/,
					content: (
						<TreeTableTransfer
							{...this.props}
							treeData={this.treeData}
							rightOrigins={this.rightOrigins}
							setRightOrigins={this.setRightOrigins}
							addIDs={this.addIDs}
							setAddIDs={this.setAddIDs}
							delIDs={this.delIDs}
							setDelIDs={this.setDelIDs}
							leftTitle={getLangByResId(this, 'C010REJECTTYPE-000006')} /* 国际化处理： 待选检验项目*/
							rightTitle={getLangByResId(this, 'C010REJECTTYPE-000007')} /* 国际化处理： 已选检验项目*/
						/>
					),
					leftBtnName: getLangByResId(this, 'C010REJECTTYPE-000008'), //左侧按钮名称/* 国际化处理： 确定*/
					rightBtnName: getLangByResId(this, 'C010REJECTTYPE-000009'), //右侧按钮名称/* 国际化处理： 取消*/
					size: 'xlg', //模态框尺寸|sm/lg/xlg
					hasCloseBtn: true, //控制“X”按钮，显示true，不显示false，默认不显示
					closeModalEve: this.cancelBtnClick.bind(this), //关闭按钮事件回调
					beSureBtnClick: this.beSureBtnClick.bind(this), //点击确定按钮事件
					cancelBtnClick: this.cancelBtnClick.bind(this) //取消按钮事件回调
				})}
			</div>
		);
	}
}

Rejecttype = createPage({
	billinfo: {
		billtype: 'form',
		pagecode: PAGECODE.list
	}
})(Rejecttype);
export default Rejecttype;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65