/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/
//修改页面状态--button的显隐性
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { showErrBtn } from "../../../../../tmpub/pub/util";

let formId = Templatedata.card_formid;
let tableId = Templatedata.card_tableid;
let pageid = Templatedata.card_pageid;

export const buttonVisable = function (props) {
    //控制重试按钮显示情况lidyu
    showErrBtn(props, { headBtnCode: 'card_head', headAreaCode: Templatedata.card_formid,fieldPK:Templatedata.pkname, datasource:Templatedata.dataSource });

    //联查（买入账户余额、卖出账户余额、手续费账户余额）、打印、附件管理
    props.button.setButtonVisible(
        [
            'cardlinksearchBtn',
            'cardbuybalanceBtn',
            'cardsellbalanceBtn',
            'cardchargebalanceBtn',
            'cardprintBtn',
            'cardoutputBtn',
            'cardaccessoryBtn'],
        true
    );
}

/*rlM83N7mRYu+dE59d+vsJE7OO7CrrNySaHXyn//TP8dL1TFL3BoUsC2zpQHB+Dkb*/