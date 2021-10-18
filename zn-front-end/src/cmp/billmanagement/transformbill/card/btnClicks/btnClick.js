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
const cardpath =  constant.cardpath;
// 保存按钮
export const saveBtn = function (props, savedata) {
  let status = props.getUrlParam('status');
  ajax({
    url: requesturl.save,
    data: savedata,
    success: (res) => {
      if (res.success) {
        
        let id = res.data[formcode1].rows[0].values.pk_transformbill.value
        if (status === 'add' || status === 'copy') {
          addCache(id, res.data, formcode1, this.cacheDataSource, res.data[formcode1].rows[0].values);
        } else if (status === 'edit') {
          updateCache(this.billpk, id, res.data, formcode1, this.cacheDataSource, res.data[formcode1].rows[0].values);
        }
        this.pageTransition(id, 'browse');
        toast({
          color: 'success',
          content: this.state.json['36070TBR-000000']/* 国际化处理： 删除成功*/
        });
      }
    }
  });
}

// 保存新增按钮操作
export const saveaddBtn = function (props, saveadddata) {
  let status = props.getUrlParam('status');
  ajax({
    url: requesturl.save,
    data: saveadddata,
    success: (res) => {
      if (res.success) {
        let id = res.data[formcode1].rows[0].values.pk_transformbill.value
        if (status === 'add' || status === 'copy') {
          addCache(id, res.data, formcode1, this.cacheDataSource, res.data[formcode1].rows[0].values);
        } else if (status === 'edit') {
          updateCache(this.billpk, id, res.data, formcode1, this.cacheDataSource, res.data[formcode1].rows[0].values);
        }
        this.pageTransition(id, 'add');
        toast({
          color: 'success',
          content: this.state.json['36070TBR-000000'] /* 国际化处理： 保存成功*/
        });
      }
    }
  });
}

// 保存提交方法
export const savesubmitBtn = function (props, savesubmitdata) {
  let status = props.getUrlParam('status');
  ajax({
    url: requesturl.savesubmit,
    data: savesubmitdata,
    success: (res) => {
      let {
        data
      } = res
      if (res.success) {

        if (data) {
          let {
            appointmap,
            form
          } = data;
          if(form){
            let id = form[formcode1].rows[0].values.pk_transformbill.value
            if (status === 'add' || status === 'copy') {
              addCache(id, form, formcode1, this.cacheDataSource, form[formcode1].rows[0].values);
            } else if (status === 'edit') {
              updateCache(this.billpk, id, form, formcode1, this.cacheDataSource, form[formcode1].rows[0].values);
            }
            this.pageTransition(id, 'browse');
          }
          if (appointmap) {
            if (appointmap.workflow &&
              (appointmap.workflow == 'approveflow' || appointmap.workflow == 'workflow')) {
              this.setState({
                compositedata: appointmap,
                compositedisplay: true,
              });
            }
          } else {
            toast({
              color: 'success',
              content: this.state.json['36070TBR-000001'] /* 国际化处理： 保存提交成功*/
            });
          }
        }
      }
    }
  });
}
/*UYIQG/b1cfIcC8EpiYDODD8/u3NOxtKvwO0mHl+mWfs0pSkgxWLSrDt9gUWOcx+U*/