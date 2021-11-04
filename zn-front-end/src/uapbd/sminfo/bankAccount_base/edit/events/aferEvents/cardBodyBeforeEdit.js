//Fxdl7Gl4rq0iMeR0nG0Nq5RMSp7eyi+xv/bZiV6CZ8fDZqd3lKDLEgSReLBHyYKs
import{toast} from 'nc-lightapp-front';
export default function (props,moduleId,key,value,index,record){
    let enableEdit = true;
    switch (key){
        case'isconcerted':
            enableEdit = record.values.acctype.value==='0'?true:false;
            return enableEdit;
            break;
        case'concertedmny':
            enableEdit = record.values.isconcerted.value===true?true:false;
            enableEdit||toast({color:'info',title:this.state.json['10140BANKACC-000020']});/* 国际化处理： tips:设置了协定才能设置协定金额！*/
            return enableEdit;
            break;
        case'fronzenmny':
            enableEdit = record.values.fronzenstate.value===2?true:false;
            return enableEdit;
            break;

        case'overdraftmny':
            enableEdit = record.values.acctype.value==='0'?true:false;
            enableEdit||toast({color:'info',content:this.state.json['10140BANKACC-000021']});/* 国际化处理： tips:活期才能设置透支金额！*/
            return enableEdit;
            break;
        case'overdrafttype':
            // enableEdit = record.values.overdraftmny.value&&record.values.overdraftmny.value!=0?true:false;
            // enableEdit||toast({color:'info',title:this.state.json['10140BANKACC-000022']})/* 国际化处理： 请先设置透支金额！*/
            return true;
            break;
        case'banknotespec':
            //账户类型为保证金 票据池专用才可以维护
            enableEdit = record.values.acctype.value=='4'?true:false;
            return enableEdit;
        default:
            return true;
            break;
    }

}

//Fxdl7Gl4rq0iMeR0nG0Nq5RMSp7eyi+xv/bZiV6CZ8fDZqd3lKDLEgSReLBHyYKs