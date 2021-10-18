/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, cardCache, toast ,viewModel} from 'nc-lightapp-front';
let { setDefData } = cardCache;
import * as CONSTANTS from '../constants';
let { dataSource,CACHE_KEY } = CONSTANTS;
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if (searchVal) {
        setDefData(dataSource, this.listDataSource, searchVal);
        let pageInfo = props.table.getTablePageInfo('table');
        let queryInfo = props.search.getQueryInfo('search');
        let pk_org = props.search.getSearchValByField(CONSTANTS.searchId,'pk_org');
        if(!pk_org || !pk_org.value || pk_org.value.firstvalue ==""){
            toast({ content: this.props.MutiInit.getIntl("36070AISC") && this.props.MutiInit.getIntl("36070AISC").get('36070AISC-000068'), color: 'warning' });/* 国际化处理： 请选择组织！*/
            return;
        } 
        setGlobalStorage('sessionStorage', CACHE_KEY.PK_ORG, pk_org.value.firstvalue);
        let oid = queryInfo.oid;
        let data = {
            querycondition: searchVal,
            pageInfo: pageInfo,
            pageCode: '36070AI_L01',
            queryAreaCode: 'search',  //查询区编码
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };
        ajax({
            url: '/nccloud/cmp/informer/informerquery.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                let pks = [];
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                        giveToast.call(this,props, data[this.tableId].allpks.length);
                    } else {
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                        giveToast.call(this,props,0);
                    }
                }
            }
        });
    }

};

const giveToast = function (props, resLength) {
    if (resLength && resLength > 0) {
        
        toast({
            duration: 6,
            color: 'success',
            title: (props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AIPSSC--000009')) + resLength + (props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AIPSSC--000010'))    /* 国际化处理： 查询成功！*/
        })
    }
    else {
        toast({
            duration: 6,
            color: 'warning',
            title: (props.MutiInit.getIntl("36070AISC") && props.MutiInit.getIntl("36070AISC").get('36070AIPSSC--000011')) /* 国际化处理： 未查询出符合条件的数据！*/
        })

       
    }
}

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/