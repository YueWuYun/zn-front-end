//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import { high, base } from 'nc-lightapp-front';

const { ReferWithUnit, MultiLangWrapper } = high.Refer;
const { NCCheckbox: Checkbox, NCCollapse: Collapse, NCButton: Button, NCTable: Table,NCDiv, NCHotKeys,NCTooltip  } = base;

class MaterialMultiVersion extends ReferWithUnit {
	constructor(props) {
		super(props);
		this.state = {
			...this.state, // 继承state
			isShowVerison: this.props.isDefaultChecked ? this.props.isDefaultChecked : false, // 自定义扩展state
			isShowAssignData: false
		};

		Object.assign(this.hotKeyElement, { showAssignData: Symbol('showAssignData'), showVersionData: Symbol('showVersionData') });

		this.gridTree = new Map([
			this.hotKeyElement.referPopWindow,
			this.hotKeyElement.referTree,
			this.hotKeyElement.tableSearchInput,
			this.hotKeyElement.showDisabledData, // 可能没有
			this.hotKeyElement.referTable,
			this.hotKeyElement.showAssignData,
			this.hotKeyElement.showVersionData, // 可能没有
			this.hotKeyElement.unit,// 可能没有
			this.hotKeyElement.treeSearchInput // 一定有
		].filter(e => e).map((e, i) => [e, i]));
	}

	onChange = (e) => {
		this.setState({ isShowVerison: e }, () => {
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

	onChangeShowDisableData = (e) => {
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
	getParam = (param = {}) => {
		console.log(param);
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
				: {}
		};

		_param.queryCondition.isShowVerison = this.state.isShowVerison ? '1' : '0'; // 在参数中加上flag字段
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
								{this.props.multiLang['refer-002016']/* 国际化处理： 移除*/}
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
				onChange={this.onChangeShowDisableData}
				tabIndex={this.getTabIndex(this.hotKeyElement.showAssignData)}
				onKeyDown={this.resetHotKeyLoop.bind(this, this.hotKeyElement.showAssignData)}>
				{this.props.multiLang['refer-002017']/* 国际化处理： 显示已分配*/}
			</Checkbox>),
			<Checkbox
				checked={this.state.isShowVerison}
				onChange={this.onChange}
				tabIndex={this.getTabIndex(this.hotKeyElement.showVersionData)}
				onKeyDown={this.resetHotKeyLoop.bind(this, this.hotKeyElement.showVersionData)}>
				{this.props.multiLang['refer-002028']/* 国际化处理： 显示历史版本*/}
			</Checkbox>,
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
											'min-width': '40px',
											padding: '0 10px',
											"border-radius": '3px',
											"font-size": '13px',
											"background-color": '#e14c46',
											color: 'rgb(255, 255, 255)'
										}}
										onClick={() => {
											this.setState({
												selectedValues: new Map()
											});
										}}
									>
										{this.props.multiLang['refer-002020']/* 国际化处理： 清空*/}
									</Button>
									<Button
										fieldid="retract"
										style={{
												'min-width': '40px',
											   	 padding: '0 10px',
												"border-radius": '3px',
												"font-size": '13px',
												"background-color": '#fff',
												"margin-right": '10px',
												color: '#111'			
												}}
										onClick={() => {
											this.setState({
												selectedShow: false
											});
										}}
									>
										{this.props.multiLang['refer-002021']/* 国际化处理： 收起*/}
									</Button>
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

var unitProps = {
	multiLang: {
		domainName: 'uapbd',
		currentLocale: 'zh-CN',
		moduleId: 'refer_uapbd',
	},
	refType: 'tree',
	refName: 'refer-002002',/* 国际化处理： 业务单元*/
	refCode: 'uapbd.refer.org.BusinessUnitTreeRef',
	rootNode: { refname: 'refer-002002', refpk: 'root' },/* 国际化处理： 业务单元*/
	placeholder: 'refer-002002',/* 国际化处理： 业务单元*/
	queryTreeUrl: '/nccloud/uapbd/org/BusinessUnitTreeRef.do',
	treeConfig: { name: ['refer-002003', 'refer-002004'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
	isMultiSelectedEnabled: false
};

export default function (props = {}) {
	var conf = {
		multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},
		refType: 'gridTree',
		refName: 'refer-002024',/* 国际化处理： 物料(多版本)*/
		placeholder: 'refer-002024',/* 国际化处理： 物料(多版本)*/
		refCode: 'uapbd.ref.MaterialMultiVersionTreeGridRef',
		queryTreeUrl: '/nccloud/uapbd/ref/MaterialClassTreeRef.do',
		queryGridUrl: '/nccloud/uapbd/ref/MaterialMultiVersionGridRef.do',
		rootNode: { refname: 'refer-002006', refpk: 'root' },/* 国际化处理： 物料基本分类*/
		columnConfig: [{
			name: ['refer-002007', 'refer-002008', 'refer-002009', 'refer-002025', 'refer-002010', 'refer-002011', 'refer-002012', 'refer-002013', 'refer-002014', 'refer-002015', 'refer-002026', 'refer-002027'],/* 国际化处理： 所属组织,物料编码,物料名称,版本号,规格,型号,物料简称,助记码,图号,主计量单位,原始编码,备注*/
			code: ['org_name', 'refcode', 'refname', 'version', 'materialspec', 'materialtype', 'materialshortname', 'materialmnecode', 'graphid', 'measdoc_name', 'source_code', 'memo'],
			fullTxtCode: { 'refcode': true, 'refname': true, 'materialspec': false, 'materialtype': false, 'materialshortname': false, 'materialmnecode': false, 'graphid': false },
			checked: {
				graphid: false,
				measdoc_name: false,
				source_code: false,
				memo: false
			},
			search: { 'materialmnecode': true }
		}],
		treeConfig: { name: ['refer-002003', 'refer-002004'], code: ['refcode', 'refname'] },/* 国际化处理： 编码,名称*/
		isShowDisabledData: false,
		unitProps: unitProps,
		isShowUnit: false,
		isShowUsual: true,
	};

	return <MaterialMultiVersionWrapper {...conf} {...props} />
}

const MaterialMultiVersionWrapper = MultiLangWrapper(MaterialMultiVersion)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65