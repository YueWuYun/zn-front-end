/*YuO8szH0cVixePu/Bt+mGy/a9mCJvO6wjPMZzNenbQKYYnyHEsxKrIFJORaMvOg6*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { list_page_id, list_table_id, list_search_id, searchDataSourceName } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
let { setDefData } = cardCache;

//点击查询，获取查询区数据
export default function clickSearchBtn(props,searchVal) {

    if (searchVal) {
        let pageInfo = props.table.getTablePageInfo(list_table_id);
        setDefData( list_search_id, searchDataSourceName, searchVal);
        let queryInfo = props.search.getQueryInfo(list_search_id);
        let oid = queryInfo.oid;
        let data = {
            querycondition: searchVal,
            custcondition: {
                logic: "and",   //逻辑操作符，and、or
                conditions: [],
            },
            pageInfo: pageInfo,
            pagecode: list_page_id,
            queryAreaCode: list_search_id,  //查询区编码
            
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };

        ajax({
            url: requesturl.query,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(data){
                        giveToast(props, data[list_table_id].allpks.length);
                        this.props.table.setAllTableData(list_table_id, data[list_table_id]);
                        this.setState({ activeKey: 5 });
                    }else{
                        this.props.table.setAllTableData(list_table_id, {rows:[]});
                        this.setState({ numvalues: {} });
                        giveToast(props, );
                    }
                }
                else {
                    giveToast(props, );
                }
            }
        });
    }
    
}

function giveToast(props, resLength) {
    if (resLength && resLength > 0) {
        let contentHead = props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000040'); /* 国际化处理： 查询成功，共 */
        let contentEnd = props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000041'); /* 国际化处理： 条。*/
        toast({
            duration: 6,
            color: 'success',
            content: contentHead + resLength + contentEnd
        })
    }
    else {
        toast({
            duration: 6,
            color: 'warning',
            content: props.MutiInit.getIntl("36010SA") && props.MutiInit.getIntl("36010SA").get('36010SA-000042') /* 国际化处理： 未查询出符合条件的数据*/
        })
    }
}
/*YuO8szH0cVixePu/Bt+mGy/a9mCJvO6wjPMZzNenbQKYYnyHEsxKrIFJORaMvOg6*/