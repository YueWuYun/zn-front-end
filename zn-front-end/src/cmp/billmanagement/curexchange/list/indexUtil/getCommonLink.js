/*Pevh12LFnsg3DfXH4m3wE80nBtOznXf+Z9eFyZcr5j4yOt5a3SoaL4CddpuLli/G*/
/**
 * [外币兑换index]-被联查查询方法
 * @param {*}  
 */
export const getCommonLink = function (id) {

    let sendArr = {
        'pk':id,
        'pageid': this.pageCode
    }
    ajax({
        url: '/nccloud/cmp/curexchange/commonlistq.do',
        data: sendArr,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                } else {
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        }
    });
}

/*Pevh12LFnsg3DfXH4m3wE80nBtOznXf+Z9eFyZcr5j4yOt5a3SoaL4CddpuLli/G*/