/*PmETh3G9Mp9znykR2R1O5/F7/9uPxtKkE+/L+L/kEAzJoZQDmBqbZ72sqPBIGROM*/
import {  ajax, toast, cardCache } from 'nc-lightapp-front';
import {  pageInfoClick } from '../events';
//缓存
let {  getNextId,
     } = cardCache;

/**
 * [外币兑换index]-取消确认按钮
 * @param {*}  
 */
export const delConfirm = function () {
    let deletedata = {
        'pk': this.props.getUrlParam('id'),
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
    };
    //删除后直接进入下一行
    let delpk = this.props.getUrlParam('id');
    if (delpk) {
        this.setState({
            deleteId: delpk
        });//删除单据pk
    }
    let nextId = getNextId(delpk, this.dataSource);
    ajax({
        url: '/nccloud/cmp/curexchange/carddelete.do',
        data: deletedata,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                toast(
                    {
                        color: 'success',
                        content: this.props.MutiInit.getIntl("36070FCE") &&
                            this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000028')
                    });/* 国际化处理： 删除成功!*/
                this.deleteCacheData();//删除缓存
                if (nextId != null) {
                    pageInfoClick.call(this, this.props, nextId);
                } else {
                    //没有下一条或者上一条直接留在空白页面
                    this.cancleSkyPage();
                }
            }
        }
    });
}

/*PmETh3G9Mp9znykR2R1O5/F7/9uPxtKkE+/L+L/kEAzJoZQDmBqbZ72sqPBIGROM*/