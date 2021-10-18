/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/
/**
 * 处理按钮的可见性
 * 只控制 是否记账 是否制证 四个按钮的可见性 其余按钮一直显示不做处理
 * @param {*} props 界面内置对象
 */
import { card_page_id, card_from_id, card_table_id ,dataSource, islink, receiptPk} from '../../cons/constant.js';
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { sagaField, sagaFrozenEnum} from "../../../../../tmpub/pub/cons/constant.js";
import { showErrBtn} from "../../../../../tmpub/pub/util/index";

export default function buttonVisible(props) {

	//所有按钮隐藏
	props.button.setButtonVisible(['Bookkeeping', 'UnBookkeeping', 'Certification', 'UnCertification'], false);

	//记账标识
	let istally = props.form.getAllFormValue('form_deliveryreceipt_head').rows[0].values.istally.value === true ? true : false;//是否记账;
	//制证标识
	let isvoucher = props.form.getAllFormValue('form_deliveryreceipt_head').rows[0].values.isvoucher.value === true ? true : false;//是否制证;

	//联查时只有附件联查打印
	if(getDefData(dataSource, islink)){
		//这里不需要做特殊处理

	}else{
		if (!istally) {//没有记账
			//显示记账
			props.button.setButtonVisible(['Bookkeeping'], true);
	
		} else {//已经记账
	
			if(isvoucher){//已经制证
				//显示取消制证
				props.button.setButtonVisible(['UnCertification'], true);
			}else{//没有制证
				//显示制证 取消记账
				props.button.setButtonVisible(['Certification','UnBookkeeping'], true);
			}
		}
	}
	//控制重试按钮显示情况
    showErrBtn(props, {
        headBtnCode: 'card_head',
        headAreaCode: card_from_id,
        fieldPK: receiptPk,
        datasource: dataSource
    }); 	
}
//隐藏所有按钮
export const hideAllBtn = function (props) {
    const { setButtonVisible,setButtonDisabled } = props.button;
	setButtonDisabled(['Bookkeeping', 'UnBookkeeping', 'Certification', 'UnCertification'], false);
}

/**判断是否冻结 */
const isSagaFrozen = function (props) {
    let sagafrozen = props.form.getFormItemsValue(card_from_id, sagaField.frozen).value;
    return sagaFrozenEnum.frozen == sagafrozen;
}
/*2+0Qf+roUlDHXBeA/o9JMC11R5lj4BQqeltBN5W7LKaQgmoznnMYgwycAKgrWRQk*/