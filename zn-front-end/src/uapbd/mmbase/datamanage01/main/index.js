//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 数据管理
 * @author liuyanp
 */
import React, { Component } from 'react';
import { ajax, base, createPage, getBusinessInfo } from 'nc-lightapp-front';
import DataManageTree from '../component/inspectobject';
import MaterialBasClassTreeRef from '../../../../uapbd/refer/material/MaterialBasClassTreeRef/index';
import StockPlanGridRef from '../../../../uapbd/refer/org/StockPlanGridRef/index';
import './index.less';
const { NCDatePicker } = base;
const urls = {
	detectUrl: '/nccloud/mmbd/datadetect/detect.do',
	getCodeUrl: '/nccloud/mmbd/datadetect/gencode.do',
	linkdetect: '/nccloud/mmbd/datadetect/linkdetect.do'
};
class DataManage extends Component {
	constructor(props) {
		super(props);
		this.config = {
			formId: 'datamanage',
			pageCode: '10140DAMA_form',
			treeId: 'InpectObjectTree'
		};
		this.state = {
			time: '',
			pks: [],
			curOrg: {}, //当前组织
			curMaterial: [], //当前物料
			status: 'browse',
			json: {},
			dataHead: '',
			dataBody: ''
		};
	}
	componentDidMount() {
		let callback = (json) => {
			//自定义根节点
			this.root = {
				isleaf: false,
				key: '~',
				title: json['10140DAMA2-000000'] /* 国际化处理： 检测对象*/,
				id: '~',
				innercode: '~',
				pid: '',
				refname: json['10140DAMA2-000000'] /* 国际化处理： 检测对象*/,
				refpk: '~'
			};
			this.treeData = [
				{
					isleaf: false,
					key: '~',
					title: json['10140DAMA2-000000'] /* 国际化处理： 检测对象*/,
					id: '~',
					innercode: '~',
					pid: '',
					refname: json['10140DAMA2-000000'] /* 国际化处理： 检测对象*/,
					refpk: '~',
					children: [
						{
							key: 'sjgx',
							title: json['10140DAMA-SJGX'],
							refname: json['10140DAMA-SJGX'],
							refpk: 'sjgx',
							id: 'sjgx',
							name: json['10140DAMA-SJGX'],
							pid: '~',
							innercode: 'sjgx',
							code: '',
							nodeData: {},
							children: [
								{
									key: 'sjtqq',
									title: json['10140DAMA-SJGX-SJTQQ'],
									refname: json['10140DAMA-SJGX-SJTQQ'],
									refpk: 'sjtqq',
									id: 'sjtqq',
									name: json['10140DAMA-SJGX-SJTQQ'],
									pid: 'sjgx',
									innercode: 'sjtqq',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'sjjhsx',
									title: json['10140DAMA-SJGX-SJJHSX'],
									refname: json['10140DAMA-SJGX-SJJHSX'],
									refpk: 'sjjhsx',
									id: 'sjjhsx',
									name: json['10140DAMA-SJGX-SJJHSX'],
									pid: 'sjgx',
									innercode: 'sjjhsx',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'sjjhzj',
									title: json['10140DAMA-SJGX-SJJHZJ'],
									refname: json['10140DAMA-SJGX-SJJHZJ'],
									refpk: 'sjjhzj',
									id: 'sjjhzj',
									name: json['10140DAMA-SJGX-SJJHZJ'],
									pid: 'sjgx',
									innercode: 'sjjhzj',
									code: '',
									nodeData: {},
									children: []
								}
							]
						},
						{
							key: 'scbom',
							title: json['10140DAMA-SCBOM'],
							refname: json['10140DAMA-SCBOM'],
							refpk: 'scbom',
							id: 'scbom',
							name: json['10140DAMA-SCBOM'],
							pid: '~',
							innercode: 'scbom',
							code: '',
							nodeData: {},
							children: [
								{
									key: 'bomxh',
									title: json['10140DAMA-SCBOM-BOMXH'],
									refname: json['10140DAMA-SCBOM-BOMXH'],
									refpk: 'bomxh',
									id: 'bomxh',
									name: json['10140DAMA-SCBOM-BOMXH'],
									pid: 'scbom',
									innercode: 'bomxh',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'bomlf',
									title: json['10140DAMA-SCBOM-BOMLF'],
									refname: json['10140DAMA-SCBOM-BOMLF'],
									refpk: 'bomlf',
									id: 'bomlf',
									name: json['10140DAMA-SCBOM-BOMLF'],
									pid: 'scbom',
									innercode: 'bomlf',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'bomty',
									title: json['10140DAMA-SCBOM-BOMTY'],
									refname: json['10140DAMA-SCBOM-BOMTY'],
									refpk: 'bomty',
									id: 'bomty',
									name: json['10140DAMA-SCBOM-BOMTY'],
									pid: 'scbom',
									innercode: 'bomty',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'bomzf',
									title: json['10140DAMA-SCBOM-BOMZF'],
									refname: json['10140DAMA-SCBOM-BOMZF'],
									refpk: 'bomzf',
									id: 'bomzf',
									name: json['10140DAMA-SCBOM-BOMZF'],
									pid: 'scbom',
									innercode: 'bomzf',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'bomzz',
									title: json['10140DAMA-SCBOM-BOMZZ'],
									refname: json['10140DAMA-SCBOM-BOMZZ'],
									refpk: 'bomzz',
									id: 'bomzz',
									name: json['10140DAMA-SCBOM-BOMZZ'],
									pid: 'scbom',
									innercode: 'bomzz',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'bomzxxx',
									title: json['10140DAMA-SCBOM-BOMZXXX'],
									refname: json['10140DAMA-SCBOM-BOMZXXX'],
									refpk: 'bomzxxx',
									id: 'bomzxxx',
									name: json['10140DAMA-SCBOM-BOMZXXX'],
									pid: 'scbom',
									innercode: 'bomzxxx',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'bomfxxx',
									title: json['10140DAMA-SCBOM-BOMFXXX'],
									refname: json['10140DAMA-SCBOM-BOMFXXX'],
									refpk: 'bomfxxx',
									id: 'bomfxxx',
									name: json['10140DAMA-SCBOM-BOMFXXX'],
									pid: 'scbom',
									innercode: 'bomfxxx',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'bomxx',
									title: json['10140DAMA-SCBOM-BOMXX'],
									refname: json['10140DAMA-SCBOM-BOMXX'],
									refpk: 'bomxx',
									id: 'bomxx',
									name: json['10140DAMA-SCBOM-BOMXX'],
									pid: 'scbom',
									innercode: 'bomxx',
									code: '',
									nodeData: {},
									children: []
								}
							]
						},
						{
							key: 'gylx',
							title: json['10140DAMA-GYLX'],
							refname: json['10140DAMA-GYLX'],
							refpk: 'gylx',
							id: 'gylx',
							name: json['10140DAMA-GYLX'],
							pid: '~',
							innercode: 'gylx',
							code: '',
							nodeData: {},
							children: [
								{
									key: 'rtpd',
									title: json['10140DAMA-GYLX-RTPD'],
									refname: json['10140DAMA-GYLX-RTPD'],
									refpk: 'rtpd',
									id: 'rtpd',
									name: json['10140DAMA-GYLX-RTPD'],
									pid: 'gylx',
									innercode: 'rtpd',
									code: '',
									nodeData: {},
									children: []
								},
								{
									key: 'rtfxx',
									title: json['10140DAMA-GYLX-RTFXX'],
									refname: json['10140DAMA-GYLX-RTFXX'],
									refpk: 'rtfxx',
									id: 'rtfxx',
									name: json['10140DAMA-GYLX-RTFXX'],
									pid: 'gylx',
									innercode: 'rtfxx',
									code: '',
									nodeData: {},
									children: []
								}
							]
						},
						{
							key: 'bomrtyzx',
							title: json['10140DAMA-BOMRTYZX'],
							refname: json['10140DAMA-BOMRTYZX'],
							refpk: 'bomrtyzx',
							id: 'bomrtyzx',
							name: json['10140DAMA-BOMRTYZX'],
							pid: '~',
							innercode: 'bomrtyzx',
							code: '',
							nodeData: {},
							children: []
						}
					]
				}
			];
			this.setState({ json, time: new Date().toLocaleDateString().split('/').join('-') }, () => {
				this.initTemplate(this.props);
			});
		};
		//加载多语文件
		this.props.MultiInit.getMultiLang({ moduleId: '10140DAMA', domainName: 'uapbd', callback });
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
	initTemplate = (props, callback) => {
		props.createUIDom({ pagecode: this.config.pageCode }, (data) => {
			let pk_org = props.getUrlParam('pk_org');
			let pk_org_d = props.getUrlParam('pk_org_d');
			//按钮
			if (data.button) {
				props.button.setButtons(data.button);
				props.button.setButtonDisabled([ 'datainspect' ], true);
			}
			//业务单元默认值
			if (data.context.pk_org) {
				this.state.curOrg = {
					refname: data.context.org_Name,
					refpk: data.context.pk_org
				};
				this.setState(this.state);
			} else {
				props.button.setButtonDisabled([ 'lowlevelcode' ], true);
			}
			if (pk_org) {
				this.state.curOrg = {
					refname: pk_org_d,
					refpk: pk_org
				};
				this.setState(this.state);
			}
			this.loadTreeData();
			callback && callback();
		});
	};
	/**
     * 处理树数据  树数据 查询回来后都带有children属性，这里需要去掉为空的children
     * @param data
     * @returns {*}
     */
	dealTreeData = (data) => {
		let deleteDataChildrenProp = function(node) {
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
	//BOM维护跳转到数据管理页面进行数据检测
	dataInspectFromBom = (data) => {
		ajax({
			url: urls.linkdetect,
			data: { cbomid: data },
			success: (res) => {
				let dataBody =
					this.state.dataBody +
					res.data.message +
					this.state.json['10140DAMA2-000001'] +
					'<br/><br/>' +
					this.state.json['10140DAMA2-000002']; /* 国际化处理： 对BOM与工艺路线一致性检测完成,数据检测完毕*/
				this.setState({ dataBody });
			},
			error: (err) => {
				console.log(err, 'err');
			}
		});
	};
	//加载树节点数据
	loadTreeData = () => {
		let cbomid = this.props.getUrlParam('cbomid');
		this.props.syncTree.setSyncTreeData(this.config.treeId, this.dealTreeData(this.treeData));
		//展开节点  设置默认展开项
		this.props.syncTree.openNodeByPk(this.config.treeId, this.root.refpk);
		this.props.syncTree.setNodeDisable(this.config.treeId, false);
		if (cbomid) {
			this.setState(
				{
					pks: [ 'bomrtyzx' ],
					dataHead: `${this.state.json['10140DAMA2-000013']}${this.state.json['10140DAMA2-000014']}${this
						.state.time}` /* 国际化处理： 数据检测开始,检测日期*/,
					dataBody: this.state.json['10140DAMA2-000003'] /* 国际化处理： 开始检测BOM与工艺路线一致性......<br/>*/
				},
				() => {
					this.props.syncTree.setNodeChecked(this.config.treeId, [ 'bomrtyzx' ]);
					this.props.button.setButtonDisabled([ 'datainspect' ], false);
					this.dataInspectFromBom(cbomid);
				}
			);
		}
	};
	//获取树所有节点pk
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
	//是否选中所有子节点
	selectAllLeafNode = (data, refpk) => {
		let flag = true;
		for (let i = 0; i < data.length; i++) {
			const element = data[i].key;
			if (!refpk.includes(element)) {
				flag = false;
				break;
			}
		}
		return flag;
	};
	//选中树节点
	onCheckTree = (props, refpk, data) => {
		let pks = this.getTreeAllPks(this.treeData);
		let statePk = this.state.pks;
		//判断当前选中的节点是不是根节点
		if (data.node.props.refpk == this.root.refpk) {
			if (statePk.includes(data.node.props.refpk)) {
				//取消全选
				refpk = [];
				this.props.syncTree.setNodeChecked(this.config.treeId, refpk);
			} else {
				//全选
				pks.push(this.root.refpk);
				refpk = pks;
				this.props.syncTree.setNodeChecked(this.config.treeId, refpk);
			}
		} else {
			//当前选中的不是根节点
			//当前节点上次已选中
			if (statePk.includes(data.node.props.refpk)) {
				if (data.node.props.children) {
					for (let i = 0; i < data.node.props.children.length; i++) {
						const element = data.node.props.children[i].key;
						refpk.map((item, index) => {
							if (item == element) {
								refpk.splice(index, 1);
							}
						});
					}
					refpk.map((item, index) => {
						if (item == this.root.refpk) {
							refpk.splice(index, 1);
						}
					});
					refpk = [ ...new Set(refpk) ];
					this.props.syncTree.setNodeChecked(this.config.treeId, refpk);
				} else {
					refpk.map((item, index) => {
						if (item == data.node.props.pid) {
							refpk.splice(index, 1);
						}
					});
					refpk.map((item, index) => {
						if (item == this.root.refpk) {
							refpk.splice(index, 1);
						}
					});
					this.props.syncTree.setNodeChecked(this.config.treeId, refpk);
				}
			} else {
				let parentNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, data.node.props.pid);
				if (data.node.props.children) {
					let flag = this.selectAllLeafNode(parentNode.children, refpk);
					if (flag) {
						refpk.push(this.root.refpk);
					}
					data.node.props.children.map((item) => {
						refpk.push(item.key);
					});
					refpk = [ ...new Set(refpk) ];
					this.props.syncTree.setNodeChecked(this.config.treeId, refpk);
				} else {
					let flag = this.selectAllLeafNode(parentNode.children, refpk);
					if (flag) {
						if (data.node.props.pid == this.root.refpk) {
							refpk.push(data.node.props.pid);
						} else {
							let parentNode = this.props.syncTree.getSyncTreeValue(this.config.treeId, this.root.refpk);
							let flag = '';
							refpk.push(data.node.props.pid);
							flag = this.selectAllLeafNode(parentNode.children, refpk);
							if (flag) {
								refpk.push(this.root.refpk);
							}
						}
					}
					this.props.syncTree.setNodeChecked(this.config.treeId, refpk);
				}
			}
		}
		this.setState({ pks: refpk });
		this.dataInspectBurton(this.state.curOrg, this.state.time, refpk);
	};
	//点击树节点
	onSelectTree = (refpk, curNode, isCheck, node) => {
		let statePk = [ ...this.state.pks ];
		if (statePk.includes(refpk)) {
			statePk.map((item, index) => {
				if (item == refpk) {
					statePk.splice(index, 1);
				}
			});
		} else {
			statePk.push(refpk);
		}
		this.props.syncTree.cancelSelectedNode(this.config.treeId);
		this.onCheckTree('', statePk, node);
	};
	//按钮点击事件
	onButtonClick = (props, id) => {
		switch (id) {
			case 'datainspect':
				this.setState(
					{
						dataHead: `${this.state.json['10140DAMA2-000013']}${this.state.json['10140DAMA2-000014']}${this
							.state.time}`
					} /* 国际化处理： 数据检测开始,检测日期*/,
					this.dataInspect('datainspect')
				);
				break;
			case 'lowlevelcode':
				this.setState(
					{
						dataHead: `${this.state.json['10140DAMA2-000015']}${this.state.time}<br/>
						${this.state.json['10140DAMA2-000016']}${new Date()
							.toLocaleString('chinese', { hour12: false })
							.replace(/\//g, '-')}<br/>
							${this.state.json['10140DAMA2-000017']}` /* 国际化处理： 底层码生成日期 底层码生成运算开始时间 开始生成底层码*/
					},
					this.lowlevelcode('')
				);
				break;
			default:
				break;
		}
	};
	//数据监测按钮控制
	dataInspectBurton = (...value) => {
		if (Object.keys(value[0]).length == 0 || !value[1] || value[2].length == 0) {
			this.props.button.setButtonDisabled([ 'datainspect' ], true);
		} else {
			this.props.button.setButtonDisabled([ 'datainspect' ], false);
		}
	};
	//底层码生成按钮控制
	lowlevelcodeButton = (...value) => {
		if (Object.keys(value[0]).length == 0 || !value[1]) {
			this.props.button.setButtonDisabled([ 'lowlevelcode' ], true);
		} else {
			this.props.button.setButtonDisabled([ 'lowlevelcode' ], false);
		}
	};
	//选择库存计划
	onOrgChange = (value) => {
		if (Object.keys(value).length == 0) {
			this.setState({ curMaterial: '' });
		}
		this.dataInspectBurton(value, this.state.time, this.state.pks);
		this.lowlevelcodeButton(value, this.state.time);
		this.setState({ curOrg: value });
	};
	//选择物料
	onMaterialChange = (value) => {
		this.setState({ curMaterial: value });
	};
	//选择日期
	onChangeTime = (value) => {
		this.dataInspectBurton(this.state.curOrg, value, this.state.pks);
		this.lowlevelcodeButton(this.state.curOrg, value);
		this.setState({ time: value });
	};
	//数据检测
	dataInspect = () => {
		let marcodes = [],
			marids = [],
			nodeClass = [ [], [], [], [] ]; //检测对象按父级分类
		let nodeName = [
			this.state.json['10140DAMA2-000004'],
			this.state.json['10140DAMA2-000005'],
			this.state.json['10140DAMA2-000006'],
			this.state.json['10140DAMA2-000007']
		]; /* 国际化处理： 数据关系,BOM关系,工艺路线,BOM与工艺路线一致性*/
		for (const item of this.state.pks) {
			let pk = item.substr(0, 2);
			switch (pk) {
				case 'sj':
					nodeClass[0].push(item);
					break;
				case 'bo':
					if (item == 'bomrtyzx') {
						nodeClass[3] = [ 'bomrtyzx' ];
					} else {
						nodeClass[1].push(item);
					}
					break;
				case 'rt':
					nodeClass[2].push(item);
					break;
				default:
					break;
			}
		}
		for (const item of this.state.curMaterial) {
			marcodes.push(item.refcode);
			marids.push(item.refpk);
		}
		let requestParam = {
			pk_group: getBusinessInfo().groupId,
			pk_org: this.state.curOrg.refpk,
			detectdate: this.state.time,
			marcodes: marcodes,
			marids: marids,
			conds: []
		};
		let flag = 0;
		let startTitle = '';
		for (let i = 0; i < nodeClass.length; i++) {
			const element = nodeClass[i];
			if (element.length > 0) {
				flag = i;
				startTitle = this.state.json['10140DAMA2-000008'] + nodeName[i]; /* 国际化处理： 开始检测*/
				break;
			}
		}
		let ajaxA = (flag) => {
			let nextStartTitle = '',
				endTitle = '';
			if (flag == nodeClass.length) {
				this.setState({
					dataBody: this.state.dataBody + this.state.json['10140DAMA2-000002']
				}); /* 国际化处理： 数据检测完毕*/
				return;
			}
			for (let i = 0; i < nodeClass.length; i++) {
				const element = nodeClass[i];
				if (flag == i) {
					requestParam.conds = element;
					endTitle =
						this.state.json['10140DAMA2-000009'] +
						nodeName[i] +
						this.state.json['10140DAMA2-000010']; /* 国际化处理： 对,检测完成*/
					++flag;
					break;
				}
			}
			if (flag < nodeClass.length) {
				for (let i = flag; i < nodeClass.length; i++) {
					const element = nodeClass[i];
					if (element.length > 0) {
						nextStartTitle = this.state.json['10140DAMA2-000008'] + nodeName[i]; /* 国际化处理： 开始检测*/
						break;
					}
				}
			} else {
				nextStartTitle = '';
			}

			if (requestParam.conds.length > 0) {
				ajax({
					url: urls.detectUrl,
					data: requestParam,
					success: (res) => {
						let dataBody = nextStartTitle
							? this.state.dataBody +
								res.data.message +
								endTitle +
								'<br/><br/>' +
								nextStartTitle +
								'<br/>'
							: this.state.dataBody + res.data.message + endTitle + '<br/><br/>';
						this.setState({ dataBody }, () => {
							ajaxA(flag);
						});
					},
					error: (err) => {
						let dataBody = nextStartTitle
							? this.state.dataBody + err.message + endTitle + '<br/><br/>' + nextStartTitle + '<br/>'
							: this.state.dataBody + err.message + endTitle + '<br/><br/>';
						this.setState({ dataBody }, () => {
							ajaxA(flag);
						});
					}
				});
			} else {
				nextStartTitle = '';
				ajaxA(flag);
			}
		};
		this.setState({ dataBody: startTitle + '<br/>' }, ajaxA(flag));
	};
	//底层码生成
	lowlevelcode = () => {
		let requestParam = {
			pk_group: getBusinessInfo().groupId,
			pk_org: this.state.curOrg.refpk,
			gendate: this.state.time
		};
		ajax({
			url: urls.getCodeUrl,
			data: requestParam,
			success: (res) => {
				this.setState({ dataBody: res.data.message });
			},
			error: (err) => {
				this.setState({
					dataBody: this.state.json['10140DAMA2-000011'] + err.message
				}); /* 国际化处理： 底层码生成过程出错<br/>*/
			}
		});
	};
	render() {
		const { button, ncmodal, DragWidthCom } = this.props;
		const { createButtonApp } = button;
		let { createModal } = ncmodal; //模态框
		/**
         * 树参数
         **/
		let treeConfig = {
			treeId: this.config.treeId,
			checkable: true, //显示复选框
			needEdit: false, //不可编辑
			showLine: true, //显示连线
			needSearch: false, //是否需要搜索框
			onCheckTree: this.onCheckTree, //选中
			onSelectTree: this.onSelectTree //点击
		};
		return (
			<div className="nc-bill-list">
				{/* 头部 header*/}
				<div className="nc-bill-header-area">
					{/* 标题 title*/}
					<div className="header-title-search-area">
						<h2 className="title-search-detail">
							{this.state.json ? this.state.json['10140DAMA-000000'] : '10140DAMA-000000'}
						</h2>
					</div>
					{/* 按钮组 btn-group*/}
					<div className="header-button-area">
						{createButtonApp({
							area: 'main-action',
							buttonLimit: 3,
							onButtonClick: this.onButtonClick,
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				<div className="nc-bill-search-area" style={{ display: 'flex' }}>
					{/*业务单元选择区域*/}
					<div className="search-box" style={{ paddingRight: 10 }}>
						<StockPlanGridRef
							value={this.state.curOrg}
							onChange={this.onOrgChange.bind(this)}
							queryCondition={{
								GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter'
							}}
						/>
					</div>
					{/*物料选择区域*/}
					<div className="search-box" style={{ paddingRight: 10 }}>
						<MaterialBasClassTreeRef
							disabled={this.state.curOrg.refpk ? false : true}
							value={this.state.curMaterial}
							isMultiSelectedEnabled={true}
							onChange={this.onMaterialChange.bind(this)}
							queryCondition={{
								unitPks: this.state.curOrg.refpk
							}}
						/>
					</div>
					{/*时间选择区域*/}
					<div className="search-box" style={{ paddingRight: 10 }}>
						<NCDatePicker
							placeholder={this.state.json['10140DAMA2-000012']} /* 国际化处理： 请选择日期*/
							value={this.state.time}
							showToday={true}
							onChange={this.onChangeTime}
						/>
					</div>
				</div>
				<div className="tree-card">
					<DragWidthCom
						// 左树区域
						leftDom={<DataManageTree treeConfig={treeConfig} syncTree={this.props.syncTree} />}
						// 右卡片区域
						rightDom={
							<div className="data-manage">
								<div className="card-head">
									<p>{this.state.json['10140DAMA2-000018']}</p> {/* 国际化处理： 数据检测的内容包括*/}
									<p>{this.state.json['10140DAMA2-000019']}</p> {/* 国际化处理： 一、工艺路线、BOM关系的检测*/}
									<p>{this.state.json['10140DAMA2-000020']}</p> {/* 国际化处理： 二、各种基础数据之间的关联检测*/}
								</div>
								<div className="card-content">
									<p dangerouslySetInnerHTML={{ __html: this.state.dataHead }} />
									<p dangerouslySetInnerHTML={{ __html: this.state.dataBody }} />
								</div>
							</div>
						}
						defLeftWid="22%"
					/>
				</div>
			</div>
		);
	}
}
DataManage = createPage({})(DataManage);
ReactDOM.render(<DataManage />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65