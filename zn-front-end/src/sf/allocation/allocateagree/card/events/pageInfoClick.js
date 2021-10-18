/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/
import {ajax} from 'nc-lightapp-front';
export default function (props, pks) {
    console.log(pks);
    //let {addCacheId} = this.props.table;
    let pkArr = [];
    // 后台还没更新，暂不可用
     // 后台还没更新，暂不可用
    if(pks){
        pkArr.push(pks);
    }
    let data = {
        // "pks": pkArr,
        // "pageCode": this.pageId 
        pks: pkArr,
        pageid: '36320FAA_C01',
        status: 'browse',
    };
    
    ajax({
        url: '/nccloud/sf/allocation/alloagreecardquery.do',
        data: data,
        success: (res) => {
            //新增成功后, 调用该方法新增缓存中对应id
            /*
            * tableAreacode：表格区域编码
            * pkvalue:数据主键的值
            */
            //addCacheId(tableAreacode,pkvalue);
            if (res.data) {
                if (res.data.head) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                }
                if (res.data.body) {
                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                }
                props.setUrlParam(pks)//动态修改地址栏中的id的值
                //页签赋值
                this.setState({
                    billNO: res.data.head['head'].rows[0].values.vbillno.value
                });
            } else {
                this.props.form.setAllFormValue({ [this.formId]: { rows: [] } });
                this.props.cardTable.setTableData(this.tableId, { rows: [] });
            }
        }
    });
    this.toggleShow();
}

/*j07c8riwYnz20MYibuDbtOP/jBaF98+nLxRDTjuEW/dJ4YfaLX5obEVeh5l7OdTb*/