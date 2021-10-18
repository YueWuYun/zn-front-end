/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { ajax, base, toast, cacheTools, print, output, cardCache, promptBox } from 'nc-lightapp-front';
import { 
	BTN_CARD, CARD_PAGE_CODE, DATASOURCE, URL_LIST, 
	CARD_FORM_CODE,CARD_TABLE_CODE, BTN_GROUP, PIRNTNODEKEY 
} from "./../../cons/constant";
import { doAjax } from "./../../utils/commonUtil";
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
let { getNextId, getCurrentLastId, deleteCacheById, getCacheById, updateCache, addCache } = cardCache;

export function buttonClick(props, id) {
	switch (id) {
		//联查单据
		case BTN_CARD.LINK_BILL:
			doLinkBill.call(this, props)
			break;
		//打印
		case BTN_CARD.PRINT:
			doPrint.call(this, props)
			break;
		//输出
		case BTN_CARD.OUTPUT:
			doOutPut.call(this, props)
			break;
		//刷新
		case BTN_CARD.REFRESH:
			doRefresh.call(this, props, true)
			break;
		default:
			break;
	}
}

/**
 * 联查单据
 * @param {*} props 
 */
function doLinkBill(props) {
	let checkBodyData = props.cardTable.getCheckedRows(CARD_TABLE_CODE);
	//数据校验
	if (checkBodyData.length != 1) {
		toast({ color: 'warning', content: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000000')});/* 国际化处理： 请选择1条表体数据操作*/
		return;
	}else{
		let billtype,pk_bill;
		checkBodyData.forEach((val) => {
			// 单据类型
			billtype = val.data.values.billtype;
			// 来源单据主键
			pk_bill = val.data.values.pk_bill;
		});
		if (!billtype || !billtype.value || !pk_bill || !pk_bill.value){
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000010')});/* 国际化处理： 无法获取单据具体信息，不能联查单据！*/
			return;
		}
		let linkbillExtParam = {
			status: 'browse',
			id: pk_bill && pk_bill.value,
		};
		linkApp(props, billtype && billtype.value, linkbillExtParam);
	}

}

/**
 * 打印
 * @param {*} props 
 */
function doPrint(props) {
	let printpks = [props.getUrlParam('id')];

	print(
		//支持两类: 'html'为模板打印, 'pdf'为pdf打印
		'pdf',
		URL_LIST.PRINT,
		{
			//模板节点标识
            nodekey: PIRNTNODEKEY,
			oids: printpks
		}
	);
}

/**
 * 输出
 * @param {*} props 
 */
function doOutPut(props) {
	let outputpks = [props.getUrlParam('id')];
	output({
		url: URL_LIST.PRINT,
		data: {
			//模板节点标识
            nodekey: PIRNTNODEKEY,
			oids: outputpks,
			outputType: 'output'
		}
	});
}

/**
 * 刷新
 * @param {*} props 
 */
function doRefresh(props, showToast) {
	let pk_register = props.getUrlParam('id');
	if (!pk_register) {
		this.props.form.EmptyAllFormValue(CARD_FORM_CODE)
		this.setState({
			isBlank: true
		})
		this.toggleShow();
		return;
	}
	let queryData = {
		pk: pk_register
	}

	// 成功回调
	let successCallback = function (res) {
		if (res.data && res.data.card) {
			if (res.data.card.head) {
				this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
				this.fbmbillno = res.data.card.head[CARD_FORM_CODE].rows[0].values.fbmbillno.value
			}
			if (res.data.card.body) {
				this.props.cardTable.setTableData(CARD_TABLE_CODE, res.data.card.body[CARD_TABLE_CODE]);
			}
			this.toggleShow();

			if (showToast) {
				toast({
					color: 'success',
					content: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000001')/* 国际化处理： 刷新成功！*/
				})
			}
		}
	}

	doAjax.call(this, queryData, URL_LIST.CARD_QUERY, successCallback)
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/