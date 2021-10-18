/*dP3BeANuoVU73/nFulEwSPazz58KLTheQoyhOqt9/ylJ/HHy5L3QbDVqXrrqStlx*/
import { ajax } from 'nc-lightapp-front';
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
/**
 * [收款协同]-删除操作
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const deletetableBtn = function (record, index) {
    let { deleteCacheId } = this.props.table;
    let tsmpa = {
        'pk': record.pk_recbill.value,
        'ts': record.ts.value,
        'index': index
    }
    let listTsmap = [];
    listTsmap.push(tsmpa);
    let data = {
        'pk': record.pk_recbill.value,
        'ts': record.ts.value,
        'listTsmap': listTsmap
    };

    ajax({
        url: '/nccloud/cmp/recbill/recbilldelete.do',
        data: data,
        success: (res) => {
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex } = res.data;
            if (res.success) {
                //删除提示信息
                BatchToast.call(this, 'DELETE', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                if (successPks.length > 0) {
                    deleteCacheId(this.tableId, record.pk_recbill.value);//删除成功后, 调用该方法删除缓存中对应id
                    this.props.table.deleteTableRowsByIndex(this.tableId, index)//直接删除table中的行列
                }
            }
        }
    });
}

/*dP3BeANuoVU73/nFulEwSPazz58KLTheQoyhOqt9/ylJ/HHy5L3QbDVqXrrqStlx*/