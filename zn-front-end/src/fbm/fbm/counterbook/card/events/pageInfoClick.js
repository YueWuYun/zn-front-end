/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/
import { ajax, cardCache } from 'nc-lightapp-front';
import { CARD_FORM_CODE, URL_LIST, CARD_TABLE_CODE, DATASOURCE } from "./../../cons/constant";
import { buttonVisiable } from "./buttonVisiable";
import { doAjax } from '../../utils/commonUtil';

export function pageInfoClick(props, pk) {
	if (!pk) {//如果刷新了浏览器，那么pk将不会存在，如果pk不存在，return
		return;
	}

	let cardData = cardCache.getCacheById(pk, DATASOURCE);
	props.setUrlParam({ status: 'browse', id: pk })//动态修改地址栏中的id的值

	// 有缓存用缓存的数据，没有缓存就重新查
	if (cardData) {
		if (cardData.head) {
			this.props.form.setAllFormValue({ [CARD_FORM_CODE]:cardData.head[CARD_FORM_CODE] });
			this.fbmbillno = cardData.head[CARD_FORM_CODE].rows[0].values.fbmbillno.value
		}
		if (cardData.body) {
			this.props.cardTable.setTableData(CARD_TABLE_CODE, cardData.body[CARD_TABLE_CODE]);
		}
		this.toggleShow()
	} else {
		let data = {
			pk: pk
		};

		let callback = function (res) {
			if (res.data.card) {
				if (res.data.card.head) {
					this.props.form.setAllFormValue({ [CARD_FORM_CODE]: res.data.card.head[CARD_FORM_CODE] });
					this.fbmbillno = res.data.card.head[CARD_FORM_CODE].rows[0].values.fbmbillno.value
				}
				if (res.data.card.body) {
					this.props.cardTable.setTableData(CARD_TABLE_CODE, res.data.card.body[CARD_TABLE_CODE]);
				}
				cardCache.updateCache('pk_register', pk, res.data.card, CARD_FORM_CODE, DATASOURCE);

				this.props.setUrlParam({ id: pk })
				this.toggleShow()
			}else {
				this.props.form.setAllFormValue({ [CARD_FORM_CODE]: { rows: [] } });
			}
		}
		doAjax.call(this, data, URL_LIST.CARD_QUERY, callback)
	}
}

/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/