/*TUjALmQQ8CzXA4MgzZQr7r1iAvHNbC7tZMbUIhRXTV14BdTZxHWQKb7meviNROWG*/
import { toast, cardCache, print, output } from 'nc-lightapp-front';
import { CopyLastHandleData } from '../events/CMPCopyUtil.js';
import { BatchCopy } from '../../../../public/CMPButtonUtil.js';
/**
 * [外币兑换]-粘贴致末行按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copyLineLastBtn = function () {
    let selectRows = this.props.cardTable.getCheckedRows(this.tableId);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000007')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
    }
    //张贴末行位置index
    let copyindex = this.props.cardTable.getNumberOfRows(this.tableId, false);
    BatchCopy.call(this,this.props, this.tableId, copyindex);//调用组件使用粘贴
    //处理复制张贴数据数据
    CopyLastHandleData(this.props, this.tableId, copyindex, selectRows.length);
    this.setState({ pasteflag: false }, () => { this.toggleShow() });
}

/*TUjALmQQ8CzXA4MgzZQr7r1iAvHNbC7tZMbUIhRXTV14BdTZxHWQKb7meviNROWG*/