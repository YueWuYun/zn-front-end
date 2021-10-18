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
const cardpath =  constant.cardpath;

// 保存按钮
export const saveBtn = function (props) {
  let status = props.getUrlParam('status');
  let savedata = props.createFormAfterEventData(this.pageId, this.formId);
  // savedata.form.userjson ="1221";
  let flag = props.form.isCheckNow(this.formId);
  if(flag){
    ajax({
      url: requesturl.savebase,
      data: savedata,
      success: (res) => {
        if (res.success) {
          toast({
            color: 'success',
            content: this.props.MutiInit.getIntl("36070DC") && this.props.MutiInit.getIntl("36070DC").get('36070DC-000000') /* 国际化处理： 保存成功*/
          });
          this.buttonAfter(res.data);
          let id = res.data[this.formId].rows[0].values.pk_cashdeposit.value;
          if (status === 'add' || status === 'copy') {
            addCache(id, res.data, formcode1, this.cacheDataSource, res.data[this.formId].rows[0].values);
          } else if (status === 'edit') {
            updateCache(this.pkname, id, res.data, formcode1, this.cacheDataSource, res.data[this.formId].rows[0].values);
          }
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
          content: this.props.MutiInit.getIntl("36070DC") && this.props.MutiInit.getIntl("36070DC").get('36070DC-000000') /* 国际化处理： 保存成功*/
        });
        let id = res.data[formcode1].rows[0].values.pk_cashdeposit.value;
        if (status === 'add' || status === 'copy') {
          addCache(id, res.data, formcode1, this.cacheDataSource, res.data[this.formId].rows[0].values);
        } else if (status === 'edit') {
          updateCache(this.pkname, id, res.data, formcode1, this.cacheDataSource, res.data[this.formId].rows[0].values);
        }
        props.pushTo(cardpath, {
          pagecode: constant.cpagecode,
          status: 'add'
        });
        // this.toggleShow();
        this.renderHtmlByStatus();
      }
    }
  });
}

// 保存提交方法
export const savesubmitBtn = function (props) {
  let status = props.getUrlParam('status');
  let savesubmitdata = props.createFormAfterEventData(this.pageId, this.formId);

  ajax({
    url: requesturl.savesubmit,
    data: savesubmitdata,
    success: (res) => {
      let { success, data } = res;
      if(success){
        if(data){
          let {appointmap} = data;
          let billform = data.form
          if(billform){
            let id = billform[formcode1].rows[0].values.pk_cashdeposit.value;
            if (status === 'add' || status === 'copy') {
              addCache(id, billform, formcode1, this.cacheDataSource, billform[this.formId].rows[0].values);
            } else if (status === 'edit') {
              updateCache(this.pkname, id, billform, formcode1, this.cacheDataSource, billform[this.formId].rows[0].values);
            }
            this.buttonAfter(billform);
          }
          if(appointmap){
            if (appointmap.workflow &&
              (appointmap.workflow == 'approveflow' || appointmap.workflow == 'workflow')) {
              this.setState({
                compositedata: appointmap,
                compositedisplay: true,
              });
            }
          }else{
            toast({
              color: 'success',
              content: this.props.MutiInit.getIntl("36070DC") && this.props.MutiInit.getIntl("36070DC").get('36070DC-000001') /* 国际化处理： 提交成功*/
            });
          }
        }

      }
      
    }
  });
}
/*UYIQG/b1cfIcC8EpiYDODD8/u3NOxtKvwO0mHl+mWfs0pSkgxWLSrDt9gUWOcx+U*/