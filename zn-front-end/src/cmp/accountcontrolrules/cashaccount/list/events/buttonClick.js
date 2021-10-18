/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { cardCache, toast, promptBox, ajax } from 'nc-lightapp-front';
import { list_table_id, list_search_id, search_source, card_page_id, URL_INFO, FIELD, PAGE_STATUS, BTN, appcode } from '../../cons/constant.js';
import { getLang } from "../../util/index";
import clickSearchBtn from "./searchBtnClick";
let { getDefData } = cardCache;
export default function buttonClick(props, id) {

	switch (id) {
		//刷新
		case BTN.LIST.REFRESH:
			//查询条件
			let refreshsearchVal = getDefData(list_search_id, search_source);//查询condition
			if (!refreshsearchVal) {
				refreshsearchVal = this.props.search.getAllSearchData(list_search_id);
			}
			//查询
			clickSearchBtn.call(this, props, props.search.getAllSearchData(list_search_id), null, refreshsearchVal, true);
			break;
		//新增
		case BTN.LIST.ADD:
			props.pushTo(URL_INFO.CARD_PAGE_URL,
				{
					status: PAGE_STATUS.ADD,
					pagecode: card_page_id
				}
			);
			break;
		//删除
		case BTN.LIST.DELETE:
			let selectedData = props.table.getCheckedRows(list_table_id);
			if (selectedData.length != 1) {
				toast(getLang(props, '000008'));	/* 国际化处理： 请选择1条数据，进行删除！*/
				return;
			}
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: getLang(props, '000004'),/* 国际化处理： 删除*/
				content: getLang(props, '000009'),/* 国际化处理： 确定要删除所选数据吗？*/
				beSureBtnClick: delConfirm.bind(this, selectedData)	// 确定按钮点击调用函数,非必输
			})
			break;
		//超额签核
		case BTN.CARD.SIGN:
			let checkedRows = this.props.table.getCheckedRows(list_table_id);
			if (checkedRows.length != 1) {
				toast({
					color: 'warning',
					content: getLang(props, '000014')/* 国际化处理： 请选择1条数据！*/
				});
				return;
			}
			let pkorg;
			checkedRows.forEach((val) => {
				if (val.data.values.pk_org && val.data.values.pk_org.value) {
					pkorg = val.data.values.pk_org.value;
				}
			});
			this.props.openTo(URL_INFO.EXSIGN, {
				srcFunCode: appcode,
				pk_org: pkorg,
				appcode: URL_INFO.PARAM.EXSIGNAPPCODE,
				pagecode: URL_INFO.PARAM.EXSIGNPAGECODE,
				status: PAGE_STATUS.BROWSER
			});
			break;
		default:
			break;
	}
}

/**
 * 删除确认
 * @param {*} selectDatas 
 */
const delConfirm = function (selectDatas) {
	let pkTsMap = {};
	let pk =
		selectDatas[0] &&
		selectDatas[0].data &&
		selectDatas[0].data.values &&
		selectDatas[0].data.values[FIELD.PKCASHACCRULE] &&
		selectDatas[0].data.values[FIELD.PKCASHACCRULE].value;
	let ts =
		selectDatas[0] &&
		selectDatas[0].data &&
		selectDatas[0].data.values &&
		selectDatas[0].data.values[FIELD.TS] &&
		selectDatas[0].data.values[FIELD.TS].value;
	pkTsMap[pk] = ts;
	let data = { pkTsMap, pageCode: card_page_id };
	let rowIndex = selectDatas[0].index
	ajax({
		url: URL_INFO.COMMON.DELETE,
		data,
		success: () => {
			this.props.table.deleteCacheId(list_table_id, pk);
			//删除行
			this.props.table.deleteTableRowsByIndex(list_table_id, rowIndex);
			toast({ color: 'success', content: getLang(this.props, '000006') });/* 国际化处理： 删除成功*/
		}
	});
};
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/