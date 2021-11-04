//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, cacheTools, base, toast, high, promptBox, createPageIcon, getMultiLang } from 'nc-lightapp-front';
const { NCPopconfirm, NCCheckbox, NCIcon, NCTabs } = base;
const NCTabPane = NCTabs.NCTabPane;
import { print } from 'nc-lightapp-front';
const { PrintOutput } = high
import ProducePlanGridRef from '../../../refer/org/ProducePlanGridRef/index';
import { showBatchOprMessage } from '../../public/tools/messageUtil';

const dataSource = 'mmbd.psinfo.planstrategy.data'
const pageId = '10140PST_list';        //pagecode
const tableId = 'pstlist';                 //表头id
const linkItem = 'code';        //列表卡片跳转字段
const pk_item = 'pk_pst';           //列表主键
const queryListUrl = '/nccloud/mmbd/pst/query.do';           //通过查询区域查询url
const deleteUrl = '/nccloud/mmbd/pst/delete.do';                 //删除url
const printUrl = '/nccloud/mmbd/pst/pstPrint.do'

const listInnerBtnArea = 'list-inner'			//行操作区域

class List extends Component {
	constructor(props) {
		super(props);
		this.tableId = tableId;
		this.selectedRowRecord = null
		this.state = {
			isShowOff: false,
			pk_org: null,
		};

		this.searchVal = null

		this.changeEnableInfo = {
			title: '',
			content: ''
		}
	}

	initTemplate = (props) => {

		let _this = this;
		props.createUIDom(
			{
				pagecode: pageId//页面id
			},
			(data) => {
				if (data) {
					if (data.template) {
						let meta = data.template;
						meta = this.modifierMeta(props, meta)
						props.meta.setMeta(meta);


					}
					if (data.button) {
						let button = data.button;
						props.button.setButtons(button);
					}
					if (data.context.pk_org) {
						this.setState({
							pk_org: { value: data.context.pk_org, display: data.context.org_Name,refpk:data.context.pk_org,refname:data.context.org_Name }
						}, () => {
							this.getData(data.context.pk_org, this.state.isShowOff, false, () => {
							})
						})


					}
				}
			}
		)
	}

	modifierMeta(props, meta) {

		meta[tableId].items = meta[tableId].items.map((item, key) => {
			if (item.attrcode == linkItem) {
				item.render = (text, record, index) => {
					return (
						<span
							style={{ textDecoration: 'underline', cursor: 'pointer' }}
							onClick={() => {
								props.pushTo('/card', {
									status: 'browse',
									id: record[pk_item].value,//列表卡片传参
									pk_org: this.state.pk_org
								});
							}}
						>
							{record && record[linkItem] && record[linkItem].value}
						</span>
					);
				};
			}
			return item;
		});
		//添加操作列
		meta[tableId].items.push({
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['10140PST-000000'] : '10140TPST-000000',/* 国际化处理： 操作*/
			width: 200,
			fixed: 'right',
			className: 'table-opr',
			visible: true,
			render: (text, record, index) => {
				let btnArray = ['Edit','Del']
				return props.button.createOprationButton(
					btnArray,
					{
						area: listInnerBtnArea,
						buttonLimit: 2,
						onButtonClick: (props, id) => {
							this.onTableButtonClick.bind(this)(props, id, text, record, index)
						}
					}
				)
			}
		});
		return meta;
	}

	onTableButtonClick = (props, id, text, record, index) => {
		if(id === 'Edit'){
			props.pushTo('/card', {
				status: 'edit',
				id: record[pk_item].value,
				pk_org: this.state.pk_org
			});
		}

		if(id === 'Del'){
			let id = record[pk_item].value
			ajax({
				url: deleteUrl,
				data: {
					'param': [{
						id: record[pk_item].value,
						ts: record.ts.value
					}]
				},
				success: (res) => {
					if (res.success) {
						//toast({ color: "success", title: this.state.json['10140TAXRE-000019'] });/* 国际化处理： 删除成功！*/
						showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
						this.refreshAction(props);
					}
				}
			});
		}
	}

	componentDidMount() {

		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({ json, inlt }, () => {
					this.initTemplate(this.props)
				})       // 保存json和inlt到页面state中并刷新页面
			}
		}
		let callbacknoinit = (json, status, inlt) => {
			if (status) {
				this.setState({ pubjson: { ...json } })
			}
		}
		this.props.MultiInit.getMultiLang({ moduleId: '10140PST', domainName: 'uapbd', callback })
		this.props.MultiInit.getMultiLang({ moduleId: '10140MMPUBMSG', domainName: 'uapbd', callback: callbacknoinit })


		let pk_org = this.props.getUrlParam('pk_org')
		if (pk_org && pk_org.refpk) {
			let tableData = {
				allpks: [],
				rows: []
			}
			this.props.table.setAllTableData(tableId, tableData);
			this.setState({
				pk_org: pk_org
			})
			this.getData(pk_org.refpk)
		}
		this.props.button.setButtonDisabled({
			Delete: true
		})
	}



	doubleClick = (record, index, e, props) => {
		this.props.pushTo('/card', {
			status: 'browse',
			id: record[pk_item].value,
			pk_org: this.state.pk_org
		});
	}
	onSelected = (props, moduleId, record, index, status) => {
		let delrows = this.props.table.getCheckedRows(tableId);
		if (delrows.length > 0) {
			this.props.button.setButtonDisabled({
				Delete: false
			})
		} else {
			this.props.button.setButtonDisabled({
				Delete: true
			})
		}
	}
	deleteAction = (props) => {

		let delrows = this.props.table.getCheckedRows(tableId);
		let params = [];
		if (delrows.length > 0) {
			delrows.forEach(item => {
				params.push({
					id: item.data.values[pk_item].value,
					ts: item.data.values.ts.value
				})
			})
		} else {
			if (this.selectedRowRecord) {
				params.push({
					id: this.selectedRowRecord[pk_item].value,
					ts: this.selectedRowRecord.ts.value
				});
			}
		}

		ajax({
			url: deleteUrl,
			data: { "param": params },
			success: (res) => {
				//toast({ color: "success", title: this.state.json['10140TAXRE-000019'] });/* 国际化处理： 删除成功！*/
				showBatchOprMessage(null, res.data, this.state.pubjson['10140PUBMESSAGE-000028']);
				this.refreshAction(props);
			}
		});


		// let params = {
		// 	id: this.selectedRowRecord[pk_item].value,
		// 	ts: this.selectedRowRecord.ts.value
		// }
		// ajax({
		//     url: deleteUrl,
		//     data: params,
		//     success: (res) => {
		//         toast({color:"success",title: this.state.json['10140PST-000019']});/* 国际化处理： 删除成功！*/
		//         this.refreshAction(props);
		//     }
		// });
	}

	onRowClick(props, moduleId, record, index) {
		this.selectedRowRecord = record
	}

	refreshAction = (props, isClickRef = false) => {
		this.getData(this.state.pk_org ? this.state.pk_org.refpk : '', this.state.isShowOff, false, () => {
			if (isClickRef) {
				toast({ title: this.state.json['10140PST-000013'], color: 'success' });/* 国际化处理： 刷新成功！*/
			}
		})
	}


	getData(pk_org, isShowOff, showToast = false, callback) {
		//获取查询模板信息
		//let queryInfo = this.props.search.getQueryInfo('pstquery')
		//let OID = queryInfo.oid
		let data = {
			pageInfo: {
				pageIndex: 0,
				pageSize: 10,
				total: 0,
				totalPage: 0
			},
			pagecode: pageId,
			showDisable: isShowOff,
			pk_org: pk_org
		};
		ajax({
			url: queryListUrl,
			data,
			success: (res) => {
				//this.props.button.setButtonVisible(['Enable','Disable'],false)
				console.log(res)
				if (res.data) {
					//构建一下分页组件需要的数组
					let allPks = []
					res.data[tableId].rows.forEach(row => {
						allPks.push(row.values[pk_item].value)
					})
					this.props.button.setButtonDisabled({
						Print: false,
						Output: false
					})
					res.data[tableId].allpks = allPks
					this.props.table.setAllTableData(this.tableId, res.data[tableId]);
					let count = allPks.length;
					let { inlt } = this.state
					if (showToast) {
						toast({ title: this.state.json['10140PST-000035'], content: inlt.get('10140PST-000042', { count: count }), color: 'success' })/* 国际化处理： 已成功！,查询成功,共,条*/
					}
				} else {
					//同样，下面这一行是为了拯救simpleTable.jsx当中愚蠢的componentWillUnmount函数
					let tableData = {
						allpks: [],
						rows: []
					}
					this.props.button.setButtonDisabled({
						Print: true,
						Output: true
					})
					this.props.table.setAllTableData(tableId, tableData);
					if (showToast) {
						toast({ content: this.state.json['10140PST-000036'], color: "warning", title: this.state.json['10140PST-000037'] });/* 国际化处理： 未查询出符合条件的数据！,请注意！*/
					}
				}

				// if(res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				// 	this.props.dealFormulamsg(
				// 		res.formulamsg,{
				// 			[tableId]: 'table'
				// 		}
				// 	)
				// }

				if (callback && typeof callback == 'function') {
					callback()
				}
			}
		});
	}

	buttonClick(props, id) {
		switch (id) {
			case 'Add':
				if (!this.state.pk_org || !this.state.pk_org.refpk) {
					toast({ content: this.state.json['10140PST-000010'], color: 'warning' })/* 国际化处理： 请选择需要编辑的数据！*/
					return
				}
				props.pushTo('/card', {
					status: 'add',
					pk_org: this.state.pk_org
				})
				break;
			case 'Edit':
				if (this.selectedRowRecord == null) {
					toast({ content: this.state.json['10140PST-000033'], color: 'warning' })/* 国际化处理： 请选择需要编辑的数据！*/
					return
				}
				props.pushTo('/card', {
					status: 'edit',
					id: this.selectedRowRecord[pk_item].value,
					pk_org: this.state.pk_org
				})
				break;
			case 'Refresh':
				this.refreshAction(props, true);
				break;
			case 'Delete':
				//this.props.modal.show('delete');
				//this.deleteAction(props);
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140PST-000004'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.state.json['10140PST-000005'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140PST-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140PST-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.deleteAction.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break;

			default:
				break;
		}
	}
	onUnitChange = (refdata) => {
		this.setState({
			pk_org: {value:refdata.refpk,display:refdata.refname,refpk:refdata.refpk,refname:refdata.refname}
		})
		if (refdata.refpk) {
			this.getData(refdata.refpk, this.state.isShowOff, false, () => {
			})
		} else {
			this.props.table.setAllTableData(tableId, { rows: [] });
		}

	}

	render() {
		let { table, button, search, base, modal } = this.props;
		let buttons = this.props.button.getButtons();
		buttons = buttons.sort((a, b) => {
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createModal } = modal
		let { createButtonApp, getButtons } = button;
		return (<div className="nc-bill-list">
			<div className='nc-bill-header-area'>
				<div className='header-title-search-area'>
					{createPageIcon()}
					<h2 className='title-search-detail'>{this.state.json ? this.state.json['10140PST-000029'] : '10140PST-000029'}</h2></div>
				<div className="search-box" style={{ position: 'relative' }}>
					{ProducePlanGridRef({

						onChange: this.onUnitChange.bind(this),
						foolValue:this.state.pk_org,
						value: [this.state.pk_org],
						isDataPowerEnable: false,
						queryCondition: { GridRefActionExt: 'nccloud.web.mmbd.refer.pub.AppPermissionOrgRefFilter' }
					})}
				</div>

				<div className="header-button-area">
					{createButtonApp({
						area: 'header-action',
						buttonLimit: 3,
						onButtonClick: this.buttonClick.bind(this),
						popContainer: document.querySelector('.header-button-area')

					})}
				</div>
			</div>
			<div className="nc-bill-table-area">
				{createSimpleTable(this.tableId, {
					//handlePageInfoChange: this.pageInfoClick,
					dataSource: dataSource,
					pkname: pk_item,
					tableModelConfirm: this.tableModelConfirm,
					showIndex: false,
					onRowClick: this.onRowClick.bind(this),
					showCheck: true,
					onRowDoubleClick: this.doubleClick.bind(this),
					onSelected: this.onSelected.bind(this),
					onSelectedAll: this.onSelected.bind(this),
					height: 700
				})}
			</div>

		</div>
		);
	}
}

List = createPage({
	initTemplate: [],
	mutiLangCode: '10140PST'
})(List);

//ReactDOM.render(<List />, document.querySelector('#app'));

export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65