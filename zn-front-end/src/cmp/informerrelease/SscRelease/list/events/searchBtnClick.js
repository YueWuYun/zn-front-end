/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import {ajax ,cardCache, cacheTools, toast,viewModel} from 'nc-lightapp-front';
import { DATA_SOURCE ,CACHE_KEY} from '../constants';
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
//点击查询，获取查询区数据
export default function clickSearchBtn(props,qryCondition) { 
    // let searchVal = this.props.search.getAllSearchData(this.searchId);
    let searchVal = qryCondition;
    let pageInfo = props.table.getTablePageInfo(this.tableId);
    //查询条件为空则表明是点击页签进行查询，故从缓存中获取查询条件，
    if (!qryCondition || !qryCondition.conditions || qryCondition.conditions.length == 0) {
        searchVal = JSON.parse(getGlobalStorage('sessionStorage', CACHE_KEY.SEARCH_DATA));  
    }else{  
        setGlobalStorage('sessionStorage', CACHE_KEY.SEARCH_DATA, JSON.stringify(searchVal));
        setGlobalStorage('sessionStorage', CACHE_KEY.HAS_QRY, 'true');
    }
    //动态获取oid
    if (this.props.meta.getMeta()[this.searchId].oid) {
        this.oid = props.meta.getMeta()[this.searchId].oid;
    }
    let data={
        querycondition: searchVal,
        custcondition: {
            logic: 'or', //逻辑操作符，and、or
            conditions:[]
        },
        pageInfo:pageInfo, 
        pagecode: '36070AIPSSC_L01',
        queryAreaCode:'search',  //查询区编码
        oid: this.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype:'tree'
    };
    ajax({
        url: '/nccloud/cmp/release/sscquery.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if(data){
                    giveToast.call(this,props, data[this.tableId].allpks.length);
                    this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                    
                }else{
                    giveToast.call(this,props, 0);
                    this.props.table.setAllTableData(this.tableId, { rows: [] });              
                    
                }
            }
        }
    });
    
    
};


const giveToast = function (props, resLength) {
    if (resLength && resLength > 0) {
        
        toast({
            duration: 6,
            color: 'success',
            title: (props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000009')) + resLength + (props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000010'))    /* 国际化处理： 查询成功！*/
        })
    }
    else {
        toast({
            duration: 6,
            color: 'warning',
            title: (props.MutiInit.getIntl("36070AIPSSC") && props.MutiInit.getIntl("36070AIPSSC").get('36070AIPSSC--000011')) /* 国际化处理： 未查询出符合条件的数据！*/
        })

       
    }
}
/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/