//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/
import {ajax, base, toast ,cardCache,getBusinessInfo} from 'nc-lightapp-front';
const{setDefData} = cardCache;
import manageModePlugIn from '../../../../../public/utils/ManageModeUtils';
import confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
const ajaxurl = '/nccloud/uapbd/bankacc/baseAction.do';
/**
 * 银行账户列表操作列按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export default  function(record, index, props, key){
    let{pagecode,NODE_TYPE} = props.config;
    let{PermissionOrgIDs} = this.state.context;
    let editurl ='/card';

    // 操作列按钮除了复制都需要管控校验
    if(key!=='oprCopy'){
        let rem = manageModePlugIn.call(this,NODE_TYPE,record.pk_org.value,record.pk_group.value,PermissionOrgIDs,getBusinessInfo().groupId);
        if(!rem.editFlag){
            toast({
                color:'warning',
                content:rem.message
            });
            return;
        }
    }
    switch (key) {
        // 表格操作修改按钮
        case 'oprEdit':
            if(record.accstate.value === '3'){
                toast({
                    color:'warning',
                    title:this.state.json['10140BANKACC-000089']
                });
                return;
            }
            setDefData('id',props.config.datasource,record.pk_bankaccbas.value);
            ajax({
                url:ajaxurl,
                data:{
                    'pk_bankaccbas':[record.pk_bankaccbas.value],
                    'actionName':key,
                    'pagecode':pagecode
                },
                success:(res)=>{
                    let{data,success} = res;
                    if(success){
                        if(data&&data.hasOwnProperty('message')&&data.message){
                            toast({ color: 'warning', title: data.message});
                        }else{
                            props.pushTo(editurl,{
                                'status':'edit',
                                'pagecode':props.config.pagecode_card,
                                'id':record.pk_bankaccbas.value,
                                'appcode':props.config.appcode
                            });
                        }
                    }
                }
            });
            break;
        case 'oprDelete':
            if(record.accstate.value === '3'){
                toast({
                    color:'warning',
                    title:this.state.json['10140BANKACC-000089']
                });
                return;
            }
            record.accstate.value === '3' && toast({
                color:'warning',
                title:this.state.json['10140BANKACC-000028']/* 国际化处理： 已经销户的账户不允许删除！*/
            });
            record.accstate.value === '3' || ajax({
                url:ajaxurl,
                data:{
                    pk_bankaccbas:[record.pk_bankaccbas.value],
                    actionName:key
                },
                success:(res)=>{
                    let {success,data} = res;
                    if(success){
                        if(data&&data.hasOwnProperty('message')&&data.message){
                            toast({ color: 'warning', title: data.message });
                        }else{
                            toast({ color: 'success', title: this.state.json['10140BANKACC-000032'] });/* 国际化处理： 删除成功！*/
                            this.loadGridData(this.getLoadDataParam(props),()=>{
                                this.initializeButtons();
                            });
                        }
                    }
                }
            });
            break;
        case 'oprCopy':
            setDefData('id',props.config.datasource,record.pk_bankaccbas.value)
            props.pushTo(editurl,{
                status:'add',
                pagecode:props.config.pagecode_card,
                id:record.pk_bankaccbas.value,
                copyFlag:'copy',
                'appcode':props.config.appcode
            });
            break;
        case'oprDisable':
            record.enablestate.value&&enableDisableSwitch.call(this,record,props,key,()=>{
                this.loadGridData(this.getLoadDataParam(props),()=>{
                    this.initializeButtons();
                });
            });
            record.enablestate.value||toast({
                color:'warning',
                title:this.state.json['10140BANKACC-000040']/* 国际化处理： 已经停用的数据，无法停用！*/
            });
            break;
        case'oprEnable':
            !record.enablestate.value&&enableDisableSwitch.call(this,record,props,key,()=>{
                this.loadGridData(this.getLoadDataParam(props),()=>{
                    this.initializeButtons();
                });
            });
            !record.enablestate.value||toast({
                color:'warning',
                title:this.state.json['10140BANKACC-000039']/* 国际化处理： 已经启用的数据，无法启用！*/
            });
            break;
        default:
            console.log(key, index);
            break;
    }
}
function enableDisableSwitch(record,props,key,callback) {
    let enablecontent =key==='oprDisable'?{title:this.state.json['10140BANKACC-000064'],content:this.state.json['10140BANKACC-000065']}:{title:this.state.json['10140BANKACC-000066'],content:this.state.json['10140BANKACC-000067']};/* 国际化处理： 停用成功！,是否确认要停用？,启用成功！,是否确认要启用？*/
    let toasttitle = key === 'oprDisable' ? this.state.json['10140BANKACC-000096'] : this.state.json['10140BANKACC-000095'];
    confirmUtil.call(this,{
        title:toasttitle,
        content:enablecontent.content,
        beSureBtnClick:()=>{
            ajax({
                url:key ==='oprDisable'?'/nccloud/uapbd/bankacc/batchDisable.do':'/nccloud/uapbd/bankacc/batchEnable.do',
                data:[record.pk_bankaccbas.value],
                success:(res)=>{
                    let {success,data} = res;
                    if(success){
                        if(data&&data.hasOwnProperty('message')){
                            toast({color:'warning',title:data.message});
                        }else{
                            toast({ color: 'success', title: enablecontent.title});
                            callback.call(this);
                        }
                    }
                }
            });

        }
    });

}

//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/