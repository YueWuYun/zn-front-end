/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/
import { ajax, toast } from 'nc-lightapp-front';
import { base_url, pageCodeList, searchId, tableId,BankRegularAccountQueryConst} from '../../cons/constant.js';
import { setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

//点击查询，获取查询区数据
export default function searchBtnClick(props, condition, type, a, isSearchButton = true, isRefresh = false) {
    let oid = oid;
    if (props.meta.getMeta()[searchId].oid) {
        oid = props.meta.getMeta()[searchId].oid;//动态获取oid
    }
    //点击查询按钮，将查询条件放入缓存
    if (condition) {
        setDefData(BankRegularAccountQueryConst.dataSource, BankRegularAccountQueryConst.queryCondition, condition);
    }
    //点击刷新按钮，从缓存中获取查询条件
    else {
        condition = getDefData(BankRegularAccountQueryConst.dataSource, BankRegularAccountQueryConst.queryCondition);
    }
    if (!condition || !condition.conditions || condition.conditions.length == 0) {
        return;
    }

     //构建查询条件        
     let pageInfo = props.table.getTablePageInfo(tableId);
     pageInfo.pageIndex= 0;
     let data = {
         querycondition: condition,
         pageInfo: pageInfo,
         pageCode: pageCodeList,
         queryAreaCode: searchId,  //查询区编码
         oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
         querytype: 'tree'
     };
     ajax({
        url: base_url+'pagequeryaction.do',
        data: data,
        success: (res) => {
            listRender.call(this, res, isRefresh);
        },
        error: (res) => {
            listRender.call(this, {success: false});
            toast({color: 'warning', content: res.message});
        }
    });
    
};
/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 * @param {*} isRefresh        是否刷新
 */
function listRender (res, isRefresh) {
    let { success, data } = res;
    if (success && data && data[tableId]) {
        this.props.table.setAllTableData(tableId, data[tableId]);
        let flag= data[tableId].allpks.length;
        if (isRefresh) {
            if (flag) {
                toast({color: 'success', content: loadMultiLang(this.props, '36141FDIBS-000005'),/* 国际化处理： 刷新成功！*/});
            } else {
                toast({color: 'warning', content: loadMultiLang(this.props, '36141FDIBS-000003'),/* 国际化处理： 未查询出符合条件的数据!*/});
            }
        }else{
            if (flag) {
                toast({color: 'success', content: loadMultiLang(this.props, '36141FDIBS-000002'),/* 国际化处理： 查询成功！*/});
            } else {
                toast({color: 'warning', content: loadMultiLang(this.props, '36141FDIBS-000003'),/* 国际化处理： 未查询出符合条件的数据!*/});
            }
        }
    } else {
        this.props.table.setAllTableData(tableId, { rows: [] });
    }
}
/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/