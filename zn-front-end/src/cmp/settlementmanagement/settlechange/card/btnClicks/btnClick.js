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
import {
  commondata,
  getappurl
} from '../../../../public/utils/constant';

const formcode1 = constant.formcode1;
const cardpath = constant.cardpath;

// 保存按钮
export const saveBtn = function (props) {
  let status = props.getUrlParam('status');
  let savedata = props.createFormAfterEventData(this.pageId, this.formId);
  ajax({
    url: requesturl.save,
    data: savedata,
    success: (res) => {
      if (res.success) {
        toast({
          color: 'success',
          content: this.state.json['36070CPI-000000'] /* 国际化处理： 保存成功*/
        });
        let id = res.data[formcode1].rows[0].values.pk_settlechange.value
        if (status === 'edit') {
          updateCache(this.billpk, id, res.data, formcode1, this.cacheDataSource, res.data[formcode1].rows[0].values);
        }
        props.pushTo(cardpath, {
          pagecode: constant.cpagecode,
          status: 'browse',
          billstatus: res.data[this.formId].rows[0].values.busistatus.value,
          id: res.data[this.formId].rows[0].values.pk_settlechange.value
        });
        this.toggleShow();
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

      let {data,success} = res;
					if (success) {
						if(data){
							let {appointmap} = data;
							if (appointmap) {
								if (appointmap.workflow &&
									(appointmap.workflow == 'approveflow' || appointmap.workflow == 'workflow')) {
									this.setState({
										compositedata: appointmap,
										compositedisplay: true,
									});
								}
							}else{
								let form = data.form;
								toast({
									color: 'success',
									content: this.state.json['36070CPI-000001'] /* 国际化处理： 提交成功*/
								});
								let id = form[formcode1].rows[0].values.pk_settlechange.value
								if (status === 'edit') {
									updateCache(this.billpk, id, form, formcode1, this.cacheDataSource, form[formcode1].rows[0].values);
								}
								props.pushTo(cardpath, {
                  pagecode: constant.cpagecode,
									status: 'browse',
									billstatus: form[this.formId].rows[0].values.busistatus.value,
									id: form[this.formId].rows[0].values.pk_settlechange.value
								});
								this.toggleShow();
								this.renderHtmlByStatus();
							}
						}
						
					}
    },
    // tm begin lidyu 报错后刷新一下数据 20200415
    error: (res) => {
      toast({
        color: 'warning',
        content:res.message
      });
      this.renderHtmlByStatus();
    }
    // tm end lidyu 20200415
  });
}
/*UYIQG/b1cfIcC8EpiYDODD8/u3NOxtKvwO0mHl+mWfs0pSkgxWLSrDt9gUWOcx+U*/