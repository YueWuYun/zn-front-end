//ePuItG2R9Vk6l155frGPEvobDjF00G22X42BLnlw7F+XzklJZx40fnhcOJIsu24U
import {toast} from 'nc-lightapp-front';

/**
 * 列表双击行事件
 * @param record
 * @param index
 * @param props
 * @param e
 */
export default function(record,index,props,e){
    let recordVal  = record.values;
    let param = Object.assign({
        pk_cust:recordVal.pk_cust.value,
        pk_bankaccbas:recordVal.pk_bankaccbas.value,
        pk_custbank:recordVal.pk_custbank.value,
        pagecode:props.config.pagecode,
        actionName:'check'
    },this.config);
    this.setState({
        currentCustBankPk : recordVal.pk_custbank.value,
        currentCustPk : recordVal.pk_cust.value,
        currentBankaccbas : recordVal.pk_bankaccbas.value
    },()=>{
        this.toogleCardOrList(props,'browse','card',()=>{
            this.loadCardData(props,param,()=>{
            });
        });
    });
}

//ePuItG2R9Vk6l155frGPEvobDjF00G22X42BLnlw7F+XzklJZx40fnhcOJIsu24U