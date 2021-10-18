/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/
import { ajax, base, toast } from 'nc-lightapp-front';
import { CARD, LIST } from '../../../interestrate/cons/constant';
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
              id: pk_bconfer,
              pagecode: CARD.page_id
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
          props.pushTo("/card", {
            status: 'browse',
            id: props.getUrlParam('lastid'),
            pagecode: CARD.page_id
          });
          this.toggleShow();
        }
      } else if (from == 'list') {
        props.pushTo("/list", {
          status: 'browse',
          pagecode: LIST.page_id
        });
      }
      break;
    case 'edit'://修改
      props.pushTo("/card", {
        status: 'edit',
        id: props.getUrlParam('id'),
        from: 'card',
        pagecode: CARD.page_id
      });
      this.toggleShow();
      break;
    case 'add'://新增
      //清空数据
      props.form.EmptyAllFormValue('form');
      props.pushTo("/card", {
        status: 'add',
        from: 'card',
        lastid: props.getUrlParam('id'),
        pagecode: CARD.page_id
      });
      this.toggleShow();
      break;
    default:
      break;
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzmF2zaJY7GDdfoYzewOLljoLUZ9TwDrmCvj1ydk5smd+*/