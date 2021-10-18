/*6ZMWV8nV2/uEgzT4NRQpctQrYm1HKWMASO2efFzcZQY4Hy3aSB9uKsWJt3aI1t09*/
import { ajax, cardCache } from 'nc-lightapp-front';
let { updateCache } = cardCache;
import { Rateinfo } from "../../util/commonUtil";
/**
 * [外币兑换index]-加载卡片查询数据
 * @param {*}  
 */
export const loadQueryDatas = function () {
    //查询单据详情[新增卡片]
    if (this.props.getUrlParam('status') === 'add') {
        //清空表单form所有数据
        this.props.form.EmptyAllFormValue(this.formId);
        this.billno = '';
        let adddata = {
            pk: this.tableId,
            pageid: this.pageId,
            pk_org: this.state.curr_pk_org//默认组织
        };
        ajax({
            url: '/nccloud/cmp/curexchange/curexchangeaddevent.do',
            data: adddata,
            success: (res) => {
                //获取后台返回data				
                if (res.data) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                    if (this.state.curr_pk_org) {
                        //设置组织可以编辑
                        this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': false });
                        this.props.form.setFormItemsVisible(this.formId, { 'pk_org_v': false });
                        this.props.resMetaAfterPkorgEdit();
                        //财务组织赋值
                        this.props.form.setFormItemsValue(this.formId,
                            {
                                'pk_org': {
                                    value: this.state.curr_pk_org,
                                    display: this.state.curr_orgname
                                },
                                'pk_org_v': {
                                    value: this.state.curr_pk_org_v,
                                    display: this.state.curr_orgname_v
                                }
                            }
                        );
                        //汇率编辑性控制
                        Rateinfo.call(this, res.data.userjson, 'pk_chargecurrtype');
                    } else {
                        //没有预设组织
                        this.props.resMetaAfterPkorgEdit();
                        this.props.initMetaByPkorg();
                    }

                } else {
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.formId);
                }
                this.toggleShow();//切换页面状态,查询要根据状态动态改变按钮显隐性的pk
            }
        });
    }
    //查询单据详情[编辑卡片]
    if (this.props.getUrlParam('status') === 'edit') {
        //后台grid只接受pageid。
        let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId, param: 'edit' };
        ajax({
            url: '/nccloud/cmp/curexchange/curexchangecardquery.do',
            data: data,
            success: (res) => {
                //data要看返回的id，而不是后台设置的id
                if (res.data) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                    if (res.data[this.formId].rows) {
                        //页签赋值
                        let billno = res.data[this.formId].rows[0].values.vbillno.value;
                        this.billno = billno;
                        //业务类型
                        let busitype = res.data[this.formId].rows[0].values.busitype.value;
                        this.setOtherEditAble(busitype);//根据业务类型控制其他字段[编辑]
                    }
                    //按钮显示控制[单据状态]
                    this.props.setUrlParam({
                        pk: res.data[this.formId].rows[0].values.busistatus.value
                    });
                    //汇率编辑性控制
                    Rateinfo.call(this, res.data.userjson, null);
                } else {
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.formId);
                }
                //设置组织不可以编辑
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                this.toggleShow();//切换页面状态,查询要根据状态动态改变按钮显隐性的pk
            }
        });
    }
    //复制单据详情[复制卡片]
    if (this.props.getUrlParam('status') === 'copy') {
        // /清空表单form所有数据
        this.props.form.EmptyAllFormValue(this.formId);
        this.billno = '';
        //后台grid只接受pageid。
        let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
        ajax({
            url: '/nccloud/cmp/curexchange/curexchangecopy.do',
            data: data,
            success: (res) => {
                //获取后台返回data				
                if (res.data) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });

                    if (res.data[this.formId].rows && res.data[this.formId].rows.length > 0) {
                        //业务类型
                        let busitype = res.data[this.formId].rows[0].values.busitype.value;
                        this.setOtherEditAble(busitype);//根据业务类型控制其他字段[编辑]
                    }
                    //按钮显示控制[单据状态]
                    this.props.setUrlParam({
                        pk: res.data[this.formId].rows[0].values.busistatus.value
                    });
                    //汇率编辑性控制
                    Rateinfo.call(this, res.data.userjson, null);
                } else {
                    //清空表单
                    this.props.form.EmptyAllFormValue(this.formId);
                }
                //设置组织不可以编辑
                this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
                this.toggleShow();//切换页面状态,查询要根据状态动态改变按钮显隐性的pk

            }
        });
    }
    //查询单据详情[浏览卡片]
    if (this.props.getUrlParam('status') === 'browse') {
        if (this.props.getUrlParam('id') &&
            this.props.getUrlParam('id').length > 0) {
            //后台grid只接受pageid。
            let data = { pk: this.props.getUrlParam('id'), pageid: this.pageId };
            ajax({
                url: '/nccloud/cmp/curexchange/curexchangecardquery.do',
                data: data,
                success: (res) => {
                    //data要看返回的id，而不是后台设置的id
                    if (res.data) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                        if (res.data[this.formId].rows) {
                            //页签赋值
                            let billno = res.data[this.formId].rows[0].values.vbillno.value;
                            this.billno = billno;
                            //按钮显示控制[单据状态]
                            this.props.setUrlParam({
                                pk: res.data[this.formId].rows[0].values.busistatus.value
                            });
                        }
                        //更新缓存
                        updateCache(
                            this.pkname,
                            res.data[this.formId].rows[0].values.pk_cruexchange.value,
                            res.data,
                            this.formId, this.dataSource,
                            res.data[this.formId].rows[0].values
                        );
                    } else {
                        this.billno = '';
                        //清空表单
                        this.props.form.EmptyAllFormValue(this.formId);
                    }
                    this.toggleShow();//切换页面状态,查询要根据状态动态改变按钮显隐性的pk
                }
            });
        }
    }

}

/*6ZMWV8nV2/uEgzT4NRQpctQrYm1HKWMASO2efFzcZQY4Hy3aSB9uKsWJt3aI1t09*/