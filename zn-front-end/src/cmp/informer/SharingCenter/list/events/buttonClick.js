/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { tableId, searchId, pagecode } from '../constants';
import { busiOperate } from './busiOperate';
import { refresh } from './refresh';
import { printClick } from './printClick';
const { getDefData } = cardCache;
import * as CONSTANTS from '../constants';
let { dataSource } = CONSTANTS;
export default function buttonClick(props, id) {
    let url;
    switch (id) {
        /**
         *  【list_head】【发布】
         */
        case 'publish':
            url = '/nccloud/cmp/informer/informerpublish.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000002'), "head");/* 国际化处理： 发布，成功！*/
            break;
        /**
         * 【list_head】【更多操作】不生成
         */
        case 'ungenerate':
            url = '/nccloud/cmp/informer/informerungenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000006'), "head");/* 国际化处理： 不生单，成功！*/
            break;
        /**
        * 【list_head】【更多操作】恢复生单
        */
        case 'regenerate':
            url = '/nccloud/cmp/informer/informerrecgenerate.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000007'), "head");/* 国际化处理： 恢复生单，成功！*/
            break;
        /**
         * 【list_head】【更多操作】取消发布
         */
        case 'cancelpublish':
            url = '/nccloud/cmp/informer/informerunpublish.do';
            busiOperate(this, props, url, this.props.MutiInit.getIntl("36070AISCC") && this.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000001'), "head");/* 国际化处理： 取消发布，成功！*/
            break;
        /**
         * 【list_head】打印
         */
        case 'printbtn':
            printClick(this, id);
            break; s
        /**
         * 【list_head】输出
         */
        case 'printout':
            printClick(this, id);
            break;
        case 'refresh':
            query(this, props);
            break;
    }
}
/**
 * 根据缓存中的查询条件，刷新
 * @param {*} that 
 * @param {*} props 
 * @param {*} searchVal 
 */
function query(that, props) {
    let searchData = getDefData(dataSource, that.listDataSource);
    if (!searchData) {
        searchData = props.search.getAllSearchData('search');
    }

    let pageInfo = props.table.getTablePageInfo('table');
    pageInfo.pageIndex = 0;
    let data = {
        querycondition: searchData,
        pageInfo: pageInfo,
        pageCode: '36070AI_L05',
        queryAreaCode: 'search',  //查询区编码
        oid: '0001Z61000000000P971',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    ajax({
        url: '/nccloud/cmp/informer/informerquery.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    that.props.table.setAllTableData(that.tableId, data[that.tableId]);
                } else { 
                    that.props.table.setAllTableData(that.tableId, { rows: [] });                   
                }
                toast({ color: 'success', content: that.props.MutiInit.getIntl("36070AISCC") && that.props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000017') });
            }
        }
    });

}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/