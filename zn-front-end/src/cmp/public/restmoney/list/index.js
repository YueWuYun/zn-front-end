/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/

//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, getMultiLang } from 'nc-lightapp-front';
import axios from 'axios';
import { initTemplate } from './events';
const { NCModal } = base;

class NCCOriginalBalance extends Component {
	constructor(props) {
		super(props);
		this.moduleId = '360701OB';
		// this.searchId = 'search_area';
		this.tableId = 'restmoney';
		this.state = {
			currentLocale: 'zh-CN',
			showOriginalData: [],
			json: {}
		};
		// initTemplate.call(this,props);

	}
	/**获取多语方法 */
	getLangCode = (key) => {
		let multiLang = this.props.MutiInit.getIntl(this.moduleId);
		return multiLang && multiLang.get(this.moduleId + '-' + key);
	};
	componentWillMount() {
		this.initMultiLang();
	}
	initMultiLang = () => {
		let moduleid = this.moduleId;
		getMultiLang({
			moduleId: moduleid,
			currentLocale: this.state.currentLocale,
			domainName: 'cmp',
			callback: this.setMultiLang
		})
	}
	setMultiLang = (json) => {
		this.setState({
			json
		}, () => {
			initTemplate.call(this, this.props);
		})
	}
	componentDidMount() {
		// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
		// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
		// 需要每次都重新加载
		this.props.table.setAllTableData(this.tableId, { rows: [] });
		this.setState(
			{
				showOriginalData: this.props.showOriginalData
			}, () => {
				this.initData();
			}
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.showmodal && nextProps.showmodal !== this.props.showmodal) { // 
			let need = true;
			// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
			// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
			// if (this.state.showOriginalData) {
			// 	// 判断本次和上次加载的数据是否一致，如果一致则不重新加载
			// 	let nextshowOriginalData = nextProps.showOriginalData;
			// 	let thisshowOriginalData = this.state.showOriginalData;
			// 	if (nextshowOriginalData && nextshowOriginalData.length==thisshowOriginalData.length) {
			// 		let nextSet = new Set();
			// 		let thisSet = new Set();
			// 		nextshowOriginalData.forEach((val,index) => {
			// 			let pk_account = val.pk_account;
			// 			nextSet.add(pk_account);
			// 		});

			// 		thisshowOriginalData.forEach((val,index) => {
			// 			let thispk_account = val.pk_account;
			// 			thisSet.add(thispk_account);
			// 		})
			// 		if (nextSet.toString() == thisSet.toString()) {
			// 			need = false;
			// 		}
			// 	}
			// }
			// 需要每次都重新加载
			if (need) {
				this.props.table.setAllTableData(this.tableId, { rows: [] });
				this.setState(
					{
						showOriginalData: nextProps.showOriginalData
					}, () => {
						this.initData();
					}
				);
			}
		}

	}
	initData() {
		// 在didMount里初始化数据
		let data = this.state.showOriginalData;
		if (Array.isArray(data)) {
			if (!data || data.length == 0) {
				//toast({ color: 'warning', content: '未接收到您需要查询的数据' });
				// console.log(this.props.MutiInit.getIntl("360701OB") && this.props.MutiInit.getIntl("360701OB").get('360701OB-000047'));/* 国际化处理： 未传入需要查询的余额数据*/
				return;
			}
			for (let index = 0; index < data.length; index++) {
				let val = data[index];
				if (!val.pk_account && !val.pk_cashaccount) {
					data.splice(index, 1);
				}
			}
			if (data.length == 0) {
				// 没有有效的查询数据直接弹空
				return;
			}
			this.getData(data);
		} else {
			//处理单条查询
			let searchData = [];
			if (!data.pk_account && !data.pk_cashaccount) {
				return;
			}
			searchData.push(data);
			this.getData(searchData);
		}
	}
	getData = (searchData) => {
		//let pageInfo = this.props.table.getTablePageInfo(this.tableId);
		//let searchVal = this.props.search.getAllSearchData(this.searchId);
		let data = {
			pubsearch: searchData,
			//pageInfo:pageInfo,
			pagecode: "360701OB_P01",
			queryAreaCode: '',  //查询区编码
			oid: '',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			queryType: 'simple'
		};
		ajax({
			url: '/nccloud/cmp/bankaccountbook/initrestmoneypub.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success && data != undefined && data) {
					let tablearea = {};
					let rows = [];
					if (data.message) {
						// message有值，表示有错误信息
						toast({ color: 'warning', content: data.message });
						this.props.table.setAllTableData(this.tableId, { rows: [] });
						return;
					}
					// 后台传过来的精度
					let scale = data.scale;
					if (!scale) {
						// 如果没传，默认3
						scale = '3';
					}
					let val = data.vos;
					let values = {};
					let value = {};
					let accountCode = val.accountCode;
					let accountName = val.accountName;
					let accountType = val.accountType;
					let capitalType = val.capitalType;
					let currencyName = val.currencyName;
					let currentBalance = val.currentBalance;
					let surplusBalance = val.surplusBalance;
					value.accountcode = { value: accountCode, display: accountCode };
					value.accountname = { value: accountName, display: accountName };
					value.accounttype = { value: accountType, display: accountType };
					value.capitaltype = { value: capitalType, display: capitalType };
					value.currencyname = { value: currencyName, display: currencyName };
					value.currentbalance = { value: currentBalance, display: currentBalance, scale };
					value.surplusbalance = { value: surplusBalance, display: surplusBalance, scale };
					values.values = value;
					values.status = '0';
					values.rowid = null;
					rows.push(values);
					tablearea['rows'] = rows;
					tablearea['areacode'] = this.tableId;
					this.props.table.setAllTableData(this.tableId, tablearea);
				} else {
					this.props.table.setAllTableData(this.tableId, { rows: [] });
				}
			}
		});
	};
	close = () => {
		this.setState({
			showOriginalData: []
		}, () => {
			this.props.onCloseClick();
		})
	}
	render() {
		let { table, button, search, modal } = this.props;
		let { createSimpleTable } = table;
		let { createButton } = button;
		return (
			<div>
				<NCModal
					fieldid="accbalance"
					show={this.props.showmodal}
					style={{ width: '1100px' }}
					size='lg'
					onHide={
						this.close
					}
				>
					<NCModal.Header closeButton={'true'}>
						<NCModal.Title>
							{/* {this.props.MutiInit.getIntl("360701OB") && this.props.MutiInit.getIntl("360701OB").get('360701OB-000056')} */}
							{this.state.json['360701OB-000056']}
							{/* 国际化处理： 联查余额*/}
						</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body size="sm" className="body-resize-icon">
						<div>
							{createSimpleTable(this.tableId, {
								height: '158px',
								showIndex: true,
								//取消保存列宽功能
								cancelCustomRightMenu: true,
							})}
						</div>
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}

export default createPage({
	// mutiLangCode: '360701OB'
	// initTemplate: initTemplate
})(NCCOriginalBalance);


/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/