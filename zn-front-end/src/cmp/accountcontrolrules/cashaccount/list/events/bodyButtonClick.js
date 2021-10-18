/*zPpBovT29EyoCeGjE4sa1aUYmPJHXawFZ83sJwm+gBd3uyzesQKt6OiOKwOo9l86*/
//引入常量定义
import { PAGE_STATUS, BTN, URL_INFO, card_page_id } from '../../cons/constant.js';

export default function bodyButtonClick(props, key, text, record, index, prop) {
    switch (key) {
        case BTN.LIST.EDIT:
            props.pushTo(URL_INFO.CARD_PAGE_URL,
				{
					status: PAGE_STATUS.EDIT,
					id: record.pk_cashaccrule.value,
					pagecode: card_page_id
				}
			);
            break;
        default:
            break;
    }
}

/*zPpBovT29EyoCeGjE4sa1aUYmPJHXawFZ83sJwm+gBd3uyzesQKt6OiOKwOo9l86*/