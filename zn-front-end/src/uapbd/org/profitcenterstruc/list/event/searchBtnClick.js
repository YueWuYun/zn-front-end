//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g
import { ajax, toast, cacheTools } from 'nc-lightapp-front';

let tableId = 'resapfcs';
let searchId = 'resapfcsearch';
let queryListUrl = '/nccloud/uapbd/profitcenterstruc/ListQuery.do';

export default function searchBtnClick(props,searchVal) {

    console.log(searchVal);

    searchVal.conditions.map((cond) => {
        if (cond.field == 'pk_org') {

            //集团节点初始化时会在查询区默认为当前集团，但是没初始化好时，getBusinessInfo 获取不到，所以pk_org赋值为‘pkGroup’，此处再取一次
            if (props.nodeType == 'group' && cond.value.firstvalue == 'pkGroup') {
                let businessInfo = getBusinessInfo();
                let pkGroup = businessInfo == null ? null : businessInfo.groupId;
                cond.value.firstvalue = pkGroup;
            }

            cacheTools.set('pk_org', cond.value.firstvalue);
        }
    })
    cacheTools.set("hasSearched", 1);
    cacheTools.set("searchParams", searchVal);
    cacheTools.set('pageInfo', props.table.getTablePageInfo(tableId));
    let metaData = props.meta.getMeta();

    //获取查询模板信息
    let queryInfo = this.props.search.getQueryInfo(searchId);
    let OID = queryInfo.oid;

    let data = {
        querycondition: searchVal,
        custcondition: {},
        pagecode: props.pagecode_list,
        nodeType: props.nodeType,
        queryAreaCode: searchId,
        pageInfo: props.table.getTablePageInfo(tableId),
        querytype: 'tree',
        oid: OID,//cacheTools.get('orgunit_searchoid')
    };


    ajax({
        url: queryListUrl,
        data,
        success: (res) => {
            console.log(res);
            if (res.data) {
                props.table.setAllTableData(this.tableId, res.data[tableId]);
                props.button.setButtonDisabled(['printGrp', 'output'], false);
                toast({ content: this.state.json['10140INCMG-000022'] + res.data[tableId].rows.length + this.state.json['10140INCMG-000023'], color: "success" });/* 国际化处理： 查询成功，共,条*/
            } else {
                props.table.setAllTableData(this.tableId, { rows: [] });
                props.button.setButtonDisabled(['printGrp', 'output'], true);
                toast({ content: this.state.json['10140INCMG-000024'], color: "warning" });/* 国际化处理： 未查询出符合条件的数据！*/
            }
        },
        error: (res) => {
            console.log(res.message);
        }
    });

}


//YuO8szH0cVixePu/Bt+mG3bVDYtJTGvKZcGK3iypDb9P1NCQ60SYpClfbGT0pz4g