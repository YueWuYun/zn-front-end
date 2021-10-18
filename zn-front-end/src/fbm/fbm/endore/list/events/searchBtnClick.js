/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/
/**
 * 背书办理列表 查询区按钮事件
 * @author：gaokung
 */
import { cardCache, ajax, toast } from 'nc-lightapp-front';
import { URI, LIST, DATASOURCE, LIST_BTN } from './../../cons/constant';
import { buttonDisabledRule } from './buttonDisabledRule';
import { doAjax } from '../../utils/commonUtil';
let { setDefData, getDefData } = cardCache;
export function searchBtnClick(props, searchData) {
	doSearch.call(this, searchData, LIST_BTN.search);
}
export function doSearch(searchData, sourceBtn) {
	let searchOid = this.props.search.getQueryInfo(LIST.searchCode).oid;
	// 缓存处理
	searchData = searchCacheHandle(this,searchOid,searchData);
	// 如果刷新时 没有历史查询数据，则不进行查询操作
	if (!searchData) return;
	if (!searchOid) {
		searchOid = this.state.searchOid;
	}
	let pageInfo = this.props.table.getTablePageInfo(LIST.tableCode);
	// 整理查询数据
	let data = searchDataHandle(searchData, this.state.activeKey, pageInfo, searchOid);
	let listRender;
	if (sourceBtn === LIST_BTN.refresh) {
		listRender = setListRenderByRefresh;
	} else if (sourceBtn === LIST_BTN.tab) {
		listRender = setListRenderByTab;
	} else if (sourceBtn === LIST_BTN.search) {
		listRender = setListRenderBySearch;
	}
	// 获取列表数据
	doAjax.call(this, data, URI.endoreListMainQuery, listRender);
}
/**
 * 查询条件缓存处理
 * @param {*} searchData
 */
const searchCacheHandle = (that,oid,searchData) => {
	if (searchData && searchData.conditions && searchData.conditions.length > 0) {
		// 放入缓存
		setDefData(LIST.searchCode, DATASOURCE, searchData);
		if (oid){
			that.setState({searchOid:oid});
		}
	} else {
		// 从缓存取出
		searchData = getDefData(LIST.searchCode, DATASOURCE);
		if (!searchData) {
			return null;
		}
	}
	return searchData;
};

/**
 * 整理查询需要的数据及数据结构
 * @param {*} searchData // 查询数据 （查询组件返回的数据）
 * @param {*} status // 对应状态
 * @param {*} pageInfo // 分页信息
 * @param {*} oid // 查询模版 oid
 */
const searchDataHandle = (searchData, status, pageInfo, oid) => {
	let custcondition = null;
	if (status != '9') {
		custcondition = {
			conditions: [
				{
					field: 'vbillstatus',
					value: {
						firstvalue: status,
						secondvalue: null
					},
					oprtype: '='
				}
			],
			logic: 'and'
		}
	} else {
		custcondition =  {
			logic: "and",
			conditions: [{
				field: "disableflag",
				value: {
					firstvalue: 'Y',
					secondvalue: null
				},
				oprtype: "!="
			}, {
				logic: "or",
				conditions: [{
					field: "ecdswithdrawstatus",
					oprtype: 'in',
					value: {
						firstvalue: "2,3",
						secondvalue: null
					}
				},{
					field: "paymentstatus",
					oprtype: 'in',
					value: {
						firstvalue: "2,3",
						secondvalue: null
					},
				}]
			}
			]
		};
	}
	return {
		querycondition: searchData,
		custcondition: custcondition,
		pageInfo: pageInfo,
		pagecode: LIST.pageCode,
		//查询区编码
		queryAreaCode: LIST.searchCode,
		//查询模板id，手工添加在界面模板json中，放在查询区
		oid: oid,
		querytype: 'tree'
	};
};

/**
 * 列表数据处理
 * @param {*} param0
 */
const setListRenderBySearch = function ({ data: { grid, numvalues } }) {
	// 表格数据
	if (grid) {
		this.props.table.setAllTableData(LIST.tableCode, grid[LIST.tableCode]);
	} else {
		this.props.table.setAllTableData(LIST.tableCode, { rows: [] });
	}
	// 状态页签数据
	if (numvalues) {
		// 防止后台少传状态 造成页签内容显示不全
		this.setState({ numvalues: { ...this.state.numvalues, ...numvalues } });
		//放入缓存
		setDefData('numvalues', DATASOURCE, this.state.numvalues);
		setDefData('activeKey', DATASOURCE, this.state.activeKey);
		if (parseInt(numvalues.ALL) < 1) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000040') });/* 国际化处理： 未查询出数据！*/
		} else {
			let successStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000041');
			// let totalStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000054');
			// let recordStr = this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000055');
			toast({ color: 'success', content: successStr });/* 国际化处理： 查询成功*/
		}
	}
	//放入缓存
	setDefData(LIST.tableCode, DATASOURCE, grid);
	// 重置按钮 状态
	buttonDisabledRule.call(this);
};

/**
 * 列表数据处理
 * @param {*} param0
 */
const setListRenderByRefresh = function ({ data: { grid, numvalues } }) {
	// 表格数据
	if (grid) {
		this.props.table.setAllTableData(LIST.tableCode, grid[LIST.tableCode]);
	} else {
		this.props.table.setAllTableData(LIST.tableCode, { rows: [] });
	}
	// 状态页签数据
	if (numvalues) {
		// 防止后台少传状态 造成页签内容显示不全
		this.setState({ numvalues: { ...this.state.numvalues, ...numvalues } });
		//放入缓存
		setDefData('numvalues', DATASOURCE, this.state.numvalues);
		setDefData('activeKey', DATASOURCE, this.state.activeKey);
		if (parseInt(numvalues.ALL) < 1) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000040') });/* 国际化处理： 未查询出数据！*/
		} else {
			toast({ color: 'success', content: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000042') });/* 国际化处理： 刷新成功!*/
		}
	}
	//放入缓存
	setDefData(LIST.tableCode, DATASOURCE, grid);
	// 重置按钮 状态
	buttonDisabledRule.call(this);
};

/**
 * 列表数据处理
 * @param {*} param0
 */
const setListRenderByTab = function ({ data: { grid, numvalues } }) {
	// 表格数据
	if (grid) {
		this.props.table.setAllTableData(LIST.tableCode, grid[LIST.tableCode]);
	} else {
		this.props.table.setAllTableData(LIST.tableCode, { rows: [] });
	}
	// 状态页签数据
	if (numvalues) {
		// 防止后台少传状态 造成页签内容显示不全
		this.setState({ numvalues: { ...this.state.numvalues, ...numvalues } });
		//放入缓存
		setDefData('numvalues', DATASOURCE, this.state.numvalues);
		setDefData('activeKey', DATASOURCE, this.state.activeKey);
	}
	//放入缓存
	setDefData(LIST.tableCode, DATASOURCE, grid);
	// 重置按钮 状态
	buttonDisabledRule.call(this);
};

/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/