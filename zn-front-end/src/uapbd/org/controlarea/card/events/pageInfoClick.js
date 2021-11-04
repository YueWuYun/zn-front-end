//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1
import {ajax ,cardCache} from 'nc-lightapp-front';
import { formId ,dataSource,pkname} from '../constants';
let { getCacheById, updateCache } = cardCache;

export default function (props, pk) {
    if(!pk){//如果刷新了浏览器，那么pk将不会存在，如果pk不存在，return
        return;
    }
    //先从缓存中获取数据，如果获取不到就查询一次
    let cardData = getCacheById(pk, dataSource);
    if(cardData){
        this.props.setUrlParam({id : pk});
        props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
        props.cardTable.setTableData(this.tableId, cardData.body[this.tableId],null, null, true);               
        this.toggleShow();     
    }else{
        this.queryCard(pk,'pageInfoClick');//传按钮名称，主要是为了提示

    }
    
}

//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1