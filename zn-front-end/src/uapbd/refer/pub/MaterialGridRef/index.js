//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high, base } from 'nc-lightapp-front';

import { conf as unitConf } from '../../org/BusinessUnitTreeRef/index';
unitConf["fieldid"] = "busiUnit"

const { ReferWithUnit, MultiLangWrapper } = high.Refer;
const { NCCheckbox: Checkbox, NCCollapse: Collapse, NCButton: Button, NCTable: Table, NCDiv, NCTooltip, NCHotKeys  } = base;

class MaterialGridRef extends ReferWithUnit {
	constructor(props) {
		super(props);
		this.state = {
			...this.state, // 继承state
			unit: {},
			isShowAssignData: false // 自定义扩展state
		};
	}

	onChange = (e) => {
		this.setState({ isShowAssignData: e }, () => {
			let param = this.getParam({
				pid: this.state.selectedKeys[0],
				pageInfo: {
					pageSize: this.props.pageSize,
					pageIndex: 0
				}
			});
			if (param.pid != null && param.pid != undefined && param.pid !== "") {
				this.loadAndSetTableData(param);
			}
		});
	}

	// 复写原型方法
	getParam = () => {
		let { queryCondition } = this.props;
		let _param = {
			queryCondition: queryCondition
				? typeof queryCondition === 'function'
					? queryCondition(this.props)
					: typeof queryCondition === 'object' ? queryCondition : {}
				: {}
		};
		//_param.queryCondition.isShowAssignData = this.state.isShowAssignData?'Y':'N'; // 在参数中加上flag字段
		return _param;
	};

	renderPopoverBottom = () => {
		let { selectedShow, tableData } = this.state;
		const { isMultiSelectedEnabled, isShowAssginDataChk } = this.props;
		let selectColumns = [
			{
				title: <div fieldid="oprCol">{this.props.multiLang['refer-002000']}</div>,/* 国际化处理： 操作*/
				key: 'operate',
				width: 50,
				render: (text, row, index) => {
					return (
						<div fieldid="oprCol">
							<span className="refer-del" onClick={this.onSelectedRowClick.bind(null, row, index)}>
								{this.props.multiLang['refer-002016']}{/* 国际化处理： 移除*/}
							</span>
						</div>
					);
				}
			}
		];
		selectColumns.unshift(...this.getCommonColumns());
		return [
			isShowAssginDataChk && (<Checkbox
				checked={this.state.isShowAssignData}
				onChange={this.onChange}>
				{this.props.multiLang['refer-002017']}{/* 国际化处理： 显示已分配*/}
			</Checkbox>),
			isMultiSelectedEnabled && (
				<div className="refer-selected" key="1">
					<Button
						fieldid="chosed"
						onClick={() => {
							this.setState({
								selectedShow: !selectedShow
							});
						}}
					>
						{this.props.multiLang['refer-002018']}：<span>{this.getSelections().length}</span>{/* 国际化处理： 已选*/}
					</Button>
					<Collapse in={selectedShow} className="refer-collapse">
						<div>
							<div className="refer-collapse-header">
								<div className="refer-title" key="1">
									{this.props.multiLang['refer-002019']}{/* 国际化处理： 查看已选*/}
								</div>
								<div className="refer-close" key="3">
									<Button
										fieldid="clear"
										style={{
											backgroundColor: '#E14C46',
											color: '#fff'
										}}
										onClick={() => {
											this.setState({
												selectedValues: new Map()
											});
										}}
									>
										{this.props.multiLang['refer-002020']/* 国际化处理： 清空*/}
									</Button>
									<span
										onClick={() => {
											this.setState({
												selectedShow: false
											});
										}}
									>
										{this.props.multiLang['refer-002021']/* 国际化处理： 收起*/}
									</span>
								</div>
							</div>
							<NCDiv fieldid="chosed" areaCode={NCDiv.config.TableCom}>
								<Table
									rowKey="refpk"
									scroll={{ x: true, y: '417px' }}
									columns={selectColumns}
									data={this.getSelections()}
									emptyText={() => this.props.multiLang['refer-002001']}/* 国际化处理： 没有数据*/
								/>
							</NCDiv>
						</div>
					</Collapse>
				</div>
			),
			<div className="refer-bottom-extend" key="2" />,
			<div className="buttons" key="3">
			<NCTooltip
						placement="top"
						inverse
						overlay={`${this.props.multiLang['refer-002022']}  (${
							NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM
							})`}
						trigger={["hover", "focus"]}
					>
						<Button fieldid="sure" className="button-primary"
							onClick={() => {
								isMultiSelectedEnabled ? this.multiSelect() : this.singleSelect(this.getSelections()[0]);
								this.handlePopoverBlur();
							}}>
							{this.props.multiLang['refer-002022']}(<span className="text-decoration-underline">Y</span>)
						</Button>
				</NCTooltip>
				<NCTooltip
						placement="top"
						inverse
						overlay={`${this.props.multiLang['refer-002023']}  (${
							NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
							})`}
						trigger={["hover", "focus"]}
					>
						<Button onClick={this.cancel} colors="info" fieldid="cancel">
							{this.props.multiLang['refer-002023']}(<span className="text-decoration-underline">N</span>)
						</Button>
				</NCTooltip>
			</div>
		];
	};
}

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
		refType: 'gridTree',
		refName: 'refer-002005',/* 国际化处理： 物料*/
		placeholder: 'refer-002005',/* 国际化处理： 物料*/
		refCode: 'uapbd.ref.MaterialClassTreeGridRef',
		queryTreeUrl: '/nccloud/uapbd/ref/MaterialClassTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/MaterialGridRef.do',
		rootNode: { refname: 'refer-002006', refpk: 'root' },/* 国际化处理： 物料基本分类*/
		columnConfig: [{
			name: ['refer-002007', 'refer-002008', 'refer-002009', 'refer-002010', 'refer-002011', 'refer-002012', 'refer-002013', 'refer-002014', 'refer-002015'],/* 国际化处理： 所属组织,物料编码,物料名称,规格,型号,物料简称,助记码,图号,主计量单位*/
			code: ['org_name', 'refcode', 'refname', 'materialspec', 'materialtype', 'materialshortname', 'materialmnecode', 'graphid', 'measdoc_name'],
			fullTxtCode: { 'refcode': true, 'refname': true, 'materialspec': false, 'materialtype': false, 'materialshortname': false, 'materialmnecode': false, 'graphid': false },
			checked: {
				graphid: false,
				measdoc_name: false
			},
			search: { 'materialmnecode': true }
		}],
		treeConfig: { name: ['refer-002003', 'refer-002004'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		isShowDisabledData: false,
		unitProps: unitConf,
		isShowUnit: false,
		isShowAssginDataChk: false,
		isShowUsual: true,
	};

	return <MaterialGridRefWrapper {...conf} {...props} />
}

const MaterialGridRefWrapper = MultiLangWrapper(MaterialGridRef);

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65