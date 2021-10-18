/*MbmsQ44fu4sIQRtCQMNXT1O4y2P7VJv+/aVLZlkEGh5QwPXT4QRp+147byBGsfzk*/
import { ajax } from 'nc-lightapp-front';

/**
 * [收款]-获取联查条件
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const getLinkQueryData = function (searchData) {
    let sendArr = {
        'pks': searchData,
        'pageid': this.pageId
    }
    ajax({
        url: '/nccloud/cmp/recbill/recbilllinkbill.do',
        data: sendArr,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    let rowlenght = data[this.tableId].rows;
                    console.log(rowlenght);
                    let src = this.props.getUrlParam('src');
                    if (rowlenght.length == 1) {
                        let record = rowlenght[0];
                        //1条数据跳转到卡片页面
                        this.props.pushTo('/card', {
                            status: 'browse',
                            id: record.values.pk_recbill.value,
                            scene: 'linksce',
                            pagecode: this.cardPageId
                        });
                    } else {
                        //多条数据跳转到列表页面
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                    }
                } else {
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        }
    });
}

/*MbmsQ44fu4sIQRtCQMNXT1O4y2P7VJv+/aVLZlkEGh5QwPXT4QRp+147byBGsfzk*/