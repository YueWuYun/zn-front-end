/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, base, toast } from 'nc-lightapp-front';
export default function(props, id) {
  switch (id) {
		case 'saveBtn':
			this.saveBill();
			break;
    case 'editBtn':
      props.pushTo("/card", {
        status: 'edit',
        id: props.getUrlParam('id')
      })
      this.toggleShow()
    break;
    case 'copy':
      props.pushTo("/card", {
        status: 'edit',
        id: props.getUrlParam('id'),
        copyFlag:'copy',
      })
      this.toggleShow()
      break

    case 'delete':
      this.props.modal.show('delete');
      break
    case 'approveBtn': // 审批
      let datas = {
        billID: this.props.form.getFormItemsValue(this.formId, 'crevecontid').value,
        vtranTypeCode: this.props.form.getFormItemsValue(this.formId, 'vtrantypecode').value
      }
      ajax({
        url: '/nccloud/cplatform/approve/queryhistory.do',
        data: datas,
        success: (res) => { 
          if (res.data) {
            this.setState(
              {
                ApproveDetails: res.data
              },
              () => {
                props.modal.show('approve')
              }
            )
          }
        }
      })
      break
    case 'cancelApproveBtn': // 取消审批
      this.approve('UNAPPROVE')
      break
    case 'back':
      props.pushTo("/list")
      break
    case 'cancelBtn':
      if ((props.getUrlParam('status') === 'edit')||(props.getUrlParam('status') === 'add')){
        // 表单返回上一次的值
        props.form.cancel(this.formId)
        // 表格返回上一次的值
        //props.cardTable.cancelEdit(this.tableId)
        props.pushTo("/list", {
          status: 'browse',
          id: props.getUrlParam('id')
        });
        this.toggleShow()
      }
      break
    case 'addSenBtn':
      props.cardTable.addRow(this.tableId)
      break
      case 'add':
          props.cardTable.addRow(this.tableId);
      break;
    default:
      break
  }
}

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/