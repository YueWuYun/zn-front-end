//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high, base } from 'nc-lightapp-front';
import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';

unitConf['fieldid'] = 'orgunit';
const { PopRefer, MultiLangWrapper, ReferWithUnit } = high.Refer;
const { Refer } = high;
const { NCCheckbox: Checkbox, NCCollapse: Collapse, NCButton: Button, NCTable: Table } = base;

class PsndocGridTreeRef extends ReferWithUnit {
	constructor(props) {
		super(props);
		this.state = {
			...this.state, // 继承state
			unit: props.defaultUnitValue || {},
			isShowDimission: false,  //是否显示离职人员
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
					? queryCondition(this.props)
					: typeof queryCondition === 'object' ? queryCondition : {}
				: {},
			pageInfo,
			refType
		};

		_param.queryCondition.isShowDimission = this.state.isShowDimission ? 'Y' : 'N';

		return _param;
	};

	renderPopoverLeftHeader = () => {
		return this.props.isShowDimission && (<div style={{ 'margin-bottom': '5px', 'margin-left': '10px' }}>
			<Checkbox checked={this.state.isShowDimission} onChange={this.onChangeFirst.bind(this)}>{this.props.multiLang['refer-000570'] ? this.props.multiLang['refer-000570'] : '显示离职人员'}</Checkbox>
		</div>)
	}

	onChangeFirst = (checked) => {
		this.setState(
			{
				isShowDimission: checked,
				isShowDisabledData: checked,
				isDisabledDataDisabled: checked,
			},

			() => {
				let param = this.__getParam({
					pid: this.state.selectedKeys[0],
					pageInfo: {
						pageSize: this.props.pageSize,
						pageIndex: 0
					}
				});
				if (param.pid !== null && param.pid !== undefined && param.pid !== "") {
					this.loadTableData(param).then((data) => {
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
		refName: 'refer-000369',/* 国际化处理： 人员*/
		placeholder: 'refer-000369',/* 国际化处理： 人员*/
		rootNode: { refname: 'refer-000216', refpk: 'root' },/* 国际化处理： 部门*/
		refCode: 'uapbd.psninfo.PsndocTreeGridRef',
		queryTreeUrl: '/nccloud/uapbd/ref/PsndocTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/PsndocGridRef.do',
		columnConfig: [
			{
				name: ['refer-000370', 'refer-000371', 'refer-000216'],/* 国际化处理： 人员编码,姓名,部门*/
				code: ['refcode', 'refname', 'deptname'],
				fullTxtCode: { 'refcode': true, 'refname': true }
			}
		],
		treeConfig: { name: ['refer-000002', 'refer-000003'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUsual: true,
		isShowUnit: true,
		rowKey: "pk_psnjob"
	};

	return <PsndocGridTreeRefWrapper {...conf} {...props} />
}

const PsndocGridTreeRefWrapper = MultiLangWrapper(PsndocGridTreeRef)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65