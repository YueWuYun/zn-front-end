//252tZAiTASWmqY0zxEAxEUOjmNzEUs7FjVkF6PdCm+Lu18NScKGjpuk8+lWTvRaJ
import { high } from 'nc-lightapp-front';
import { base } from 'nc-lightapp-front';
const { NCRadio } = base;
const { Refer } = high;
const { PopRefer, MultiLangWrapper,ReferWithUnit } = Refer;


class InnerCustSupplierFlexGridTreeRef extends ReferWithUnit {


	constructor(props) {
		super(props);
		this.state = {
			...this.state, // 继承state
			radioValue: this.props.defaultCheck =='pk_custclass'?'pk_custclass' :'pk_supplierclass', // 自定义扩展state
			group_pk: 'firstGroup',
			currentReffer: []
		};
	}

	// renderPopoverHeaderExtend = () => {
	//     return <div>内部客商参照</div>;
	// };

	// renderPopoverSearchArea = () => {
	//     return (
	// 		<div><Refer
	// 		refName={'集团'} 
	// 		refCode={'pk_group'} 
	// 		queryTreeUrl={'/nccloud/riart/ref/groupRefTreeAction.do'} 
	// 		refType={'tree'}  
	// 		pageSize={50}
	// 		isCacheable = {true}
	// 		placeholder="集团"
	// 		refType="tree"
	// 		onChange={this.handleGroupChange.bind(this)}
	// 		value = {this.state.currentReffer}
	// 		isTreelazyLoad={false}
	// 		// {...config}

	// 		/>
	// 		</div>
	// 	);
	// };

	getParam = (param = {}) => {
		let {
			queryCondition,
			pageSize,
			refType
		} = this.props;
		if (param.pid === 'root') {
			param.pid = '';
		}
		let {
			keyword = '',
			pid = '',
			pageInfo = {}
		} = param;
		pageInfo = {
			pageSize: pageInfo.pageSize || pageSize,
			pageIndex: pageInfo.pageIndex || (refType === 'tree' ? -1 : 0)
		};
		let _param = {
			pid, // 对应的树节点
			keyword,
			queryCondition: queryCondition ?
				typeof queryCondition === 'function' ?
					queryCondition() :
					typeof queryCondition === 'object' ? queryCondition : {} :
				{},
			pageInfo
		};
		_param.queryCondition.queryType = this.state.radioValue;
		return _param;
	};

	handleGroupChange = (value) => {
		this.setState(
			{
				group_pk: value.refpk,
				expandedKeys: []
			},
			() => {
				this.getTreeData();
			}
		);
	}

	// handleRadioChange = (value) => {
	// 	debugger
	// 	this.props.onRadioChange(value);
	// 	let rootNode = this.props.rootNode
	// 	this.setState(
	// 		{
	// 			group: {
	// 				undefined: [rootNode]
	// 			},
	// 			tableData: [ //参照的数据
	// 				{
	// 					rows: [],
	// 					page: {
	// 						pageIndex: 0,
	// 						pageSize: this.props.pageSize,
	// 						totalPage: 1
	// 					}
	// 				}
	// 			],
	// 			treeData: [rootNode],
	// 			radioValue: value,
	// 			expandedKeys: ['root']
	// 		},
	// 		() => {
	// 			this.getTreeData();
	// 		}
	// 	);
	// }

	handleRadioChange = (value) => {
		this.props.onRadioChange(value);
		let rootNode = this.props.rootNode
		let group=this.state.group
		group['undefined']=[rootNode]
		this.setState(
			{
				group:group,
				tableData: [ //参照的数据
					{
						rows: [],
						page: {
							pageIndex: 0,
							pageSize: this.props.pageSize,
							totalPage: 1
						}
					}
				],
				treeData: [rootNode],
				radioValue: value,
				expandedKeys: []
			},
			() => {
				this.getTreeData();
			}
		);
	}

	getTreeData = () => {
		const {
			queryTreeUrl,
			isCacheable,
			rootNode
		} = this.props;
		let param = this.getParam({
			pid: '',
			pageInfo: {
				pageSize: 10,
				pageIndex: -1
			},
			queryCondition: {
				queryType: this.state.radioValue,
			}
		}),
			cacheData = this.hasCache(queryTreeUrl, param);
		// this.state.treeData =
		this.state.tableData = [{
			rows: [],
			page: {
				pageIndex: 0,
				pageSize: this.props.pageSize,
				totalPage: 1
			}
		}];
		if (isCacheable == true && cacheData) {
			this.setTreeData('treeData', rootNode, cacheData);
		} else {
			this.loadTreeData(param).then((data) => {
				this.setTreeData('treeData', rootNode, data);
			});
		}
		this.setState({
			tableData: this.state.tableData
		});

	}

	renderPopoverLeftHeader = () => {
		return (
			<div id="radioGroup" style={{ 'margin-bottom': '5px' }}>
				<NCRadio.NCRadioGroup
					name="role"
					radioValue={this.state.radioValue}
					selectedValue={this.state.radioValue}
					onChange={this.handleRadioChange.bind(this)}>
					<NCRadio value="pk_custclass" >{this.props.multiLang['refer-000540']}</NCRadio>
					<NCRadio value="pk_supplierclass" >{this.props.multiLang['refer-000541']}</NCRadio>
				</NCRadio.NCRadioGroup>
			</div>
		);
	};

}
const InnerCustSupplierWrapper = MultiLangWrapper(InnerCustSupplierFlexGridTreeRef)
export default InnerCustSupplierWrapper;

//252tZAiTASWmqY0zxEAxEUOjmNzEUs7FjVkF6PdCm+Lu18NScKGjpuk8+lWTvRaJ