//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high } from 'nc-lightapp-front';
import InnerCustSupplierWrapper from './base.js'
const { Refer } = high;
import React, { Component } from 'react'

class InnerCustSupplierRef extends Component {
	constructor(props) {
		super(props)
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
		return <InnerCustSupplierWrapper {...this.props} rootNode={this.state.rootNode} onRadioChange={this.onRadioChange.bind(this)} />
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
		refName: 'refer-000505',/* 国际化处理： 内部客商*/
		refCode: 'uapbd.refer.supplier.InnerCustSupplierGridTreeRef',
		placeholder: 'refer-000505',/* 国际化处理： 内部客商*/
		queryTreeUrl: '/nccloud/uapbd/ref/InnerCustSupplierDefaultTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/InnerCustSupplierDefaultGridRef.do',
		columnConfig: [{
			name: ['refer-000047', 'refer-000501', 'refer-000502', 'refer-000503', 'refer-000504'],
			code: ['pk_orgname', 'refcode', 'refname', 'pk_financeorg', 'taxpayerid'],
			fullTxtCode: { 'refcode': true, 'refname': true, 'taxpayerid': false }
		}],/* 国际化处理： 所属组织,客商编码,客商名称,对应业务单元,纳税人登记号*/
		isMultiSelectedEnabled: false,
		isTreelazyLoad: true,
		isShowUnit: false,
		isShowUsual: true,
		isHasDisabledData: false,
		defaultCheck: 'pk_custclass'
	};

	return <InnerCustSupplierRef {...conf} {...props} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65