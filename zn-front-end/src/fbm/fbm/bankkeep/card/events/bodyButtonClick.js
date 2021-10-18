/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { card,cardEvent } from '../../../../public/container/index';
export function bodyButtonClick(props, key, text, record, index) {
    let currTableId = this.tabCode;
    let curTabKey = this.props.cardTable.getCurTabKey();
  
    switch (key) {
        //行 新增
        case 'addRow':
            card.addRow.call(this);
        break;
        //行 删除
        case 'deleteRow':
            card.deleteRow.call(this);
            const eventDatas = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder,  'pfbm', 'delrow', null);//编辑后事件整单数据
            let eventData = { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas) };
            cardEvent.setBodyAfterEventData.call(this, eventData).then(res => {
                setAfterEditFormValue.call(this,this.props,res);
        	});
            break;
        //展开（编辑态）
        case 'expand':
            card.openTabModal.call(this, record, index);
            break;
        //展开（浏览态）
        case 'unfold':
        //收起
        case 'fold':   
            card.toggleRowView.call(this, record);
            break;
        //插行
        case 'insertRow':
            card.insertRow.call(this, index); 
            break;
        //删行
        case 'delRow':
          //  if (checkDelRow(props, record, index)) {
                card.delRow.call(this, index);
                const eventDatas1 = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder,  'pfbm', 'delrow', null);//编辑后事件整单数据
                let eventData1 = { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(eventDatas1) };
                cardEvent.setBodyAfterEventData.call(this, eventData1).then(res => {
                    setAfterEditFormValue.call(this,this.props,res);
            	});
          //  }
            break;      
    }
}

function setAfterEditFormValue(props,res){
	    let { success, data } = res;
	    let { card, retExtParam, headProp, bodyItemProps,headItemProps } = data;
	    let { head, bodys } = card;
	    props.form.setAllFormValue({ [this.formId]: head[this.formId] });
	    props.cardTable.setAllTabsData(bodys, this.tabOrder);
	    setHeadItemProp(props,this.formId,headItemProps);
		setBodyItemProp(props,this.tabCode,bodyItemProps,bodys);
}
/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/