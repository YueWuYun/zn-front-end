/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/
import { ajax } from 'nc-lightapp-front';
import { cardCache } from 'nc-lightapp-front';
let { getCacheById, updateCache, addCache } = cardCache;
import * as CONSTANTS from '../../const/constants';
let { tableId, pageCodeCard, Query_BY_PK_URL, dataSource, formId, pkname } = CONSTANTS;
export default function (props, pk) {
    let cardData = getCacheById(pk, dataSource);
    if (cardData) {
        let { head, body } = cardData;
        if (head) {
            this.props.form.setAllFormValue({ [formId]: cardData.head[formId] });
            let billno = cardData.head[formId].rows[0].values.vbillno.value;
            this.billno = billno;
            props.setUrlParam({
                status: 'browse',
                id:  this.props.form.getFormItemsValue(formId,pkname)&&this.props.form.getFormItemsValue(formId,pkname).value
            });
            this.toggleShow();
        }
    } else {
        let pks = [];
        pks.push(pk);
        let data = {
            pks: pks,
            pageCode: pageCodeCard,
            extParam: {
                type: 'original'
            }
        };
        //得到数据渲染到页面
        ajax({
            url: Query_BY_PK_URL,
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                        this.billno = res.data.head[formId].rows[0].values.vbillno.value;
                        this.props.BillHeadInfo.setBillHeadInfoVisible({
                            showBackBtn: true,
                            showBillCode: true,
                            billCode: this.billno
                        });
                    }
                    props.setUrlParam({
                        status: 'browse',
                        id: pk
                    });
                    //更新缓存
                    updateCache(pkname, pk, res.data, formId, dataSource);
                } else {
                    this.props.form.setAllFormValue({ [formId]: { rows: [] } });
                }
            }
        });
    }
}

/*j07c8riwYnz20MYibuDbtLiMTbmJRKXK99nyLdxXvKzLOOIuKU82Hl4GjWhKqzIX*/