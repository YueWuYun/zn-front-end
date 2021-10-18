/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/
import {ajax,cardCache} from 'nc-lightapp-front';
import { dataSourceTam,card_from_id ,card_table_id} from '../../cons/constant';
import {processFormulamsg} from '../../util/util.js';
import {requesturl} from '../../cons/requesturl.js';
export default function (props, pks) {
    // 后台还没更新，暂不可用
    let { getCacheById, updateCache, addCache } = cardCache;
    let data = {
        "pk": pks,
        "pageCode": this.pageId
    };
    
    /*
     * id：数据主键的值
     * dataSource: 缓存数据命名空间
     */
    let cardData = getCacheById(pks, dataSourceTam);
    props.setUrlParam(pks)//动态修改地址栏中的id的值
    if(cardData){
        props.form.setAllFormValue({card_from_id:cardData.head[card_from_id]});       
        let vbillno = cardData[card_from_id][card_from_id].rows[0].values.vbillno.value;
        this.setState({ billno: vbillno });
        if(cardData.body == null){
            props.cardTable.setTableData(card_table_id, { rows: [] });
        }else{
            props.cardTable.setTableData(card_table_id,cardData.body[card_table_id]);
        }
    }else{
        ajax({
            url: requesturl.querycard,
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [card_from_id]: res.data.head[card_from_id] });
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(card_table_id, res.data.body[card_table_id]);
                    }
                    else {
                        this.props.cardTable.setTableData(card_table_id, { rows: [] });
                    }
                    updateCache('pk_intlist',pks,res.data,card_from_id,dataSourceTam,res.data.head[card_from_id].rows[0].values);
                    this.setState({ billno: res.data.head[card_from_id].rows[0].values.vbillno.value });
                    //处理公式
                    processFormulamsg(props, res);                    
                } else {
                    this.props.form.setAllFormValue({ [card_from_id]: { rows: [] } });
                    this.props.cardTable.setTableData(card_table_id, { rows: [] });
                }               
            }
        });
    }
    this.toggleShow();
}

/*j07c8riwYnz20MYibuDbtFob1QVWoQQZVt4+aQcnO55GmoP71pqdbq9es7qnFFEA*/