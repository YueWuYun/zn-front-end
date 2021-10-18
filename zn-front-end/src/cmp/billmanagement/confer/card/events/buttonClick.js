/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, promptBox } from 'nc-lightapp-front';
export default function (props, id) {
  switch (id) {
    case 'save'://保存
      let flag = props.form.isCheckNow('form');
      if (flag) {
        let data = { '0001': null };

        data['0001'] = this.props.form.getAllFormValue('form');
        data.pageid = '360701BCS_C01';
        let pk_bconfer;
        ajax({
          url: '/nccloud/cmp/billmanagement/confersave.do',
          data: data,
          async: true,
          success: (res) => {
            if (res.data) {
              this.props.form.setAllFormValue({ ['form']: res.data['form'] });
              pk_bconfer = res.data['form'].rows[0].values.pk_bconfer.value;
            }
            props.pushTo("/card", {
              status: 'browse',
              id: pk_bconfer
            });
            toast({
              color: 'success',
              content: props.MutiInit.getIntl("360701BCS") && this.props.MutiInit.getIntl("360701BCS").get('360701BCS-000013')
            });
            this.toggleShow();
          }
        });
      }
      break;
    case 'cancel'://取消
      let from = props.getUrlParam('from');
      if (from == 'card') {
        if ((props.getUrlParam('status') === 'edit') || (props.getUrlParam('status') === 'add')) {
          // 表单返回上一次的值
          props.form.cancel('form');
          promptBox({
            color: "warning",
            title: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000014'),
            content: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000016'),
            beSureBtnClick: cancelClick.call(this, props)
          });
        }
      } else if (from == 'list') {
        promptBox({
          color: "warning",
          title: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000014'),
          content: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000016'),
          beSureBtnClick: cancelClick.bind(this, props)
        });
      }
      break;
    case 'edit'://修改
      props.pushTo("/card", {
        status: 'edit',
        id: props.getUrlParam('id'),
        from: 'card',
      });
      this.toggleShow();
      break;
    case 'add'://新增
      //清空数据
      props.form.EmptyAllFormValue('form');
      props.pushTo("/card", {
        status: 'add',
        from: 'card',
        lastid: props.getUrlParam('id')
      });
      this.toggleShow();
      break;
    default:
      break;
  }
}

function cancelClick(props){
    let from = props.getUrlParam('from');
    if(from =='card'){
        props.pushTo("/card", {
        status: 'browse',
        id: props.getUrlParam('lastid')
      });
      this.toggleShow();
    }else if(from =='list'){
      props.pushTo("/list", {
              status: 'browse'
            });
      this.toggleShow();
    }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/