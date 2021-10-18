/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
//应收票据退票——表体编辑后事件
import { card } from '../../../../public/container/index';
import { cardEvent } from '../../../../public/container/index';

export function bodyButtonClick(props, key, text, record, index) {
    switch (key) {
        //行 新增
        case 'addRow':
            card.addRow.call(this);
        break;
        //行 删除
        case 'deleteRow':
            card.deleteRow.call(this);
            const eventData = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder, 'pfbm', 'delrow', null);//编辑后事件整单数据
			cardEvent.setBodyAfterEventData.call(this, eventData).then(res => {
                props.form.setAllFormValue({
                    [this.formId]: res.data.head && res.data.head[this.formId]
                });
            });
            break;
        //插行
        case 'insertRow':
            card.insertRow.call(this, index); 
            break;
        //删行
        case 'delRow':
            card.delRow.call(this, index);
            const eventData1 = this.props.createTabsBodyAfterEventData(this.pageId, this.formId, this.tabOrder, 'pfbm', 'delrow', null);//编辑后事件整单数据
			cardEvent.setBodyAfterEventData.call(this, eventData1).then(res => {
                props.form.setAllFormValue({
                    [this.formId]: res.data.head && res.data.head[this.formId]
                });
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
    }
}


/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/