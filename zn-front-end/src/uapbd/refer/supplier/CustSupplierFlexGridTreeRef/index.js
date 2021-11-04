//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import CustSupplierWrapper from './base.js'
import { conf as unitConf } from '../../org/BusinessUnitAllTreeRef/index';
import React, { Component } from 'react'

const { Refer } = high;

class CustSuppilerRef extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rootNode: {
				refname: this.props.defaultCheck == 'pk_custclass' ? 'refer-000538' : 'refer-000539',//国际化处理，客户分类/供应商分类
				refpk: 'root'
			},
		}
	}

	onRadioChange(value) {
		let root = this.state.rootNode
		root.refname = value == 'pk_custclass' ? 'refer-000538' : 'refer-000539',
			this.setState({
				rootNode: root
			})

	}
	render() {
		return <CustSupplierWrapper {...this.props} rootNode={this.state.rootNode} onRadioChange={this.onRadioChange.bind(this)} />
	}
}

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'gridTree',
		refName: 'refer-000500',/* 国际化处理： 客商档案*/
		refCode: 'uapbd.supplier.InnerCustSupplierForCustGridTreeRef',
		placeholder: 'refer-000500',/* 国际化处理： 客商档案*/
		queryTreeUrl: '/nccloud/uapbd/ref/CustSupplierFlexTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/CustSupplierFlexGridRef.do',
		columnConfig: [{
			name: ['refer-000047', 'refer-000501', 'refer-000502', 'refer-000014', 'refer-000504'],
			code: ['pk_orgname', 'refcode', 'refname', 'mnecode', 'taxpayerid'],
			fullTxtCode: { 'refcode': true, 'refname': true, 'taxpayerid': true },
			search: { 'mnecode': true }
		}],/* 国际化处理： 所属组织,客商编码,客商名称,助记码,纳税人登记号*/
		isMultiSelectedEnabled: false,
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		isTreelazyLoad: true,
		isShowUnit: false,
		unitProps: unitConf,
		isShowUsual: true,
		isHasDisabledData: true,//默认也是true
		defaultCheck: 'pk_custclass'
	};

	return <CustSuppilerRef {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65