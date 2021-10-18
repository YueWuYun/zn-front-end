/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAkIa59bAY2122z1Amwc1aLa*/
import { FIELD, card_search_id } from '../../cons/constant.js';

export default function searchAfterEvent(field, val) {

    if (field == FIELD.SEARCH.PKORG || field == FIELD.SEARCH.PKCURRTYPE || field == FIELD.SEARCH.SETTLEDATE) {
        this.props.search.setSearchValByField(card_search_id, FIELD.SEARCH.PKINTOBJ, { value: '', display: '' });
    }

}
/*VRi3nyqaeOPenSkOLNstN67Zi7jahgHbEqXb+H4sfAkIa59bAY2122z1Amwc1aLa*/