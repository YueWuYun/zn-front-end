/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
let { setDefData } = cardCache;
import * as CONSTANTS from '../constants';
let { dataSource } = CONSTANTS;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if (searchVal) {
        setDefData(dataSource, this.listDataSource, searchVal);
        let queryInfo = props.search.getQueryInfo('search');
        let pageInfo = props.table.getTablePageInfo('table');
        let oid = queryInfo.oid;
        let pk_org = props.search.getSearchValByField(CONSTANTS.searchId,'pk_org');
        if(!pk_org || !pk_org.value || pk_org.value.firstvalue ==""){
            toast({ content: props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AIPSSC--000024')/* 国际化处理： 请选择组织！*/});
            return;
        }
        let data = {
            querycondition: searchVal,
            pageInfo: pageInfo,
            pageCode: '36070AI_L05',
            queryAreaCode: 'search',  //查询区编码
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };
        ajax({
            url: '/nccloud/cmp/informer/informerquery.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                        giveToast.call(this,props, data[this.tableId].allpks.length);
                    } else {
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                        giveToast.call(this,props, 0);
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
            title: (props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AIPSSC--000009')) + resLength + (props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AIPSSC--000010'))    /* 国际化处理： 查询成功！*/
        })
    }
    else {
        toast({
            duration: 6,
            color: 'warning',
            title: (props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AIPSSC--000011')) /* 国际化处理： 未查询出符合条件的数据！*/
        })

       
    }
}


/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/