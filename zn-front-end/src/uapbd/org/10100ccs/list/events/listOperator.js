//pBNvnmjcK57WwsW5DK7ToejGIQDglrGK7YffjtnBpI0uE9QfeQwH0wP0Ssq60B/A
import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { REQUESTURL, SEARCHCACHE, CARD, LIST, PRIMARTKEY, LIST_BUTTON } from '../../constant';

//列表新增
export function listCreate(props) {
    props.pushTo(REQUESTURL.toCard, {
        status: 'add',
        pagecode: CARD.page_code
    });
}

//列表刷新
export function listRefresh(props) {
    let { getDefData } = cardCache;
    let queryInfo = getDefData(SEARCHCACHE.key, SEARCHCACHE.dataSource);
    listSearch(props, queryInfo);
}

//列表修改
export function listEdit(props, record) {
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

//列表删除
export function listDelete(props, pk, index) {
    ajax({
        url: REQUESTURL.delete,
        data: { pks: [pk] },
        success: (res) => {
            if (res.success) { //成功
                props.table.deleteCacheId(LIST.table_id, pk);
                props.table.deleteTableRowsByIndex(LIST.table_id, index);
                toast({ color: 'success', content: props.json['10100CCS-000005'] });/* 国际化处理： 删除成功*/
            } else { //失败
                toast({ color: 'warning', content: props.json['10100CCS-000009'] });/* 国际化处理： 删除失败*/
            }
        }
    });
}

//列表查询
export function listSearch(props, queryInfo) {
    let pageInfo = props.editTable.getTablePageInfo(LIST.table_id);
    // let pageInfo={
    //     pageIndex:0,
    //     pageSize:'10'
    // };
    if (!queryInfo) {
        queryInfo = props.search.getQueryInfo(LIST.search_id);
    }
    queryInfo.pageInfo = pageInfo;
    queryInfo.pageCode = LIST.page_code;

    // 刷新按钮可用
    props.button.setDisabled({ [LIST_BUTTON.refresh]: false });

    ajax({
        url: REQUESTURL.queryList,
        data: queryInfo,
        success: (res) => {
            let { success, data } = res;
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

//分页查询
export function pageInfoClick(props, config, pks) {
    let data = {
        pks,
        pagecode: LIST.page_code
    };

    ajax({
        url: REQUESTURL.queryListByPks,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success && data && data[LIST.table_id]) {
                props.editTable.setTableData(LIST.table_id, data[LIST.table_id]);
                toast({ color: 'success' });
            } else {
                props.editTable.setTableData(LIST.table_id, { rows: [] });
                toast({ color: 'warning', content: props.json['10100CCS-000010'] });/* 国际化处理： 未查询出符合条件的数据！*/
            }
        }
    });
}

//列表行双击
export function handleDoubleClick(record, index, props) {
    // props.pushTo(REQUESTURL.toCard, {
    //     status: 'browse',
    //     id: record[PRIMARTKEY.head_id].value,
    //     pagecode: CARD.page_code,
    //     scene: props.getUrlParam('scene')
    // });

    props.pushTo(REQUESTURL.toCard, {
        status: 'browse',
        id: record[PRIMARTKEY.head_id].value,
        pagecode: CARD.page_code,
        scene: props.getUrlParam('scene')
    });
};
//pBNvnmjcK57WwsW5DK7ToejGIQDglrGK7YffjtnBpI0uE9QfeQwH0wP0Ssq60B/A