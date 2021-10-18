/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/
import { ajax, cardCache } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
let { getCacheById, updateCache, addCache, getCurrentLastId,getNextId, deleteCacheById } = cardCache;
import { buttonVisible } from './buttonVisible';

export default function (props, pks) {
    // 后台还没更新，暂不可用
    let data = {
        pk: pks,
        pageCode: constant.cpagecode
    };
    let cardData = getCacheById(pks, this.cacheDataSource);
    if(cardData){
        this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
		buttonVisible(props);
	}else{
        ajax({
            url: requesturl.querycard,
            data: data,
            success: (res) => {
                if (res) {
                    if (res.data) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                        let billno = res.data[this.formId].rows[0].values.vbillno.value;
                        let id = res.data[this.formId].rows[0].values.pk_accountagiotage.value;
                        props.setUrlParam(pks)//动态修改地址栏中的id的值
                        this.setState({ billno: billno });
                        buttonVisible(props);
                        updateCache(constant.pk_accountagiotage, id, this.formId, this.cacheDataSource);
                    }
                } else {
                    this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                }
            }
        });
    }
    
}

/*j07c8riwYnz20MYibuDbtIegP36ApNb8GVj+l7KrmIDNSTOhbaWxzCXNwh0r8Nmj*/