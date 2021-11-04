//wxBtVHTjruFsGR5nLWPsoA8Y9FjLFED263TFgna3B6ncIzS6DiZP58ubJ/t3jUSy
import { ajax, cardCache } from 'nc-lightapp-front';
import { showSuccessInfo, showWarningInfo, showNoQueryResultInfo } from '../../../pub/tool/messageUtil';
import { URL, PAGECODE, PAGEAREA, DATASOURCE, SEARCHINFO } from '../constance';
import { buttonController } from '../viewController';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
/**
 * 查询数据，包括查询和刷新
 * @param {*} props 
 * @param {*} isrefresh 是否是刷新
 */
export default function(props, isrefresh) {
	let { setDefData, getDefData } = cardCache;
	let queryinfo = {};
	//校验组织必输
	if (!this.state.pk_org.value) {
		showWarningInfo(getLangByResId(this, '4001MST-000003')); /* 国际化处理： 请选择主组织*/
		return;
	}
	if (isrefresh) {
		//没有查询过就点刷新直接返回
		queryinfo = getDefData(SEARCHINFO, DATASOURCE);
		if (!queryinfo) {
			return;
		}
	} else {
		queryinfo = props.search.getQueryInfo(PAGEAREA.search);
		//补充主组织和是否显示停用条件
		addCondition.call(this, queryinfo);
		setDefData(SEARCHINFO, DATASOURCE, queryinfo);
	}
	queryinfo.pageCode = PAGECODE;
	ajax({
		url: URL.query,
		data: queryinfo,
		method: 'POST',
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let rowsData = { rows: [] };
				if (data == null) {
					props.editTable.setTableData(PAGEAREA.list, rowsData);
				} else {
					rowsData = data[PAGEAREA.list];
					props.editTable.setTableData(PAGEAREA.list, rowsData);
				}
				//判断是否是刷新
				if (isrefresh) {
					showSuccessInfo(getLangByResId(this, '4001MST-000004')); /* 国际化处理： 刷新成功*/
				} else if (data == null) {
					showNoQueryResultInfo();
				} else {
					showSuccessInfo(
						getLangByResId(this, '4001MST-000005', { count: rowsData.rows.length })
					); /* 国际化处理： 查询成功*/
				}
				//重置按钮可用性
				buttonController.call(this, props);
			}
		}
	});
}
/**
 * 补充查询条件，需要根据主组织和是否包含停用过滤
 * @param {*} queryinfo 
 */
function addCondition(queryinfo) {
	let conditions = queryinfo.querycondition.conditions || [];
	//组织
	if (this.state.pk_org.value) {
		let orgCondition = {
			datatype: '204',
			field: 'pk_org',
			isIncludeSub: false,
			oprtype: '=',
			value: { firstvalue: this.state.pk_org.value, secondvalue: '' }
		};
		conditions.push(orgCondition);
	}
	//显示停用（如果是否，只显示启用的）
	if (!this.state.showSeal) {
		let isSealCondition = {
			datatype: '203',
			field: 'enablestate',
			isIncludeSub: false,
			oprtype: '=',
			refurl: '',
			value: { firstvalue: '2', secondvalue: '' }
		};
		conditions.push(isSealCondition);
	}
}

//wxBtVHTjruFsGR5nLWPsoA8Y9FjLFED263TFgna3B6ncIzS6DiZP58ubJ/t3jUSy