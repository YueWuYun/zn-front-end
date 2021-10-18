/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { list_table_id, list_search_id, URL_INFO, search_source } from '../../cons/constant.js';
import { getLang, getListQueryData } from '../../util/index.js';
import buttonUsability from './buttonUsability';
let { setDefData } = cardCache;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal, type, queryInfo, isRefresh) {

    if (searchVal) {
        let data = getListQueryData(props, searchVal);
        setDefData(list_search_id, search_source, searchVal);
        ajax({
            url: URL_INFO.LIST.QUERY,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(list_table_id, data[list_table_id]);
                        giveToast(props, data[list_table_id].allpks.length, isRefresh);
                    } else {
                        this.props.table.setAllTableData(list_table_id, { rows: [] });
                        giveToast(props, null, isRefresh);
                    }
                }
                else {
                    giveToast(props, null, isRefresh);
                }
                buttonUsability.call(this, props);//列表按钮显影性
            }
        });
    }
}

function giveToast(props, resLength, isRefresh) {
    if (resLength && resLength > 0) {
        let contentText;
        if(isRefresh == true) {
            contentText = getLang(props, '000010'); /* 国际化处理： 刷新成功*/
        }
        else {
            let contentHead = getLang(props, '000011'); /* 国际化处理： 查询成功，共 */
            let contentEnd = getLang(props, '000012'); /* 国际化处理： 条。*/
            contentText = contentHead + resLength + contentEnd;
        }
        toast({
            duration: 6,
            color: 'success',
            content: contentText
        })
    }
    else {
        toast({
            duration: 6,
            color: 'warning',
            content:  getLang(props, '000013')/* 国际化处理： 未查询出符合条件的数据*/
        })
    }
}
/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/