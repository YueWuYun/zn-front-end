/*UYIQG/b1cfIcC8EpiYDODD8/u3NOxtKvwO0mHl+mWfs0pSkgxWLSrDt9gUWOcx+U*/
import {
  ajax,
  toast
} from 'nc-lightapp-front';
import {
  constant,
  requesturl
} from '../../config/config';

const formcode1 = constant.formcode1;
// 保存按钮
export const saveBtn = function (props, savedata) {
  ajax({
    url: requesturl.save,
    data: savedata,
    success: (res) => {
      if (res.success) {
        let id = res.data[formcode1].rows[0].values.pk_transformbill.value
        this.pageTransition(id, 'browse');
        toast({
          color: 'success',
          content: this.state.json['36070TBR-000000'] /* 国际化处理： 删除成功*/
        });
      }
    }
  });
}
/*UYIQG/b1cfIcC8EpiYDODD8/u3NOxtKvwO0mHl+mWfs0pSkgxWLSrDt9gUWOcx+U*/