/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { base, toast } from 'nc-lightapp-front';
import { tableId, pagecode } from '../constants';
let { NCMessage } = base;
/**
 * 刷新
 * @param {*} props 
 * @param {*} res 后台返回结果
 * @param {*} indexMap Map:key为pk，balue为index
 * @param {*} content 提示语
 * @param {*} source 操作来源
 */
export function refresh(props, res, indexMap, opername, source, index) {
    //表头操作
    let content;
    if (source == 'head') {
        if (res.data != null) {
            let total = res.data.total;
            let successNum = res.data.successNum;
            let failNum = res.data.failNum;
            content = '共' + opername + total + '条，';
            content = content + '成功' + successNum + '条 ,';
            content = content + '失败' + failNum + '条';
            if (res.data.result && res.data.result.table) {
                res.data.result.table.rows.forEach((val) => {
                    let updateDataArr = [{
                        index: indexMap.get(val.values.pk_informer.value),
                        data: { values: val.values }
                    }];
                    props.table.updateDataByIndexs(tableId, updateDataArr);
                });
            }
            if (res.data.errormessage) {
                if (total == failNum) {
                    toast({
                        duration: 'infinity',
                        color: 'danger',
                        title: opername + ' 全部失败!',
                        content: content,
                        groupOperation: true,
                        TextArr: ['展开', '收起', '关闭'],
                        groupOperationMsg: res.data.errormessage.split("\n")
                    });
                } else { 
                    toast({
                        duration: 'infinity',
                        color: 'warning',
                        title: opername + ' 部分失败!',
                        content: content,
                        groupOperation: true,
                        TextArr: ['展开', '收起', '关闭'],
                        groupOperationMsg: res.data.errormessage.split("\n")
                    });
                }
            } else {
                toast({
                    duration: 5,
                    color: 'success',
                    title: opername + ' 全部成功!',
                    content: content,
                    groupOperation: total == 1 ? false : true
                });
            }
        }
    }
    //表内操作
    if (source == 'inner') {
        if (res.data != null && typeof res.data.errormessage == 'string') {
            // NCMessage.create({ content: res.data.errormessage, color: 'warning' });
            toast({ content: res.data.errormessage,color: 'warning' });
        } else {
            let updateDataArr = [{
                index: index,
                data: { values: res.data.result.table.rows[0].values }
            }];
            props.table.updateDataByIndexs(tableId, updateDataArr);
            toast({ content: opername + " 成功！", color: 'success' });
        }
    }
}

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/