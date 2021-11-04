//lBnI2Li8nbTff27m5rkdxtAy+GbYkwMtwRUz4HTB6VZATPE7XTetOQPnzxwe/29E
//成本要素列表操作

import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { REQUESTURL, SEARCHCACHE, CARD, LIST, PRIMARTKEY, LIST_BUTTON } from '../../constant';



//列表停用启用数据
export function getCFSOffChangeData(props,value) {
    // let showOff = this.state.isShowOff;
    // //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
    // ajax({
    //     url: urls['query'],
    //     data: {
    //         "pagecode": pagecode,
    //         "showOff": showOff
    //     },
    //     success: (res) => {
    //         this.handleData(res, query_from);
    //     }
    // });
}

//成本要素结构列表查询
export function listCFSSearch(props, queryInfo) {
    let showOff = this.state.isShowOff;
    //如果showOff为true，则显示停用数据，在请求参数data中增加显示停用参数，根据业务前后端自行处理
    ajax({
        url: this.URLINFO.queryList,
        data: {
            "pagecode": this.listPagecode,
            "showOff": showOff
        },
        success: (res) => {
            let {success,data} = res ;
            console.log("search",data);
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(res.formulamsg);
            }
            if (success && data && data[LIST.table_id]) {
                props.editTable.setTableData(LIST.table_id, data[LIST.table_id]);
                toast({ color: 'success' });
            } else {
                props.editTable.setTableData(LIST.table_id, { rows: [] });
                toast({ color: 'warning', content: props.json['10100CCS-000010'] });/* 国际化处理： 未查询出符合条件的数据！*/
            }

            // 将查询条件缓存
            let { setDefData } = cardCache;
            setDefData(SEARCHCACHE.key, SEARCHCACHE.dataSource, queryInfo);
        }
    });
}


//列表进入卡片
export function listCFSEdit(props, record) {
    let pk = record.values[PRIMARTKEY.head_id] && record.values[PRIMARTKEY.head_id].value;
    let vno= record.values["vno"] && record.values["vno"].value;
    let vname= record.values["vname"] && record.values["vname"].value;
    let vstartdate= record.values["vstartdate"] && record.values["vstartdate"].value;
    let venddate= record.values["venddate"] && record.values["venddate"].value;


    props.pushTo(REQUESTURL.toCard, {
        status: 'browse',
        id: pk,
        version : {
            "pk_ccstructure": pk,
            "vno": record.values["vno"].value,
            "vname": record.values["vname"].value,/* 国际化处理： 成本中心*/
            "vstartdate":record.values["vstartdate"].value,
            "venddate":record.values["venddate"].value
        },
        pagecode: CARD.page_code
    });
    // props.linkTo("/uapbd/org/costcentergrp/main/index.html", {
    //     status: 'edit',
    //     id: pk,
    //     pagecode: CARD.page_code
    // });


}






//lBnI2Li8nbTff27m5rkdxtAy+GbYkwMtwRUz4HTB6VZATPE7XTetOQPnzxwe/29E