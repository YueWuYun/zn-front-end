/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { submitBtn } from '../tableButtonClick/submitBtn.js';
import { unsubmitBtn } from '../tableButtonClick/unsubmitBtn.js';
import { settleBtn } from '../tableButtonClick/settleBtn.js';
import { unsettleBtn } from '../tableButtonClick/unsettleBtn.js';
import { editinnerBtn } from '../tableButtonClick/editinnerBtn.js';
import { deleteinnerBtn } from '../tableButtonClick/deleteinnerBtn.js';
import { makebillBtn } from '../tableButtonClick/makebillBtn.js';
import { submitAssginBtn } from '../tableButtonClick/submitAssginBtn.js';
//引入公共api
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/CMPPubButtonUtil';
//引入常量定义
import { URL_INFO, LIST_PAGE_INFO, SHOW_MODE,  ITEM_INFO ,CARD_PAGE_INFO,APP_INFO} from '../../cons/constant';

/**
 * [外币兑换]-表体操作列
 * @param {*} props 
 * @param {*} key 
 * @param {*} text 
 * @param {*} record 
 * @param {*} index 
 */
export default function tableButtonClick(props, key, text, record, index) {

    switch (key) {
        //提交
        case 'submitBtn':
            submitBtn.call(this, record, index);
            break;
        //指派提交
        case 'submitAssginBtn':
            submitAssginBtn.call(this, record, index);
            break;
        //收回
        case 'unsubmitBtn':
            unsubmitBtn.call(this, record, index);
            break;
        //委托付款
        case 'transferBtn':
			listSingleOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, URL_INFO.COMMON.COMMIT, record, ITEM_INFO.PK, index, this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000049'), APP_INFO.DATA_SOURCE);/* 国际化处理：委托付款*/
            break;
        //取消委托
		case 'canceltransferBtn':
			listSingleOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, URL_INFO.COMMON.UNCOMMIT, record, ITEM_INFO.PK, index, this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000050'), APP_INFO.DATA_SOURCE);/* 国际化处理：取消付款！*/
			break;
        //结算
        case 'settleBtn':
            settleBtn.call(this, record, index);
            break;
        //取消结算
        case 'unsettleBtn':
            unsettleBtn.call(this, record, index);
            break;
        //编辑修改
        case 'editinnerBtn':
            editinnerBtn.call(this, props,record, index);
            break;
        //单条删除
        case 'deleteinnerBtn':
            deleteinnerBtn.call(this, record, index);
            break;
        //制单
        case 'makebillBtn':
            makebillBtn.call(this, record, index);
            break;

    }
};

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/