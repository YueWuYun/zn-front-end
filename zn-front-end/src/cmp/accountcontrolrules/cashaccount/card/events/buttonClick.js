/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cardCache, promptBox } from 'nc-lightapp-front';
import { card_form_id, FIELD, PAGE_STATUS, card_page_id, list_page_id, BTN, URL_INFO, appcode } from '../../cons/constant.js';
import { versionControl, getLang, save, repaintView, qryDataByPK, emptyView } from '../../util/index';
import initTemplate from './initTemplate';

let { updateCache } = cardCache;
export default function (props, btnId) {
    let billdata = props.createMasterChildData(card_page_id, card_form_id);
    let pk = props.form.getFormItemsValue(card_form_id, FIELD.PKCASHACCRULE).value;
    let saveObj = {};
    //财务组织
    switch (btnId) {
        //新增
        case BTN.CARD.ADD:
            props.setUrlParam({
                status: PAGE_STATUS.ADD
            });
            initTemplate.call(this, props);
            break;
        //刷新
        case BTN.CARD.REFRESH:
            qryDataByPK(props, pk);
            break;
        //保存
        case BTN.CARD.SAVE:
            props.validateToSave(billdata, save.bind(this, props), saveObj, '');
            break;
        //修改
        case BTN.CARD.EDIT:
            props.setUrlParam({
                status: PAGE_STATUS.EDIT
            });
            qryDataByPK(props, pk);
            break;
        //删除
        case BTN.CARD.DELETE:
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: getLang(this.props, '000004'),    /* 国际化处理： 删除*/
                content: getLang(this.props, '000005'),    /* 国际化处理： 确定要删除吗*/
                beSureBtnClick: delConfirm.bind(this, props)
            });
            break;
        //取消
        case BTN.CARD.CANCEL:
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: getLang(this.props, '000002'),    /* 国际化处理： 取消*/
                content: getLang(this.props, '000003'),  /* 国际化处理： 确定要取消吗?*/
                beSureBtnClick: cancelConfirm.bind(this, props)
            });
            break;
        //超额签核
        case BTN.CARD.SIGN:
            let pkorg = this.props.form.getFormItemsValue(card_form_id, FIELD.PKORG).value;
            this.props.openTo(URL_INFO.EXSIGN, {
                srcFunCode: appcode,
                pk_org: pkorg,
                appcode: URL_INFO.PARAM.EXSIGNAPPCODE,
                pagecode: URL_INFO.PARAM.EXSIGNPAGECODE,
                status: PAGE_STATUS.BROWSER
            });
            break;
        default:
            break;
    }
}

/**
 * 取消确认
 * @param {*} props 
 * @param {*} pk
 */
const cancelConfirm = function (props) {
    let id = props.getUrlParam(URL_INFO.PARAM.ID);
    props.setUrlParam({
        status: PAGE_STATUS.BROWSER
    });
    if (!id) {
        props.form.EmptyAllFormValue(card_form_id);
    } else {
        qryDataByPK(props, id);
    }
    repaintView(props);
}

/**
 * 删除确认
 * @param {*} props 
 */
const delConfirm = function (props) {
    let pkTsMap = {};
    let pk = props.form.getFormItemsValue(card_form_id, FIELD.PKCASHACCRULE).value;
    let ts = props.form.getFormItemsValue(card_form_id, FIELD.TS).value;
    pkTsMap[pk] = ts;
    let data = { pkTsMap, pageCode: card_page_id };
    ajax({
        url: URL_INFO.COMMON.DELETE,
        data,
        success: () => {
            emptyView.call(this, props, pk);
            toast({ color: 'success', content: getLang(this.props, '000006') });/* 国际化处理： 删除成功*/
        }
    });
};

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/