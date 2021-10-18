/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/
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
    // if(cardData){
    //     this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
	// 	buttonVisible(props);
	// }else{
        ajax({
            url: requesturl.querycard,
            data: data,
            success: (res) => {
                if (res) {
                    if (res.data) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                        let billno = res.data.head[this.formId].rows[0].values.vbillno.value;
                        let id = res.data.head[this.formId].rows[0].values.pk_debitcontract_icdmc.value;
                        props.setUrlParam(pks)//动态修改地址栏中的id的值
                        this.setState({ billno: billno });
                        buttonVisible(props);
                        updateCache(constant.pk_debitcontract_icdmc, id, this.formId, this.cacheDataSource);

                        if(res.data.bodys){
                            if(res.data.bodys[this.tablecode_plan]){
                                this.props.cardTable.setMulTablesData({ [this.tablecode_plan]: res.data.bodys[this.tablecode_plan] });
                            } else {
                                this.props.cardTable.setMulTablesData({ [this.tablecode_plan]: { rows: [] } });
                            }

                            if(res.data.bodys[this.tablecode_exe]){
                                this.props.cardTable.setMulTablesData({ [this.tablecode_exe]: res.data.bodys[this.tablecode_exe] });
                            } else {
                                this.props.cardTable.setMulTablesData({ [this.tablecode_exe]: { rows: [] } });
                            }
                        }
                    }
                } else {
                    this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                    this.props.cardTable.setMulTablesData({ [this.tablecode_plan]: { rows: [] } });
                    this.props.cardTable.setMulTablesData({ [this.tablecode_exe]: { rows: [] } });
                }
            }
        });
    // }
    
}

/*j07c8riwYnz20MYibuDbtGf/HI5Cx+NCQzW+Llv0PsnstKZskVhKgATc/tqKlnvi*/