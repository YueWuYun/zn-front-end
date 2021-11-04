//2UtDAKDSPhvEym6/R/SUhiWNI4el7BPT1XTIFxKznHU/E6ylsrlCijYL9PAcm5A8frFV3zYmCb4/
gszychKLGw==
import {promptBox} from 'nc-lightapp-front';
export  default  function onModaltableAfterEdit(props, moduleId, key, value, changedrows, index,record){
    debugger;
    switch (key){
        case'enablestate':
            promptBox({
                title:this.state.json['10140BANKACC-000015'],/* 国际化处理： 询问？*/
                content:value?this.state.json['10140BANKACC-000017']:this.state.json['10140BANKACC-000016'],/* 国际化处理： 确定启用？,确定停用？*/
                beSureBtnClick:()=>{
                    ajax({
                        url:'/nccloud/uapbd/bankacc/bankaccuse.do',
                        data:{
                            pk_list:[record.values.pk_bankaccuse.value],
                            enableswitch:value,
                            actionName:'modalEnable'
                        },
                        success:(res)=>{
                            let{success,data} = res;
                            if(success)
                            {
                                if(data){
                                    if(data.hasOwnProperty('message')&&data.message){

                                    }else{
                                        toast({
                                            'color':'success',
                                            'title':this.state.json['10140BANKACC-000001']/* 国际化处理： 操作成功！*/
                                        });
                                        this.loadBankaccuseData(this.props.cardTable.getCheckedRows(this.props.config.gridId));
                                    }
                                }

                            }
                        }
                    });
                }
            })
            break;
        default:
            break;
    }


}

//2UtDAKDSPhvEym6/R/SUhiWNI4el7BPT1XTIFxKznHU/E6ylsrlCijYL9PAcm5A8frFV3zYmCb4/
gszychKLGw==