//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
//按钮点击事件
import {base,ajax,toast,print,getBusinessInfo,cardCache,output,printer,excelImportconfig} from 'nc-lightapp-front';
const{setDefData} = cardCache;
import manageModePlugIn from '../../../../../public/utils/ManageModeUtils';
import confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
import Utils from '../../../../../public/utils/index';
const {queryToastFunc} = Utils;
import BankaccuseModel from '../../../bankaccuse/index';
const {NCMessage} = base;
const ajaxurl ='/nccloud/uapbd/bankacc/baseAction.do';
const printurl = '/nccloud/uapbd/bankacc/mainPrint.do'


/**
 * 银行账户列表页按钮点击事件
 * @param props
 * @param id
 */
export default function onClickButton(props,id){
    let{searchId,gridId,NODE_TYPE,formId,appcode,pagecode} = props.config;
    let{PermissionOrgIDs} =this.state.context;
    let meta = props.meta.getMeta();
    //获取选中行数据
    let rowsdata  = props.table.getCheckedRows(gridId);
    let alldata = props.table.getAllTableData(gridId);
    let  pks = [];
    if(id!=='btnAdd'&&id!=='btnRefresh'&&id!=='btnPrint'&&id!=='print'&&id!=='output'&&id!=='import'&&id!=='export'&&id!='btnUpgrade'){
        if(rowsdata.length===0){
            NCMessage.create({content: this.state.json['10140BANKACC-000006'], color: 'info'});/* 国际化处理： 请选择数据操作！*/
            return;
        }else{
            //需要管控模式控制的按钮
            let manageModeBtn = ['btnEdit','btnDel','btnAdjust','btnCancellAcc','listEnable','listDisable'];
            if(manageModeBtn.includes(id)){
                let pk_org = rowsdata[0].data.values.pk_org.value;
                let pk_group = rowsdata[0].data.values.pk_group.value;
                let rem = manageModePlugIn.call(this,NODE_TYPE,pk_org,pk_group,PermissionOrgIDs,getBusinessInfo().groupId);
                if(!rem.editFlag){
                    toast({
                        color:'warning',
                        content:rem.message
                    });
                    return;
                }
            }
        }
    }
    let editurl = '/card';
    switch (id) {
        case 'btnAdd':
            props.pushTo(editurl,{
                status:'add',
                pagecode:props.config.pagecode_card,
                appcode:appcode,
                id:alldata.rows.length === 0 ?'':alldata.rows[alldata.rows.length-1].values.pk_bankaccbas.value
            });
            break;
        case 'btnDel':
            let cantdeleteArr = []
            rowsdata.map((ele,key)=>{
                if(ele.data.values.accstate.value === '3'){
                    cantdeleteArr.push(ele.data.values.pk_bankaccbas.value);
                }else{
                    pks.push(ele.data.values.pk_bankaccbas.value);
                }
            });
            if(cantdeleteArr.length!=0){
                toast({color:'warning',title:this.state.json['10140BANKACC-000080']});/* 国际化处理： 所选数据包括已经销户的账户,不允许删除！*/
                return;
            }
            pks.length !=0 && confirmUtil.call(this,{
                title:this.state.json['10140BANKACC-000097'],/* 国际化处理： 询问*/
                content:this.state.json['10140BANKACC-000081'],/* 国际化处理： 是否删除所选数据！*/
                beSureBtnClick:()=>{
                    confirmUtil.call(this,{
                        title:this.state.json['10140BANKACC-000036'],/* 国际化处理： 提示*/
                        content:this.state.json['10140BANKACC-000031'],/* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
                        beSureBtnClick:()=>{
                            ajax({
                                url:ajaxurl,
                                data:{
                                    pk_bankaccbas:pks,
                                    actionName:id
                                },
                                success:(res)=>{
                                    let{success,data} = res;
                                    if(success){
                                        if(data&&data.hasOwnProperty('message')&&data.message){
                                            toast({ color: 'warning', title: data.message});
                                        }else{
                                            toast({ color: 'success', title: this.state.json['10140BANKACC-000032']});/* 国际化处理： 删除成功！*/
                                            this.loadGridData(this.getLoadDataParam(props),()=>{
                                                this.props.button.setButtonDisabled(
                                                    ['btnDel', 'btnUpgrade', 'btnAdjust', 'btnCancellAcc', 'btnPrint', 'output',
                                                        'btnAuthorization', 'authorization', 'usufruct', 'unAuthorization', 'listEnable', 'listDisable'], true);
                                            });
                                        }
                                    }

                                }
                            });
                        }
                    });
                }
            });
            break;
        case'btnAdjust':
            if(rowsdata.length>1){
                toast({color:'warning',title:this.state.json['10140BANKACC-000082']});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            //设置财务组织参照过滤条件
            let financeorgItem = meta[formId].items.find(item=>item.attrcode = 'controlorg');
            financeorgItem.queryCondition =()=> {
                return {
                    pk_financeorg:rowsdata[0].data.values.controlorg.value,
                    TreeRefActionExt:'nccloud.web.uapbd.sminfo.bankacc.extendRef.ControlorgSqlBuilder'
                }
            }
            props.form.EmptyAllFormValue(formId);
            props.form.setFormStatus(formId,'add');
            props.modal.show('adjustForm',{
                beSureBtnClick:()=>{
                    //获取选中组织
                    let controlorgvalue = props.form.getFormItemsValue(formId,'controlorg');
                    if(!controlorgvalue.value){
                        toast({'color':'warning','title':this.state.json['10140BANKACC-000041']});/* 国际化处理： 请选择核算归属组织！*/
                        return;
                    }
                    confirmUtil.call(this,{
                        'title':this.state.json['10140BANKACC-000029'],/* 国际化处理： 询问*/
                        'content':this.state.json['10140BANKACC-000042'],/* 国际化处理： 是否同时停用修改前核算归属组织的使用权？*/
                        beSureBtnClick:()=>{
                            ajax({
                                url:ajaxurl,
                                data:{
                                    'pk_bankaccbas':[rowsdata[0].data.values.pk_bankaccbas.value],
                                    'newOrg':controlorgvalue.value,
                                    'enableswitch':true,
                                    'actionName':'btnAdjust'
                                },
                                success:(res)=>{
                                    let{success,data} = res;
                                    if(success){
                                        if(data && data.hasOwnProperty('message')){
                                            toast({'color':'warning','title':this.state.json['10140BANKACC-000091']});
                                        }else{
                                            toast({'color':'success','title':this.state.json['10140BANKACC-000001']});/* 国际化处理： 操作成功！*/
                                            //返回成功关闭模态框
                                            props.modal.close('adjustForm');
                                            this.loadGridData(this.getLoadDataParam(props),()=>{
                                                this.initializeButtons();
                                            });
                                        }

                                    }

                                }
                            });
                        },
                        cancelBtnClick:()=>{
                            ajax({
                                url:ajaxurl,
                                data:{
                                    'pk_bankaccbas':[rowsdata[0].data.values.pk_bankaccbas.value],
                                    'newOrg':controlorgvalue.value,
                                    'enableswitch':false,
                                    'actionName':'btnAdjust'
                                },
                                success:(res)=>{
                                    let{success,data} = res;
                                    if(success){
                                        if(data && data.hasOwnProperty('message')){
                                            toast({'color':'warning','title':this.state.json['10140BANKACC-000091']});
                                        }else{
                                            toast({'color':'success','title':this.state.json['10140BANKACC-000001']});/* 国际化处理： 操作成功！*/
                                            //返回成功关闭模态框
                                            props.modal.close('adjustForm');
                                            this.loadGridData(this.getLoadDataParam(props),()=>{
                                                this.initializeButtons();
                                            });
                                        }

                                    }
                                }
                            });

                        },
                        'leftBtnName':this.state.json['10140BANKACC-000004'],/* 国际化处理： 确定*/
                        'rightBtnName':this.state.json['10140BANKACC-000005'],/* 国际化处理： 取消*/
                    });
                },
                cancelBtnClick:()=>{
                    props.modal.close('adjustForm');
                }
            });

            break;
        case'btnCancellAcc':
            //销户
            if(rowsdata.length>1){
                toast({title: this.state.json['10140BANKACC-000082'], color: 'warning'});/* 国际化处理： 请选择一条数据操作！*/
                return;
            }
            confirmUtil.call(this,{
                title:this.state.json['10140BANKACC-000029'],/* 国际化处理： 询问*/
                content:this.state.json['10140BANKACC-000044'],/* 国际化处理： 是否确认销户？*/
                beSureBtnClick:()=>{
                    confirmUtil.call(this,{
                        'content':this.state.json['10140BANKACC-000045'],/* 国际化处理： 银行账户销户为不可逆行操作，是否确认销户？*/
                        'title':this.state.json['10140BANKACC-000029'],/* 国际化处理： 询问*/
                        beSureBtnClick:()=>{
                            ajax({
                                url:ajaxurl,
                                data:{
                                    pk_bankaccbas:[rowsdata[0].data.values.pk_bankaccbas.value],
                                    actionName:id
                                },
                                success:(res)=>{
                                    let{success,data} = res
                                    if(success){
                                        if(data&&data.hasOwnProperty('message')&&data.message){
                                            toast({'color':'warning','title':this.state.json['10140BANKACC-000090']});
                                        }else{
                                            toast({'color':'success','title':this.state.json['10140BANKACC-000046']});/* 国际化处理： 操作成功!*/
                                            this.loadGridData(this.getLoadDataParam(props),()=>{
                                                this.initializeButtons();
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });

            break;
        case'btnUpgrade':
            confirmUtil.call(this,{
                title:this.state.json['10140BANKACC-000015'],/* 国际化处理： 询问？*/
                content:this.state.json['10140BANKACC-000062'],/* 国际化处理： 是否确认升级？*/
                size:'lg',
                beSureBtnClick:()=>{
                    ajax({
                        url:ajaxurl,
                        data:{
                            pk_bankaccbas:[rowsdata[0].data.values.pk_bankaccbas.value],
                            actionName:id
                        },
                        success:(res)=>{
                            let{success,data} = res;
                            if(success){
                                if(data&&data.message){
                                    if(data.message == '000092'){
                                        toast({'color':'warning','title':this.state.json['10140BANKACC-000092']});
                                    }else{
                                        toast({'color':'warning','title':this.state.json['10140BANKACC-000093']});
                                    }
                                }else{
                                    toast({color:'success',title:this.state.json['10140BANKACC-000063']});/* 国际化处理： 升级成功！*/
                                    this.loadGridData(this.getLoadDataParam(props),()=>{
                                        this.initializeButtons();
                                    });
                                }
                            }
                        }
                    });
                }
            });
            break;
        case'btnAuthorization':
        //银行账户使用权授权
        case'authorization':
            this.accountGrantModal.show(true,true);
            break;
        case 'usufruct':  //usufruct unAuthorization
            //银行账户使用权查询
            props.button.setButtonVisible(['modalSave','modalCancel'],false);
            props.modal.show('checkOrg',{
                'title': this.state.json['10140BANKACC-000083'],/* 国际化处理： 银行账户列表使用权*/
                'content': <BankaccuseModel
                    {...this.props}
                    {...{currentPkbankaccbas:rowsdata[0].data.values.pk_bankaccbas.value,
                         json:this.state.json
                    }}/>,
                'size': 'lg',
                'noFooter': true
            });
            break;
        case 'unAuthorization':  //usufruct unAuthorization
            //银行账户使用权取消授权
            this.accountGrantModal.show(false,true);
            break;
        case 'btnRefresh':
            let searchVal = props.search.getAllSearchData(searchId);
            if( typeof (searchVal) !=='undefined'&&searchVal&&searchVal.conditions) {
                setDefData('searchVal',props.config.datasource,searchVal);
                this.loadGridData(this.getLoadDataParam(props),()=>{
                    queryToastFunc.call(this)();
                    this.initializeButtons();
                });
            }else{
                return;
            }
            break;
        case'btnPrint':
        case'print':
            if(alldata.rows.length===0){
                toast({'warning':'warning','title':this.state.json['10140BANKACC-000084']});/* 国际化处理： 请查询打印数据！*/
                return;
            }
            alldata.rows.forEach((item,index) => {
                pks.push(item.values.pk_bankaccbas.value);
            });
            var tableorder = this.props.table.getSortParam(gridId);
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                printurl,
                {
                    funcode: '10140BACCG',
                    nodekey:props.config.nodekey,
                    oids: pks,
                    userjson:`{order:${tableorder  && tableorder.sortParam[0].order},field:${tableorder  && tableorder.sortParam[0].field}}`,
                    appcode:'10140BACCG'
                }
            );
            break;
        case 'export':
            this.setState(this.state,()=>{
                this.props.modal.show('exportFileModal');
            });
            break;
        case'output':
            if(alldata.rows.length===0){
                toast({'color':'warning','title':this.state.json['10140BANKACC-000084']});/* 国际化处理： 请查询打印数据！*/
                return;
            }
            var outorder = this.props.table.getSortParam(gridId);
            alldata.rows.forEach((item,index) => {
                pks.push(item.values.pk_bankaccbas.value);
            });
            output({
                url:printurl,
                data:{
                    funcode: '10140BACCG',      //功能节点编码，即模板编码
                    nodekey:props.config.nodekey,
                    oids: pks,
                    userjson:`{order:${outorder  && outorder.sortParam[0].order},field:${outorder  && outorder.sortParam[0].field}}`,
                    outputType:'output'
                }
            });
            break;
        case'listEnable':
            confirmUtil.call(this,{
                title:this.state.json['10140BANKACC-000095'],/* 国际化处理： 启用*/
                content:this.state.json['10140BANKACC-000067'],/* 国际化处理： 是否确认要启用？*/
                beSureBtnClick:()=>{
                    let enablerowvaluesarr = [];
                    let enablerowvalues = {};
                    let pkarrenable = [];
                    rowsdata.map((e)=>{
                        enablerowvalues.values = e.data.values;
                        enablerowvaluesarr.push(enablerowvalues);
                        pkarrenable.push(e.data.values.pk_bankaccbas.value)
                    });
                    ajax({
                        url:'/nccloud/uapbd/bankacc/batchEnable.do',
                        // data:{
                        //     griomodel:{
                        //         areacode:gridId,
                        //         rows:enablerowvaluesarr
                        //     },
                        //     pageid:pagecode,
                        //     userjson:id
                        // },
                        //平台的组件太垃圾，一会一个样子，列表中下拉类型取到的值居然是false。。。现在直接传主键回去查vos
                        data:pkarrenable,
                        success:(res)=>{
                            let {success,data} = res;
                            if(success){
                                if(data){
                                }else{
                                    toast({color:'success',title:this.state.json['10140BANKACC-000066']});/* 国际化处理： 启用成功！*/
                                    this.loadGridData(this.getLoadDataParam(props),()=>{
                                        this.initializeButtons();
                                    });
                                }
                            }
                        }
                    });
                }
            });


            break;
        case'listDisable':
            confirmUtil.call(this,{
                title:this.state.json['10140BANKACC-000096'],/* 国际化处理： 停用*/
                content:this.state.json['10140BANKACC-000065'],/* 国际化处理： 是否确认要停用？*/
                beSureBtnClick:()=>{
                    let disablerowvaluesarr = [];
                    let disablerowvalues = {};
                    let pkarrdisable = [];
                    rowsdata.map((e)=>{
                        disablerowvalues.values = e.data.values;
                        disablerowvaluesarr.push(disablerowvalues);
                        pkarrdisable.push(e.data.values.pk_bankaccbas.value)
                    });
                    ajax({
                        url:'/nccloud/uapbd/bankacc/batchDisable.do',
                        // data:{
                        //     griomodel:{
                        //         areacode:gridId,
                        //         rows:disablerowvalues
                        //     },
                        //     pageid:pagecode,
                        //     userjson:id
                        // },
                        //平台的组件太垃圾，一会一个样子，列表中下拉类型取到的值居然是false,转化报错，现在直接传主键回去查vos以后再改
                        data:pkarrdisable,
                        success:(res)=>{
                            let {success,data} = res;
                            if(success){
                                if(data){

                                }else{
                                    toast({color:'success',title:this.state.json['10140BANKACC-000064']});/* 国际化处理： 停用成功！*/
                                    this.loadGridData(this.getLoadDataParam(props),()=>{
                                        this.initializeButtons();
                                    });
                                }
                            }
                        }
                    });
                }
            });
            break;
        default:
            break;
    }
}


//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS