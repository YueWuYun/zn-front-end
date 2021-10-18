/*i2ttZGBLUD5i+3NoC85dIXohU3WVGCUinYUnpQWpa3s4/6PQu0+dETCJ0vkzVTTc*/
/**
 * [外币兑换index]-切换组织取消按钮
 * @param {*}  
 */
export const cancelConfirm = function () {
    //编辑中的取消操作
    if (this.props.getUrlParam('status') === 'edit') {
        let edit_pk = this.props.getUrlParam('id');
        let bill_no = this.props.form.getFormItemsValue(this.formId, 'busistatus').value;
        this.cancleNewPage(edit_pk, bill_no);
    }
    //新增中的取消操作
    if (this.props.getUrlParam('status') === 'add') {
        //判断是否列表新增
        if (this.props.getUrlParam('form_list')) {
            /**
             * 列表新增--取消
             */
            let url_id = this.props.getUrlParam('id');
            let url_billno = this.props.getUrlParam('bill_no');
            if (url_id && url_id.length > 0 && url_billno && url_billno.length > 0) {
                //1,查询后跳转浏览页面
                this.cancleNewPage(this.props.getUrlParam('id'), this.props.getUrlParam('bill_no'));
            } else {
                //2,未查询后跳转新增card空白页面
                this.cancleSkyPage();
            }
        } else {
            /**
             * 卡片新增--取消
             */
            if (this.props.getUrlParam('bill_no') && this.props.getUrlParam('id')) {
                this.cancleNewPage(this.props.getUrlParam('id'), this.props.getUrlParam('bill_no'));
            } else {
                this.loadCacheData();//加载缓存
            }

        }
    }
    //复制中的取消操作
    if (this.props.getUrlParam('status') === 'copy') {
        this.cancleNewPage(this.props.getUrlParam('id'), this.props.getUrlParam('bill_no'));
    }
}

/*i2ttZGBLUD5i+3NoC85dIXohU3WVGCUinYUnpQWpa3s4/6PQu0+dETCJ0vkzVTTc*/