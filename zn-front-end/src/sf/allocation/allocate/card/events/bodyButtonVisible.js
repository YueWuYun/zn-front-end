/*rU6xC2Indv2jTQbxtgRf9IXIIsF1n4XYTvWuOvzuUoAWHXlV+m83EOV5gFoybvpE*/
import { base_url, button, card_from_id,sourceModel_SF, SHOWMODEL_BULU, viewmod_deal, billtype, print_nodekey, print_templateid, funcode, dataSource, card_table_id } from '../../cons/constant.js';

// export const bodyButtonVisible = function (props) {
export default function click(props) {
	let selectdata;
	let status = props.getUrlParam('status');
	if (props.cardTable&&props.cardTable.getNumberOfRows(card_table_id)>0) {
		selectdata = props.cardTable.getCheckedRows(card_table_id);
	}
	let pk_org=props.form.getFormItemsValue(card_from_id, 'pk_org');
	if (status == 'add') {

		if (!selectdata || selectdata.length == 0) {
			//没有选中
			if(pk_org&&pk_org.value) {
				props.button.setButtonDisabled(['deleteline', 'copyline'], true);
			}else {
				props.button.setButtonDisabled(['addline','deleteline', 'copyline'], true);
			}
			
		} else {
			props.button.setButtonDisabled(['addline', 'deleteline', 'copyline'], false);
		}
	} else {
		if (!selectdata || selectdata.length == 0) {
			//没有选中
			props.button.setButtonDisabled(['addline'], false);
			props.button.setButtonDisabled(['deleteline', 'copyline'], true);
		} else {
			// 在修改的时候选中行，增行也要亮
			// props.button.setButtonDisabled(['addline'], true);
			props.button.setButtonDisabled(['addline','deleteline', 'copyline'], false);
		}
	}

}
//卡片表体行级按钮数组
export const getBodyBtnArr = function (props, record,copyflag) {
    let status = props.getUrlParam('status');
    if ('browse' == status) {
        return record.expandRowStatus ? ['closedown'] : ['opendown'];
    }
    // else if ('decide' == status) {
    //     return record.expandRowStatus ? ['closedown'] : ['opendown'];
    // }
    else {
        if (!copyflag) {
            return ['openright'];
        }
    }
}

/*rU6xC2Indv2jTQbxtgRf9IXIIsF1n4XYTvWuOvzuUoAWHXlV+m83EOV5gFoybvpE*/