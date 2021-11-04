//gO/8rap/sgvWEvET1I01BdFh/XkKnaY78qQSb37J8+tLJT++Z8j4ptq9gXplQzCM
import {ajax, base, toast,print,output} from 'nc-lightapp-front';
import confirmUtils from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
const ajaxurl = {
    'subgridaction':'/nccloud/uapbd/custsubinfo/subGridAction.do',
    'subgridDel':'/nccloud/uapbd/custsubinfo/deletesublistinfo.do',
    'subFormDel':'/nccloud/uapbd/custsubinfo/deletesubcardinfo.do'
};

/**
 *客户信用控制模态框和肩部按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export  default function (areaFlag,props,id) {
    let editStatusBtns = ['subG6ModalSave','subG6ModalCancel'];
    let browseStatusBtns=['subG6Edit','subG6Del','subG6Ref','subG6Pri'];
    let alldata = props.cardTable.getAllData(props.config.subGrid6);
    let formItemArr = props.form.getFormItemsValue(props.config.formId, ['pk_customer']);
    let pks = [];
    let reqParam;
    let checkedRocord;
    if(areaFlag ==='shoulder'){
        alldata = props.cardTable.getAllData(props.config.subGrid6);
        checkedRocord = props.cardTable.getCheckedRows(props.config.subGrid6);
    }else{
        alldata =props.form.getAllFormValue('customer_simpleinfo');
        reqParam =  props.form.getAllFormValue(props.config.creditctlForm);
    }
    switch (id){
        case 'subG6Edit':
            this.setState({subGridStatus:false},()=>{
                props.form.setFormStatus(props.config.creditctlForm, 'edit');
                //设置按钮显示隐藏
                props.button.setButtonVisible(browseStatusBtns, false);
                props.button.setButtonVisible(editStatusBtns, true);
                let pk_customer_main =  props.form.getFormItemsValue(props.config.formId,'pk_customer_main');
                props.form.setFormItemsDisabled(props.config.creditctlForm,{'creditcontrol':pk_customer_main.value?false:true,'acclimitcontrol':pk_customer_main.value?false:true});
            });
            break;
        case'subG6Del':
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
                        areacode:props.config.subGrid6,
                        rows:checkedarr
                    }
                }
                url = ajaxurl.subgridDel;
            }else{
                //模态框按钮删除
                reqParam =  props.form.getAllFormValue(props.config.creditctlForm);
                reqParam.areacode = props.config.creditctlForm;
                reqData = {
                    pageid:props.config.creditctlForm,
                    model:reqParam
                }
                url = ajaxurl.subFormDel;
            }
            confirmUtils.call(this,{
                title:this.state.json['10140CUST-000034'],/* 国际化处理： 确认删除*/
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
                                        toast({'color':'danger','content':data.message});
                                    }else{
                                        toast({'color':'success','content':this.state.json['10140CUST-000046']});/* 国际化处理： 操作成功！*/
                                        props.modal.close('custCreditctlModal');
                                        this.loadSubGridData('shoulder',
                                            props.config.subGrid6,
                                            props.config.creditctlForm,
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
        case'subG6Ref':
            //刷新
            this.loadSubGridData(
                areaFlag,
                props.config.subGrid6,
                props.config.creditctlForm,
                props.config.pagecode,
                'querySubFormOrGrid',
                editStatusBtns,
                browseStatusBtns,
                areaFlag==='shoulder'?formItemArr[0].value:reqParam['rows'][0]['values']['pk_custcreditctl'].value,()=> {
                    toast({
                        color: 'success',
                        title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                    });
                }
            );
            break;
        case'subG6Pri':
        case'subG6P':
            //打印
            areaFlag==='shoulder'&&alldata.rows.forEach((item,index) => {
                pks.push(item.values['pk_custcreditctl']['value']);
            });
            areaFlag==='modal'&&alldata.rows.forEach((item,index) => {
                pks.push(item.values['pk_custcreditctl']['value']);
            });
            pks.length >0 && print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/uapbd/custsubinfo/creditclPrint.do',
                {
                    funcode:'10140CUB',      //功能节点编码，即模板编码
                    nodekey: areaFlag==='shoulder'?'creditcllist':'creditclcard',
                    oids: areaFlag==='shoulder'?pks:[reqParam.rows[0].values.pk_custcreditctl.value],
                    appcode:'10140CUB'
                }
            );
            break;
        case'subG6O':
            areaFlag==='shoulder'&&alldata.rows.forEach((item,index) => {
                pks.push(item.values['pk_custcreditctl']['value']);
            });
            areaFlag==='modal'&&alldata.rows.forEach((item,index) => {
                pks.push(item.values['pk_custcreditctl']['value']);
            });
            pks.length >0 && output({
                url:'/nccloud/uapbd/custsubinfo/creditclPrint.do',
                data:{
                    funcode:'10140CUB',      //功能节点编码，即模板编码
                    nodekey: areaFlag==='shoulder'?'creditcllist':'creditclcard',
                    outputType:'output',
                    oids: areaFlag==='shoulder'?pks:[reqParam.rows[0].values.pk_custcreditctl.value]  //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
                }
            });
            //输出
            break;

        case'subG6ModalSave':
            this.SubModalSave(
                props.config.subGrid6,
                'custCreditctlModal',
                props.config.creditctlForm,
                editStatusBtns,
                browseStatusBtns
            );
            break;
        case'subG6ModalCancel':
            confirmUtils.call(this,{
                title:this.state.json['10140CUST-000038'],/* 国际化处理： 确认取消*/
                content:this.state.json['10140CUST-000065'],/* 国际化处理： 是否确认取消？*/
                beSureBtnClick:()=>{
                    this.setState({subGridStatus:true},()=>{
                        props.form.setFormStatus(props.config.creditctlForm, 'browse');
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

//gO/8rap/sgvWEvET1I01BdFh/XkKnaY78qQSb37J8+tLJT++Z8j4ptq9gXplQzCM