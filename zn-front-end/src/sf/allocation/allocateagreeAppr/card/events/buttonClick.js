/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/
import { ajax, base, toast, print, cacheTools, cardCache } from 'nc-lightapp-front';
import { viewmod_agree, app_id, card_from_id, card_table_id, card_page_id, base_url, billtype, print_nodekey, print_templateid, funcode, base_path, allocateapply,allocate, AllocateAgreeCache,CARD_PAGE_INFO,printParameter } from '../../cons/constant.js';
import { AddLine, InsertLine, BatchDelLine, DelLine, Open, CopyLine, BatchCopy, cardOperator,listMultiOperator, showTBBMsg } from '../../../../pub/utils/SFButtonUtil';
import initTemplate from './initTemplate';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil.js';
import { orgVersionView } from '../../../../../tmpub/pub/util/version/index.js';
import { toASCII } from 'punycode';
import Sign from '../../../../../tmpub/pub/util/ca/index';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
//import { InnerAccoutDialog } from '../../../../../tmpub/pub/inneraccount/list/index.js';

var pk;
var that;
//props, key, text, record, index
export default function buttonClick(props, id,text,record,index,tableId) {
  let status = props.getUrlParam("status");
  let showOriginalData = [];
  let pk_org = this.props.form.getFormItemsValue(card_from_id, 'pk_org').value;
  const checkeddata = props.cardTable.getCheckedRows(card_table_id); //获取当前选中行数据
  let billdata = props.createMasterChildData(card_page_id, card_from_id, card_table_id);
  let saveObj = {};
  saveObj[card_table_id] = 'cardTable';
  let pk = this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value;
  let ts = this.props.form.getFormItemsValue(card_from_id, 'ts').value;
  let checkAllCardDate = this.props.cardTable.getAllRows(card_table_id, false);

  that = this;
  let pkMapTs = {};
  switch (id) {
    //头部保存
    case 'Save':
      //props.validateToSave(billdata, this.saveBill.bind(this, false), saveObj, '');
      this.saveBill(false);
      break;
    //保存提交
    case 'SaveCommit':
      //props.validateToSave(billdata, this.saveBill.bind(this, true), saveObj, '');
      saveBill.call(this,props,() => {
        cardOperator(props, card_page_id, card_from_id, [card_table_id], 'pk_allocateagree_h', base_url + 'alloagreecommit.do', loadMultiLang(props,'36320FAA-000001'), AllocateAgreeCache, commitAssign.bind(this), true);/* 国际化处理： 保存提交*//* 国际化处理： 提交成功！*/
      });
      //this.saveBill(true);
      break;
    case 'Agree':
    
    pkMapTs[pk] = ts;
    ajax({
        url: base_url+'alloagreeedit.do',
        data: {
            pkMapTs,
            pageCode:card_page_id
        },
        success: (res) => {
          if (res) {
              // beforeLinkOfList(props);
              props.pushTo('/card', {
                status: 'edit',
                from: 'card',
                id: props.getUrlParam('id')
              });
              orgVersionView(props,card_from_id,pk_org);
              this.toggleShow();
          }}
      })
      break;
    //展开（浏览态）
    case 'opendown':
    //收起
    case 'closedown':
        props.cardTable.toggleRowView(card_table_id, record);
        break;
    //展开（编辑态）
    case 'openright':
        props.cardTable.openModel(card_table_id, 'edit', record, index);
        break;
    //头部 刷新
    case 'Refresh':
      this.qryData();
      break;
    // 头部 取消
    case 'Cancel':
      //表头数据回退到编辑前
      this.props.form.cancel(card_from_id);
      //表体数据回退到编辑前
      // this.props.cardTable.resetTableData(card_table_id);
      props.pushTo('/card', {
        status: 'browse',
        id: props.getUrlParam('id')
      });
      this.refresh();
      break;
    //头部 提交
    case 'Commit':
      cardOperator(props, card_page_id, card_from_id, [card_table_id], 'pk_allocateagree_h', base_url + 'alloagreecommit.do', loadMultiLang(props,'36320FAA-000002'), AllocateAgreeCache, commitAssign.bind(this), true);/* 国际化处理： 提交*//* 国际化处理： 提交成功！*/
      break;
    //头部 收回
    case 'Uncommit':
      cardOperator(props, card_page_id, card_from_id, [card_table_id], 'pk_allocateagree_h', base_url + 'alloagreeuncommit.do', loadMultiLang(props,'36320FAA-000003'),AllocateAgreeCache, this.refresh.bind(this));/* 国际化处理： 收回*//* 国际化处理： 收回成功！*/
      break;
    //头部，退回
    case 'Back':
      this.setState({ showReBack: true});

      props.modal.show('backModel',{
        //点击确定按钮事件
        beSureBtnClick: buttonClick.bind(this, props, 'backconfirm',text, record, index)
      });
      break;
    //退回确认
    case 'backconfirm':
      //cardOperator(props, card_page_id, card_from_id,[card_table_id] ,'pk_allocate_h', base_url + 'alloabackedit.do', '退回成功！', dataSource ,repaintView.bind(this, props));
      //break;
    // //头部 退回
    // case 'Back':
      //this.props.modal.show('back');
      //获取行主键值
      //判空
      if (pk && ts) {
          pkMapTs[pk] = ts;
      }
      ajax({
          url: base_url+'alloabackedit.do',
          data: {
              pkMapTs,
              pageCode:card_page_id,
          },
          success: (res) => {
              if (res) {
                  //beforeLinkOfList(props);
                  //数据权限校验通过
                  billBack.call(that,props,pkMapTs,pk,ts,{retbillreason:this.state.returnnote});
            }
          }
      })
      break;
      //生成下拨单
    case 'CreateAllocate':
      let bodyPKs = [];
      let checkBodyDate = this.props.cardTable.getCheckedRows(card_table_id);
      if (checkBodyDate && checkBodyDate.length > 0) {
        for (let index = 0; index < checkBodyDate.length; index++) {
          const element = checkBodyDate[index];
          bodyPKs.push(element.data.values.pk_allocateagree_b && element.data.values.pk_allocateagree_b.value);
        }
      }
      
      cardCreateAllocate(that,props, card_page_id, card_from_id, [card_table_id], 'pk_allocateagree_h', base_url + 'alloagreecreateallocatecard.do', loadMultiLang(props,'36320FAA-000029'), AllocateAgreeCache, bodyPKs);/* 国际化处理： 生成下拨单成功！*/
      break;
    //头部 附件
    case 'File':
      this.setState({
        showUploader: !this.state.showUploader
      });
      break;
    //头部 打印
    case 'Print':
      console.log(this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value);
      if (!this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000004') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      print(
          printParameter.prinType,  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
          printParameter.actionUrl,
          {
              // billtype: printParameter.billtype,  //单据类型
              // funcode: printParameter.funcode, //功能节点编码，即模板编码
              // nodekey: printParameter.nodekey,     //模板节点标识
              // printTemplateID: printParameter.printTemplateID, //模板id
              oids: [this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value]
          }
      );
      break;
    //输出      
    case 'OutPut':
        if (!this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value) {
            toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000004') });/* 国际化处理： 操作失败，无数据!*/
            return;
        }
        this.refs.printOutput.open();
        this.setState(
            {
                outputData: {
                    funcode: printParameter.funcode, //功能节点编码，即模板编码
                    nodekey: printParameter.nodekey, //模板节点标识
                    printTemplateID: printParameter.print_templateid, //模板id
                    oids: [this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value],
                    outputType: 'output'
                }//打印输出使
            },
            () => {
               this.refs.printOutput.open();
            }
        );
    break;
    //计划预算
    case 'LinkNtbPlan':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_allocateagree_h').value) {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000004') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      let pk_allocateagree_h = this.props.form.getFormItemsValue(this.formId, 'pk_allocateagree_h').value;
      let data = {
        pk: pk_allocateagree_h,
        pageid: card_page_id
      };
      ajax({
        url: base_url + 'alloagreelinkplan.do',
        data: data,
        success: (res) => {
          if (res.data) {
            this.setState({
              sourceData: res.data,
              show: true
            });
          }
        }
      });
      break;      
    //来源单据
    case 'LinkSourceBill':
      //let pk_srcbill = checkeddata[0].data.values.pk_srcbill.value;
      let srcbillcode = this.props.form.getFormItemsValue(card_from_id, 'pk_srcbill').value
      let urlExtParam = {};
      urlExtParam = {
          status: 'browse',
          srcbillid: [srcbillcode],
          linkquerytype: 'LinkQuery_Apply_B',//4
      };
      linkApp(props, '36K1', urlExtParam);
      break;  
    //下拨单据
    case 'LinkAllocate':
      let srcbilltype=this.props.form.getFormItemsValue(card_from_id,['vbillno'])[0].value;//来源单据类型
      debugger
      urlExtParam = {
        status: 'browse',
        srcbillid: [srcbilltype],
        linkquerytype: '5',//4
      };
      linkApp(props,'36K2',urlExtParam);
      break;
    case 'LinkInnerAcc':
      if (!checkeddata || checkeddata.length != 1) {
        toast({ content: loadMultiLang(props,'36320FAA-000030'), color: 'warning' });/* 国际化处理： 请选择一行表体进行操作!*/
        return;
      }
      let currAccid = checkeddata[0].data.values.pk_accid.value;
      if (currAccid) {
        this.setState({ showInnerAccount: true, currAccid });
      } else {
        toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000031') });/* 国际化处理： 找不到付款账户！*/
      }
      break;
    case 'LinkBankAccR'://收款账号
      let bankaccbalance_rarr = [];
      let restpk_org_r, pk_bankacc_r;
      // pk_bankacc_r = LinkBankAccount.call(this, props, card_table_id, 'pk_bankacc_r');
      if (checkeddata.length > 0) {
          restpk_org_r = checkeddata[0].data.values.pk_financeorg_r.value;
      }else{
          toast({ content: loadMultiLang(props,'36320FAA-000030'), color: 'warning' });/* 国际化处理： 请选择一行表体进行操作!*/
          return;
      }
      if (checkAllCardDate.length > 1) {
        if (!checkeddata || checkeddata.length != 1) {
          toast({ content: loadMultiLang(props,'36320FAA-000030'), color: 'warning' });/* 国际化处理： 请选择一行表体进行操作!*/
          return;
        }else{
          //处理选择数据
          checkeddata.forEach((val) => {
            if (val.data.values.pk_bankacc_r
                && val.data.values.pk_bankacc_r.value) {
                pk_bankacc_r = val.data.values.pk_bankacc_r.value;
            }
            let bankaccbalance_rdata = {
                // 财务组织
                pk_org: restpk_org_r,
                // 银行账户id
                pk_account: pk_bankacc_r,
            };
            bankaccbalance_rarr.push(bankaccbalance_rdata);
        });
        }

      }else{
        if (checkAllCardDate[0].values.pk_bankacc_r
          && checkAllCardDate[0].values.pk_bankacc_r.value) {
          pk_bankacc_r = checkAllCardDate[0].values.pk_bankacc_r.value;
        }
        let bankaccbalance_rdata = {
            // 财务组织
            pk_org: restpk_org_r,
            // 银行账户id
            pk_account: pk_bankacc_r,
        };
        bankaccbalance_rarr.push(bankaccbalance_rdata);
      }
      this.setState({
        showOriginalData: bankaccbalance_rarr,
        showOriginal: true,
      });
      break;
    //付款账户
    case 'LinkBankAccP':
      let bankaccbalance_parr = [];
      let paymentAccountAllrows = props.cardTable.getAllRows(card_table_id);
      let paymentAccountSelectrow = props.cardTable.getCheckedRows(card_table_id);
      if(paymentAccountAllrows.length > 1){
        if (paymentAccountSelectrow.length != 1) {
          toast({ color: 'warning', content: loadMultiLang(props,'36320FA_PAY-000001')})/* 国际化处理： 请选择一条表体数据操作*/
          return;
        }else{
          //处理选择数据
          paymentAccountSelectrow.forEach((val) => {
            //处理选择数据
            let restpk_org_p, pk_bankacc_p;
            if (val.data.values.pk_org 
              && val.data.values.pk_org.value) {
              restpk_org_p = val.data.values.pk_org.value;
            }
            if (val.data.values.pk_bankacc_p 
              && val.data.values.pk_bankacc_p.value) {
                pk_bankacc_p = val.data.values.pk_bankacc_p.value;
            }
            let bankaccbalance_pdata = {
              // 财务组织
              pk_org: restpk_org_p,
              // 银行账户id
              pk_account: pk_bankacc_p,
            };
            bankaccbalance_parr.push(bankaccbalance_pdata);
          });
        }
      }else{
        //处理选择数据
        let restpk_org_p, pk_bankacc_p;
        if (paymentAccountAllrows[0].values.pk_org 
          && paymentAccountAllrows[0].values.pk_org.value) {
          restpk_org_p = paymentAccountAllrows[0].values.pk_org.value;
        }
        if (paymentAccountAllrows[0].values.pk_bankacc_p 
          && paymentAccountAllrows[0].values.pk_bankacc_p.value) {
            pk_bankacc_p = paymentAccountAllrows[0].values.pk_bankacc_p.value;
        }

        let bankaccbalance_pdata = {
          // 财务组织
          pk_org: restpk_org_p,
          // 银行账户id
          pk_account: pk_bankacc_p,
        };
        bankaccbalance_parr.push(bankaccbalance_pdata);
      }

      this.setState({
        showOriginalData: bankaccbalance_parr,
        showOriginal: true,
      });
    break;
    case 'ApproveMsg':
      let pk_allocateagreeh = this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value;
      if (pk_allocateagreeh) {
          this.setState({
              showApprove: true,
              approveBilltype: '36K7',//单据类型
              approveBillId: pk_allocateagreeh//单据pk
          });
      } 
      break;
		//游览态 展开收起
		case 'opendown':
			break;
		//收起
		case 'closedown':
			props.cardTable.toggleRowView(card_table_id, record);
			break;      
    default:
      break
  }
}


/**
 * 银行账户联查
 * @param {*} props 
 * @param {*} tableId 
 * @param {*} key 
 */
const LinkBankAccount = function (props, tableId, key) {
  let checkBodyDate = this.props.cardTable.getCheckedRows(tableId);
  if (!checkBodyDate || checkBodyDate.length == 0) {
    toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000032') });/* 国际化处理： 请选择表体行！*/
    return;
  }
  if (checkBodyDate && checkBodyDate.length > 1) {
    toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000033') });/* 国际化处理： 请选择一行表体！*/
    return;
  }
  let bankaccount = checkBodyDate[0].data.values[key].value;
  return bankaccount;
}

/**
 * 获取数据的公共方法
 */
function getrequestdata(props) {

 // cardOperator(props, card_page_id, card_from_id, 'pk_allocateagree_h', base_url + 'alloagreeuncommit.do', '收回成功！', this.toggleShow.bind(this));
  //props, pageCode, headCode, pkName, url, successMess, refreshFunc

  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value;
  let ts = props.form.getFormItemsValue(card_from_id, 'ts').value;
  pkMapTs[pk] = ts;


  let data = {
    //主键pk与时间戳ts的映射
    pkMapTs:pkMapTs,
    //页面编码
    pageCode:card_page_id,
    //是否返回数据
    isRet: true
  }; 
  //自定义请求数据
 // let data = {
  //    pks: dataArr,
   //   pkMapTs: pkMapTs
  //};
  return data;
}

/**
 * 
 * @param {*} record 
 * @param {*} props 
 * @param {*} pkMapTs 
 * @param {*} pk 
 */
export const billBack = function (props,pkMapTs,pk,ts,extParam){
  //let {deleteCacheId} = props.table;
  ajax({
      url: '/nccloud/sf/allocation/alloagreeback.do',
      data: {
          pks: [pk],
          ts: ts,
          pkMapTs:pkMapTs,
          pageCode:card_page_id,
          extParam,
      },
      success: (res) => {
          //删除成功后, 调用该方法删除缓存中对应id
          /*
          * list_table_id：表格区域编码
          * pk:数据主键的值
          */
          //deleteCacheId(card_table_id,pk);
          if (res.success) {
              let { getNextId, deleteCacheById } = cardCache;    
              //删除成功！
              let id = props.getUrlParam("id");
              //根据当前id,获取下个id
              /*
              * id：数据主键的值
              * AllocateAgreeCache: 缓存数据命名空间
              */
              let nextId = getNextId(id, AllocateAgreeCache);
              //调用删除缓存数据方法
              /*
              * idname: 数据主键的命名
              * id：数据主键的值
              * AllocateAgreeCache: 缓存数据命名空间
              */
              deleteCacheById('pk_allocateagree_h', id, AllocateAgreeCache);
              this.setState({ showReBack: false});
              toast({ color: 'success', content: loadMultiLang(props,'36320FAA-000005') });/* 国际化处理： 退回成功*/
              props.pushTo('/card', {
                status: 'browse',
                id: nextId ? nextId : '',
              });     
              this.refresh();
          }
      }
  });
}



export const cardCreateAllocate = function (that,props, pageCode, headCode, bodyCodeArr, pkName, url, successMess, datasource, bodyPKs, extParam) {
  let pkMapTs = {};
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value;
  let ts = props.form.getFormItemsValue(card_from_id, 'ts').value;
  pkMapTs[pk] = ts;
  if (!extParam) {
      extParam = {};
  }
  ajax({
      url,
      data: {
          //主键pk与时间戳ts的映射
          pkMapTs,
          //页面编码
          pageCode,
          //是否返回数据
          isRet: true,
          bodyPKs,
          extParam
      },
      success: (res) => {
          let { success, data } = res;
          if (success) {
              let { head, body } = data;
              if (data) {
                  if (head && head[headCode] && head[headCode].rows && head[headCode].rows[0]) {
                      let row = head[headCode].rows[0];
                      let pk = row && row.values && row.values[pkName] && row.values[pkName].value;
                      let status = props.getUrlParam('status');
                      if (status == 'add') {
                          cardCache.addCache(pk, data, headCode, datasource);
                      } else {
                          cardCache.updateCache(pkName, pk, data, headCode, datasource);
                      }
                  }
                  //更新表头
                  if (head) {
                      props.form.setAllFormValue({ [headCode]: head[headCode] });
                  }
                  //更新表体
                  if (body && bodyCodeArr && bodyCodeArr.length > 0) {
                      for (let bodyCode of bodyCodeArr) {
                          let bodyData = body[bodyCode];
                          if (!bodyData) {
                              continue;
                          }
                          props.cardTable.setTableData(bodyCode, bodyData);
                      }
                  }
              }
              that.toggleShow(),
              toast({ color: 'success', content: successMess });
              props.button.setMainButton(['CreateAllocate'],false);
              that.refresh();
          }
      }
  });
}

//退回确认
export const backConfirm = (props,value) => {
  if(!value) {
      toast({ color: 'warning', content: loadMultiLang(props,'36320FAA-000006') });/* 国际化处理： 退回原因必输！*/
      return;
  }
  //listMultiOperator(props, list_page_id, list_table_id, 'pk_allocateag_h', base_url + 'allocateback.do', '退回成功！', dataSource,{returnnote: value});
  let pk = props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h').value;
  let ts = props.form.getFormItemsValue(card_from_id, 'ts').value;
  let pkMapTs = {};
  if (pk && ts) {
    pkMapTs[pk] = ts;
  }
  ajax({
      url: base_url+'alloabackedit.do',
      data: {
          pkMapTs,
          pageCode:card_page_id,
      },
      success: (res) => {
          if (res) {
            //beforeLinkOfList(props);
            //数据权限校验通过
            billBack.call(that, props,pkMapTs,pk,ts,{retbillreason:value});
          }
      }
  })
}


/**
 * 提交指派
 * @param {*} props 
 * @param {*} data 
 */
const commitAssign = function (props, data) {
  let { workflow } = data;
  console.log(workflow);
  //有指派信息，则指派，没有则重绘界面
  if (workflow && workflow == 'approveflow' || workflow == 'workflow') {
      that.setState({ assignData: data, assignShow: data });
  } else {
    that.props.setUrlParam({
      status: 'browse'
    });
    that.qryData();
  }
}


	//保存单据
  const saveBill = async function(props,callback){
		//过滤表格空行
		//this.props.cardTable.filterEmptyRows(this.tableId);
		let flag = this.props.form.isCheckNow(this.formId);
		let CardData;
		if (flag) {
      //重设rowno
		  resetBodysRowno(this.props);
			CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
		}else{
      return;
    }
		let result = await Sign({ isSign: true, isKey: true, data: CardData, encryptVOClassName: 'nccloud.web.sf.allocation.allocateagree.vo.AllocateAgreeEncryptVO4NCC',isSource:true });
		if (result.isStop) {
			return;
		}
		let savecommitBeforePk = this.props.form.getFormItemsValue(card_from_id, 'pk_allocateagree_h');
		CardData = result.data;
		if(CardData && CardData.body){
			for(let i=0;i<CardData.body.allocateagree_b.rows.length;i++){
				let pk_bankacc = CardData.body.allocateagree_b.rows[i].values.pk_bankacc_p.value;
				//let pk_bankacc_display = CardData.body.allocateagree_b.rows[i].values.pk_bankacc_p.display;
				//this.props.cardTable.setValByKeyAndIndex(card_table_id,i,'pk_bankacc_p',{value :pk_bankacc_display,display :pk_bankacc});
				if(pk_bankacc == null || pk_bankacc == ''){
					toast({ color: 'warning', content: loadMultiLang(this.props,'36320FAA-000047') });
					return;
				}
				let bankname_p = CardData.body.allocateagree_b.rows[0].values.bankname_p.value;
				if(bankname_p == null || bankname_p == ''){
					toast({ color: 'warning', content: loadMultiLang(this.props,'36320FAA-000048') });
					return;
				}
				let isagree = CardData.body.allocateagree_b.rows[0].values.isagree.value;
				if(isagree == null || isagree == ''){
					toast({ color: 'warning', content: loadMultiLang(this.props,'36320FAA-000049')  });
					return;
				}
				let agreeamount = CardData.body.allocateagree_b.rows[0].values.agreeamount.value;
				if(agreeamount==null || agreeamount==''){
					toast({ color: 'warning', content: loadMultiLang(this.props,'36320FAA-000050')  });
					return;
				}
			}
		}else{
			toast({ color: 'warning', content: loadMultiLang(this.props,'36320FAA-000008') });/* 国际化处理： CA签名返回数据格式错误*/
			return;
		}
		let status = this.props.getUrlParam('status');
	//	let url = '/nccloud/sf/allocation/alloagreesavecommit.do'; //新增保存
		//if ( (status === 'edit' || status == viewmod_agree) && Saveflag === false ) {
		let	url = '/nccloud/sf/allocation/alloagreeupdate.do'; //修改保存
  //	}
		CardData = {
			...CardData,
			pageid: card_page_id
		};
		console.log("cardData", JSON.stringify(CardData));
		ajax({
			url: url,
			data: CardData,
			// majfd 后端保存格式改变，前端相应修改  majfd
			//data: { data: JSON.stringify(CardData), pageCode: card_page_id },
			success: (res) => {
				let pk_allocateagree_h = null;
				let { updateCache } = cardCache;
				let { data } = res;
				if (res.success) {
					if (res.data) {
            let hasTbbMsg = showTBBMsg(res.data.head, this.formId);
							if (!hasTbbMsg) {
								toast({ color: 'success', content: loadMultiLang(props,'36320FAA-000017') });/* 国际化处理： 保存成功*/
							}
						if(data.returnMsg && data.returnMsg.workflow && 
							(data.returnMsg.workflow == 'approveflow'|| data.returnMsg.workflow == 'workflow' )){
							if(savecommitBeforePk && savecommitBeforePk.value){

							}else{
								if(data.billCard && data.billCard.head){
									props.form.setAllFormValue({ [card_from_id]: data.billCard.head[card_from_id] });
								}
							}
						}else{
							//toast({ color: 'success', content: this.props.MutiInit.getIntl("36320FAA") && this.props.MutiInit.getIntl("36320FAA").get('36320FAA-000017') });/* 国际化处理： 保存成功*/
							/*
							* idname: 数据主键的命名
							* id：数据主键的值
							* headAreacode: 卡片表头的区域编码
							* dataSource: 缓存数据命名空间
							*/
							updateCache('pk_allocateagree_h', this.tableId, res.data, this.formId, AllocateAgreeCache);
	
							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_allocateagree_h = res.data.head[this.formId].rows[0].values.pk_allocateagree_h.value;
							}
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
							if (pk_allocateagree_h) {
								let idObj = {};
								idObj.id = pk_allocateagree_h;
								if (url === '/nccloud/sf/allocation/alloagreesavecommit.do') {
									idObj.status = 2;
								}
								this.props.cardPagination.setCardPaginationId(idObj)//暴露出最新的id值
							}
						}
					}
        }
        if (callback) {
            callback(props, data);
        } else {
          this.props.pushTo('/card', {
            status: 'browse',
            id: pk_allocateagree_h
          });
          this.props.button.setMainButton(['Commit'],true);
          this.props.button.setMainButton(['Agree'],false);
          //orgVersionView(props,card_from_id,pk_org);
          this.refresh();
        }
			}
		});
		//}
	};

/*Hm9gUKDDwtNjV7Mk8onAztupoRAb7fkAHSA8w/EPG33YwlX9OviyY1kg6Ku7Xf4n*/