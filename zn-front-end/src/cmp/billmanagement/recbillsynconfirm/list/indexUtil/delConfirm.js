/*PmETh3G9Mp9znykR2R1O5/F7/9uPxtKkE+/L+L/kEAzJoZQDmBqbZ72sqPBIGROM*/
import { ajax, toast } from 'nc-lightapp-front';
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
/**
 * [收款协同]-删除
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const delConfirm = function () {
    let selectedData = this.props.table.getCheckedRows(this.tableId);
    let { deleteCacheId } = this.props.table;
    if (selectedData.length == 0) {
        toast(
            {
                color: 'warning',
                content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000048')
            }
        );/* 国际化处理： 请选择数据*/
        return
    }
    let indexArr = [];
    let dataArr = [];
    let listTsmap = [];
    //处理选择数据
    selectedData.forEach((val) => {
        dataArr.push(val.data.values.pk_recbill.value);//主键数组
        indexArr.push(val.index);
        let tsmpa = {
            'pk': val.data.values.pk_recbill.value,
            'ts': val.data.values.ts.value,
            'index': val.index
        }
        listTsmap.push(tsmpa);
    });
    //自定义请求数据
    let data = {
        'pks': dataArr,
        'pageid': this.pageId,
        'listTsmap': listTsmap
    };

    ajax({
        url: '/nccloud/cmp/recbill/recbilldelete.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex } = res.data;
            if (success) {
                //删除提示信息
                BatchToast.call(this, 'DELETE', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                if (successPks.length > 0) {
                    successPks.forEach((val) => {
                        deleteCacheId(this.tableId, val);//删除成功后, 删除allpk中pk
                    })
                    this.props.table.deleteTableRowsByIndex(this.tableId, indexArr)//直接删除table中的行列
                }

            }
        }
    });
}

/*PmETh3G9Mp9znykR2R1O5/F7/9uPxtKkE+/L+L/kEAzJoZQDmBqbZ72sqPBIGROM*/