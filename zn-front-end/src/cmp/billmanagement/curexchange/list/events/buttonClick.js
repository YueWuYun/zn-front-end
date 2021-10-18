/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { toast } from 'nc-lightapp-front';
import { addBtn } from '../buttonClick/addBtn.js';
import { editBtn } from '../buttonClick/editBtn.js';
import { deleteBtn } from '../buttonClick/deleteBtn.js';
import { approveBtn } from '../buttonClick/approveBtn.js';
import { unapproveBtn } from '../buttonClick/unapproveBtn.js';
import { settlelistBtn } from '../buttonClick/settlelistBtn.js';
import { unsettlelistBtn } from '../buttonClick/unsettlelistBtn.js';
import { copyBtn } from '../buttonClick/copyBtn.js';
import { submitlistBtn } from '../buttonClick/submitlistBtn.js';
import { submitAssginBtn } from '../buttonClick/submitAssginBtn.js';
import { unsubmitlistBtn } from '../buttonClick/unsubmitlistBtn.js';
import { makebillBtn } from '../buttonClick/makebillBtn.js';
import { refreshBtn } from '../buttonClick/refreshBtn.js';
import { buybalanceBtn } from '../buttonClick/buybalanceBtn.js';
import { sellbalanceBtn } from '../buttonClick/sellbalanceBtn.js';
import { chargebalanceBtn } from '../buttonClick/chargebalanceBtn.js';
import { voucherBtn } from '../buttonClick/voucherBtn.js';
import { approvemsgBtn } from '../buttonClick/approvemsgBtn.js';
import { printBtn } from '../buttonClick/printBtn.js';
import { outputBtn } from '../buttonClick/outputBtn.js';
import { accessoryBtn } from '../buttonClick/accessoryBtn.js';
import { exportFile } from '../../../../pub/utils/CMPButtonUtil';//导出EXCEL
//引入公共api
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/CMPPubButtonUtil';
//引入常量定义
import { URL_INFO, LIST_PAGE_INFO, SHOW_MODE,  ITEM_INFO ,CARD_PAGE_INFO,APP_INFO} from '../../cons/constant';


export default function buttonClick(props, id) {

    switch (id) {
        //新增
        case 'addBtn':
            addBtn.call(this);
            break;
        //修改	
        case 'editBtn':
            editBtn.call(this);
            break;
        //删除，可以支持批量
        case 'deleteBtn':
            deleteBtn.call(this);
            break;
        //审批
        case 'approveBtn':
            approveBtn.call(this);
            break;
        //审批取消-退审
        case 'unapproveBtn':
            unapproveBtn.call(this);
            break;
        // 委托付款
		case 'transfer':
            listMultiOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, ITEM_INFO.PK, URL_INFO.COMMON.COMMIT, this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000049') , APP_INFO.DATA_SOURCE);/* 国际化处理： 委托付款*/
            break;
        // 取消委托付款
        case 'canceltransfer':
            listMultiOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, ITEM_INFO.PK, URL_INFO.COMMON.UNCOMMIT, this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000050') , APP_INFO.DATA_SOURCE);/* 国际化处理： 取消委托*/
            break;
        //结算
        case 'settlelistBtn':
            settlelistBtn.call(this);
            break;
        //结算取消
        case 'unsettlelistBtn':
            unsettlelistBtn.call(this);
            break;
        //复制
        case 'copyBtn':
            copyBtn.call(this);
            break;
        //提交
        case 'submitlistBtn':
            submitlistBtn.call(this);
            break;
        //提交<指派确认提交>
        case 'submitAssginBtn':
            submitAssginBtn.call(this);
            break;
        //收回
        case 'unsubmitlistBtn':
            unsubmitlistBtn.call(this);

            break;
        //制单
        case 'makebillBtn':
            makebillBtn.call(this);
            break;
        //刷新
        case 'refreshBtn':
            refreshBtn.call(this);
            break;
        //买入账户余额
        case 'buybalanceBtn':
            buybalanceBtn.call(this);
            break;
        //卖出账户余额
        case 'sellbalanceBtn':
            sellbalanceBtn.call(this);
            break;
        //手续费账户余额
        case 'chargebalanceBtn':
            chargebalanceBtn.call(this);
            break;
        //联查凭证
        case 'voucherBtn':
            voucherBtn.call(this);
            break;

        //审批意见
        case 'approvemsgBtn':
            approvemsgBtn.call(this);
            break;
        //打印
        case 'printBtn':
            printBtn.call(this);
            break;
        //预览
        case 'previewBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000012') });/* 国际化处理： 功能待开发*/
            break
        //输出
        case 'outputBtn':
            outputBtn.call(this);
            break;
        //附件
        case 'accessoryBtn':
            accessoryBtn.call(this);
            break;
               //导出
		case 'exportFile': //导出
		exportFile.call(this,props,'table_curexchange_01','pk_cruexchange');
		break;
    }
};

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/