/*w/8iNiAH+zj8WJF4+Br6+hKdGDAof9HPKN2+vymi+iI3tF0G8PLm4teGOaiBQKxH*/
import { ajax, toast } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl, accList } from '../../cons/constant.js';
import { selectedEvent } from './page.js';

/**
 * 点击查询，获取查询区数据
 * @param {*} props           页面内置对象
 */
export function searchBtnClick(props) {
	let metaData = props.meta.getMeta();
	let searchOid = metaData.search.oid;
	let pageInfo = props.table.getTablePageInfo(accList.tableCode);
	let searchdata = {
		querycondition: {},
		custcondition: {},
		pageInfo: pageInfo,
		pageCode: this.pageId,
		queryAreaCode: accList.searchCode, //查询区编码
		oid: searchOid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		querytype: 'tree'
	};
	let namePk = props.getUrlParam('namePk');
	let bckPk = props.getUrlParam('nonbankPk');
	// 过滤金融机构
	searchdata.querycondition = {
		logic: 'and',
		conditions: [
			{
				field: 'nonbankfininstitution',
				oprtype: '=',
				value: {
					firstvalue: namePk ? namePk : bckPk,
					secondvalue: null
				}
			}
		]
	};
	if (this.appcode === '36010NBFOO') {
		searchdata.querycondition.conditions.push({
			field: 'orgflag',
			oprtype: '=',
			display:"组织",
			value: {
				firstvalue: 0,
				secondvalue: null
			}
		});
	} else if (this.appcode === '36010NBFOG') {
		searchdata.querycondition.conditions.push({
			field: 'orgflag',
			oprtype: '=',
			display:"集团",
			value: {
				firstvalue: 1,
				secondvalue: null
			}
		});
	} else {
		searchdata.querycondition.conditions.push({
			field: 'orgflag',
			oprtype: '=',
			display:"全局",
			value: {
				firstvalue: 2,
				secondvalue: null
			}
		});
	}
	getListData.call(this, javaUrl.accListQuery, searchdata);
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
	let data = {
		pks,
		pageCode: this.pageId
	};
	getListData.call(this, javaUrl.accListQueryByPks, data);
}

/**
 * 请求列表接口
 * @param {*} path       接口地址
 * @param {*} data       数据
 */
function getListData(path, data) {
	ajax({
		url: `${baseReqUrl}${path}.do`,
		data,
		success: (res) => {
			listRender.call(this, res);
		},
		error: () => {
			listRender.call(this, { success: false });
		}
	});
}

/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 */
function listRender(res) {
	let { success, data } = res;
	if (success && data && data.grid && data.grid[accList.tableCode]) {
		this.props.table.setAllTableData(accList.tableCode, data.grid[accList.tableCode]);
		this.props.button.setButtonDisabled('Refresh', false);
		selectedEvent.call(this, this.props);
		if (this.state.showToast) {
			toast({
				color: 'success',
				content: `${this.state.json['36010NBFO-000024']}，${this.state.json['36010NBFO-000025']}${data.grid[
					this.tableId
				].pageInfo.total}${this.state.json['36010NBFO-000026']}。`
			}); /* 国际化处理： 查询成功,共有,条数据*/
		}
	} else {
		this.props.table.setAllTableData(accList.tableCode, { rows: [] });
	}
}

/*w/8iNiAH+zj8WJF4+Br6+hKdGDAof9HPKN2+vymi+iI3tF0G8PLm4teGOaiBQKxH*/