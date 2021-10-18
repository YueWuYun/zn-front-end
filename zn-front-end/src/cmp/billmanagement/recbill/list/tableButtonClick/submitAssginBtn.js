/*0i95nAg/z6TbL4YNVym0bN7CFa2VDSG70OFTwtLMpB1qWz7oD5W5kdVY+BDhVLOZ*/
import { ajax, toast } from 'nc-lightapp-front';
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
/**
 * [收款结算]-提交指派
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const submitAssginBtn = function (record, index) {
    let submitdataArr = [];
    let tsmap = {
        'pk': record.pk_recbill.value,
        'ts': record.ts.value,
        'index': index,
        'param': this.getAssginUsedr//提交指派使用
    }
    if (!this.getAssginUsedr) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000113')   // 提示内容,非必输/* 国际化处理：'请选择指派人！'*/
        });
        return;
    }
    let listTsmap = [];
    listTsmap.push(tsmap);
    submitdataArr.push(record.pk_recbill.value);
    let submitdata = {
        'pks': submitdataArr,
        'pageid': this.pageId,
        'ts': record.ts.value,
        'listObjTsmap': listTsmap
    };

    ajax({
        url: '/nccloud/cmp/recbill/listsubmiassgin.do',
        data: submitdata,
        success: (res) => {
            let { success, data } = res;
            let { status, sumNumIndex, successNumIndex, failNumIndex, message, successPks, successIndex, gridList } = res.data;
            if (success) {
                BatchToast.call(this, 'COMMIT', status, sumNumIndex, successNumIndex, failNumIndex, message, null);
                //加载更新缓存数据
                if (gridList != null && gridList.length > 0) {
                    let gridRows = res.data.gridList;
                    gridRows.forEach((val) => {
                        let test = val.index;
                        let value = val.rows.values;
                        let submitUpdateDataArr = [{
                            index: index,
                            data: { values: val.rows.values }//自定义封装数据
                        }];
                        this.props.table.updateDataByIndexs(this.tableId, submitUpdateDataArr);
                    });
                }
                //关闭指派框+清空标识
                this.setState({
                    compositedisplay: false,
                    record: null,
                    index: null
                });

            }
        }
    });
}

/*0i95nAg/z6TbL4YNVym0bN7CFa2VDSG70OFTwtLMpB1qWz7oD5W5kdVY+BDhVLOZ*/