/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
import {cardCache} from "nc-lightapp-front";
import {dataSource,card_from_id,card_page_id} from "../../cons/constant"

export default function (props, pk) {   
    if (!pk) {
        return;
    }   
    let cardData = cardCache.getCacheById(pk, dataSource);
    props.setUrlParam({ status: 'browse', id: pk })//动态修改地址栏中的id的值

    //如果缓存有数据，就用缓存的数据展示,否则发起ajax请求
    if(cardData){
        props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
        let vbillno = cardData.head[this.formId].rows[0].values.vbillno.value;
        this.setState({
            billno:vbillno
        })
        if(cardData.body == null){
            props.cardTable.setTableData(this.tableId, { rows: [] });
        }else{
            props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
        }
        this.toggleShow()        
    }else{
        let data = {
            pk: pk,
            pageid:card_page_id,
            pageCode: card_page_id            
        };
        ajax({
            url: '/nccloud/sf/allocation/querycard.do',
            data: data,
            success: (res) => {
                if (res.data) {
                    if (res.data.head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    }
                    if (res.data.body) {
                        this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                    }                   
                    cardCache.updateCache("pk_allocatepay_h",pk,res.data,card_from_id,dataSource);
                    this.setState({ billno: res.data.head[this.formId].rows[0].values.vbillno.value });
                    this.toggleShow()
                } else {
                    this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                    this.props.cardTable.setTableData(this.tableId, { rows: [] });
                }
            }
        });
    }

	
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/