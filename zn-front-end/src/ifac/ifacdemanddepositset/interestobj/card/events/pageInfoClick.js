/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import {ajax,cardCache} from 'nc-lightapp-front';
import { dataSourceTam,card_from_id,pk_name } from '../../cons/constant';
import {processFormulamsg} from '../../util/util.js';
import { requesturl } from '../../cons/requesturl.js';

export default function (props, pks) {
    // 后台还没更新，暂不可用
    let { getCacheById, updateCache, addCache } = cardCache;
    let id = this.props.getUrlParam('id');
    let cardData = getCacheById(id, dataSourceTam);
    let data = {
        "pk": pks,
        "pageCode": this.pageId
    };
    
    /*
     * id：数据主键的值
     * dataSource: 缓存数据命名空间
     */

   // let cardData = getCacheById(pks, dataSourceTam);
    props.setUrlParam(pks)//动态修改地址栏中的id的值
    
    if(cardData){
        
        props.form.setAllFormValue({card_from_id:cardData.head[this.formId]});       
        //let vbillno = cardData.head[this.formId].rows[0].values.vbillno.value;
        // let vbillno = cardData.head[card_from_id].rows[0].values.vbillno.value;
        // this.setState({ billno: vbillno });
        if(cardData.body == null){
            props.cardTable.setTableData(this.tableId, { rows: [] });
        }else{
            props.cardTable.setTableData(this.tableId,cardData.body[this.tableId]);
        }
    }else{
        ajax({
            url: requesturl.querycard,
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    }
                    else {
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    }
                    // addCache(pks,res.data,this.formId,dataSourceTam);
                    updateCache(pk_name,pks,res.data,card_from_id,dataSourceTam,res.data.head[this.formId].rows[0].values);
                    // this.setState({ billno: res.data.head[this.formId].rows[0].values.vbillno.value });
                    //处理公式
                    processFormulamsg(props, res);                    
                } else {
                    this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                }               
            }
        });
    }
    this.toggleShow();
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/