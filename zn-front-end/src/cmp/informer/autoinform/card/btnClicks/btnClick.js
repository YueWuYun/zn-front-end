/*UYIQG/b1cfIcC8EpiYDODD8/u3NOxtKvwO0mHl+mWfs0pSkgxWLSrDt9gUWOcx+U*/
import {
  ajax,
  toast,
  cardCache
} from 'nc-lightapp-front';
import {
  constant,
  requesturl
} from '../../config/config';
let {
  updateCache,
  addCache
} = cardCache;

const formcode1 = constant.formcode1;
const cardpath = constant.cardpath;

// 保存按钮
export const saveBtn = function (props) {
  let status = props.getUrlParam('status');
  let savedata = props.createFormAfterEventData(this.pageId, this.formId);
  let flag = props.form.isCheckNow(this.formId);
  if (flag) {
    ajax({
      url: requesturl.savebase,
      data: savedata,
      success: (res) => {
        if (res.success) {
          toast({
            color: 'success',
            content: this.state.json['36070AGR-000000']/* 国际化处理： 保存成功*/
          });
          this.buttonAfter(res.data); //保存后跳浏览态
          let id = res.data[this.formId].rows[0].values.pk_autoinform.value;
          
          //设置按钮

          //修改状态
          this.props.setUrlParam({ status: 'browse', id: id });
        }
      }
    });
  }
}

// 保存新增按钮操作
export const saveaddBtn = function (props) {
  let status = props.getUrlParam('status');
  let saveadddata = props.createFormAfterEventData(this.pageId, this.formId);
  ajax({
    url: requesturl.savebase,
    data: saveadddata,
    success: (res) => {
      if (res.success) {
        toast({
          color: 'success',
          //content: this.props.MutiInit.getIntl("36070AGR") && this.props.MutiInit.getIntl("36070AGR").get('36070AGR-000000') /* 国际化处理： 保存成功*/
          content: this.state.json['36070AGR-000000']
        });
        let id = res.data[formcode1].rows[0].values.pk_autoinform.value;
        if (status === 'add' || status === 'copy') {
          addCache(id, res.data, formcode1, this.cacheDataSource, res.data[this.formId].rows[0].values);
        } else if (status === 'edit') {
          updateCache(this.pkname, id, res.data, formcode1, this.cacheDataSource, res.data[this.formId].rows[0].values);
        }
        props.pushTo(cardpath, {
          status: 'add'
        });
        // this.toggleShow();
        this.renderHtmlByStatus();
      }
    }
  });
}
/*UYIQG/b1cfIcC8EpiYDODD8/u3NOxtKvwO0mHl+mWfs0pSkgxWLSrDt9gUWOcx+U*/