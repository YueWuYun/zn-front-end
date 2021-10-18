/*zPpBovT29EyoCeGjE4sa1auEaMbk/CaLIRN7B5oxEo3+Q+5niSTF/dGEAHo29PcG*/
import { card } from '../../../../public/container/index';

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