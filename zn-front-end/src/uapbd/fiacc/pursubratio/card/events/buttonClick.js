//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import { ajax,toast ,cardCache,promptBox,print,output} from 'nc-lightapp-front';
import { dataSource,pkname } from '../constants';
let {setDefData, getDefData,addCache ,getNextId, deleteCacheById,getCacheById,updateCache,getCurrentLastId } = cardCache;

export default function (props, id) {
  let pk_bill = this.props.getUrlParam('id');
  switch (id) {
    case 'Add':
        this.initAdd();
        break;
    case 'Save':
        this.saveBill();
        break;
    case 'Copy'://复制
        this.copy();
        
        break;
    case 'Edit':
        this.props.setUrlParam({ status: 'edit' })
        this.state.buttonfalg = true;
        this.props.resMetaAfterPkorgEdit();
        this.props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
        this.props.cardTable.setStatus(this.tableId, 'edit');
        this.props.form.setFormStatus(this.formId, 'edit');
        this.controlBillno();//控制单据号是否可以编辑
        this.toggleShow();
        this.onSelected();
        break;
    case 'Delete'://删除
        promptBox({
          color: 'warning',                 
          title: this.state.json['10140CCSD-000006'],                  /* 国际化处理： 删除*/
          content: this.state.json['10140CCSD-000002'],             /* 国际化处理： ​确定要删除吗？*/
          noFooter: false,                 
          noCancelBtn: false,              
          beSureBtnName: this.state.json['10140CCSD-000007'],           /* 国际化处理： 确定*/
          cancelBtnName: this.state.json['10140CCSD-000008'] ,          /* 国际化处理： 取消*/
          beSureBtnClick: ()=>{
            ajax({
                url: '/nccloud/uapbd/pursubratio/delete.do',
                data: {
                    pk_bill: pk_bill,
                    ts: this.props.form.getFormItemsValue(this.formId, 'ts').value,
                },
                success: (res) => {
                    //删除单据后，卡片界面显示该单据的下一个单据
                    if (res.success) {
                        toast({ color: 'success', content: this.state.json['10140CCSD-000005'] });/* 国际化处理： 删除成功*/
                        //删除成功之后获取当前删除id的下一个id
                        let nextId = getNextId(pk_bill, dataSource);
                        //删除当前页面缓存信息
                        deleteCacheById(pkname, pk_bill, dataSource);
                        //如果存在下一个id，渲染界面，如果不存在就清空界面数据
                        if (nextId) {
                            this.props.setUrlParam({ id: nextId });
                            this.initShow();
                        } else {
                            this.props.setUrlParam({ id: null });
                            this.props.form.EmptyAllFormValue(this.formId);
                            this.props.cardTable.setTableData(this.tableId, { rows: [] });
                            this.toggleShow();
                        }
                    }
                }
            });
          }
        });
        break;
      case 'Cancel'://取消
          promptBox({
              color: 'warning',
              title: this.state.json['10140CCSD-000008'],                  /* 国际化处理： 取消*/
              content: this.state.json['10140CCSD-000010'],             /* 国际化处理： ​确定要取消吗？*/
              noFooter: false,
              noCancelBtn: false,
              beSureBtnName: this.state.json['10140CCSD-000007'],           /* 国际化处理： 确定*/
              cancelBtnName: this.state.json['10140CCSD-000008'],          /* 国际化处理： 取消*/
              beSureBtnClick: () => {
                  let pk_org = this.props.form.getFormItemsValue(this.formId, 'pk_org');
                  if (!pk_org || !pk_org.value || pk_org.value == '') {
                      this.props.resMetaAfterPkorgEdit();
                  }
                  this.props.beforeUpdatePage(); //打开开关
                  this.state.buttonfalg = null;
                  //如果获取不到浏览器上面的id，就获取当前缓存的最后一个id，因为直接列表新增进入卡片的数据，浏览器上不保存id
                  let id = this.props.getUrlParam('id');
                  if (!id) {
                      id = getCurrentLastId(dataSource);
                  }
                  if (id) {
                      //如果Id存在，先获取缓存中的数据取渲染界面，如果没有缓存，重新查询一次数据信息
                      this.props.setUrlParam({ status: 'browse', id: id });
                      let cardData = getCacheById(id, dataSource);
                      if (cardData) {
                          this.props.form.setAllFormValue({ [this.formId]: cardData.head[this.formId] });
                          this.props.cardTable.setTableData(this.tableId, cardData.body[this.tableId]);
                          this.props.cardTable.setStatus(this.tableId, 'browse');
                          this.props.form.setFormStatus(this.formId, 'browse');
                          this.props.updatePage(this.formId, this.tableId); //关闭开关
                          this.toggleShow();
                      } else {
                          this.initShow();
                      }
                  } else {
                      //如果id不存在，清空界面数据信息，重新控制按钮状态
                      this.props.form.EmptyAllFormValue(this.formId);
                      this.props.cardTable.setTableData(this.tableId, { rows: [] });
                      this.props.setUrlParam({ status: 'browse' });
                      this.props.cardTable.setStatus(this.tableId, 'browse');
                      this.props.form.setFormStatus(this.formId, 'browse');
                      this.props.updatePage(this.formId, this.tableId); //关闭开关
                      this.toggleShow();
                  }
              }
          });
          break;
    case 'Refresh'://刷新
        this.queryCard(pk_bill,id);
        break;
    

    default:
      break
  }
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS