//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { createPage, base, ajax, toast, print, high, promptBox, createPageIcon } from 'nc-lightapp-front';
import Utils from '../../../public/utils';
import './index.less';
import { config } from '../config/index';
const { formId, treeId, bodyvosId, ajaxurl, keys } = config;
const { NCAffix, NCMessage, NCPopconfirm, NCCheckbox, NCFormControl, NCDiv } = base;
const { PrintOutput } = high;
import { initTemplate } from '../initTemplate/index';

let allTree = {};
//0001HR10000000002MD5

/**
 * author zhaochxs
 *
 */

function convertGridEnablestate(rows, type = '', enablestate = 'enablestate') {
	if (rows && rows.length > 0) {
		rows.map((ele, key) => {
			if (type == 'number') {
				if (ele.values[enablestate].value === true) {
					ele.values[enablestate].value = '2';
				} else if (ele.values[enablestate].value === false) {
					ele.values[enablestate].value = '3';
				}
			} else if (type == 'boolean') {
				if (ele.values[enablestate].value === '2') {
					ele.values[enablestate].value = true;
				} else if (ele.values[enablestate].value === '1' || ele.values[enablestate].value === '3') {
					ele.values[enablestate].value = false;
				}
			} else {
				if (ele.values[enablestate].value === '2') {
					ele.values[enablestate].value = true;
				} else if (ele.values[enablestate].value === '1' || ele.values[enablestate].value === '3') {
					ele.values[enablestate].value = false;
				} else if (ele.values[enablestate].value === true) {
					ele.values[enablestate].value = '2';
				} else if (ele.values[enablestate].value === false) {
					ele.values[enablestate].value = '3';
				} else {
					ele.values[enablestate].value = '1';
				}
			}
		});
	}
	return rows;
}

class AmCategoryTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showDisable: '0',
			currentNODE: {},
			//o:false   1:true
			copyflag: '0',
			copycode: '',
			searchValue: '',
			json: {},
			inlt: null
		};

		this.config = props.config;
		this.loadTree = this.loadTree.bind(this);
		this.dealTreeData = this.dealTreeData.bind(this);
	}

	componentDidMount() {
		//???????????????????????????init??????

		let callback = (json, status, inlt) => {
			// json ??????json??????????????? status??? ???????????????json????????????????????????????????????????????????????????????????????????????????? inlt??? ???????????????????????????????????????
			//alert(status)
			console.log(json);
			//alert(json)

			if (status) {
				initTemplate.call(this, this.props, json, inlt); // ?????????????????????????????????????????????????????????????????????????????? ?????????json???????????????????????????????????????intemplate???????????????
				this.setState({ json, inlt }); // ??????json???inlt?????????state??????????????????

				/*this.props.button.setButtonsVisible({
                    'copy':true,
                    'save':false,
                    'saveadd':false,
                    'cancel':false,
                    'addline':false,
                    'delline':false,
                    'formoprbtngrp':false,
                });
                this.props.button.setDisabled({
                    print:true,
                    output:true
                })*/

				this.root = {
					//???????????????????????????????????????
					isleaf: false,
					key: 'ROOT',
					title: this.state.json['10141505-000004'] /* ?????????????????? ????????????*/,
					id: 'ROOT',
					innercode: 'ROOT',
					pid: '',
					nodeData: { pcode: '', enablestate: '2' },
					refname: this.state.json['10141505-000004'] /* ?????????????????? ????????????*/,
					refpk: 'ROOT'
				};

				//??????????????????????????????
				this.setFormStatus(this.props, formId, 'browse');
				this.props.form.EmptyAllFormValue(formId);
				this.props.cardTable.setTableData(bodyvosId, { areacode: bodyvosId, rows: [] });
				this.loadTree(this.root.refpk, this.root.refpk);
			} else {
				console.log('????????????????????????'); // ???????????????????????????????????????
			}
		};
		this.props.MultiInit.getMultiLang({ moduleId: '10141505', domainName: 'uapbd', callback });
	}

	/**
     * form??????????????????
     * @param props
     * @param formId
     * @param status
     */
	setFormStatus(props, formId, status) {
		props.form.setFormStatus(formId, status);

		if (status == 'edit' || status == 'add') {
			window.onbeforeunload = () => {
				return '';
			};
		} else {
			window.onbeforeunload = null;
		}

		let cardData = this.props.createMasterChildData(props.config.pageCodeForm, formId, bodyvosId);
		let rows = [];
		if (cardData && cardData.head && cardData.head.head) {
			if (status == 'edit' || status == 'add') {
				rows = convertGridEnablestate(cardData.head.head.rows, 'number');
			} else {
				rows = convertGridEnablestate(cardData.head.head.rows, 'boolean');
			}
			this.props.form.setAllFormValue({ [formId]: { rows: rows } });
		}
	}

	//pid ?????????????????????refpk ???????????????
	loadTree(pid, refpk, callback) {
		//???????????????(??????????????????)

		let requestParam = {
			showDisable: this.state.showDisable,
			nodeType: this.config.NODE_TYPE
		};
		ajax({
			url: ajaxurl.loadtree,
			data: requestParam,
			success: (result) => {
				console.log(result);
				if (result.success) {
					result.data[0] && this.onSelectTree('pk', result.data[0]);
					let data = [ Object.assign({ ...this.root }, { children: result.data }) ];
					//?????????  ??????????????????
					this.props.syncTree.setSyncTreeData(treeId, this.dealTreeData(data));
					//????????????  ?????????????????????
					this.props.syncTree.openNodeByPk(treeId, pid);
					// ????????????????????????????????????
					result.data[0] && this.props.syncTree.setNodeSelected(treeId, result.data[0].refpk);
					// this.props.syncTree.setNodeSelected(treeId, refpk);
					this.changeEnableTips.call(this, this.props);
					this.setState({ searchValue: '' });
					this.updateButtonStatus(this.props);
					callback && callback();
				}
			}
		});
	}
	dealTreeData(data) {
		let deleteDataChildrenProp = function(node) {
			if (!node.children || node.children.length == 0) {
				node.isleaf = true;

				delete node.children;
			} else {
				node.isleaf = false;
				node.children.forEach((e) => {
					deleteDataChildrenProp(e);
				});
			}
		};
		data.forEach((e) => {
			deleteDataChildrenProp(e);
		});
		return data;
	}
	//??????????????????
	updateButtonStatus(props) {
		let formstatus = props.form.getFormStatus(formId);
		let tablestatus = props.cardTable.getStatus(bodyvosId);
		let dataflag =
			props.form.getFormItemsValue(formId, 'pk_category') &&
			props.form.getFormItemsValue(formId, 'pk_category').value;

		//???????????????
		props.button.setButtonsVisible({
			query: formstatus === 'browse' || formstatus == undefined,
			copy: formstatus === 'browse' || formstatus == undefined,
			//????????????????????? ???????????? ???????????????????????????????????????
			saveadd: formstatus === 'edit' || formstatus === 'add',
			save: formstatus === 'edit' || formstatus === 'add',
			formoprbtngrp: formstatus === 'edit' || formstatus === 'add',
			cancel: formstatus === 'edit' || formstatus === 'add',
			addline: tablestatus === 'edit' || tablestatus === 'add',
			delline: tablestatus === 'edit' || tablestatus === 'add',
			print: formstatus === 'browse' || formstatus == undefined,
			output: formstatus === 'browse' || formstatus == undefined,
			refresh: formstatus === 'browse' || formstatus == undefined
		});

		this.state.showOffDisable = formstatus === 'browse' || formstatus == undefined ? false : true;
		this.state.searchBox = formstatus === 'browse' || formstatus == undefined ? false : true;

		props.form.setFormItemsDisabled(formId, {
			enablestate: !dataflag || formstatus === 'edit' || formstatus === 'add'
		});
		props.form.setFormItemsDisabled(formId, { special_flag: formstatus === 'browse' || formstatus == undefined });
		props.form.setFormItemsDisabled(formId, {
			associate_fa_flag: formstatus === 'browse' || formstatus == undefined
		});

		props.button.setDisabled({
			copy: !dataflag,
			print: !dataflag,
			output: !dataflag
		});

		let selectNode = this.props.syncTree.getSelectNode(treeId);
		props.syncTree.setNodeDisable(treeId, formstatus === 'edit' || formstatus === 'add'); //?????????????????????????????????
		props.syncTree.setTreeEdit(treeId, !(formstatus === 'edit' || formstatus === 'add')); //??????????????????
		selectNode && props.syncTree.setNodeSelected(treeId, selectNode.refpk);
	}
	//??????????????????
	onButtonClick(props, id) {
		let formdata = props.form.getAllFormValue(formId);

		let pk_category = formdata.rows[0].values.pk_category.value;

		if (!formdata) return;

		let oldFormData = {
			head: formdata
		};
		let cardData = {};
		let saveData = {};
		let parentNodeCode = ''; //.setNodeSelected(treeId, key.refpk);

		switch (id) {
			case 'save':
				this.props.cardTable.filterEmptyRows(bodyvosId, keys);
				parentNodeCode = this.props.syncTree.getSelectNode(treeId).nodeData.pcode;
				cardData = this.props.createMasterChildData(props.config.pageCodeForm, formId, bodyvosId);
				saveData = {
					userjson: JSON.stringify({
						nodeType: this.config.NODE_TYPE,
						pageid: props.config.pageCodeForm,
						parentNodeCode: parentNodeCode,
						copyflag: this.state.copyflag,
						copycode: this.state.copycode
					}),
					head: cardData.head,
					body: cardData.body,
					pageid: cardData.pageid
					//'data':cardData
				};

				let saveFun = () => {
					ajax({
						url: ajaxurl.savecategory,
						data: saveData,
						success: (res) => {
							let { success, data } = res;
							if (success) {
								if (res.hasOwnProperty('data')) {
									let { billCard, treeData } = data;
									if (treeData[0].hasOwnProperty('children') && treeData[0].children.length == 0) {
										delete treeData[0].children;
									}

									if (billCard.head && billCard.head[formId]) {
										convertGridEnablestate(billCard.head[formId].rows, 'boolean');

										this.props.form.setAllFormValue({ [formId]: billCard.head[formId] });
									}
									if (billCard.body && billCard.body[bodyvosId]) {
										this.props.cardTable.setTableData(bodyvosId, billCard.body[bodyvosId]);
									} else {
										this.props.cardTable.setTableData(bodyvosId, { rows: [] });
									}

									this.setFormStatus(this.props, formId, 'browse');
									this.props.cardTable.setStatus(bodyvosId, 'browse');
									//????????????????????????????????????

									if (parentNodeCode == treeData[0].nodeData.pcode) {
										//props.syncTree.editNodeSuccess(treeId,treeData[0]);
										props.asyncTree.editTreeData(treeId, treeData[0]);
									} else {
										this.props.asyncTree.delTreeData(treeId, treeData[0].refpk);
										this.props.asyncTree.addTreeData(treeId, this.dealTreeData(treeData));
									}

									let tree = this.props.syncTree.getSyncTreeValue(treeId);

									this.props.syncTree.openNodeByPk(treeId, treeData[0].pid);
									this.props.syncTree.setNodeSelected(treeId, treeData[0].refpk);
									this.changeEnableTips.call(this, this.props);
									this.updateButtonStatus(props);
									toast({
										title: this.state.json['10141505-000005'],
										color: 'success'
									}); /* ?????????????????? ???????????????*/
								}
							}
						},
						error: (res) => {
							convertGridEnablestate(formdata.rows, 'boolean');
							toast({
								color: 'danger',
								content: res.message,
								title: this.state.json['10141505-000006']
							}); /* ?????????????????? ?????????*/
						}
					});
				};

				props.validateToSave(saveData, saveFun, { head: 'form', [bodyvosId]: 'cardTable' }, 'card');
				break;
			case 'saveadd':
				parentNodeCode = this.props.syncTree.getSelectNode(treeId).nodeData.pcode;
				this.props.cardTable.filterEmptyRows(bodyvosId, keys);
				cardData = this.props.createMasterChildData(props.config.pageCodeForm, formId, bodyvosId);
				saveData = {
					userjson: JSON.stringify({
						nodeType: this.config.NODE_TYPE,
						pageid: props.config.pageCodeForm,
						parentNodeCode: parentNodeCode,
						copyflag: this.state.copyflag,
						copycode: this.state.copycode
					}),
					head: cardData.head,
					body: cardData.body,
					pageid: cardData.pageid
				};

				let saveaddFunc = () => {
					ajax({
						url: ajaxurl.savecategory,
						data: saveData,
						success: (res) => {
							let { success, data } = res;
							if (success) {
								let { billCard, treeData } = data;
								if (res.hasOwnProperty('data')) {
									this.setFormStatus(this.props, formId, 'browse');
									this.props.cardTable.setStatus(bodyvosId, 'browse');

									if (parentNodeCode == treeData[0].nodeData.pcode) {
										//props.syncTree.editNodeSuccess(treeId,treeData[0]);
										props.asyncTree.editTreeData(treeId, treeData[0]);
									} else {
										this.props.asyncTree.delTreeData(treeId, treeData[0].refpk);
										this.props.asyncTree.addTreeData(treeId, this.dealTreeData(treeData));
									}
									this.props.syncTree.openNodeByPk(treeId, treeData[0].pid);
									this.props.syncTree.setNodeSelected(treeId, treeData[0].refpk);
									this.changeEnableTips.call(this, this.props);
									this.updateButtonStatus(props);
									this.onAddTreeClick(treeData[0]);
									//???????????????????????????????????????????????????????????????????????????????????????????????????
									//toast({content:'???????????????',title:'??????'});
								}
							}
						},
						error: (res) => {
							convertGridEnablestate(formdata.rows, 'boolean');
							toast({
								color: 'danger',
								content: res.message,
								title: this.state.json['10141505-000006']
							}); /* ?????????????????? ?????????*/
						}
					});
				};
				props.validateToSave(saveData, saveaddFunc, { head: 'form', [bodyvosId]: 'cardTable' }, 'card');

				break;
			case 'copy':
				this.state.copyflag = '1';
				this.copyflag = 'copy';
				this.state.copycode = this.props.form.getFormItemsValue(formId, 'category_code').value;
				this.setState(this.state);
				this.setFormStatus(this.props, formId, 'add');
				this.props.cardTable.setStatus(bodyvosId, 'edit');
				let tableData = this.props.cardTable.getAllData(bodyvosId);
				tableData &&
					tableData.rows &&
					tableData.rows.forEach((item) => {
						item.values['param_index'].disabled = false;
						item.values['classid'].disabled = false;
						//?????????????????????????????????????????????
						//item.values['show_name'].disabled = 'on';
						item.values['input_length'].disabled = false;
						item.values['input_digit'].disabled = false;
						item.values['nullflag'].disabled = false;
						item.father = false;
						item.operate = 'copy';
					});
				if (tableData && tableData.rows) {
					this.props.cardTable.setTableData(bodyvosId, { areacode: bodyvosId, rows: tableData.rows });
				}
				this.props.form.setFormItemsValue(formId, { pk_category: {} });
				this.props.form.setFormItemsValue(formId, { category_code: '' });
				this.props.form.setFormItemsDisabled(formId, { category_code: false });
				this.updateButtonStatus(props);
				break;
			case 'cancel':
				promptBox({
					color: 'warning',
					title: this.state.json['10141505-000007'] /* ?????????????????? ??????*/,
					content: this.state.json['10141505-000008'] /* ?????????????????? ?????????????????????*/,
					beSureBtnClick: () => {
						//???????????? ???state???????????????????????? ????????????
						let key = props.syncTree.getSelectNode(treeId);
						props.form.cancel(formId);
						this.setFormStatus(props, formId, 'browse');
						props.cardTable.resetTableData(bodyvosId);
						setTimeout(() => {
							props.cardTable.setStatus(bodyvosId, 'browse');
							this.updateButtonStatus(props);
						}, 10);
					}
				});
				break;
			case 'query':
				props.linkTo('/uapbd/ambase/category/querypage/index.html', props.config);
				break;
			case 'refresh':
				this.props.form.EmptyAllFormValue(formId);
				this.props.cardTable.setTableData(bodyvosId, { areacode: bodyvosId, rows: [] });
				this.loadTree(this.root.refpk, this.root.refpk, () => {
					toast({ color: 'success', title: this.state.json['10141505-000009'] }); /* ?????????????????? ???????????????*/
				});
				break;
			case 'print':
				this.output('print');
				break;
			case 'output':
				this.output('output');
				break;
			default:
				break;
		}
	}

	output(type = '') {
		let formData = this.props.form.getAllFormValue(formId);
		let pks = [];
		formData.rows.forEach((row) => {
			pks.push(row.values.pk_category.value);
		});
		let data = {
			funcode: this.props.config.funcode, //??????????????????
			nodekey: 'cardPrint', //??????????????????
			//userjson:JSON.stringify(pks),
			oids: pks,
			outputType: type
		};
		if (type == 'print') {
			//??????
			print('pdf', ajaxurl.printcategorycard, data);
		} else if (type == 'output') {
			this.state.data = data;
			this.setState(this.state);
			this.refs.printOutput.open();
		}
	}

	//????????????pk??????????????????
	loadCategoryFormData(pcode) {
		let _this = this;
		ajax({
			url: ajaxurl.query4form,
			data: {
				pcode: pcode,
				nodeType: this.config.NODE_TYPE,
				pageCode: this.props.config.pageCodeForm
			},
			success: (res) => {
				if (res.success) {
					if (res.hasOwnProperty('data')) {
						this.loadFormTable(res);
						this.changeEnableTips.call(this, this.props);
						this.updateButtonStatus(this.props);
					}
				}
			}
		});
	}

	//???????????????????????????
	loadFormTable(res) {
		//????????????
		Utils.showFormular(this.props, res, {
			[formId]: 'form',
			[bodyvosId]: 'cardTable'
		});
		let returndata = res.data;
		returndata.form[formId].rows = convertGridEnablestate(returndata.form[formId].rows, 'boolean');
		this.props.form.setAllFormValue({ [formId]: returndata.form[formId] });
		if (returndata.grid && returndata.grid[bodyvosId]) {
			let rows = returndata.grid[bodyvosId].rows;
			this.props.cardTable.setTableData(bodyvosId, returndata.grid[bodyvosId]);
		} else {
			this.props.cardTable.setTableData(bodyvosId, { areacode: bodyvosId, rows: [] });
		}
	}

	//?????????????????????
	onSelectTree(pk, node) {
		//????????????????????????form?????????
		this.props.form.EmptyAllFormValue(formId);
		this.props.cardTable.setTableData(bodyvosId, { areacode: bodyvosId, rows: [] });
		if (node.refpk === 'ROOT') {
			this.updateButtonStatus(this.props);
			return;
		}
		this.loadCategoryFormData(node.nodeData.pcode);
	}

	onAfterFormEvent(props, moduleI, key, value) {
		let _this = this;
		let formstatus = props.form.getFormStatus(formId);
		// ?????????form ??????????????????
		if (formstatus === 'browse' || typeof formstatus === 'undefined') {
			//?????????????????? false ??? true ??????
			let flag = value.value;
			//???????????????formdata ???enablestate?????????????????????????????????????????????
			let curentformData = props.form.getAllFormValue(moduleI);

			let selectNode = this.props.syncTree.getSelectNode(treeId);
			let existsLevel = !!selectNode.children;
			// let modelContent = '';
			// if (existsLevel) {
			// 	modelContent = !flag
			// 		? this.state.json['10141505-000010']
			// 		: this.state.json['10141505-000011']; /* ?????????????????? ???????????????????????????????????????????????????????????????????????????,?????????????????????*/
			// } else {
			// 	modelContent = !flag
			// 		? this.state.json['10141505-000012']
			// 		: this.state.json['10141505-000011']; /* ?????????????????? ?????????????????????,?????????????????????*/
			// }
			let formdata = props.form.getAllFormValue(formId);
			//???????????????????????????????????????

			switch (key) {
				case 'enablestate':
					this.enablestateBtnClick.call(this, props, curentformData, flag);
					// promptBox({
					// 	color: 'warning',
					// 	title: this.state.json['10141505-000013'] /* ?????????????????? ??????*/,
					// 	content: modelContent,
					// 	closeModalEve: () => {
					// 		this.props.form.setFormItemsValue(formId, { enablestate: { value: !flag } });
					// 	},
					// 	cancelBtnClick: () => {
					// 		this.props.form.setFormItemsValue(formId, { enablestate: { value: !flag } });
					// 	},
					// 	beSureBtnClick: () => {

					// 	}
					// });
					break;
				default:
					break;
			}
		}
	}

	enablestateBtnClick(props, curentformData, flag) {
		curentformData.rows = convertGridEnablestate(curentformData.rows, 'number');
		ajax({
			url: !flag ? ajaxurl.disablecategory : ajaxurl.enablecategory,
			data: {
				userjson: JSON.stringify({
					nodeType: this.config.NODE_TYPE,
					disableLevle: '1'
				}),
				pageid: props.config.pageCodeForm,
				model: curentformData
			},
			success: (res) => {
				let { data, success } = res;

				if (success) {
					data.returnForm[formId].rows = convertGridEnablestate(data.returnForm[formId].rows, 'boolean');

					props.form.setAllFormValue({ [formId]: data.returnForm[formId] });
					//?????????  ***
					props.asyncTree.editTreeData(treeId, data.treeData[0]);

					toast({
						title: !flag ? this.state.json['10141505-000014'] : this.state.json['10141505-000015'],
						color: 'success'
					}); /* ?????????????????? ???????????????,???????????????*/
				} else {
					toast({
						color: 'danger',
						content: !flag ? this.state.json['10141505-000016'] : this.state.json['10141505-000017']
					}); /* ?????????????????? ???????????????,???????????????*/
					this.props.form.setFormItemsValue(formId, { enablestate: { value: !flag } });
				}
			},
			error: (res) => {
				toast({ color: 'warning', content: res.message });
				this.props.form.setFormItemsValue(formId, { enablestate: { value: !flag } });
			}
		});
	}
	onBeforeEvent(props, moduleId, item, index, value, record) {
		/*
        //?????????????????????????????????
        if(item=='input_length') {
            //!***
            //return !this.fieldDisable('input_length',record.values.classid.value);
            return !this.fieldDisable('input_length',record.classtype);
        }
        //???????????????????????????
        if(item=='input_digit') {
            //!***
           // return !this.fieldDisable('input_digit',record.values.classid.value);
            return !this.fieldDisable('input_digit',record.classtype);
        }
*/

		if (item == 'input_length' || item == 'input_digit') {
			//????????????????????????????????????false???????????????
			if (!(record.values.classid && record.values.classid.value)) {
				return false;
			} else {
				//???????????????????????????
				if (!record.classtype) {
					ajax({
						url: ajaxurl['queryparam'],
						async: false,
						data: {
							searchPks: [ record.values.classid.value ],
							queryCondition: {},
							pageInfo: { pageSize: 50, pageIndex: 0 }
						},
						success: (res) => {
							if (res.data && res.data.rows && res.data.rows.length > 0) {
								record.classtype = res.data.rows[0].values.classtype.value;
							}
						}
					});
				}
			}
			return !this.fieldDisable(item, record.classtype);
		}
		return true;
	}

	onAfterTableEvent(props, moduleI, key, value, changedrows, index, record) {
		switch (key) {
			case 'classid':
				if (changedrows[0].oldvalue.value == changedrows[0].newvalue.value) {
					return;
				} else {
					//***
					//this.clearField(value.refpk,record);
					if (value && value.values && value.values.classtype) {
						record.classtype = value.values.classtype.value;
					} else {
						delete record.classtype;
					}
					this.clearField(record.classtype, record);
				}
				break;
			case 'input_length':
			case 'input_digit':
				if (value && (value > 2147483647 || value < -2147483648)) {
					toast({ color: 'warning', content: this.state.json['10141505-000033'] });
					setTimeout(() => {
						this.props.cardTable.setValByKeyAndIndex(bodyvosId, index, key, { value: '', display: '' });
					}, 1);
				}
				break;
			case 'param_index':
				if (value && (value > 20 || value < 1)) {
					toast({ color: 'warning', content: this.state.json['10141505-000034'] });
					setTimeout(() => {
						this.props.cardTable.setValByKeyAndIndex(bodyvosId, index, key, { value: '', display: '' });
					}, 1);
				}
				break;
		}
	}
	//????????????????????????????????????String,UFDouble,Integer,UFMoney?????????????????????????????????UFDouble???????????????
	clearField(classcode, record) {
		if (this.fieldDisable('input_length', classcode)) {
			record.values.input_length = { value: '', display: '' };
		}
		if (this.fieldDisable('input_digit', classcode)) {
			record.values.input_digit = { value: '', display: '' };
		}
	}
	input_lengthDisable(classcode) {
		/*if(!(classcode=='String'||classcode=='UFDouble'||classcode=='Integer'||classcode=='UFMoney')){
            return true;
        }else{
            return false;
        }*/
		//?????????(BS000010000100001001)?????????(BS000010000100001031)?????????(BS000010000100001004)?????????(BS000010000100001052)
		//???????????????????????????refcode ?????????pk??????
		//if(!(classcode=='BS000010000100001001'||classcode=='BS000010000Z00001001'||classcode=='BS000010000100001031'||classcode=='BS000010000100001004'||classcode=='BS000010000100001052')){
		if (!(classcode == '1' || classcode == '4' || classcode == '31' || classcode == '52')) {
			return true;
		} else {
			return false;
		}
	}
	input_digitDisable(classcode) {
		/*if(classcode!='UFDouble'){
            return true;
        }else{
            return false;
        }*/
		//???????????????????????????refcode ?????????pk??????
		//??????(BS000010000100001031)?????????(BS000010000100001052)
		if (classcode != '31' && classcode != '52') {
			return true;
		} else {
			return false;
		}
	}

	fieldDisable(field, classcode) {
		switch (field) {
			case 'input_length':
				return this.input_lengthDisable(classcode);
			case 'input_digit':
				return this.input_digitDisable(classcode);
			default:
				return true;
		}
	}

	onMouseEnterEve(key) {
		let formstatus = this.props.form.getFormStatus(formId);
		//??????
		let obj = {};
		if (formstatus === 'edit' || formstatus === 'add') {
			obj = {
				delIcon: false, //false:????????? true:??????; ????????????true??????
				editIcon: false,
				addIcon: false
			};
		} else {
			if (key === this.root.refpk) {
				obj = {
					delIcon: false, //false:????????? true:??????; ????????????true??????
					editIcon: false,
					addIcon: true
				};
			} else {
				obj = {
					delIcon: true, //false:????????? true:??????; ????????????true??????
					editIcon: true,
					addIcon: true
				};
			}
		}
		this.props.syncTree.hideIcon(treeId, key, obj);
	}

	//????????????
	onCheckShowDisable(val) {
		this.state.showDisable = val ? '1' : '0';
		this.setState(this.state);
		this.loadTree(this.root.refpk, this.root.refpk);
	}
	//???????????????????????????
	onAddTreeClick(key) {
		let old = this.props.form.getFormStatus(formId);
		if (old === 'edit' || old === 'add') {
			return;
		}
		// ?????????????????? ??????????????????
		this.props.syncTree.setNodeSelected(treeId, key.refpk);
		//???????????????????????????state???
		this.state.currentNODE = key;
		if (key.nodeData.enablestate != 2) {
			toast({ color: 'warning', content: this.state.json['10141505-000018'] }); /* ?????????????????? ???????????????????????????????????????????????????*/
			return;
		}

		if (key.nodeData.pcode == '') {
			//?????????????????????
			this.props.cardTable.setTableData(bodyvosId, { areacode: bodyvosId, rows: [] });
			this.props.form.EmptyAllFormValue(formId);
			this.props.form.setFormItemsValue(formId, {
				associate_fa_flag: { value: true, display: this.state.json['10141505-000019'] }
			}); /* ?????????????????? ???*/
			this.addEvent(key);
		} else {
			//form????????????????????????????????????
			if (key.refpk == this.props.form.getFormItemsValue(formId, 'pk_category').value) {
				this.addEvent(key);
			} else {
				ajax({
					url: ajaxurl.query4form,
					data: {
						pcode: key.nodeData.pcode,
						nodeType: this.config.NODE_TYPE,
						pageCode: this.props.config.pageCodeForm
					},
					success: (res) => {
						if (res.success) {
							if (res.hasOwnProperty('data')) {
								this.loadFormTable(res);
								this.addEvent(key);
							}
						}
					}
				});
			}
		}
	}

	addEvent(key) {
		this.props.form.setFormItemsDisabled(formId, { category_code: false });
		this.copyflag = 'add';
		this.state.copyflag = '0';
		this.setState(this.state);
		ajax({
			url: ajaxurl.addcategory,
			data: {
				nodeType: this.config.NODE_TYPE,
				parentNodePk: key.refpk,
				parentNodeCode: key.nodeData.pcode,
				pageCode: this.props.config.pageCodeForm
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					data[formId].rows = convertGridEnablestate(data[formId].rows, 'boolean');

					this.props.form.EmptyAllFormValue(formId);
					//form ???cancel??????????????????????????????????????????????????????????????????
					this.setFormStatus(this.props, formId, 'add');
					this.props.cardTable.setStatus(bodyvosId, 'edit');
					//?????????pk
					this.props.form.setFormItemsValue(formId, {
						category_code: { value: data[formId].rows[0].values.category_code.value, display: '' }
					});

					this.props.form.setFormItemsValue(formId, { pk_category: {} });
					this.props.form.setFormItemsValue(formId, { enablestate: { value: '2', display: '' } });

					let tableData = this.props.cardTable.getAllData(bodyvosId);
					tableData.areacode = bodyvosId;
					tableData.rows.forEach(function(item, index, array) {
						item.values['param_index'].disabled = 'on';
						item.values['classid'].disabled = 'on';
						//?????????????????????????????????????????????
						//item.values['show_name'].disabled = 'on';
						item.values['input_length'].disabled = 'on';
						item.values['input_digit'].disabled = 'on';
						item.values['nullflag'].disabled = 'on';
						item.father = true;
						item.operate = 'add';
					});
					this.props.cardTable.setTableData(bodyvosId, tableData);
					this.updateButtonStatus(this.props);
				}
			}
		});
	}

	//?????????????????????
	onEditTreeClick(key) {
		let old = this.props.form.getFormStatus(formId);
		if (old === 'edit' || old === 'add') {
			return;
		}
		// ?????????????????? ??????????????????
		this.props.syncTree.setNodeSelected(treeId, key.refpk);
		//???????????????????????????state???
		this.state.currentNODE = key;
		//??????????????????????????????????????????

		//form????????????????????????????????????
		if (key.refpk == this.props.form.getFormItemsValue(formId, 'pk_category').value) {
			this.editEvent(key);
		} else {
			ajax({
				url: ajaxurl.query4form,
				data: {
					pcode: key.nodeData.pcode,
					nodeType: this.config.NODE_TYPE,
					pageCode: this.props.config.pageCodeForm
				},
				success: (res) => {
					if (res.success) {
						if (res.hasOwnProperty('data')) {
							this.loadFormTable(res);
							this.changeEnableTips.call(this, this.props);
							this.editEvent(key);
						}
					}
				}
			});
		}
	}

	editEvent(key) {
		this.state.copyflag = '0';
		this.setState(this.state);
		this.copyflag = 'edit';
		let existleaf = key.isleaf == undefined ? false : !key.isleaf;
		let tree = this.props.syncTree.getSyncTreeValue(treeId);
		let pcode = '';
		let ss = (node, key) => {
			if (!!node.refpk && node.refpk == key.refpk) {
				return node;
			} else {
				if (node.children) {
					for (let i = 0; i < node.children.length; i++) {
						let curnode;
						curnode = ss(node.children[i], key);
						if (curnode) {
							pcode = node.nodeData.pcode;
						}
					}
				}
			}
		};
		tree.forEach((val) => {
			ss(val, key);
		});

		let requestParam = {
			nodePk: key.refpk,
			parentNodeCode: pcode,
			existsLevel: existleaf ? '1' : '0',
			nodeType: this.config.NODE_TYPE
		};

		this.setFormStatus(this.props, formId, 'edit');

		let props = this.props;
		ajax({
			url: ajaxurl.editcategory,
			data: requestParam,
			success: (result) => {
				if (result.success) {
					props.cardTable.setStatus(bodyvosId, 'edit');
					let tableData = props.cardTable.getAllData(bodyvosId);
					tableData.areacode = bodyvosId;
					if (result.data.isReferenced && existleaf) {
						tableData.rows.forEach(
							function(item, index, array) {
								item.values['param_index'].disabled = 'on';
								item.values['classid'].disabled = 'on';
								//?????????????????????????????????????????????
								//item.values['show_name'].disabled = 'on';
								item.values['input_length'].disabled = 'on';
								item.values['input_digit'].disabled = 'on';
								item.values['nullflag'].disabled = 'on';
								item.father = true;
								item.operate = 'edit';
							}.bind(this)
						);
					} else {
						tableData.rows.forEach(
							function(item, index, array) {
								result.data &&
									result.data.disableEditParams &&
									result.data.disableEditParams.forEach(function(item2) {
										if (item2 == item.values['param_index'].value) {
											item.values['param_index'].disabled = 'on';
											item.values['classid'].disabled = 'on';
											//?????????????????????????????????????????????
											//item.values['show_name'].disabled = 'on';
											item.values['input_length'].disabled = 'on';
											item.values['input_digit'].disabled = 'on';
											item.father = true;
											item.operate = 'edit';
										}
									});
								//this.fieldDisable(item);
							}.bind(this)
						);
					}

					props.cardTable.setTableData(bodyvosId, tableData);

					if (result.data.isReferenced || existleaf) {
						props.form.setFormItemsDisabled(formId, { category_code: true });
					} else {
						props.form.setFormItemsDisabled(formId, { category_code: false });
					}
					//??????????????????
					this.updateButtonStatus(this.props);
				}
			}
		});
	}

	changeEnableTips(props) {
		let validateRes = {};
		validateRes.valid = true; //??????????????????,false???????????????true?????????
		validateRes.msg = ''; //????????????

		let formData = props.form.getAllFormValue(formId);
		//????????????
		if (formData.rows[0].values['pk_category'] == undefined) {
			return;
		}
		let parent_id = formData.rows[0].values['pk_category'].value;
		if (parent_id) {
			let parentValues = props.syncTree.getSyncTreeValue(treeId, parent_id == '' ? '~' : parent_id);
			this.checkChildrenStatus(parentValues, validateRes);
		}
		if (validateRes.valid) {
			props.form.setFormPopConfirmSwitchTips(formId, 'enablestate', [
				this.state.json['10141505-000036'] /* ?????????????????? ?????????????????????*/,
				this.state.json['10141505-000037'] /* ?????????????????? ?????????????????????*/
			]);
		} else {
			props.form.setFormPopConfirmSwitchTips(formId, 'enablestate', [
				this.state.json['10141505-000036'] /* ?????????????????? ?????????????????????*/,
				validateRes.msg
			]);
		}
	}

	//???????????????????????????
	checkChildrenStatus(syncTreeNode, validateRes) {
		// ???????????????????????????????????????????????????????????????????????????
		if (syncTreeNode == undefined || syncTreeNode == null) {
			return;
		}
		if (syncTreeNode.children != null) {
			syncTreeNode.children.map((item) => {
				if (item.hasOwnProperty('children')) {
					this.checkChildrenStatus(item, validateRes);
				}
				if (item.nodeData.enablestate != 3) {
					if (item.nodeData.enablestate || item.nodeData.enablestate == 2) {
						validateRes.valid = false;
						validateRes.msg = this.state.json['10141505-000010']; /* ?????????????????? ???????????????????????????????????????????????????????????????????????????*/
						return;
					}
				}
			});
		}
	}
	//?????????????????????
	onDelTreeClick(key) {
		let old = this.props.form.getFormStatus(formId);
		if (old === 'edit' || old === 'add') {
			return;
		}
		// ?????????????????? ??????????????????
		this.props.syncTree.setNodeSelected(treeId, key.refpk);
		//???????????????????????????state???
		this.state.currentNODE = key;
		let requestParam = {};

		let message1 = this.state.json['10141505-000020']; /* ?????????????????? ?????????????????????????????????*/
		let message2 = this.state.json['10141505-000021']; /* ?????????????????? ???????????????????????????????????????????????????????????????????????????????????????*/
		promptBox({
			color: 'warning',
			title: this.state.json['10141505-000022'] /* ?????????????????? ??????*/,
			content: message1,
			beSureBtnClick: () => {
				promptBox({
					color: 'warning',
					title: this.state.json['10141505-000022'] /* ?????????????????? ??????*/,
					content: message2,
					beSureBtnClick: () => {
						requestParam = {
							pcode: key.nodeData.pcode,
							ts: key.nodeData.ts,
							isLeaf: key.isLeaf,
							nodeType: this.config.NODE_TYPE,
							delLevel: '0'
						};
						let pid = key.pid;

						ajax({
							url: ajaxurl.deletecategory,
							data: requestParam,
							success: (result) => {
								if (result.success) {
									if (result.data.status == '1') {
										let message3 = result.data.message;
										requestParam.delLevel = '1';
										promptBox({
											color: 'warning',
											title: this.state.json['10141505-000022'] /* ?????????????????? ??????*/,
											content: message3,
											beSureBtnClick: () => {
												let pid = key.pid;
												ajax({
													url: ajaxurl.deletecategory,
													data: requestParam,
													success: (result) => {
														if (result.success) {
															if (result.data.status == '0') {
																this.props.form.EmptyAllFormValue(formId);
																//?????????????????????????????????????????????
																this.props.asyncTree.delTreeData(treeId, key.refpk);
																this.props.cardTable.setTableData(bodyvosId, {
																	areacode: bodyvosId,
																	rows: []
																});
																toast({
																	title: this.state.json['10141505-000023'],
																	color: 'success'
																}); /* ?????????????????? ???????????????*/
																this.changeEnableTips.call(this, this.props);
																this.updateButtonStatus(this.props);
															}
														}
													}
												});
											}
										});
									} else if (result.data.status == '0') {
										this.props.form.EmptyAllFormValue(formId);
										//?????????????????????????????????????????????
										this.props.asyncTree.delTreeData(treeId, key.refpk);
										this.props.cardTable.setTableData(bodyvosId, { areacode: bodyvosId, rows: [] });
										this.changeEnableTips.call(this, this.props);
										toast({
											title: this.state.json['10141505-000023'],
											color: 'success'
										}); /* ?????????????????? ???????????????*/
										this.updateButtonStatus(this.props);
									}
								}
							}
						});
					}
				});
			}
		});
	}
	//????????????????????????
	getTableHead = () => {
		let { button } = this.props;
		let buttons = this.props.button.getButtons();
		let { createButtonApp } = button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{createButtonApp({
						area: 'table-actions', //??????????????????????????????
						buttonLimit: 5,
						onButtonClick: this.onTableButtonClick.bind(this)
					})}
				</div>
			</div>
		);
	};
	onTableButtonClick = (props, id) => {
		let selectNode = this.props.syncTree.getSelectNode(treeId);
		switch (id) {
			case 'addline':
				if (this.copyflag == 'edit' && !selectNode.isleaf && selectNode.refpk != 'ROOT') {
					toast({
						color: 'warning',
						content: this.state.json['10141505-000031'] /*?????????????????? ?????????????????????????????????????????????????????????!*/
					});
					return;
				}
				let num = props.cardTable.getNumberOfRows(bodyvosId); //?????????????????????
				props.cardTable.addRow(bodyvosId, num, true);
				break;
			case 'delline':
				if (this.copyflag == 'edit' && !selectNode.isleaf && selectNode.refpk != 'ROOT') {
					toast({
						color: 'warning',
						content: this.state.json['10141505-000032'] /*?????????????????? ?????????????????????????????????????????????????????????!*/
					});
					return;
				}
				let selectedData = this.props.cardTable.getCheckedRows(bodyvosId);
				let indexArr = [];
				let indexmsg = '';
				selectedData.forEach((val) => {
					if (val.data.father) {
						indexmsg = indexmsg + val.data.values.param_index.value + ',';
					} else {
						indexArr.push(val.index);
					}
				});
				if (indexmsg != '') {
					indexmsg = indexmsg.substring(0, indexmsg.lastIndexOf(','));
					let msg =
						this.state.inlt &&
						this.state.inlt.get('10141505-000001', { index: indexmsg }); /* ?????????????????? ????????????????????????????????????????????????*/
					toast({ color: 'warning', content: msg });
				}

				this.props.cardTable.delRowsByIndex(
					bodyvosId,
					indexArr /*,()=>{
                    let rows = this.props.cardTable.getCheckedRows(bodyvosId);
                    this.props.button.setDisabled({delline:!(rows&&rows.length>0)});}*/
				);
				setTimeout(() => {
					this.onSelectedChangeEvent();
				}, 1);
				break;
		}
	};

	onLoadLevelTree(pk, node) {
		node = this.props.asyncTree.getAsyncTreeValue(treeId, pk);
		//if(node.children){
		//    return;
		// }
		let innercode = node.nodeData.innercode;
		let requestParam = {
			showDisable: this.state.showDisable,
			nodeType: this.config.NODE_TYPE,
			innercode: innercode
		};
		ajax({
			url: '/nccloud/uapbd/amcategory/loadleveltree.do',
			data: requestParam,
			success: (result) => {
				if (result.success) {
					if (result.hasOwnProperty('data')) {
						result.data.forEach((ele, i) => {
							if (!ele.hasOwnProperty('pid')) {
								ele.pid = '~';
							}
							ele.isleaf = true;
						});
					}
					if (result.data.length != 0) {
						result.data.forEach((eve) => {
							this.props.asyncTree.delTreeData(treeId, eve.refpk);
							let node = this.props.asyncTree.getAsyncTreeValue(treeId, eve.pid);
							node.isleaf = false;
						});
						this.props.asyncTree.addTreeData(
							treeId,
							result.hasOwnProperty('data') ? this.dealTreeData(result.data) : ''
						);
						this.changeEnableTips.call(this, this.props);
					}
				}
			}
		});
	}

	//??????????????????
	onSearch(value) {
		//let allData = allTree;
		let allData = Utils.clone(allTree);
		if (this.state.searchValue == '') {
			allData = this.props.syncTree.getSyncTreeValue(treeId);
			allTree = Utils.clone(allData);
		}
		this.setState({ searchValue: value });
		this.props.syncTree.setSyncTreeData(treeId, allData);
		if (value.trim() === '') {
			this.props.syncTree.setSyncTreeData(treeId, allTree);
			this.props.syncTree.openNodeByPk(treeId, 'ROOT');
		} else {
			this.deldata(allData, value);
			let finishData = this.props.syncTree.getSyncTreeValue(treeId);
			let replaceRefName = (child) => {
				this.props.syncTree.openNodeByPk(treeId, child.refpk);
				let str = child.refname;
				if (str.indexOf(value) > -1) {
					child.refname = (
						<span>
							{str.substr(0, str.indexOf(value))}
							<span class="u-tree-searchable-filter">{value}</span>
							{str.substr(str.indexOf(value) + value.length, str.length)}
						</span>
					);
				}
				if (child.children) {
					child.children.forEach((ele) => {
						replaceRefName(ele);
					});
				}
			};
			replaceRefName(finishData[0]);
		}
		this.props.form.EmptyAllFormValue(formId);
		this.props.cardTable.setTableData(bodyvosId, { rows: [] });
	}

	deldata(children, index) {
		let delpk = [];
		for (var child = 0; child < children.length; child++) {
			if (this.existIndex(children[child], index)) {
				if (children[child].children) {
					this.deldata(children[child].children, index);
				}
			} else {
				delpk.push(children[child].refpk);
			}
		}
		delpk.forEach((e) => {
			this.props.asyncTree.delTreeData(treeId, e);
		});
	}

	existIndex(child, index) {
		if (child.refname.indexOf(index) > -1 || child.refpk == 'ROOT') {
			return true;
		} else {
			if (child.children) {
				let flag = false;
				for (var child2 = 0; child2 < child.children.length; child2++) {
					if (this.existIndex(child.children[child2], index)) {
						flag = true;
					}
				}
				return flag;
			} else {
				return false;
			}
		}
	}

	onSelectedChangeEvent(props, moduleId, newVal, oldVal) {
		if (newVal) {
			this.props.button.setDisabled({ delline: newVal == 0 });
		} else {
			let rows = this.props.cardTable.getCheckedRows(bodyvosId);
			this.props.button.setDisabled({ delline: !(rows && rows.length > 0) });
		}
	}

	render() {
		const { form, button, modal, DragWidthCom, syncTree, cardTable, asyncTree } = this.props;

		const { createSyncTree } = syncTree;

		const { createAsyncTree } = asyncTree;

		const { createForm } = form;
		let { createCardTable } = cardTable;

		const { createButtonApp } = button;

		let { createModal } = modal; //?????????

		return (
			<div className="nc-bill-tree-card">
				{/* ?????? header*/}
				<NCDiv areaCode={NCDiv.config.HEADER} div className="header">
					{createModal('modal', { noFooter: false })}
					{/* ?????? title*/}

					<span>
						{this.props.BillHeadInfo.createBillHeadInfo({
							title:
								this.config.NODE_TYPE == 'GROUP_NODE'
									? this.state.json['10141505-000024']
									: this.state.json['10141505-000025'] /* ?????????????????? ????????????-??????,????????????-??????*/,
							initShowBackBtn: false
						})}
					</span>

					<div className="title-search-detail">
						<span className="showOff">
							<NCCheckbox
								checked={this.state.showDisable == '1'}
								onChange={this.onCheckShowDisable.bind(this)}
								disabled={this.state.showOffDisable}
							>
								{this.state.json['10141505-000027'] /* ?????????????????? ????????????*/}
							</NCCheckbox>
						</span>
					</div>

					{/* ????????? btn-group*/}
					<div className=" btn-group">
						{createButtonApp({
							area: 'list-actions',
							buttonLimit: 20,
							onButtonClick: this.onButtonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>

				{/* ???????????? */}
				<div className="tree-card">
					<DragWidthCom
						width="100%"
						// ????????????
						leftDom={
							<div className="tree-area">
								{/* ???????????? */}
								<div className="title-search-detail cancelicon" width="100%">
									<NCFormControl
										placeholder={this.state.json['10141505-000026'] /* ?????????????????? ?????????*/}
										value={this.state.searchValue}
										onChange={this.onSearch.bind(this)}
										disabled={this.state.searchBox}
										type="search"
									/>
								</div>
								<div>
									{createAsyncTree({
										treeId: treeId,
										/*needEdit: true, //???????????????*/
										showLine: false, //????????????
										metaId: 'treeForm',
										needSearch: true, //?????????????????????
										onSelectEve: this.onSelectTree.bind(this), //??????
										loadTreeData: this.onLoadLevelTree.bind(this), //?????????????????????
										onMouseEnterEve: this.onMouseEnterEve.bind(this),
										editType: true,
										//?????????
										editNodeCallBack: this.onEditTreeClick.bind(this), //???????????? ??????
										addNodeCallBack: this.onAddTreeClick.bind(this), //???????????? ??????
										delNodeCallBack: this.onDelTreeClick.bind(this), // ???????????? ??????
										showModal: false
									})}
								</div>
							</div>
						}
						// ???????????????
						rightDom={
							<div id="nc-bill-card">
								<div className="nc-bill-card">
									<div className="nc-bill-form-area">
										{createForm(formId, {
											onAfterEvent: this.onAfterFormEvent.bind(this)
										})}
									</div>

									<div className="nc-bill-table-area">
										{createCardTable(bodyvosId, {
											tableHead: this.getTableHead.bind(this),
											modelSave: this.saveBill,
											isAddRow: true,
											onBeforeEvent: this.onBeforeEvent.bind(this),
											selectedChange: this.onSelectedChangeEvent.bind(this),
											onAfterEvent: this.onAfterTableEvent.bind(this),
											showCheck: true,
											showIndex: true
										})}
									</div>
								</div>
							</div>
						} //????????????dom
						defLeftWid="20%" // ???????????????????????????px/?????????
					/>
				</div>

				<PrintOutput ref="printOutput" url={ajaxurl.printcategorycard} data={this.state.data} />
			</div>
		);
	}
}

export { AmCategoryTable };

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65