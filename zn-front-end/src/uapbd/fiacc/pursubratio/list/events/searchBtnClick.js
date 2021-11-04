//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g
import {ajax ,toast,cardCache} from 'nc-lightapp-front';
import { tableId, searchId,dataSource} from '../constants';

let {setDefData, getDefData } = cardCache;

export default function clickSearchBtn(props,searchVal) {
    if(searchVal){
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let queryInfo = props.search.getQueryInfo(this.searchId);
        queryInfo.pageInfo = pageInfo;
        queryInfo.pageCode = this.pageId ;
        let data = {
            queryInfo:queryInfo
        };
        setDefData(searchId, dataSource, data);//将查询条件放入缓存,后续刷新会用到，主键为查询区的Id
        ajax({
            url: '/nccloud/uapbd/pursubratio/querylist.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(data){
                        toast({ color: 'success', content:this.state.json['10140CCSD-000003'].replace("{n}",data[this.tableId].allpks.length) });/* 国际化处理： 查询成功，共,条*/
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                    }else{
                        toast({ color: 'warning', content: this.state.json['10140CCSD-000004'] });/* 国际化处理： 未查询出符合条件的数据*/
                        this.props.table.setAllTableData(this.tableId, {rows:[]});
                    }
                    //将查询成功的数据放入缓存
                    setDefData(this.tableId, dataSource, data);
                    //控制界面按钮
                    this.onSelected()
                }
            }
        });
    }
    
};

//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g