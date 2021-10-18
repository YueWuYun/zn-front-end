/*oin4DONBAk3jWNMmcVYh70Z2p5SK0rZ2BoK2xtNMxC74Z177qB/+C+TFygieo8rL*/
import { toast } from 'nc-lightapp-front';
import { BatchCopy } from '../../../../public/CMPButtonUtil.js';
import { CopyThisHandleData } from '../events/CMPCopyUtil.js';

/**
 * [收款协同]-粘贴至此
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copythisBtn = function (record, index) {
    let selectRows = this.props.cardTable.getCheckedRows(this.tableId);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000007')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
    }
    if (index != 0 && !index) {
        index = this.props.cardTable.getNumberOfRows(this.tableId, false);
    }
    BatchCopy.call(this, this.props, this.tableId, index);//调用组件使用粘贴
    CopyThisHandleData(this.props, this.tableId, index, selectRows.length);
    this.setState({ pasteflag: false }, () => { this.toggleShow() });
}

/*oin4DONBAk3jWNMmcVYh70Z2p5SK0rZ2BoK2xtNMxC74Z177qB/+C+TFygieo8rL*/