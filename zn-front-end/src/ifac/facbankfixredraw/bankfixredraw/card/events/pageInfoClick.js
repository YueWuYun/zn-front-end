/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import { ajax, toast } from 'nc-lightapp-front';
import { getCacheDataByPk, updateCacheData, getDefData, setDefData } from '../../../../../tmpub/pub/util/cache';
import { CurrExConst, pageCodeCard,formId, base_url, pkname,dataSource } from '../../cons/constant';

export default function (props, pk) {
    if (pk == null || pk == undefined || pk == '') {
        //清空表体
		props.form.EmptyAllFormValue(formId);
        this.billNO = '';
		this.billID = '';
        this.toggleShow();
        return;
    }
    let cardData = getCacheDataByPk(props, dataSource, pk);
    if (cardData) {
        props.setUrlParam(pk);//动态修改地址栏中的id的值
        props.form.setAllFormValue({[formId]: cardData.head[formId]});
        this.billID = cardData.head[formId].rows[0].values.pk_fixeddatewithdraw.value || '';
		this.billNO = cardData.head[formId].rows[0].values.vbillcode.value || '';
        this.toggleShow();
    } else {
        let reqdata = {
            "pk": pk,
            "pageCode": pageCodeCard
        };
        ajax({
            url: base_url+'querycardaction.do',
            data: reqdata,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                        this.billID = res.data.head[formId].rows[0].values.pk_fixeddatewithdraw.value || '';
                        this.billNO = res.data.head[formId].rows[0].values.vbillcode.value || '';
                    }
                    props.setUrlParam(pk);//动态修改地址栏中的id的值
                    //更新cache卡片数据
                    updateCacheData(
                        props,
                        pkname,
                        pk,
                        res.data,
                        this.formId,
                        dataSource,
                        res.data.head[formId].rows[0].values
                    );
                    this.toggleShow();
                } else {
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36140NDSR") && this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000033') });
                    this.props.form.EmptyAllFormValue(formId);
                    this.billNO = '';
					this.billID = '';
                    this.toggleShow();
                }
            }
        });
    }
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/