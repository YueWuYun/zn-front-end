/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
// 自定义--关账检查--单表
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base } from 'nc-lightapp-front';
import { initTemplate } from './events';

let tableId = 'table_closecheck_01';
let pageCode = '36070CA_L02';

class ExportReportModal extends Component {
	constructor(props) {
		super(props);
		let pk_org = props.data.exdata.pk_org;
		let moduleid =props.data.exdata.moduleid;
		let pk_checkitem =props.pk_checkitem;
		let pk_period =props.data.exdata.selref_pk_accperiodmonth;
		this.props = props;
		//console.log(this.props);		
		//console.log(pk_org,'pk_org');
		//console.log(moduleid,'pk_org');
		//console.log(pk_checkitem,'pk_checkitem');
		//console.log(pk_period,'pk_period');
		this.state={
			pk_org:pk_org,
			moduleid:moduleid,
			pk_checkitem:pk_checkitem,
			pk_period:pk_period
			
	   }

	}
	componentDidMount() {
		this.getData();
	}
	//请求列表数据
	getData = () => {
		//自己测试用
		let data ={
			pageid: pageCode,
			pk_org: this.state.pk_org,
			moduleid: this.state.moduleid,
			pk_checkitem: this.state.pk_checkitem,
			pk_period: this.state.pk_period,

		}
		// let data = {
		// 	"pageid": pagecode,
		// 	"model": {//关账期间明细数据
		// 		pageinfo: null,
		// 		rows: [this.state.selCloseAccBookVO]
		// 	},
		// 	"model1": {//业务模块数据
		// 		areacode: 'stordoccloseaccmodule',
		// 		pageinfo: null,
		// 		rows: bodyData
		// 	},
		// 	exdata: {
		// 		"pk_org": this.state.selOrg.refpk,//关账组织
		// 		"moduleid": this.state.moduleBody.showMoudleId,//模块号
		// 		"selref_pk_accperiodmonth":this.state.selAccperiodmonth.refValue.refpk,//会计期间主键
		// 		"selref_accperiodmonth_name": this.state.selAccperiodmonth.refValue.refname,//会计期间名称
		// 	}
		// };

		ajax({
			url: '/nccloud/cmp/closeaccount/closeaccountquery.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data && data[tableId]) {
						this.props.table.setAllTableData(tableId, data[tableId]);
					} else {
						this.props.table.setAllTableData(tableId, { rows: [] });
					}
				}
			}
		});

	};
	others() {
		//其他搜索条件，如停启用等
		return <div>嘎嘎嘎自定义页面</div>;
	}

	/**
	 * //关账检查必须内容
	 * //平台可以调用实现
	 * @param {*} cfg 
	 */
	print(cfg = {}) {//打印
		//console.log('print');
	}
	printPreVIew(cfg = {}) {//预览
		//console.log('printPreVIew');
	}
	output(cfg = {}) {//输出
		//console.log('output');
	}

	render() {
		let { table, button, search } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButton } = button;
		let { createSimpleSearch } = this.props.simpleSearch;
		return (
			<div className="nc-bill-table-area">
				{createSimpleTable(tableId, {
					showIndex: true
				})}
			</div>
		);
	}
}

ExportReportModal = createPage({
	initTemplate: initTemplate
})(ExportReportModal);

//关账检查使用
export default function (props = {}) {
	var conf = {
	};
	return <ExportReportModal {...Object.assign(conf, props)} />
}

//ReactDOM.render(<SingleTable />, document.querySelector('#app'));

/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/