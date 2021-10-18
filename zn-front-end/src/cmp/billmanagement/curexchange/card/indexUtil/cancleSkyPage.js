/*TFVuhbSSJEZIc6So1uYir2v0gpOG9OwJ9p7POAV4Q0njgRFN0TAvq36e5pov/ebu*/
/**
 * [外币兑换index]-跳转空白card页面
 * @param {*}  
 */
export const cancleSkyPage = function () {
    this.props.form.EmptyAllFormValue(this.formId);
    this.props.pushTo('/card', {
        status: 'browse',
        id: '',
        pk: '',
        pagecode: this.pageId
    })
    this.billno=null;
    this.props.resMetaAfterPkorgEdit();
    this.toggleShow();//切换页面状态
}

/*TFVuhbSSJEZIc6So1uYir2v0gpOG9OwJ9p7POAV4Q0njgRFN0TAvq36e5pov/ebu*/