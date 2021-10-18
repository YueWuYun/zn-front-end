/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/
import { ajax, base, toast,print,cardCache,promptBox } from 'nc-lightapp-front';
import {card_version_id,list_page_id, card_from_id, card_table_id, card_page_id,bill_type,fun_code,node_key,printTemplate_ID,card_page, dataSourceTam,app_code, pk_name } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import { versionsControl } from "../../../../pub/util/util.js";
let {getCurrentLastId,addCache,getNextId, deleteCacheById,updateCache  } = cardCache;
import {buttonVisible} from './buttonVisible';
import {processFormulamsg} from '../../util/util.js';
import initTemplate from './initTemplate';

export default function (props, id) {
  let that = this;
  let formId = card_from_id;
  let tableId = card_table_id;
  let pageId = card_page_id;
  let data;
  switch (id) {
   
    
    //联查利率
    case 'Linkrate':
      let pk_ratecode = props.form.getFormItemsValue(card_from_id, 'ratecode').value;
      if(pk_ratecode===null||pk_ratecode==''||pk_ratecode === undefined){
        toast({color:"warning",content:this.state.json['36140AIAC-000008']})/* 国际化处理： 暂无数据*/
        break;
      }
      ajax({
        url: requesturl.ratelink, 
        data: {
            pk: pk_ratecode
        },
        success: (res) => {
            let linkpath,appcode,pagecode;
            if(res.data.rateclass=='2'){
                linkpath = '/tmpub/pub/interestrate_global/main/#/card',
                appcode = '36010IRC',
                pagecode = '36010IRC_card'
            }else if(res.data.rateclass=='1'){
                linkpath = '/tmpub/pub/interestrate_group/main/#/card',
                appcode = '36010IRCG',
                pagecode = '36010IRCG_card'
            }else if(res.data.rateclass=='0'){
                linkpath = '/tmpub/pub/interestrate_org/main/#/card',
                appcode = '36010IRCO',
                pagecode = '36010IRCO_card'
            }
            props.openTo(linkpath, {
                appcode: appcode,
                pagecode: pagecode,
                status: 'browse',
                scene: "linksce",
                // islinkquery: true,
                id:pk_ratecode
            });
        }
      });
      break;
     
    case 'Add':
      props.pushTo(
        '/card', {
          status: 'add',
          id: that.props.form.getFormItemsValue(formId, pk_name).value,
          pagecode: card_page_id
      })
      this.setState({ billno: null })
      props.form.EmptyAllFormValue(card_from_id);
      props.cardTable.setTableData(this.tableId, { rows: [] });
      initTemplate.call(this, props);
      break;
   
    
    case 'Save':
      let saveflag = props.form.isCheckNow(formId) && props.cardTable.checkTableRequired(card_table_id);
      
     
      let CardData = this.props.createMasterChildData(this.pageId, card_from_id, this.tableId);
      // if(CardData.){
      let length = CardData.body[card_table_id].rows.length;
      let savebodyflag = false;
      for(let i=0;i<length;i++){
          if(CardData.body[card_table_id].rows[i].status != 3){
            savebodyflag = true;
          }
          else{
            if(!CardData.body[card_table_id].rows[i].values.pk_intaccinfo.value){
              this.props.cardTable.delRowByRowId(card_table_id, CardData.body[card_table_id].rows[i].rowid);
            }
           
          }
      }
      
      
      if(saveflag){
        if(!savebodyflag){
          toast({ color: 'warning', content: this.state.json['36140AIAC-000054'] });/* 国际化处理： 账户必须有一个子户！*/
          break;
        }
        let saveobj = {};
        saveobj[card_table_id] = 'cardTable';
        this.props.validateToSave( CardData , save.bind(this,props,CardData) , saveobj , '' );
      }
      break;

    case 'SaveAdd':
      // let saveaddflag = props.form.isCheckNow(formId);
      let saveaddflag = props.form.isCheckNow(formId) && props.cardTable.checkTableRequired(card_table_id);
      let CardDataAdd = this.props.createMasterChildData(this.pageId, card_from_id, this.tableId);
      // if(CardData.){
      let lengthadd = CardDataAdd.body[card_table_id].rows.length;
      let saveaddbodyflag = false;
      for(let i=0;i<lengthadd;i++){
          if(CardDataAdd.body[card_table_id].rows[i].status != 3){
            saveaddbodyflag = true;
          }
          else{
            if(!CardDataAdd.body[card_table_id].rows[i].values.pk_intaccinfo.value){
              this.props.cardTable.delRowByRowId(card_table_id, CardDataAdd.body[card_table_id].rows[i].rowid);
            }
           
          }
          
      }
      
      if(saveaddflag){
        if(!saveaddbodyflag){
          toast({ color: 'warning', content: this.state.json['36140AIAC-000054'] });/* 国际化处理： 账户必须有一个子户！*/
          break;
        }
        let saveaddobj = {};
        saveaddobj[card_table_id] = 'cardTable';
        this.props.validateToSave( CardDataAdd , saveadd.bind(this,props,CardDataAdd) , saveaddobj , '' );
      }
      break;
    
    
    case 'Edit':
      
    //   let extParam;
		// 	extParam = { 'uiState': 'edit' };
    //   let data = { pk: that.props.form.getFormItemsValue(formId, pk_name).value, pageCode: card_page_id,extParam };
    //   ajax({
		// 		url: requesturl.edit,
		// 		data: data,
		// 		success: (res) => {
		// 			promptBox({
    //           color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
    //           title: this.state.json['36140AIAC-000027'],// 弹框表头信息/* 国际化处理： 确认修改*/
    //           content: this.state.json['36140AIAC-000062'],//this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 计息对象未计息，修改有可能导致积数调整失效，是否继续?*/
    //           beSureBtnClick: that.beSureEditBtnClick,
    //           cancelBtnClick: that.cancelEditBtnClick
    //       })
		// 		}
		// 	});
        let pk = that.props.form.getFormItemsValue(card_from_id, pk_name).value
        that.props.pushTo("/card", {
          status:'edit',
          id:pk,
          pagecode: card_page_id
        });
        versionsControl(that.props,card_from_id);
      	that.toggleShow();
        break;
      case 'Copy':
        props.pushTo('/card', {
          status: 'copy',
          id: props.getUrlParam('id'),
          pagecode: card_page_id
        })
        versionsControl(props,card_from_id);
        that.toggleShow()
        break;
  
      case 'Delete':
        //that.props.modal.show('delete');
  
        promptBox({
            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['36140AIAC-000023'],
            content: this.state.json['36140AIAC-000024'],/* 国际化处理： 是否确认删除？*/
            beSureBtnClick: this.delConfirm
        })
  
  
        break;
      case 'Back':
        props.pushTo('/list', {
          pagecode: list_page_id
        })
        break;
      case 'Cancel':

        promptBox({
            color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['36140AIAC-000029'],
            content: this.state.json['36140AIAC-000014'],/* 国际化处理： 是否确认要取消？*/
            //点击确定按钮事件
            beSureBtnClick: () => {
              if ((props.getUrlParam('status') === 'edit')) {
                  // 表单返回上一次的值
                  props.form.cancel(formId);
                  props.setUrlParam({
                    status: 'browse',
                    id: props.getUrlParam('id')
                  });
                  versionsControl(props,card_from_id);
                  that.toggleShow();
              }
              if ((props.getUrlParam('status') === 'version')) {
                // 表单返回上一次的值
                props.form.cancel(formId);
                props.setUrlParam({
                  status: 'browse',
                  id: props.getUrlParam('id')
                });
                versionsControl(props,card_from_id);
                that.toggleShow();
              }
              //保存中的取消操作
              if (props.getUrlParam('status') === 'add') {
                  props.form.cancel(formId);  
                  props.cardTable.resetTableData(this.tableId);
                  let id = props.getUrlParam('id');
                  let nextId = getCurrentLastId(dataSourceTam); 
                  if(id == null){
                      props.setUrlParam({
                        status: 'browse',
                        id: nextId
                      });
                  }else{
                      props.setUrlParam({
                        status: 'browse',
                        id: id
                      });
                  }
                  let billno = props.form.getFormItemsValue(card_from_id, 'vbillno');
                
                  if(billno == null){
                    this.setState({ billno: null });
                  }else{
                    this.setState({ billno: props.form.getFormItemsValue(card_from_id, 'vbillno').value });
                  }
                
                  versionsControl(props,card_from_id);
                  that.toggleShow();
              
              }
              if (props.getUrlParam('status') === 'copy') {
                  props.form.cancel(formId);
                  props.setUrlParam({
                    status: 'browse',
                    id: props.getUrlParam('id')
                  });
                  versionsControl(props,card_from_id);
                  that.toggleShow();
              }
            }
          });	
  
        break;
      case 'Refresh':
        this.refreshcard();
        break;
        
      //创建版本
      case 'version' :
        props.pushTo('/card', {
          status: 'version',
          id: props.getUrlParam('id'),
          pagecode: card_page_id,
          version: that.props.form.getFormItemsValue(formId, 'version').value
          //pk_banktype:that.props.form.getFormItemsValue(formId, 'pk_banktype').value
        })
        versionsControl(props,card_from_id);
        that.toggleShow();
        break;
      //查看版本
      case 'QueryVersion':
        queryVersion.call(this,props);
        this.setState({
          showModal_version: true
        });
        break;
      //删除版本
      case 'DeleteVersion':
        let version = props.form.getFormItemsValue(card_from_id, 'version').value;
        if(version == 0){
          promptBox({
              color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
              title: this.state.json['36140AIAC-000060'],
              content: this.state.json['36140AIAC-000061'],
          })
        }else{
          this.delVersionConfirm();
        }
        break;
      //停用
      case 'Disable':
          
        data = { 
          pk: props.form.getFormItemsValue(card_from_id, pk_name).value,
          ts: props.form.getFormItemsValue(card_from_id, 'ts').value,
          bodyPKs: getBodyRows.call(that, props, this) 
        };
        ajax({
          url: requesturl.disable,
          data: data,
          success: (res) => {
            var pk = data.pk;
            updateCache(pk_name,pk,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
            toast({ color: 'success', content: props.MutiInit.getIntl("36140AIAC") && props.MutiInit.getIntl("36140AIAC").get('36140AIAC-000010') });/* 国际化处理： 操作成功*/
            props.pushTo('/card', {
              status: 'browse',
              id: pk,
              pagecode: card_page_id
            });
            this.toggleShow();
          }
        });
        break;
      //启用
      case 'Enable':
        data = { 
          pk: props.form.getFormItemsValue(card_from_id, pk_name).value,
          ts: props.form.getFormItemsValue(card_from_id, 'ts').value,
          bodyPKs: getBodyRows.call(that, props, this) 
        };
        ajax({
          url: requesturl.enable,
          data: data,
          success: (res) => {
            var pk = data.pk;
            updateCache(pk_name,pk,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
            toast({ color: 'success', content: props.MutiInit.getIntl("36140AIAC") && props.MutiInit.getIntl("36140AIAC").get('36140AIAC-000010') });/* 国际化处理： 操作成功*/
            props.pushTo('/card', {
              status: 'browse',
              id: pk,
              pagecode: card_page_id
            });
            this.toggleShow();
          }
        });
        break;
         //增行
    case 'InsertRow':
      let number =  props.cardTable.getNumberOfRows(tableId, false);
      if(number===0){
        props.cardTable.addRow(tableId);
      }else{
        let currRowssave = props.cardTable.getCheckedRows(tableId);
        let index;
        if(currRowssave.length===0){
          props.cardTable.addRow(tableId);
        }else{
          for (let item of currRowssave) {
            index = item.index;
          }
          props.cardTable.addRow(tableId,index+1);
        }
      }
    
      break;
    //插行
    case 'SaveRow':
        props.cardTable.addRow(that.tableId);
        let rownum2 = that.props.cardTable.getNumberOfRows(tableId);
        let dataArr2 = [ 'pk_currtype' ];
        props.form.getFormItemsValue(formId, dataArr2);
        let value2 = props.form.getFormItemsValue(formId, 'pk_currtype').value;
        let dly2 = props.form.getFormItemsValue(formId, 'pk_currtype').display;
      break;
    //删行
    case 'DeleteRow':
      let currRows = props.cardTable.getCheckedRows(tableId);
      let currSelect = [];
      if(currRows === false){
        toast({color:"warning",content:this.state.json['36140AIAC-000016']})/* 国际化处理： 请选择要删除的行*/
        break;
      }
      if(currRows.length===0){
        toast({color:"warning",content:this.state.json['36140AIAC-000016']})/* 国际化处理： 请选择要删除的行*/
        break;
      }

      if (currRows && currRows.length > 0) {
        for (let item of currRows) {
          currSelect.push(item.index);
        }
      }
      props.cardTable.delRowsByIndex(tableId, currSelect);
      break;
    case 'Print':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					//billtype: bill_type, //单据类型
          //funcode: fun_code, //功能节点编码，即模板编码
          appcode: app_code,
          //nodekey: node_key, //模板节点标识
          nodekey:null,
					//printTemplateID: printTemplate_ID,
					oids: [that.props.form.getFormItemsValue(formId, 'pk_accintobj').value]
				}
			);
      break;
    //输出
    case 'Output':
      
      that.setState(
        {
            outputData: {
                appcode: app_code,
                //funcode: fun_code, //功能节点编码，即模板编码
                nodekey: null, //模板节点标识
                //printTemplateID: printTemplate_ID, //模板id
                outputType: 'output',
                oids: [that.props.form.getFormItemsValue(formId, 'pk_accintobj').value]
            }
        },
        () => {
          that.refs.printOutput.open();
        }
      );
			break;
  }
}


function getBodyRows(props) {
	let currRows = [];
	let bodyRows = [];
	if(props.cardTable.getVisibleRows(card_table_id).length > 0){
		currRows = props.cardTable.getCheckedRows(this.tableId);
		if (currRows && currRows.length > 0) {
			for (let i = 0; i < currRows.length; ++i) {
				bodyRows.push(currRows[i].data.values.pk_intaccinfo.value);
			}
		}
	}
	return bodyRows;
}




function save(props,CardData) {
  ajax({
    url: requesturl.save,
    data: CardData,
    success: (res) => {
      // let {addCacheId} = this.props.table;
      let pk_accintobj  = null;
      if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
        props.dealFormulamsg(
          res.formulamsg,  //参数一：返回的公式对象
          {                //参数二：界面使用的表格类型
            card_table_id:"cardTable"
          }
        );
      }
      if (res.success) {
        // toast({ color: 'success', content: this.state.json['36140AIAC-000009']});/* 国际化处理： 保存成功*/
        if (res.data) {
          if (res.data.head && res.data.head[this.formId]) {
            props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
            pk_accintobj  = res.data.head[this.formId].rows[0].values.pk_accintobj.value;
          }
          if (res.data.bodys && res.data.bodys[this.tableId]) {
            props.cardTable.setTableData(this.tableId, res.data.bodys[this.tableId]);
          }
          if (res.data.body && res.data.body[this.tableId]) {
            props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
          }
          
          

          if ((props.getUrlParam('status') === 'add') || (props.getUrlParam('status') === 'copy')) {
            addCache(pk_accintobj,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }else{
            updateCache(pk_name,pk_accintobj,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }

        }
        this.props.pushTo('/card', {
          status: 'browse',
          id: pk_accintobj ,
          saveres:true,
          pagecode: card_page_id
        });
        versionsControl(this.props,card_from_id);
        this.toggleShow();
      }
    }
  });
}



function saveadd(props,CardData) {
  ajax({
    url: requesturl.save,
    data: CardData,
    success: (res) => {
      let pk_accintobj  = null;
      if (res.success) {
          if (res.data.head && res.data.head[this.formId]) {
            props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
            pk_accintobj  = res.data.head[this.formId].rows[0].values.pk_accintobj.value;
          }
        
          props.cardTable.setTableData(this.tableId, { rows: [] });
        

          if ((props.getUrlParam('status') === 'add') || (props.getUrlParam('status') === 'copy')) {
            addCache(pk_accintobj,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }else{
            updateCache(pk_name,pk_accintobj,res.data,this.formId,dataSourceTam,res.data.head[card_from_id].rows[0].values);
          }

          this.props.setUrlParam({
            status: 'add',
            id:pk_accintobj,
            saveres:true,
            isSaveAdd:true
          });
        
          versionsControl(this.props,card_from_id);
          this.toggleShow();
      }
    }
  });
}


//查看版本信息
const queryVersion = function (props) {
      let pk = props.form.getFormItemsValue(card_from_id,pk_name).value;
      let extParam;
			extParam = { 'uiState': 'edit' };
			let data = { pk: pk, pageCode: card_page_id,extParam };
      ajax({
          url: requesturl.queryversion,
          data: data,
          success: (res) => {
              let { success, data } = res;
              if (success) {
                props.table.setAllTableData(card_version_id, data.bodys[card_version_id]);
              }
          }
      }); 
}
 


/*Hm9gUKDDwtNjV7Mk8onAztSlXlceSBbE8fC6ryJH+zrAuUsk+GG06Jwl+NQXaCbP*/