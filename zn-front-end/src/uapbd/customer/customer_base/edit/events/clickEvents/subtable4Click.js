//m28ZNlUJQ7JnZFG2azXzQi6ibKSbhPerta8CrUF0vgG5posAl741md2IwY9DebKM
import {ajax, base, toast,print,output} from 'nc-lightapp-front';
import confirmUtils from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
const ajaxurl = {
    'subgridaction':'/nccloud/uapbd/custsubinfo/subGridAction.do',
    'subgridDel':'/nccloud/uapbd/custsubinfo/deletesublistinfo.do',
    'subFormDel':'/nccloud/uapbd/custsubinfo/deletesubcardinfo.do'
};
/**
 *客户财务信息模态框和肩部按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */export  default function (areaFlag,props,id) {
    let reqParam;
    let checkedRocord;
    let editStatusBtns = ['subG4ModalSave','subG4ModalCancel'];
    let browseStatusBtns=['subGrid4Edit','subGrid4Del','subGrid4Ref','subGrid4Pri'];
    let alldata;
    let pks=[];
    let formItemArr = props.form.getFormItemsValue(props.config.formId, ['pk_customer']);
    if(areaFlag ==='shoulder'){
        alldata = props.cardTable.getAllData(props.config.subGrid4);
        checkedRocord = props.cardTable.getCheckedRows(props.config.subGrid4);
    }else{
        alldata =props.form.getAllFormValue('custfinancecardcustomer');
        reqParam =  props.form.getAllFormValue(props.config.custfinanceForm);
    }
    switch (id){
        case 'subGrid4Edit':
            this.setState({subGridStatus:false},()=>{
                let meta = props.meta.getMeta();
                let formitemvalues =
                    props.form.getFormItemsValue(props.config.custfinanceForm, ['pk_org', 'pk_group']);
                //财务信息专管业务员参照
                let resppersonitem =
                    meta['custfinancecard_1']['items'].find(item => item['attrcode'] === 'pk_resppsn1');
                if(!!resppersonitem){
                    resppersonitem.queryCondition = () => {
                        return {
                            //busifuncode: 'sa',
                            pk_org: formitemvalues[0].value
                        }
                    }
                }
                //财务信息专管部门参照
                let respdeptitem =
                    meta['custfinancecard_1']['items'].find(item => item['attrcode'] === 'pk_respdept1');
                if(!!respdeptitem){
                    respdeptitem.queryCondition = () => {
                        return {
                            pk_org: formitemvalues[0].value,
                            pk_group: formitemvalues[1].value,
                            TreeRefActionExt: 'nccloud.web.uapbd.supplier.suprefcondition.action.RespDeptNCTreeRefSqlBuilder',
                        }
                    }
                }
                //收款协议参照
                let incomeGridItem =
                    meta['custfinancecard_1']['items'].find(item=>item['attrcode']==='pk_payterm');
                if(!!incomeGridItem){
                    incomeGridItem.queryCondition=()=>{
                        return {
                            pk_org: formitemvalues[0].value,
                        }
                    }
                }
                //模态框修改
                //设置按钮显示隐藏
                props.form.setFormStatus(props.config.custfinanceForm,'edit');
                props.button.setButtonVisible(browseStatusBtns,false);
                props.button.setButtonVisible(editStatusBtns,true);
                props.meta.setMeta(meta, () => {
                });
            })
            break;
        case'subGrid4Del':
            //删除
            let reqData;
            let url;
            if(areaFlag === 'shoulder'){
                //肩部按钮删除
                let checkedarr = [];
                if(checkedRocord.length!==0){
                    checkedRocord.map((r)=>{
                       checkedarr.push(r.data);
                    });
                }
                reqData = {
                    pageid:props.config.pagecode,
                    model:{
                        areacode:props.config.subGrid4,
                        rows:checkedarr
                    }
                }
                url = ajaxurl.subgridDel;
            }else{
                //模态框按钮删除
                reqParam =  props.form.getAllFormValue(props.config.custfinanceForm);
                reqParam.areacode = props.config.custfinanceForm;
                reqData = {
                    pageid:props.config.custfinanceForm,
                    model:reqParam
                }
                url = ajaxurl.subFormDel;
            }
            confirmUtils.call(this,{
                title:this.state.json['10140CUST-000095'],/* 国际化处理： 询问？*/
                content:this.state.json['10140CUST-000041'],/* 国际化处理： 确认删除所选数据？*/
                beSureBtnClick:()=>{
                    ajax({
                        url:url,
                        data:reqData,
                        success:(res)=>{
                            let{success,data} =res;
                            if(success){
                                if(data){
                                    if(data.hasOwnProperty('message')&&data.message){
                                        toast({'color':'danger','title':data.message});
                                    }else{
                                        toast({'color':'success','title':this.state.json['10140CUST-000046']});/* 国际化处理： 操作成功！*/
                                        props.modal.close('custFinanceModal');
                                        this.loadSubGridData(
                                            'shoulder',
                                            props.config.subGrid4,
                                            props.config.custfinanceForm,
                                            props.config.pagecode,
                                            'querySubFormOrGrid',
                                            editStatusBtns,
                                            browseStatusBtns,
                                            formItemArr[0].value
                                        );
                                    }
                                }
                            }
                        }
                    });
                }
            });
            break;
        case'subGrid4Ref':
            //刷新 areaFlag,subgridId,areacode,pagecode,actionName
            this.loadSubGridData(
                areaFlag,
                props.config.subGrid4,
                props.config.custfinanceForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                areaFlag==='shoulder'?formItemArr[0].value:reqParam['rows'][0]['values']['pk_custfinance'].value,()=>{
                    toast({
                        color:'success',
                        title:this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                    });
                }
            );
            break;
        case'subGrid4Pri':
        case'subGrid4P':
            //打印
            areaFlag==='shoulder'&&alldata.rows.forEach((item,index) => {
                pks.push(item.values['pk_custfinance']['value']);
            });
            areaFlag==='modal'&&alldata.rows.forEach((item,index) => {
                pks.push(item.values['pk_custfinance']['value']);
            });
            pks.length >0 && print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/uapbd/custsubinfo/financePrint.do',
                {
                    funcode:'10140CUB',      //功能节点编码，即模板编码
                    nodekey: areaFlag==='shoulder'?'financelist':'financecard',
                    oids:areaFlag==='shoulder'?pks:[reqParam.rows[0].values.pk_custfinance.value],
                    appcode:'10140CUB'
                }
            );
            break;
        case'subGrid4O':
            //输出
            areaFlag==='shoulder'&&alldata.rows.forEach((item,index) => {
                pks.push(item.values['pk_custfinance']['value']);
            });
            areaFlag==='modal'&&alldata.rows.forEach((item,index) => {
                pks.push(item.values['pk_custfinance']['value']);
            });
            pks.length >0 && output({
                url: '/nccloud/uapbd/custsubinfo/financePrint.do',
                data:{
                    funcode:'10140CUB',      //功能节点编码，即模板编码
                    nodekey: areaFlag==='shoulder'?'financelist':'financecard',
                    outputType:'output',
                    oids: areaFlag==='shoulder'?pks:[reqParam.rows[0].values.pk_custfinance.value]      //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                }
            });
            break;
        case'subG4ModalSave':
            //保存
            let innerctldeferdays =this.props.form.getAllFormValue('custfinancecardcustomer').rows[0].values.innerctldeferdays.value;
            if(innerctldeferdays<0){
                toast({
                    color:'warning',
                    title:this.state.json['10140CUST-000192']/* 国际化处理： 延期天数不能为负！*/
                });
                return;
            }
            this.SubModalSave(
                props.config.subGrid4,
                'custFinanceModal',
                props.config.custfinanceForm,
                editStatusBtns,
                browseStatusBtns
            );
            break;
        case'subG4ModalCancel':
            confirmUtils.call(this,{
                title:this.state.json['10140CUST-000096'],/* 国际化处理： 询问?*/
                content:this.state.json['10140CUST-000065'],/* 国际化处理： 是否确认取消？*/
                beSureBtnClick:()=>{
                    this.setState({subGridStatus:true},()=>{
                        props.form.setFormStatus(props.config.custfinanceForm, 'browse');
                        props.button.setButtonVisible(browseStatusBtns,true);
                        props.button.setButtonVisible(editStatusBtns,false);
                    });
                }
            });
            break;
        default:
            break;
    }


}


//m28ZNlUJQ7JnZFG2azXzQi6ibKSbhPerta8CrUF0vgG5posAl741md2IwY9DebKM