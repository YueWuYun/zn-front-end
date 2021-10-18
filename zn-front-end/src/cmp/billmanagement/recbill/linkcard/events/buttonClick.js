/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, toast, cacheTools, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证
import { imageScan, imageView } from 'sscrp/rppub/components/image';

export default function (props, id) {

  let org_val = props.form.getFormItemsValue(this.formId, 'pk_org').value;
  let org_display = props.form.getFormItemsValue(this.formId, 'pk_org').display;
  //联查协同单据
  let synbill_src = Templatedata.synbill_paybillsrc;
  let synbill_key = Templatedata.synbill_cachekey;
  let synbill_paybillcode = Templatedata.synbill_paybillcode;
  let synbill_paybillappid = Templatedata.synbill_paybillappid;
  let synbill_pagecode = Templatedata.synbill_pagecode;
  //联查凭证
  let voucher_billtype = Templatedata.voucher_billtype;
  //打印
  let printcard_nodekey = Templatedata.printcard_nodekey;
  //审批意见
  let approve_billtype = Templatedata.approve_billtype;
  //联查单据
  let billtrack_billtype = Templatedata.billtrack_billtype;

  switch (id) {
    case 'save':
      this.saveBill();
      break;

    case 'edit':
      props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
        status: 'edit',
        id: props.getUrlParam('id'),
        pagecode: this.pageId
      })
      this.toggleShow()
      break;

    case 'copy':
      props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
        status: 'edit',
        id: props.getUrlParam('id'),
        copyFlag: 'copy',
        pagecode: this.pageId
      })
      this.toggleShow()
      break;

    case 'delete':
      this.props.modal.show('delete');
      break;

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
      break;

    case 'cancelApproveBtn': // 取消审批
      this.approve('UNAPPROVE');
      break;

    case 'back':
      props.linkTo('/cmp/billmanagement/recbill/linklist/index.html')
      break;

    //取消操作
    case 'cancelBtn':
      if (props.getUrlParam('status') === 'edit') {
        // 表单返回上一次的值
        props.form.cancel(this.formId)
        // 表格返回上一次的值
        props.linkTo('/cmp/billmanagement/recbill/linklist/index.html', {
        })
        this.toggleShow()
      }
      //保存中的取消操作
      if (props.getUrlParam('status') === 'add') {
        props.linkTo('/cmp/billmanagement/recbill/linklist/index.html');
      }
      //复制中的取消操作
      if (props.getUrlParam('status') === 'copy') {
        props.linkTo('/cmp/billmanagement/recbill/linklist/index.html');
      }
      //浏览查询详情
      if (props.getUrlParam('status') === 'browse') {
        props.linkTo('/cmp/billmanagement/recbill/linklist/index.html');
      }
      break;

    case 'addline':
      props.cardTable.addRow(this.tableId);
      break;

    case 'delline':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break;

    case 'addline2':
      props.cardTable.addRow(this.tableId2)
      break;

    case 'delline2':
      let currRows2 = props.cardTable.getCheckedRows(this.tableId2);
      let currSelect2 = [];
      if (currRows2 && currRows2.length > 0) {
        for (let item of currRows2) {
          currSelect2.push(item.index);
        }
      }
      props.cardTable.delRowsByIndex(this.tableId2, currSelect2);
      break;

    case 'add':
      props.cardTable.addRow(this.tableId);
      break;

    //保存
    case 'saveBtn':
      this.saveBill();
      break;

    //保存新增
    case 'saveaddBtn':

      let CardData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
      let flag = props.form.isCheckNow(this.formId);
      let sa_tableflag = props.cardTable.getCheckedRows(this.tableId);
      let sendurl = '/nccloud/cmp/recbill/recbillinsert.do'//新增保存新增
      if (props.getUrlParam('status') === 'edit') {
        sendurl = '/nccloud/cmp/recbill/recbillupdate.do'//修改保存提交
      }
      if (flag && sa_tableflag) {
        ajax({
          url: sendurl,
          data: CardData,
          success: (res) => {
            let pk_paybill = null;
            if (res.success) {
              if (res.data) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000001') });/* 国际化处理： 保存成功*/
                props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
                  status: 'add',
                  pagecode: this.pageId
                })
                this.componentDidMount();
              }
            }

          }
        });
      }

      break;

    //保存提交
    case 'savesubmitBtn':

      let url = '/nccloud/cmp/recbill/recbillsavesubmit.do'//新增保存提交
      if (props.getUrlParam('status') === 'edit') {
        url = '/nccloud/cmp/recbill/recbilleditsubmit.do'//修改保存提交
      }
      let savesubmitBtnData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
      let savesubmitBtnflag = props.form.isCheckNow(this.formId);
      if (savesubmitBtnflag) {
        ajax({
          url: url,
          data: savesubmitBtnData,
          success: (res) => {
            let pk_paybill = null;
            if (res.success) {
              if (res.data) {
                toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000002') });/* 国际化处理： 保存提交成功*/
                let ssub_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
                let ssub_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
                // window.location.href = "/cmp/billmanagement/recbill/card#status=browse&id=" + ssub_pk_recbill + "&billno=" + ssub_billstatue;
                props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
                  status: 'browse',
                  id: ssub_pk_recbill,
                  billno: ssub_billstatue,
                  pagecode: this.pageId
                })
                this.componentDidMount();
              }
            }

          }
        });
      }

      break;

    //附件
    case 'annexBtn':
      let pk_rec_2 = props.form.getFormItemsValue(this.formId, 'pk_recbill').value;;//单据pk
      let bill_no_2 = props.form.getFormItemsValue(this.formId, 'bill_no').value;;//单据编号
      if (!pk_rec_2) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      this.setState({
        billId: pk_rec_2,//单据pk
        billno: bill_no_2,//附件管理使用单据编号
        showUploader: !this.state.showUploader,
        target: null
      })
      break;

    //body新增
    case 'addbodyBtn':

      if (org_val && org_display) {

        props.cardTable.addRow(this.tableId);
        //根据表头数据给新增表体数据赋值
        let keyArr = ['pk_currtype', 'pk_balatype', 'pk_account', 'rec_primal', 'note_type',
          'mon_account', 'note_no', 'mon_account', 'local_rate', 'rec_local', 'objecttype', 'pk_customer'];
        keyArr.forEach((val) => {
          let key = val;
          if (props.form.getFormItemsValue(this.formId, key)) {
            let value = props.form.getFormItemsValue(this.formId, key).value;
            let dly = props.form.getFormItemsValue(this.formId, key).display;
            if (value) {
              let rownum = props.cardTable.getNumberOfRows(this.tableId);//表格行数
              props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, key, { value: value, display: dly });//给表体字段赋值
              if (key == 'local_rate') {
                //设置本币汇率的编辑性
                let isEdit = props.form.getFormItemsDisabled(this.formId, key);
                if (!isEdit) {
                  props.cardTable.setEditableByIndex(this.tableId, rownum - 1, 'local_rate', true);//可以编辑
                }

              }
            }
          }
        });

      } else {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
      }

      break;

    //body删除
    case 'deletebodyBtn':

      if (org_val && org_display) {
        let currRows = props.cardTable.getCheckedRows(this.tableId);
        let currSelect = [];
        if (currRows && currRows.length > 0) {
          for (let item of currRows) {
            currSelect.push(item.index);
          }
        }
        if (currSelect.length == 0) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000065') });/* 国际化处理： 未选择数据!*/
          return;
        }
        props.cardTable.delRowsByIndex(this.tableId, currSelect);
      } else {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
      }


      break;

    //body复制
    case 'copybodyBtn':

      if (org_val && org_display) {

        let currRows3 = props.cardTable.getCheckedRows(this.tableId);
        let currSelect3 = [];
        if (currRows3 && currRows3.length > 0) {
          for (let item of currRows3) {
            currSelect3.push(item.index);
          }
        }
        if (currSelect3.length == 0) {
          toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000065') });/* 国际化处理： 未选择数据!*/
          return;
        }
        currSelect3.forEach((val) => {
          //循环在最低行复制
          props.cardTable.pasteRow(this.tableId, val);

        });
      } else {
        toast({
          'color': 'warning',
          'content': this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
      }

      break;
    //head新增
    case 'addBtn':
      props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
        status: 'add',
        pagecode: this.pageId
      })
      this.componentDidMount();
      break;

    //head修改
    case 'editBtn':
      props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
        status: 'edit',
        id: props.getUrlParam('id'),
        pagecode: this.pageId
      })
      this.componentDidMount();
      break;

    case 'deleteBtn':
      this.props.modal.show('delete');
      break;

    case 'copyBtn':
      props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
        status: 'copy',
        id: props.getUrlParam('id'),
        pagecode: this.pageId
      })
      this.componentDidMount();
      break;

    //提交
    case 'subimtBtn':
      let submitdataArr = [];
      submitdataArr.push(props.getUrlParam('id'));
      let subimtBtnData = {
        'pks': submitdataArr,
        'pageid': this.pageId
      };
      ajax({
        url: '/nccloud/cmp/recbill/recbillsubmit.do',
        data: subimtBtnData,
        success: (res) => {
          toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000009') });/* 国际化处理： 提交成功*/

          let sub_pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
          let sub_billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
          // window.location.href = "/cmp/billmanagement/recbill/card#status=browse&id=" + sub_pk_recbill + "&billno=" + sub_billstatue;
          props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
            status: 'browse',
            id: sub_pk_recbill,
            billno: sub_billstatue,
            pagecode: this.pageId
          })
          this.componentDidMount();
        }

      });

      break;

    //收回
    case 'unsubmitBtn':
      let unsubmitBtndataArr = [];
      unsubmitBtndataArr.push(props.getUrlParam('id'));
      let unsubmitBtnData = {
        'pks': unsubmitBtndataArr,
        'pageid': this.pageId
      };
      ajax({
        url: '/nccloud/cmp/recbill/recbillunsubmit.do',
        data: unsubmitBtnData,
        success: (res) => {
          toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000010') });/* 国际化处理： 收回成功*/

          let pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
          let billstatue = res.data.head[this.formId].rows[0].values.bill_status.value;
          props.linkTo('/cmp/billmanagement/recbill/linkcard/index.html', {
            status: 'browse',
            id: pk_recbill,
            billno: billstatue,
            pagecode: this.pageId
          })
          this.componentDidMount();
        }

      });
      break;

    case 'rectradetypeBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break;

    //红冲
    case 'redbillBtn':

      let pk = props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
      let reddata = { pk: pk, pageid: this.pageId };

      ajax({
        url: '/nccloud/cmp/recbill/recbillredhandle.do',
        data: reddata,
        success: (res) => {
          if (res.data) {
            if (res.data.head) {
              let message = this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000012') + res.data.head[this.formId].rows[0].values.bill_no.value;;/* 国际化处理： 红冲成功!单据编号:*/
              toast({ color: 'success', content: message });
              props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });

            }
            if (res.data.body) {
              props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
            }
          } else {
            props.form.setAllFormValue({ [this.formId]: { rows: [] } });
            props.cardTable.setTableData(this.tableId, { rows: [] });

          }
          if (props.getUrlParam('status') === 'edit') {
            //设置组织不可以编辑
            props.form.setFormItemsDisabled(this.formId, { 'pk_org': true });
          }
        }
      });

      break;
    case 'linksettleBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break;
    //影像查看
    case 'imageviewBtn':
      let billShowInfoMap = {};
      let openShowbillid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
      if (!openShowbillid) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
      }
      billShowInfoMap['pk_billid'] = openShowbillid;
      billShowInfoMap['pk_billtype'] = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
      billShowInfoMap['pk_tradetype'] = this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
      billShowInfoMap['pk_org'] = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
      //查询数据
      imageView(billShowInfoMap, 'iweb');
      break;
    //影像扫描
    case 'imagescanBtn':
      let ScanData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
      let openbillid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
      if (!openbillid) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
      }
      let billInfoMap = {};
      billInfoMap['pk_billid'] = openbillid;
      billInfoMap['pk_billtype'] = ScanData.head[this.formId].rows[0].values.bill_type.value;
      billInfoMap['pk_tradetype'] = ScanData.head[this.formId].rows[0].values.trade_type.value;;
      billInfoMap['pk_org'] = ScanData.head[this.formId].rows[0].values.pk_org.value;;
      billInfoMap['BillType'] = ScanData.head[this.formId].rows[0].values.bill_type.value;
      billInfoMap['BillDate'] = ScanData.head[this.formId].rows[0].values.creationtime.value;
      billInfoMap['Busi_Serial_No'] = ScanData.head[this.formId].rows[0].values.pk_recbill.value;
      billInfoMap['OrgNo'] = ScanData.head[this.formId].rows[0].values.pk_org.value;
      billInfoMap['BillCode'] = ScanData.head[this.formId].rows[0].values.bill_no.value;
      billInfoMap['OrgName'] = ScanData.head[this.formId].rows[0].values.pk_org.value;
      billInfoMap['Cash'] = ScanData.head[this.formId].rows[0].values.primal_money.value;
      imageScan(billInfoMap, 'iweb');
      break;

    //制单
    case 'makebillBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break;

    //打印
    case 'printBtn':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/recbill/recbillprintcard.do',
        {
          nodekey: printcard_nodekey,     //模板节点标识：单据模版初始化
          appcode: props.getSearchParam('c'),
          oids: [this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value]
        }
      );
      break;

    //预览
    case 'viewBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break;

    //输出
    case 'outputBtn':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      let pks = [];
      pks.push(this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value);
      output({
        url: '/nccloud/cmp/recbill/recbillprintcard.do',
        data: {
          nodekey: printcard_nodekey,
          appcode: props.getSearchParam('c'),
          oids: pks,
          outputType: 'output'
        }
      });
      break;

    //打印清单
    case 'printDetailBtn':
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000011') });/* 国际化处理： 功能待开发*/
      break;

    //联查单据  
    case 'linkquerybillBtn':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }

      let showbilltrackpk = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
      if (this.props.form.getFormItemsValue(this.formId, 'bill_type').value) {
        billtrack_billtype = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
      }
      if (showbilltrackpk) {
        this.setState({
          showbilltrack: true,//显示联查单据
          showbilltracktype: billtrack_billtype,//单据类型
          showbilltrackpk: showbilltrackpk//单据pk
        });
      }
      break;

    //查看审批意见 
    case 'querymsgBtn':
      if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      let billid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
      if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
        approve_billtype = this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
      }

      if (billid) {
        this.setState({
          show: true,
          billtype: approve_billtype,//单据类型
          billid: billid//单据pk
        });
      }
      break;

    //联查凭证   
    case 'queryvoucherBtn':

      if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
        voucher_billtype = props.form.getFormItemsValue(this.formId, 'trade_type').value;
      }
      linkVoucherApp(
        this.props,
        this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
        voucher_billtype,
        this.props.form.getFormItemsValue(this.formId, 'bill_no').value,
      );
      break;
    //联查计划预算 
    case 'queryconsumeBtn':
      if (!props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000014') });/* 国际化处理： 无数据，无法进行操作!*/
        return;
      }
      let queryconsume_pk = props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
      console.log(queryconsume_pk);
      let queryconsume_data = { pk: queryconsume_pk, pageid: this.pageId };
      console.log(queryconsume_data);
      ajax({
        url: '/nccloud/cmp/recbill/linkplan.do',
        data: queryconsume_data,
        success: (res) => {
          let { success, data } = res;
          if (res.data) {
            if (res.data.hint && res.data.hint.length > 0) {
              toast({ color: 'warning', content: res.data.hint });
              return;
            } else {
              this.setState({
                showInspection: true,
                sourceData: res.data
              });
            }

          }
        }
      });
      break;

    //联查协同单据
    case 'querysynbillBtn':

      let query_pk = props.form.getFormItemsValue(this.formId, 'pk_recbill').value;

      console.log(query_pk, 'pk_recbill');

      if (!query_pk) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
      }
      let querysynbillBtndata = { pk: query_pk, pageid: this.pageId };
      ajax({
        url: '/nccloud/cmp/recbill/recbillquerycard.do',
        data: querysynbillBtndata,
        success: (res) => {
          if (res.data) {
            if (res.data.head) {

              //联查pk
              let pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
              let pk_upbill = res.data.head[this.formId].rows[0].values.pk_upbill.value;

              let querysynbillArr = [];

              if (pk_recbill) {
                querysynbillArr.push(pk_recbill);//主键
              }
              if (pk_upbill) {
                querysynbillArr.push(pk_upbill);//上游主键
              }
              /**
               * 优先查询是否存在协同单据，不存在直接报错
               */
              let confirmdate = {
                pks: querysynbillArr
              }
              ajax({
                url: '/nccloud/cmp/recbill/linkbillconfirm.do',
                data: confirmdate,
                success: (res) => {
                  let { success, data } = res;
                  if (success) {
                    //联查付款结算单
                    cacheTools.set(synbill_key, querysynbillArr);

                    let querysynbillBtn_appOption = {
                      code: synbill_paybillcode,
                      name: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000015'),/* 国际化处理： 付款结算管理*/
                      pk_appregister: synbill_paybillappid
                    };
                    let querysynbillBtn_type = {
                      type: null
                    };
                    let querysynbillBtn_query = {
                      status: 'browse',
                      src: synbill_src,
                      callback: '1'
                    }
                    props.openTo('/cmp/billmanagement/paybill/linkcard/index.html',
                      {
                        appcode: synbill_paybillcode,
                        pagecode: synbill_pagecode,
                        status: 'browse',
                        src: synbill_src,
                        name: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000016'),/* 国际化处理： 付款结算联查*/
                      });
                  }
                }
              });


            }

          }
        }
      });
      break;

    //附件
    case 'cardannexBtn':
      let pk_rec = props.form.getFormItemsValue(this.formId, 'pk_recbill').value;;//单据pk
      let bill_no = props.form.getFormItemsValue(this.formId, 'bill_no').value;;//单据编号
      this.setState({
        billId: pk_rec,//单据pk
        billno: bill_no,//附件管理使用单据编号
        showUploader: !this.state.showUploader,
        target: null
      })
      break;
    default:
      break;
  }
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/