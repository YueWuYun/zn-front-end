//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high, base } from 'nc-lightapp-front';
const { PopRefer ,MultiLangWrapper} = high.Refer;
const { Refer } = high;
const { NCCheckbox: Checkbox, NCCollapse: Collapse, NCButton: Button, NCTable: Table } = base;
class BankDocGridTreeRef extends PopRefer {
	constructor(props) {
		super(props);
		this.state = {
			...this.state, // 继承state
			isShowOwnBank: false,  //是否显示本组织银行
			isIncludeCustSup: true,   //是否包含客商银行
		}
	}

	// 复写原型方法
	getParam = (param = {}) => {
		let { queryCondition, pageSize, refType } = this.props,
			{ keyword = '', pid = '', pageInfo = {} } = param;
		pageInfo = {
			pageSize: pageInfo.pageSize || pageSize,
			pageIndex: pageInfo.pageIndex || (refType === 'tree' ? -1 : 0)
		};

		let _param = {
			pid,
			keyword,
			queryCondition: queryCondition
				? typeof queryCondition === 'function'
					? queryCondition()
					: typeof queryCondition === 'object' ? queryCondition : {}
				: {},
			pageInfo
		};
		_param.queryCondition.isShowOwnBank = this.state.isShowOwnBank ? 'Y' : 'N';
		_param.queryCondition.isIncludeCustSup = this.state.isIncludeCustSup ? 'Y' : 'N'; // 在参数中加上flag字段
		return _param;
	};
	renderPopoverBottomExtend = () => {
		return <div style={{ marginLeft: "225px" }}>
			<div style={{ float: "left" }}><Checkbox checked={this.state.isShowOwnBank} onChange={this.onChangeFirst.bind(this)}>{this.props.multiLang['refer-000552']}</Checkbox></div>
			<div style={{ marginLeft: "15px", float: "left" }}><Checkbox checked={this.state.isIncludeCustSup} onChange={this.onChangeSecond.bind(this)}>{this.props.multiLang['refer-000553']}</Checkbox></div></div>;
	}

	onChangeFirst = (checked) => {
		this.setState(
			{
				isShowOwnBank: checked
			},
			() => {
				let param = this.getParam({
					pid: this.state.selectedKeys[0],
					pageInfo: {
						pageSize: this.props.pageSize,
						pageIndex: 0
					}
				});
                if(param.pid!==null&&param.pid!==undefined&&param.pid!==""){
					this.loadTableData(param).then((data)=>{
						this.setTableData('tableData', this.state.currentLevel, data);
					});
				}
				
			}
		);
	}
	onChangeSecond = (checked) => {
		this.setState(
			{
				isIncludeCustSup: checked
			},
			() => {
				let param = this.getParam({
					pid: this.state.selectedKeys[0],
					pageInfo: {
						pageSize: this.props.pageSize,
						pageIndex: 0
					}
				});
				if(param.pid!==null&&param.pid!==undefined&&param.pid!==""){
					this.loadTableData(param).then((data)=>{
						this.setTableData('tableData', this.state.currentLevel, data);
					});
				}
				
			}
		);

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
		refName: 'refer-000546',/* 国际化处理： 银行档案*/
		refCode: 'uapbd.bankacc.BankDocDefaultGridRef',
		placeholder: "refer-000546",/* 国际化处理： 银行银行档案*/
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		rootNode: { refname: 'refer-000546', refpk: 'root' },/* 国际化处理： 银行*/
		queryGridUrl: '/nccloud/uapbd/ref/BankDocDefaultGridRef.do',
		queryTreeUrl: '/nccloud/uapbd/ref/BankDocDefaultTreeRef.do',
		columnConfig: [{ name: ['refer-000047', 'refer-000547', 'refer-000548', 'refer-000250', 'refer-000549', 'refer-000550', 'refer-000551', 'refer-000015'], code: ['org_name', 'refcode', 'refname', 'shortname', 'pk_fatherbank', 'province', 'city', 'ttname'],checked:{'ttname':false} }],
		/* 国际化处理： 所属组织,银行编码,银行名称,简称，上级银行，省份，城市，银行类别*/
		isMultiSelectedEnabled: false
	};

	return <BankDocGridTreeRefWrapper {...conf} {...props} />
}
const BankDocGridTreeRefWrapper = MultiLangWrapper(BankDocGridTreeRef)
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65