/*BJzpvOTxrU0V69KiBNXco+OqPRHxvvBNmJyzHgSWk/Bl7nCSmHw/MkSfVOFkLeZB*/
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { BTN_CARD, CARD_FORM_CODE, CARD_TABLE_CODE } from "./../../cons/constant";

export default function bobyButtonClick(props, key, text, record, index) {
    switch (key) {
        // 展开
        case BTN_CARD.OPEN_INNER:
            this.props.cardTable.toggleRowView(CARD_TABLE_CODE, record);
            break;
        // 收回
        case BTN_CARD.UNOPEN_INNER:
            this.props.cardTable.toggleRowView(CARD_TABLE_CODE, record);
            break;
        default:
            break;
    }
};

/*BJzpvOTxrU0V69KiBNXco+OqPRHxvvBNmJyzHgSWk/Bl7nCSmHw/MkSfVOFkLeZB*/