/*hJQOPUg5Qdnhj5DGpeTSHkk2poEJvMsHWlnZoivQ0wPEs07ZJzVJw0jTyd2ml3+A*/
/**
 * [外币兑换]-联查入口
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const getLinkquery = function () {
    let src = this.props.getUrlParam('src');
    let callback = this.props.getUrlParam('callback');
    let Status = this.props.getUrlParam('status');
    //联查1：关联计算信息
    if (src && src == 'settlement') {
        let pk_settle = this.props.getUrlParam('pk_settle');//结算单据pk
        //设置卡片显影性
        this.props.cardTable.setStatus(this.tableId, 'edit');
        //联查处理[不用缓存处理]
        let pks = [];
        if (pk_settle && pk_settle.length > 0) {
            pks.push(pk_settle);
            this.getLinkQueryData(pks);
        }
    }
  
}

/*hJQOPUg5Qdnhj5DGpeTSHkk2poEJvMsHWlnZoivQ0wPEs07ZJzVJw0jTyd2ml3+A*/