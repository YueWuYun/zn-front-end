//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 工作中心分类
 * @author zhaopeih
 */
import React, { Component } from 'react';
import { ajax, base, createPage, toast, high, promptBox } from 'nc-lightapp-front';
import OrgSelect from '../component/org';
import WkClassTree from '../component/wkclasstree';
const { NCCheckbox, NCMessage: Message } = base;

/****************默认参数  开始***********************/
let urls = {
	enablestateUrl: '/nccloud/mmbd/wkclass/enable.do',
	loadTreeDataUrl: '/nccloud/mmbd/wkclass/loadtree.do',
	queryCardUrl: '/nccloud/mmbd/wkclass/loadcard.do',
	saveUrl: '/nccloud/mmbd/wkclass/save.do',
	deleteUrl: '/nccloud/mmbd/wkclass/delete.do'
};
let config = {
	formId: 'wkclass',
	pageCode: '10140WKC_form'
};
/***************默认参数  结束********************/

class WorkCenterClassify extends Component {
	constructor(props) {
		super(props);
		this.config = Object.assign(
			{
				treeId: 'WkClassTree',
				refresh: 'mmbd/wk/wkclass/main/index.html',
				primaryKey: 'wkclass',
				urls: urls,
				actions: {
					TreeNodeAdd: 'TreeNodeAdd',
					TreeNodeEdit: 'TreeNodeEdit',
					TreeNodeDel: 'TreeNodeDel',
					Start: 'start',
					Stop: 'stop',
					Refresh: 'refresh',
					Save: 'save',
					Cancel: 'cancel'
					// SaveAdd: 'saveadd'
				} //表单所有动作
			},
			props.config
		);
		this.codeComp = {};
		this.state = {
			pks: [],
			checked: false, //判断 显示停用按钮是否选中
			disabledShowOff: false, //复选框可选
			curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
			curOrg: {}, //当前组织
			tree: {
				needEdit: true,
				showLine: false,
				needSearch: true,
				showModal: false
			},
			oldParent: '', //原父节点
			isAdd: false, //新增标志  默认false
			disabledSearch: false, // 搜素框可用
			status: 'browse',
			json: {}
		};
		let callback = (json, status, inlt) => {
			this.setState(
				{
					json
				},
				() => {
					//自定义根节点
					this.root = {
						isleaf: false,
						key: '~',
						title: this.state.json['10140WKC-000000'],
						id: '~',
						innercode: '~',
						pid: '',
						refname: this.state.json['10140WKC-000000'],
						refpk: '~'
					};					
					this.initTemplate(props, () => {
						this.props.form.EmptyAllFormValue(this.config.formId)
						this.initData.call(this);
					});
				}
			);
		};
		//加载多语文件
		this.props.MultiInit.getMultiLang({ moduleId: '10140WKC', domainName: 'uapbd', callback });
	}
	componentDidUpdate() {
		if (this.state.status != 'browse') {
			window.onbeforeunload = () => {
				//编辑态关闭页签或浏览器的提示
				return '';
			};
		} else {
			window.onbeforeunload = null;
		}
	}
	/**
     * 初始化单据模板
     * @param props
     */
	initData() {
		if (!this.state.curOrg || this.state.curOrg == '' ||
			!this.state.curOrg.hasOwnProperty('refpk') || !this.state.curOrg.refpk) {
			this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData([Object.assign(this.root)]));
			this.props.syncTree.setNodeDisable(this.config.treeId, true);
			this.setPrintButtonStatus(true);
			//禁用
			this.state.disabledShowOff = true;
			this.state.disabledSearch = true;
			this.setState(this.state);
		}
	}
	initTemplate = (props, callback) => {
		/**
         * 页面初始设置button状态
         * @param props
         */
		const initButtonStatus = (props) => {
			//设置保存按钮不显示
			props.button.setButtonVisible('save', false);
			//设置取消按钮不显示
			props.button.setButtonVisible('cancel', false);
			//设置保存新增按钮不显示
			// props.button.setButtonVisible('saveadd', false);
		};
		props.createUIDom({ pagecode: props.config.pageCode }, (data) => {
			//页面模板
			if (data.template) {
				props.meta.setMeta(data.template);
			}
			//按钮
			if (data.button) {
				props.button.setButtons(data.button);
				//初始按钮状态
				initButtonStatus(props);
			}
			//业务单元默认值
			if (data.context) {
				this.state.curOrg = {
					isleaf: false,
					refname: data.context.org_Name,
					refpk: data.context.pk_org
				};
				this.state.disabledShowOff =
					!data.context || data.context == '' || !data.context.hasOwnProperty('pk_org');
				this.setState(this.state, () => {
					this.loadTreeData();
					this.setPrintButtonStatus(true);
					return;
				});
			}
			callback && callback();
		});
	};
	/**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
	dealTreeData = (data) => {
		let deleteDataChildrenProp = function (node) {
			node.iconBox = {
				addIcon: false,
				editIcon: false,
				delIcon: false
			};
			if (!node.children || node.children.length == 0) {
				delete node.children;
			} else {
				node.isLeaf = false;
				node.children.forEach((e) => {
					deleteDataChildrenProp(e);
				});
			}
		};
		data.forEach((e) => {
			deleteDataChildrenProp(e);
		});
		return data;
	};
	/**
     * 切换组织事件
     * @param value
     */
	onOrgChange = (value) => {
		//选择行政组织钩子
		this.state.curOrg = value;
		this.state.disabledShowOff = !value || value == '' || !value.hasOwnProperty('refpk');
		this.setState(this.state, () => {
			this.state.disabledShowOff ? this.initData() : this.loadTreeData();
		});
		this.props.form.EmptyAllFormValue(this.config.formId)
	};
	/**
     * 加载树节点数据
     */
	loadTreeData = (callback) => {
		/*****************************************************************
         * 构造请求参数
         * @type {{isShowOff: boolean, pk_curOrg: string}}
         *****************************************************************/
		let requestParam = {
			isShowOff: this.state.checked,
			pk_curOrg: this.state.curOrg.refpk //当前选择的组织pk
		};
		/*****************************************************************
         * ajax请求 加载树数据
         * @param url:请求树数据url,data: requestParam, success:回调
         *****************************************************************/
		ajax({
			url: this.config.urls.loadTreeDataUrl,
			data: requestParam,
			async: false,
			success: (result) => {
				if (result.success) {
					let data = [Object.assign(this.root, { children: result.data })];
					//同步树  加载全部数据
					this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(data));
					//展开节点  设置默认展开项
					this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
					this.props.syncTree.setNodeDisable(this.config.treeId, false);
					this.setState({ disabledShowOff: false, disabledSearch: false }, () => {
						callback && callback();
					});
				}
			}
		});
	};
	/**
     * checkbox 显示停用点击事件
     */
	onCheckBoxChange = () => {
		if (this.state.disabledShowOff) {
			return;
		}
		this.props.form.EmptyAllFormValue(this.config.formId); //清空表单数据
		this.props.form.setFormItemsValue(this.config.formId, { enablestate: { value: '', display: '' } });
		this.setState({ checked: !this.state.checked }, () => {
			let requestParam = {
				isShowOff: this.state.checked,
				pk_curOrg: this.state.curOrg.refpk
			};
			ajax({
				url: this.config.urls.loadTreeDataUrl,
				data: requestParam,
				success: (result) => {
					if (result.success) {
						var data = [Object.assign({ ...this.root }, { children: result.data })],
							initLeaf = function (node) {
								node.iconBox = {
									addIcon: false,
									editIcon: false,
									delIcon: false
								};
								if (!node.children || node.children.length == 0) {
									delete node.children;
								} else {
									node.isLeaf = false;
									node.children.forEach((e) => {
										initLeaf(e);
									});
								}
							};
						data.forEach((e) => {
							initLeaf(e);
						});
						//同步树 加载全部数据
						this.props.syncTree.setSyncTreeData(this.config.treeId, data);
						//展开节点  设置默认展开项
						this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
						//设置按钮不可用
						this.props.button.setButtonDisabled(['start', 'stop'], true);
					}
				}
			});
		});
	};
	/**
     * 鼠标进入树节点事件
     * @param key
     */
	onMouseEnterEve = (key) => {
		let obj = {
			delIcon: true, //false:隐藏； true:显示; 默认都为true显示
			editIcon: true,
			addIcon: true
		};
		if (key == this.root.refpk) {
			obj = {
				delIcon: false, //false:隐藏； true:显示; 默认都为true显示
				editIcon: false,
				addIcon: true
			};
		}
		this.props.syncTree.hideIcon(this.config.treeId, key, obj);
	};
	/**
     * 点击树节点
     * @param refpk
     */
	onSelectTree = (refpk) => {
		if (this.checkTreeNodeIsDisabled(this.props.syncTree.getSyncTreeValue(this.config.treeId, refpk))) {
			return;
		}
		/******************************************************
         * 是根节点，清空表单数据，返回
         ******************************************************/
		if (refpk == this.root.refpk) {
			//清空表单
			this.props.form.EmptyAllFormValue(this.config.formId);
			this.props.form.setFormItemsValue(this.config.formId, {
				enablestate: { value: '', display: '' }
			});
			//设置按钮不可用
			this.props.button.setButtonDisabled(['start', 'stop'], true);
			return;
		}
		/******************************************************
         * 请求参数
         * @type {{isShowOff: *,primaryKey: *, pk_curOrg: *}}
         ******************************************************/
		let requestParam = {
			isShowOff: this.state.checked,
			primaryKey: refpk,
			pk_curOrg: this.state.curOrg.refpk
		};
		/******************************************************
         * ajax 请求选择的树节点数据
         ******************************************************/
		ajax({
			url: this.config.urls.queryCardUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					//设置表单为所选树节点数据
					this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });
					/************************************************************
                     * 选中树节点回调成功后设置当前选中节点
                     ************************************************************/
					let selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId);
					let enablestate = result.data[this.config.formId].rows[0].values.enablestate.value;
					let _this = this;
					if (enablestate == '2') {
						_this.props.button.setButtonDisabled(['start'], true);
						_this.props.button.setButtonDisabled(['stop'], false);
					}
					if (enablestate == '3') {
						_this.props.button.setButtonDisabled(['start'], false);
						_this.props.button.setButtonDisabled(['stop'], true);
					}
					this.setState({ curSelectedNode: selectedTreeNode });
				}
			}
		});
	};
	// 设置按钮状态
	setPrintButtonStatus = (flag) => {
		this.props.button.setButtonDisabled(['start', 'stop'], flag);
	};
	/**
     * 新增
     * @param selectNode
     */
	onAddWkClass = (selectNode) => {
		if (this.checkTreeNodeIsDisabled(selectNode) || (!this.state.curOrg || !this.state.curOrg.refpk)) {
			return;
		}
		// 设置新增标志、当前选中节点
		this.setState(
			{
				oldParent: selectNode.refpk,
				isAdd: true,
				disabledShowOff: true,
				disabledSearch: true,
				curSelectedNode: selectNode,
				status: 'edit'
			},
			() => {
				//清空表单数据
				this.props.form.EmptyAllFormValue(this.config.formId);
				//设置表单为编辑态
				this.props.form.setFormStatus(this.config.formId, 'edit');
				//设置新增默认值
				let info = window.parent.GETBUSINESSINFO();

				this.props.form.setFormItemsDisabled(this.config.formId, {
					creator: true,
					creationtime: true,
					modifier: true,
					modifiedtime: true
				});

				this.props.form.setFormItemsValue(this.config.formId, {
					pk_group: { value: info.groupId, display: info.groupName },
					pk_org: { value: this.state.curOrg.refpk, display: this.state.curOrg.refname },
					cparentid: { value: selectNode.refpk }
				});
				//编辑时设置整棵树不可用
				this.props.syncTree.setNodeDisable(this.config.treeId, true);
				//设置按钮状态
				this.changeButtonStatus(selectNode, this.config.actions.TreeNodeAdd);
				//添加提示
				this.props.form.setFormPopConfirmSwitchTips(this.config.formId, 'code', 'haobuhaoshi');
			}
		);
	};
	/**
     * 编辑：
     *      1、构造请求参数
     *      2、ajax请求，后台查询需要编辑的对象
     *      3、回调，设置表单数据为编辑的对象     *
     * 编辑状态下：
     *      只有【保存】【取消】按钮显示
     * @param selectedTreeNode
     */
	onEditWkClass = (selectedTreeNode) => {
		if (this.checkTreeNodeIsDisabled(selectedTreeNode)) {
			return;
		}
		/******************************************************
         * 请求参数对象
         ******************************************************/
		let requestParam = {
			isShowOff: this.state.checked,
			primaryKey: selectedTreeNode.refpk,
			pk_curOrg: this.state.curOrg.refpk
		};
		ajax({
			url: this.config.urls.queryCardUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					//编辑时设置整棵树不可用
					this.props.syncTree.setNodeDisable(this.config.treeId, true);
					// 设置表单数据;
					this.props.form.setAllFormValue({
						[this.config.formId]: result.data[this.config.formId]
					});
					//设置表单状态为编辑态
					this.props.form.setFormStatus(this.config.formId, 'edit');
					//设置按钮状态
					this.changeButtonStatus(this.state.curSelectedNode, this.config.actions.TreeNodeEdit);

					this.props.form.setFormItemsDisabled(this.config.formId, {
						creator: true,
						creationtime: true,
						modifier: true,
						modifiedtime: true
					});
					/******************************************************
					 * 设置当前选中节点,记录父节点pk 移动树节点时使用
					 ******************************************************/
					this.setState({
						curSelectedNode: selectedTreeNode,
						oldParent: selectedTreeNode.pid,
						isAdd: false,
						disabledShowOff: true,
						disabledSearch: true,
						status: 'edit'
					});
				}
			}
		});
	};
	/**************************************************
     * 保存：
     *     1、获取表单对象
     *     2、构造请求参数模型
     *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
     *     4、回调，刷新当前树节点的父节点
     * 保存状态下：
     *     恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
     **************************************************/
	onSaveWkClass = () => {
		if (!this.props.form.isCheckNow(this.config.formId)) {
			return;
		}
		//为编码设置正则
		let wkcode = this.props.form.getFormItemsValue(this.config.formId, 'code').value;
		//let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId); //获得选中节点
		if (
			this.props.form.getFormItemsValue(this.config.formId, 'cwkclassid') &&
			this.props.form.getFormItemsValue(this.config.formId, 'cwkclassid').value
		) {
			if (this.state.curSelectedNode.code) {
				let reg = new RegExp(
					this.state.curSelectedNode.code.substring(0, this.state.curSelectedNode.code.length - 2) + '.{2}'
				);
				if (!reg.test(wkcode) || this.state.curSelectedNode.code.length != wkcode.length) {
					toast({ title: this.state.json['10140WKC-000020'], color: 'danger' }); /* 国际化处理： 新增保存成功！*/
					return;
				}
			} else {
				if (this.state.curSelectedNode.code) {
					let reg = new RegExp(this.state.curSelectedNode.code + '.{2}');
					if (!reg.test(wkcode) || this.state.curSelectedNode.code.length + 2 != wkcode.length) {
						toast({ title: this.state.json['10140WKC-000020'], color: 'danger' }); /* 国际化处理： 新增保存成功！*/
						return;
					}
				}
			}
		}

		/**************************************************************
         * 获得表单数据
         **************************************************************/
		let formData = this.props.form.getAllFormValue(this.config.formId); //获得表单信息
		formData.areacode = this.config.formId; //添加表单的areacode编码
		formData.rows['status'] = '2'; //设置状态
		/**************************************************************
         *  请求参数对象
         **************************************************************/
		let requestParam = {
			model: formData,
			pageid: this.config.pageCode //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
		};
		ajax({
			url: this.config.urls.saveUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					/**************************************************************
                     *  设置树可用
                     **************************************************************/
					this.props.syncTree.setNodeDisable(this.config.treeId, false);
					/**************************************************************
                     * 去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
                     **************************************************************/
					if (!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0) {
						delete result.data.treeNodeData[0].children;
					}
					/**************************************************************
                     * 是否是移动节点
                     **************************************************************/
					let isMove = result.data.treeNodeData[0].pid != this.state.oldParent;
					/**************************************************************
                     * 判断是新增还是编辑
                     **************************************************************/
					if (this.state.isAdd) {
						//新增回调后添加
						this.props.syncTree.addNodeSuccess(this.config.treeId, result.data.treeNodeData);
					} else {
						//修改回调后修改
						this.props.syncTree.editNodeSuccess(this.config.treeId, result.data.treeNodeData);
					}
					/**************************************************************
                     * 移动树节点  并且检查原父节点没有子节点时去除'>'符号
                     **************************************************************/
					if (isMove) {
						this.props.syncTree.moveNode(
							this.config.treeId,
							result.data.treeNodeData[0].refpk,
							result.data.treeNodeData[0].pid
						);
					}
					/**************************************************************
                     * 展开当前树节点
                     **************************************************************/
					this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
					/**************************************************************
                     * 设置新增节点为选中节点
                     **************************************************************/
					this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treeNodeData[0].refpk);
					/**************************************************************
                     * 设置表单为浏览态
                     **************************************************************/
					this.props.form.setFormStatus(this.config.formId, 'browse');
					/**************************************************************
                     * 重置表单数据为当前选中节点的表单数据
                     **************************************************************/
					result.data.curFormData[this.config.formId].rows[0].values.enablestate.value = 2;
					this.props.form.setAllFormValue({
						[this.config.formId]: result.data.curFormData[this.config.formId]
					});
					/**************************************************************
                     * 设置按钮状态
                     **************************************************************/
					this.changeButtonStatus(this.state.curSelectedNode, this.config.actions['Save']);
					if (result.data.curFormData[this.config.formId].rows[0].values.cwkclassid && result.data.curFormData[this.config.formId].rows[0].values.cwkclassid.value) {
						if (result.data.curFormData[this.config.formId].rows[0].values.enablestate.value=='2') {
							this.props.button.setButtonDisabled(['start'], true);
							this.props.button.setButtonDisabled(['stop'], false);
						} else {
							this.props.button.setButtonDisabled(['start'], false);
							this.props.button.setButtonDisabled(['stop'], true);
						}
					} else {
						this.props.button.setButtonDisabled(['start', 'stop'], true);
					}
					/**************************************************************
                     * 清空选中节点的缓存
                     **************************************************************/
					this.setState(
						{
							curSelectedNode: result.data.treeNodeData[0],
							disabledShowOff: false,
							disabledSearch: false,
							status: 'browse'
						},
						() => {
							toast({ title: this.state.json['10140WKC-000003'], color: 'success' }); /* 国际化处理： 保存成功！*/
						}
					);
				}
			},
		// error: (msg)=>{
		// 	console.log(msg.message)
		// 	toast({ title: this.state.json['10140WKC-000020'], color: 'danger' });
		// }
		});
	};
	/**************************************************
     * 新增保存：
     *     1、获取表单对象
     *     2、构造请求参数模型
     *     3、ajax请求，后台根据表单对象主键执行保存或更新操作
     *     4、回调，刷新当前树节点的父节点
     * 保存状态下：
     *      恢复到浏览态，根据当前选中的树节点决定按钮的可见性和可操作性
     **************************************************/
	onSaveAddWkClass = () => {
		if (!this.props.form.isCheckNow(this.config.formId)) {
			return;
		}
		let selectedTreeNode = this.state.curSelectedNode;
		/**************************************************************
         *  获得表单数据
         **************************************************************/
		let formData = this.props.form.getAllFormValue(this.config.formId); //获得表单信息
		formData.areacode = this.config.formId; //添加表单的areacode编码
		formData.rows['status'] = '2'; //设置状态
		/**************************************************************
         *  请求参数对象
         **************************************************************/
		let requestParam = {
			model: formData,
			pageid: this.config.pageCode //pageid : 我们导出的模板的名字  也就是 json数据的最外层的code值
		};
		/**************************************************************
         *  ajax请求
         **************************************************************/
		ajax({
			url: this.config.urls.saveUrl,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					/**************************************************************
					 *  设置表单为浏览态
					 **************************************************************/
					this.props.form.setFormStatus(this.config.formId, 'browse');
					/**************************************************************
					 *  去掉新增节点的children属性  树组件会根据children属性渲染‘>’符号
					 **************************************************************/
					if (!result.data.treeNodeData[0].children || result.data.treeNodeData[0].children.length == 0) {
						delete result.data.treeNodeData[0].children;
					}
					/**************************************************************
					 *  新增回调后添加
					 **************************************************************/
					this.props.syncTree.addNodeSuccess(this.config.treeId, result.data.treeNodeData[0]);
					/**************************************************************
					 *  展开当前节点的父节点
					 **************************************************************/
					this.props.syncTree.openNodeByPk(this.config.treeId, result.data.treeNodeData[0].pid);
					/**************************************************************
					 *  如果选中节点丢失，重置当前选中节点 保障性操作
					 **************************************************************/
					if (!selectedTreeNode) {
						this.props.syncTree.setNodeSelected(this.config.treeId, result.data.treeNodeData[0].pid);
						selectedTreeNode = this.props.syncTree.getSelectNode(this.config.treeId); //获得选中节点
						this.setState({ curSelectedNode: selectedTreeNode });
					}
					/**************************************************************
					 * 重新设置整棵树不可用
					 **************************************************************/
					this.props.syncTree.setNodeDisable(this.config.treeId, true);
					/**************************************************************
					 * 清空表单数据
					 **************************************************************/
					this.props.form.EmptyAllFormValue(this.config.formId);
					/**************************************************************
					 * 重置表单数据
					 **************************************************************/
					let info = window.parent.GETBUSINESSINFO();
					this.props.form.setFormItemsValue(this.config.formId, {
						pk_group: { value: info.groupId, display: info.groupName },
						pk_org: { value: this.state.curOrg.refpk, display: this.state.curOrg.refname },
						cparentid: { value: selectedTreeNode.refpk }
					});
					/**************************************************************
					 * 设置表单为编辑态
					 **************************************************************/
					this.props.form.setFormStatus(this.config.formId, 'edit');
					/**************************************************************
					 * 重新设置按钮状态
					 **************************************************************/
					// this.changeButtonStatus(selectedTreeNode, this.config.actions['SaveAdd']);
					/**************************************************************
					 * 回调成功后,记录原父节点pk 移动时使用 设置新增标志
					 **************************************************************/
					this.setState(
						{
							oldParent: this.state.curSelectedNode.refpk,
							isAdd: true,
							status: 'edit',
							disabledSearch: true
						},
						() => {
							toast({ title: this.state.json['10140WKC-000004'], color: 'success' }); /* 国际化处理： 新增保存成功！*/
						}
					);
				}
			}
		});
	};
	/**
     * 删除：
     *      1、根据选中的树节点做出相应的提示
     *      2、弹出删除确认提示
     *      3、构造请求参数
     *      4、ajax请求，后台执行删除
     *      5、回调，执行前台删除动作
     * 删除状态下：
     *      清空表单对象数据，按钮全成Disabled状态
     * @param selectedTreeNode
     */
	onDeleteWkClass = (selectedTreeNode) => {
		if (this.checkTreeNodeIsDisabled(selectedTreeNode)) {
			return;
		}
		/**************************************************************
         * 请求参数对象
         **************************************************************/
		let requestParam = {
			cwkclassid: selectedTreeNode.refpk,
			ts: selectedTreeNode.nodeData.ts
		};
		promptBox({
			color: 'warning',
			title: this.state.json['10140WKC-000007'] /* 国际化处理： 确认删除*/,
			content: this.state.json['10140WKC-000008'] /* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除?*/,
			beSureBtnClick: () => {
				ajax({
					url: this.config.urls.deleteUrl,
					data: requestParam,
					success: (result) => {
						if (result.success) {
							/**************************************************************
							 * 清空表单数据
							 **************************************************************/
							if (this.state.curSelectedNode.refpk === selectedTreeNode.refpk) {
								this.props.form.EmptyAllFormValue(this.config.formId);
								this.props.form.setFormItemsValue(this.config.formId, {
									enablestate: { value: '', display: '' }
								});
								this.props.button.setButtonDisabled(['start', 'stop'], true);
							}
							/**************************************************************
							 * 删除树节点
							 **************************************************************/
							this.props.syncTree.delNodeSuceess(this.config.treeId, selectedTreeNode.refpk);
							/**************************************************************
							 * 删除成功提示
							 **************************************************************/
							toast({
								title: this.state.json['10140WKC-000009'],
								color: 'success'
							}); /* 国际化处理： 删除成功！*/
							/**************************************************************
							 * 重新设置按钮状态
							 **************************************************************/
							this.changeButtonStatus(selectedTreeNode, this.config.actions.TreeNodeDel);
						}
					}
				});
			}
		});
	};
	/**********************************************************
     * 取消按钮
     **********************************************************/
	onCancelWkClassPrompt = (callback) => {
		promptBox({
			color: 'warning',
			title: this.state.json['10140WKC-000010'] /* 国际化处理： 确认取消*/,
			content: this.state.json['10140WKC-000011'] /* 国际化处理： 是否确认要取消?*/,
			beSureBtnClick: () => {
				callback && callback();
			}
		});
	};
	/**********************************************************
     * 确认取消：
     *      1、重新根据选中的树节点查询表单对象
     *      2、回调，设置表单对象
     *      3、设置按钮状态
     **********************************************************/
	onCancelWkClass = () => {
		/**********************************************************
         * 获取当前操作的节点
         **********************************************************/
		let selectedTreeNode = this.state.curSelectedNode;
		/**********************************************************
         * 清空表单数据
         **********************************************************/
		this.props.form.EmptyAllFormValue(this.config.formId);
		/**********************************************************
         * 请求参数对象
         * @type {{pk_curOrg: *, primaryKey: *, nodeType: *, isAdd: boolean}}
         **********************************************************/
		let requestParam = {
			isShowOff: this.state.checked,
			primaryKey: selectedTreeNode.refpk,
			pk_curOrg: this.state.curOrg.refpk
		};
		if (selectedTreeNode) {
			if (selectedTreeNode.refpk == '~') {
				/**********************************************************
                 * 设置树节点选中项
                 **********************************************************/
				this.props.syncTree.setNodeSelected(this.config.treeId, selectedTreeNode.refpk);
				/**********************************************************
                 * 设置表单状态
                 **********************************************************/
				this.props.form.setFormStatus(this.config.formId, 'browse');
				/**********************************************************
                 * 设置树可用
                 **********************************************************/
				this.props.syncTree.setNodeDisable(this.config.treeId, false);
				/**********************************************************
                 * 设置按钮状态
                 **********************************************************/
				this.changeButtonStatus(selectedTreeNode, this.config.actions['Cancel']);
			} else {
				//查询节点信息
				ajax({
					url: this.config.urls.queryCardUrl,
					data: requestParam,
					success: (result) => {
						if (result.success) {
							/**********************************************************
                             * 重置表单数据
                             **********************************************************/
							this.props.form.setAllFormValue({ [this.config.formId]: result.data[this.config.formId] });
							/**********************************************************
                             * 设置树节点选中项
                             **********************************************************/
							this.props.syncTree.setNodeSelected(this.config.treeId, selectedTreeNode.refpk);
							/**********************************************************
                             * 设置表单状态
                             **********************************************************/
							this.props.form.setFormStatus(this.config.formId, 'browse');
							/**********************************************************
                             * 设置树可用
                             **********************************************************/
							this.props.syncTree.setNodeDisable(this.config.treeId, false);
							/**********************************************************
                             * 设置按钮状态
                             **********************************************************/
							this.changeButtonStatus(selectedTreeNode, this.config.actions['Cancel']);
						}
					}
				});
			}
			this.setState({ disabledSearch: false, disabledShowOff: false, status: 'browse' });
		}
	};

	/**
     * 启用
     */
	onStartWkClass = () => {
		let formData = this.props.form.getAllFormValue(this.config.formId); //获得表单信息
		let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId); //获得选中节点
		let requestParam = {
			cwkclassid: formData.rows[0].values.cwkclassid.value,
			enablestate: '2',
			pk_curOrg: this.state.curOrg.refpk
		};
		ajax({
			url: this.config.urls.enablestateUrl,
			data: requestParam,
			success: (result) => {
				//启用成功，调用树点击事件，重新加载卡片数据
				this.onSelectTree(selectedTreeNode.refpk);
				toast({ title: this.state.json['10140WKC-000001'], color: 'success' });
			}
		});
	};
	/**
     * 停用
     */
	onStopWkClass = () => {
		let formData = this.props.form.getAllFormValue(this.config.formId); //获得表单信息
		let selectedTreeNode = this.props.asyncTree.getSelectNodeAsync(this.config.treeId); //获得选中节点
		let requestParam = {
			cwkclassid: formData.rows[0].values.cwkclassid.value,
			enablestate: '3',
			pk_curOrg: this.state.curOrg.refpk
		};
		ajax({
			url: this.config.urls.enablestateUrl,
			data: requestParam,
			success: (res) => {
				if (res.success) {
					//停用成功，调用树点击事件，重新加载卡片数据
					this.onSelectTree(selectedTreeNode.refpk);
					toast({ title: this.state.json['10140WKC-000002'], color: 'success' });
				}
			}
		});
	};
	/**
     * 刷新
     */
	onRefreshWkClass = () => {
		if (Object.keys(this.state.curOrg).length === 0) {
			this.initData();
			toast({ title: this.state.json['10140WKC-000016'], color: 'success' }); /* 国际化处理： 刷新成功！*/
			return;
		}
		this.props.form.EmptyAllFormValue(this.config.formId); //清空表单数据
		this.props.form.setFormItemsValue(this.config.formId, { enablestate: { value: '', display: '' } });
		//设置按钮不可用
		this.props.button.setButtonDisabled(['start', 'stop'], true);
		this.loadTreeData(() => {
			toast({ title: this.state.json['10140WKC-000016'], color: 'success' }); /* 国际化处理： 刷新成功！*/
		});
	};
	/**
     * 按钮点击状态切换监听事件
     * @param id
     */
	changeButtonStatus = (selectedTreeNode, id) => {
		switch (id) {
			case this.config.actions.TreeNodeAdd:
				// case this.config.actions.SaveAdd:
				this.props.button.setButtonVisible('start', false);
				this.props.button.setButtonVisible('stop', false);
				this.props.button.setButtonVisible('refresh', false);
				this.props.button.setButtonVisible('save', true);
				// this.props.button.setButtonVisible('saveadd', true);
				this.props.button.setButtonVisible('cancel', true);
				break;
			case this.config.actions.TreeNodeEdit:
				this.props.button.setButtonVisible('start', false);
				this.props.button.setButtonVisible('stop', false);
				this.props.button.setButtonVisible('refresh', false);
				this.props.button.setButtonVisible('save', true);
				// this.props.button.setButtonVisible('saveadd', false);
				this.props.button.setButtonVisible('cancel', true);
				break;
			case this.config.actions.TreeNodeDel:
				this.props.button.setButtonVisible('start', true);
				this.props.button.setButtonVisible('stop', true);
				this.props.button.setButtonVisible('refresh', true);
				this.props.button.setButtonVisible('save', false);
				// this.props.button.setButtonVisible('saveadd', false);
				this.props.button.setButtonVisible('cancel', false);
				break;
			case this.config.actions.Save:
			case this.config.actions.Cancel:
				this.props.button.setButtonVisible('start', true);
				this.props.button.setButtonVisible('stop', true);
				this.props.button.setButtonVisible('refresh', true);
				this.props.button.setButtonVisible('save', false);
				// this.props.button.setButtonVisible('saveadd', false);
				this.props.button.setButtonVisible('cancel', false);
			default:
				break;
		}
	};
	/**
	 * 按钮点击事件
	 */
	onButtonClick = (props, id) => {
		switch (id) {
			case this.config.actions.Start:
				this.onStartWkClass();
				break;
			case this.config.actions.Stop:
				this.onStopWkClass();
				break;
			case this.config.actions.Refresh:
				this.onRefreshWkClass();
				break;
			case this.config.actions.Save:
				this.onSaveWkClass();
				break;
			// case this.config.actions.SaveAdd:
			// 	this.onSaveAddWkClass();
			// 	break;
			case this.config.actions.Cancel:
				this.onCancelWkClassPrompt(this.onCancelWkClass);
				break;
			default:
				break;
		}
	};

	getTreeAllPks = (treeData) => {
		let result = new Array();
		const loop = (treeData) => {
			treeData.forEach((data) => {
				if (data.refpk != '~') {
					result.push(data.refpk);
				}
				if (data.hasOwnProperty('children') && data.children.length > 0) {
					loop(data.children);
				}
			});
		};
		loop(treeData);
		return result;
	};
	checkTreeNodeIsDisabled(node) {
		return !!node.disabled;
	}
	onBeforeEvent(props, moduleid, key, value) {
		return true;
	}
	/**
     * 渲染
     * @returns {*}
     */
	render() {
		/**
         *  经过createPage方法后，初始对象都放到了props中
         *  例如 asyncTree,syncTree,form,table……
         *  我们用的话直接从props里取就可以了
         * */
		const { form, button, ncmodal, DragWidthCom } = this.props;
		const { createForm } = form; //创建表单，需要引入这个
		const { createButtonApp } = button;
		let { createModal } = ncmodal; //模态框
		/**
         * 组织选择区 参数
         **/
		let orgParam = {
			curOrg: this.state.curOrg,
			onOrgChange: this.onOrgChange,
			status: this.state.status,
			queryCondition: {
				AppCode: '10140WKC',
				TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder',
				GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter'
			}
		};
		/**
         * 树参数
         **/
		let treeConfig = {
			treeId: this.config.treeId,
			needEdit: this.state.tree.needEdit,
			showLine: this.state.tree.showLine, //显示连线
			needSearch: this.state.tree.needSearch, //是否需要搜索框
			onSelectTree: this.onSelectTree, //选择
			onMouseEnterEve: this.onMouseEnterEve, //鼠标进入树节点
			clickAddIconEve: this.onAddWkClass, //新增点击 回调
			clickEditIconEve: this.onEditWkClass, //编辑点击 回调
			clickDelIconEve: this.onDeleteWkClass, // 删除点击 回调
			showModal: this.state.tree.showModal,
			disabledSearch: this.state.disabledSearch
		};
		return (
			<div className="nc-bill-list">
				{createModal('modal', {
					noFooter: false,
					//rightBtnName : '关闭', //左侧按钮名称,默认关闭
					leftBtnName: this.state.json['10140WKC-000018'] //右侧按钮名称， 默认确认/* 国际化处理： 确定*/
				})}
				{/* 头部 header*/}
				<div className="nc-bill-header-area">
					{/* 标题 title*/}
					<div className="header-title-search-area">
						<h2 className="title-search-detail">
							{this.state.json ? this.state.json['10140WKC-000000'] : '10140WKC-000000'}
						</h2>
					</div>
					{/*组织选择区域*/}
					<div className="search-box" style={{ width: 200 }}>
						<OrgSelect
							config={orgParam}
							ref={(OrgSelect) => {
								this.OrgSelect = OrgSelect;
							}}
						/>
					</div>
					{/* 显示停用 */}
					<span className="showOff">
						<NCCheckbox
							disabled={this.state.disabledShowOff}
							defaultChecked={false}
							checked={this.state.checked}
							onChange={this.onCheckBoxChange}
							size="lg"
						>
							{this.state.json['10140WKC-000019'] /* 国际化处理： 显示停用 启用2，停用3*/}
						</NCCheckbox>
					</span>
					{/* 按钮组 btn-group*/}
					<div className="header-button-area">
						{createButtonApp({
							area: this.config.formId,
							buttonLimit: 3,
							onButtonClick: this.onButtonClick,
							popContainer: document.querySelector('.' + this.config.formId)
						})}
					</div>
				</div>
				{/* 树卡区域 */}
				<div className="tree-card">
					<DragWidthCom
						// 左树区域
						leftDom={
							<WkClassTree
								treeConfig={treeConfig}
								syncTree={this.props.syncTree}
								ref={(NCCHRTree) => (this.NCCHRTree = NCCHRTree)}
							/>
						}
						// 右卡片区域
						rightDom={
							<div className="card-area">
								{createForm(this.config.formId, {
									onBeforeEvent: this.onBeforeEvent.bind(this),
									cancelPSwitch: true
								})}
							</div>
						}
						// 默认左侧区域宽度，px/百分百
						defLeftWid="20%"
					/>
				</div>
			</div>
		);
	}
}

WorkCenterClassify = createPage({})(WorkCenterClassify);
ReactDOM.render(<WorkCenterClassify {...{ config: config }} />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65