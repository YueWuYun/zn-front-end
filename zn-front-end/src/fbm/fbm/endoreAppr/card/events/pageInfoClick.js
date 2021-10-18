/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/
/**
 * 背书办理列表分页点击事件
 * @author：gaokung
 */
import { cardCache } from 'nc-lightapp-front';
import { CARD, URI, DATASOURCE } from './../../cons/constant';
import { doAjax } from '../../utils/commonUtil';
export default function pageInfoClick(props, pk) {
	if (!pk) {
		//如果刷新了浏览器，那么pk将不会存在，如果pk不存在，return
		return;
	}

	let cardData = cardCache.getCacheById(pk, DATASOURCE);
	props.setUrlParam({ status: 'browse', id: pk }); //动态修改地址栏中的id的值

	// 有缓存用缓存的数据，没有缓存就重新查
	if (cardData) {
		props.form.setAllFormValue({ [CARD.formHeadCode]: cardData.head[CARD.formHeadCode] });
		let vbillno = cardData.head[CARD.formHeadCode].rows[0].values.vbillno.value;
		this.setState({
			billNo: vbillno
		});
		this.setUIDisplay();
	} else {
		let data = {
			pk: pk
		};

		let callback = function(res) {
			if (res.data) {
                this.props.form.setAllFormValue({ [CARD.formHeadCode]: res.data.head[CARD.formHeadCode] });
                cardCache.updateCache('pk_endore', pk, res.data, CARD.formHeadCode, DATASOURCE);
				let vbillno = res.data.head[CARD.formHeadCode].rows[0].values.vbillno.value;
                this.props.setUrlParam({ id: pk });
                this.setState({
                    billNo: vbillno
                });
				this.setUIDisplay.call(this);
			}else {
				this.props.form.setAllFormValue({ [CARD.formHeadCode]: {} });
			}
		};
		doAjax.call(this, data, URI.endoreCardMainQuery, callback);
	}
}

/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/