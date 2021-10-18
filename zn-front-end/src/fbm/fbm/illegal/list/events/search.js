/*w/8iNiAH+zj8WJF4+Br6+mgDEjHDz7v5E8SGAvbf7IEZiLlSv1Wt87dKtx2uh5bj*/
import { listButtonVisible } from './buttonVisible';
import { ajax, toast, cardCache} from 'nc-lightapp-front';
import { listQuery } from '../../cons/constant';
let { setDefData, getDefData } = cardCache;
/**
 * 点击查询，获取查询区数据 props, data, type, queryInfo
 * @param {*} props          页面内置对象
 */
export function searchButtonClick (props,showToast) {
    if(showToast == 'undefined'){
        showToast = true
    }
    // 分页信息
    let pageInfo = props.editTable.getTablePageInfo(this.pageId);
    let querycondition = props.search.getAllSearchData(this.searchId);
    let searchdata = {
        querycondition:querycondition,
        pageInfo:pageInfo,
        pagecode: this.pageId,
        queryAreaCode: this.searchId,
        oid: this.searchOid,  
        querytype: 'tree',
    };
    queryAjax.call(this, listQuery, searchdata,showToast).then(data => {
        // 设置缓存
        setDefData(this.searchCache.key, this.searchCache.dataSource, searchdata);
        props.editTable.setStatus(this.tableId, 'browse');
        let rows = data.grid[this.tableId]
        this.props.editTable.setTableData(this.tableId, rows);
        if(rows.rows && rows.rows.length >0){
            for(let i =0;i<rows.rows.length;i++){
                if(rows.rows[i].values.fromtype.value == "2"){
                    this.props.editTable.setEditableRowByIndex(this.tableId,i,false)
                }
            }
        }     
        // 最后调用按钮显隐性控制
        listButtonVisible.call(this, props);
    });
}

/**
 * 查询ajax
 * @param {*} url      请求url
 * @param {*} sendData 传输数据
 */
export function queryAjax(url, sendData,showToast) {
    return new Promise(resolve => {
        ajax({
            url: url,
            data:  sendData,
            success: (res) => {
                let { success, data } = res;
                if (success && data && data.grid) {
                    resolve(res.data);
                    if(showToast){
                        if (data.grid[this.tableId].pageInfo.total === 0 || data.grid[this.tableId].pageInfo.total === '0'){
                            toast({ color: 'warning', content: `${this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000036')}` });/* 国际化处理： 未查询到数据*/
                        } else {
                            toast({ color: 'success', content: `${this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000017')}，${this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000018')}${data.grid[this.tableId].pageInfo.total}${this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000019')}` });/* 国际化处理： 查询成功,共,条*/
                        }
                    }                    
                } else {
                    this.props.editTable.setTableData(this.tableId, { rows: [] });
                }
            }
        });
    })
}

/*w/8iNiAH+zj8WJF4+Br6+mgDEjHDz7v5E8SGAvbf7IEZiLlSv1Wt87dKtx2uh5bj*/