//h1HZmrc3BckA4rPREA1d1tty7p6Zbra3f3ItUfIuNYeE12EnpXKgwNlE6IDTx+Y9
import {searchId,tableId,dataSource,pagecode} from '../constants';
import { ajax,toast,cardCache} from 'nc-lightapp-front';
/**
 * 查询区按钮点击事件
 */
let {setDefData } = cardCache;

 export default function  onClickSearchBtn(props,searchVal) {
    let _this = this;
    let pageInfo = _this.props.table.getTablePageInfo(tableId);
    let queryInfo = props.search.getQueryInfo(searchId);
    if(!queryInfo)
    {
        return;
    }
    queryInfo.pageInfo = pageInfo;
    queryInfo.pageCode = _this.props.getSearchParam('p');
    queryInfo.pageCode = '10140CCSC_list';
    setDefData(searchId, dataSource, queryInfo);//放入缓存
    let data = {
        queryInfo: queryInfo
    };
    ajax({
        url: '/nccloud/uapbd/costcompstruc/querylist.do',
        data:data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                //$$$
                // if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                //     props.dealFormulamsg(
                //         res.formulamsg,  //参数一：返回的公式对象
                //         {                //参数二：界面使用的表格类型
                //             "table1":tableTypeObj
                //         }
                //     );
                // }
                if(data){
                    _this.props.table.setAllTableData(tableId,data[tableId]);
                    toast({ content: _this.state.json['10140CCSC-000002'].replace("{n}",data[tableId].rows.length), color: 'success' });
                }else{

                    let nulldata = {
                            rows:[]
                        }
                    _this.props.table.setAllTableData(tableId,nulldata);
                    toast({ content: _this.state.json['10140CCSC-000001'], color: 'warning' });
                }
                //设置缓存
                setDefData(tableId, dataSource, data);
            }
            
        }
    })
 }


//h1HZmrc3BckA4rPREA1d1tty7p6Zbra3f3ItUfIuNYeE12EnpXKgwNlE6IDTx+Y9