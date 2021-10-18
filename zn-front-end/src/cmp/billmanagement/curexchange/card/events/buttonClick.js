/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { toast, promptBox } from 'nc-lightapp-front';
import { cardEditBtn } from '../buttonClick/cardEditBtn.js';
import { cardSettleBtn } from '../buttonClick/cardSettleBtn.js';
import { cardUnsettleBtn } from '../buttonClick/cardUnsettleBtn.js';
import { cardCopyBtn } from '../buttonClick/cardCopyBtn.js';
import { cardAddBtn } from '../buttonClick/cardAddBtn.js';
import { cardSubmitBtn } from '../buttonClick/cardSubmitBtn.js';
import { cardUnsubmitBtn } from '../buttonClick/cardUnsubmitBtn.js';
import { cardapprovemsgBtn } from '../buttonClick/cardapprovemsgBtn.js';
import { cardaccessoryBtn } from '../buttonClick/cardaccessoryBtn.js';
import { makebillBtn } from '../buttonClick/makebillBtn.js';
import { cardprintBtn } from '../buttonClick/cardprintBtn.js';
import { cardoutputBtn } from '../buttonClick/cardoutputBtn.js';
import { cardvoucherBtn } from '../buttonClick/cardvoucherBtn.js';
import { cardbuybalanceBtn } from '../buttonClick/cardbuybalanceBtn.js';
import { cardsellbalanceBtn } from '../buttonClick/cardsellbalanceBtn.js';
import { cardchargebalanceBtn } from '../buttonClick/cardchargebalanceBtn.js';
import { saveBill } from "../buttonClick/saveBill.js";
import { saveAddBill } from "../buttonClick/saveAddBill.js";
import { saveSubBill } from "../buttonClick/saveSubBill.js";
import { cancelConfirm } from "../indexUtil/cancelConfirm.js";
import { delConfirm } from "../indexUtil/delConfirm.js";
//引入常量定义
import { APP_INFO, URL_INFO, CARD_PAGE_INFO, ITEM_INFO } from '../../cons/constant.js';
//引入公共api
import {cardOperator} from '../../../../pub/utils/CMPPubButtonUtil';

export default function (props, id) {
  //验证公式
  let check_FormData = props.form.getAllFormValue(this.formId);
  let saveobj = {
    pageid: this.pageId,
    model: {
      areacode: this.formId,
      rows: check_FormData.rows,
      areaType: 'form'
    }
  };
  switch (id) {

    //卡片编辑修改
    case 'cardEditBtn':
      cardEditBtn.call(this);
      break;
    //保存按钮
    case 'saveBtn':
      //验证公式
      this.props.validateToSave(saveobj, saveBill.bind(this, props), '', '');
      break;
    //保存新增
    case 'saveaddBtn':
      //验证公式
      this.props.validateToSave(saveobj, saveAddBill.bind(this, props), '', '');
      break;
    //保存提交
    case 'savesubmitBtn':
      //验证公式
      this.props.validateToSave(saveobj, saveSubBill.bind(this, props), '', '');
      break;
    		// 委托付款
		case 'transfer':
      cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [], ITEM_INFO.PK, URL_INFO.COMMON.COMMIT  , this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000049'), APP_INFO.DATA_SOURCE, this.buttonAfter.bind(this), true);
      break;
    // 取消委托
    case 'canceltransfer':
      cardOperator(props, CARD_PAGE_INFO.PAGE_CODE, CARD_PAGE_INFO.HEAD_CODE, [], ITEM_INFO.PK, URL_INFO.COMMON.UNCOMMIT  , this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000050'), APP_INFO.DATA_SOURCE, this.buttonAfter.bind(this), true);
      break;
    //结算
    case 'cardSettleBtn':
      cardSettleBtn.call(this);
      break;
    //结算取消
    case 'cardUnsettleBtn':
      cardUnsettleBtn.call(this);
      break;
    //导入
    case 'importBtn':
      break;
    //导出
    case 'exportBtn':
      break;
    //打印
    case 'printBtn':
      break;
    //复制
    case 'cardCopyBtn':
      cardCopyBtn.call(this);
      break;
    //新增
    case 'cardAddBtn':
      cardAddBtn.call(this);
      break;
    //提交
    case 'cardSubmitBtn':
      cardSubmitBtn.call(this);
      break;
    //收回
    case 'cardUnsubmitBtn':
      cardUnsubmitBtn.call(this);
      break;
    //审批意见
    case 'cardapprovemsgBtn':
      cardapprovemsgBtn.call(this);
      break;
    //附件
    case 'cardaccessoryBtn':
      cardaccessoryBtn.call(this);
      break;
    //制单
    case 'makebillBtn':
      makebillBtn.call(this);
      break;
    //打印
    case 'cardprintBtn':
      cardprintBtn.call(this);
      break
    //预览
    case 'cardpreviewBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000012') });/* 国际化处理： 功能待开发*/
      break;
    //输出
    case 'cardoutputBtn':
      cardoutputBtn.call(this);
      break;
    //联查凭证
    case 'cardvoucherBtn':
      cardvoucherBtn.call(this);
      break;
    //联查--买入余额
    case 'cardbuybalanceBtn':
      cardbuybalanceBtn.call(this);
      break;
    //联查--卖出余额
    case 'cardsellbalanceBtn':
      cardsellbalanceBtn.call(this);
      break;
    //手续费余额
    case 'cardchargebalanceBtn':
      cardchargebalanceBtn.call(this);
      break;
    //删除
    case 'cardDeleteBtn':
      promptBox({
        color: "warning",
        title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000080'),//刪除
        content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000030'),
        beSureBtnClick: delConfirm.bind(this) //使用call直接執行了
      });
      break;
    // 审批
    case 'approveBtn':
      break;
    // 审批取消
    case 'unapproveBtn':
      break;
    //刷新
    case 'refreshBtn':
      this.refresh();
      break;
    // 取消
    case 'cancelBtn':
      promptBox({
        color: "info",
        title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000032'),//取消
        content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000034'),
        beSureBtnClick: cancelConfirm.bind(this) //使用call直接執行了
      });
      break;
     
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/