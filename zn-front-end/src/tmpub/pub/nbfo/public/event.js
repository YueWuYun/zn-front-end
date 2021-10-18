/*APyLvWw+WGDyvpmjBZbv9vwYTt+dWt6B8IRSZEB/K14PbGqhTm04NiKKKObzzTsP*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { baseReqUrl, javaUrl } from '../cons/constant';
import { getCardData, getQueryData } from '../card/events/page';
import { buttonVisible, clearAll, setEditStatus } from '../card/events';

/**
 * 非银行金融机构公共事件
 * @author dongyue7
 */


/**
 * 卡片按钮操作
 * @param {*} path       接口地址
 * @param {*} content    toast弹框显示内容
 */
export function cardBtnOperation(path, content) {
    let { getNextId, deleteCacheById } = cardCache;
    let pk = this.props.form.getFormItemsValue(this.formId, this.primaryId).value;
    ajax({
        url: `${baseReqUrl}${path}.do`,
        data: {pks: [pk], pageCode: this.pageId},
        success: (res) => {
            if (res.success) {
                if (path === javaUrl.delete) {
                    if (res.data.failNum === '0') {
                        toast({ color: 'success', content });
                       // 获取下一条数据的id
                        let nextId = getNextId(pk, this.cache);
                        //删除缓存
                        deleteCacheById(this.primaryId, pk, this.cache);
                        if (nextId) {
                            getCardData.call(this, nextId);
                            this.props.setUrlParam({'id': nextId});
                        } else {// 删除的是最后一个的操作
                            this.props.setUrlParam({id: ''});
                            setEditStatus.call(this, 'browse');
                            clearAll.call(this, this.props);
                            billHeadVisible.call(this, true);
                            buttonVisible.call(this, this.props);
                        } 
                    } else {
                        toast({ color: 'danger', content: res.data.errormessages[0] });
                    }
                } else {
                    toast({ color: 'success', content });
                    this.props.form.setAllFormValue({'head': res.data.head[this.formId]});
                    buttonVisible.call(this, this.props);
                }
            }
        }
    });  
}

/**
 * 单据标题设置
 * @param {*} backBtnFlag       是否显示返回按钮，默认否
 * @param {*} billCodeFlag      是否显示单据号，默认否
 * @param {*} billCode          要显示的单据号，默认为空
 */
export function billHeadVisible(backBtnFlag = false, billCodeFlag = false, billCode = '') {
    //设置状态
    this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: backBtnFlag,    //控制显示返回按钮: true为显示,false为隐藏 ---非必传
        showBillCode: billCodeFlag,  //控制显示单据号：true为显示,false为隐藏 ---非必传
        billCode: billCode           //修改单据号---非必传
    });
}

/**
 * 返回按钮事件
 * @param {*} path       返回路径
 * @param {*} sendParam  传参
 */
export function handleClick(path, sendParam) {
    this.props.pushTo(`/${path}`,sendParam);
}

/**
 * 取消
 * @param {*} props  页面内置对象
 */
export function cancel(props) {
    let id= props.getUrlParam('id');
    props.setUrlParam({status: 'browse'});
    if (id) {
        let billName = props.getUrlParam('name');
        props.form.cancel(this.formId);
        setEditStatus.call(this, 'browse');
        let serData = getQueryData.call(this, id);
        ajax({
            url: `${baseReqUrl}${javaUrl.accListQuery}.do`,
            data: serData,
            success: (res) => {
                let { success, data }= res;
                if (success) {
                    this.props.cardTable.setTableData(this.tableId, {rows: data.grid.table.rows});
                }
            }
        }); 
        buttonVisible.call(this, this.props);
        billHeadVisible.call(this, true, true, billName);
    } else {
        setEditStatus.call(this, 'browse');
        props.form.EmptyAllFormValue(this.formId);
        buttonVisible.call(this, this.props);
        billHeadVisible.call(this, true, false);
    }
}
/*APyLvWw+WGDyvpmjBZbv9vwYTt+dWt6B8IRSZEB/K14PbGqhTm04NiKKKObzzTsP*/