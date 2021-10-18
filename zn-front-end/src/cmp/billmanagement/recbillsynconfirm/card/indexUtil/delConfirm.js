/*PmETh3G9Mp9znykR2R1O5/F7/9uPxtKkE+/L+L/kEAzJoZQDmBqbZ72sqPBIGROM*/
import { ajax, toast,cardCache } from 'nc-lightapp-front';
import { pageInfoClick } from '../events';
//缓存
let { getNextId} = cardCache;
/**
 * [收款协同]-删除
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const delConfirm = function () {
    let data = {
        'pk': this.props.getUrlParam('id'),
        'ts': this.props.form.getFormItemsValue(this.formId, 'ts').value
    };
    //删除后直接进入下一行
    let delpk = this.props.getUrlParam('id');
    if (delpk) {
        this.deleteId = delpk//删除单据pk
    }
    /**
     * id：数据主键的值
     * dataSource: 缓存数据命名空间
     */
    let nextId = getNextId(delpk, this.dataSource);
    ajax({
        url: '/nccloud/cmp/recbill/carddelete.do',
        data: data,
        success: (res) => {
            if (res.success) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000031') });/* 国际化处理： 删除成功*/
                this.deleteCacheData();//删除缓存
                if (nextId != null) {
                    pageInfoClick.call(this, this.props, nextId);
                } else {
                    this.cancleSkyPage();//跳转空白页面
                }
            }
        }
    });
}

/*PmETh3G9Mp9znykR2R1O5/F7/9uPxtKkE+/L+L/kEAzJoZQDmBqbZ72sqPBIGROM*/