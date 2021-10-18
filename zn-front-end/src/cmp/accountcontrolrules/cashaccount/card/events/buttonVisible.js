/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/
import { card_form_id, URL_INFO, PAGE_STATUS, BTN } from '../../cons/constant.js';

export default function buttonVisible(props) {
	let status = props.getUrlParam(URL_INFO.PARAM.STATUS);
	let id = props.getUrlParam(URL_INFO.PARAM.ID);
	let flag = status === PAGE_STATUS.BROWSER ? false : true;
	let editBtns = [BTN.CARD.SAVE, BTN.CARD.CANCEL];
	let borwseBtns = [BTN.CARD.ADD, BTN.CARD.DELETE, BTN.CARD.REFRESH, BTN.CARD.EDIT, BTN.CARD.SIGN];
	if (!id && !flag) {
		borwseBtns = [BTN.CARD.ADD];
	}
	//编辑态
	props.button.setButtonVisible(editBtns, flag);
	//浏览态显示
	props.button.setButtonVisible(borwseBtns, !flag);
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', !flag); //设置卡片翻页的显隐性
	//空白页面，设置新增次要按钮
	props.button.setMainButton([BTN.CARD.ADD], !id);
	//设置字段的浏览和编辑状态
	let editStatus = status === PAGE_STATUS.BROWSER ? PAGE_STATUS.BROWSER : PAGE_STATUS.EDIT;
	props.form.setFormStatus(card_form_id, editStatus);
};

/*2+0Qf+roUlDHXBeA/o9JMHU4Pe46E7iRtSlnTdj5Am0t/d/cU8rAiqGiWklu9UOn*/