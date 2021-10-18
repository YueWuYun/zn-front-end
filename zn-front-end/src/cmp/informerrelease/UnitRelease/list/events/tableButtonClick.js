/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { tableId, searchId, pagecode, formId_org, formId_01, formId_02, formId_03, oid, table_orgs } from '../constants';
let { NCMessage } = base;
export default function tableButtonClick(props, key, text, record, index) {
    let pks = [];
    let pk = record.pk_informer.value;
    pks.push(pk);
    switch (key) {
        //明细
        case 'Ldetail':
            props.pushTo("/card", {
                status: 'browse',
                from: 'list',
                id: record.pk_informer.value,
                pk_org: record.pk_org.value
            });
            break;
    }
}
/**
 * 刷新
 * @param {*} props 
 */
function refresh(props) {

    let refreshpageInfo = props.table.getTablePageInfo(tableId);
    let refreshsearchVal = props.search.getAllSearchData(searchId);
	
	//动态获取oid
    if (this.props.meta.getMeta()[this.searchId].oid) {
        this.oid = this.props.meta.getMeta()[this.searchId].oid;
    }

    let data = {
        conditions: refreshsearchVal.conditions,
        pageInfo: refreshpageInfo,
        pagecode: pagecode,
        queryAreaCode: searchId, //查询区编码
        oid: this.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        queryType: 'simple'
    };
    ajax({
        url: '/nccloud/cmp/release/query.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    props.table.setAllTableData(tableId, data[tableId]);
                } else {
                    props.table.setAllTableData(tableId, { rows: [] });
                }
            }
        }
    });
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/