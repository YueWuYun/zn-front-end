/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/
import { toast,ajax } from 'nc-lightapp-front';
import { afterEventLink } from '../../cons/constant';
import {billValidation} from '../../../../public/validator/fbmBillNoCheck'

/**
 * 表体编辑后事件
 * @param {*} props         页面内置对象
 * @param {*} moduleId      表体区域
 * @param {*} key           表头字段
 * @param {*} value         新值
 * @param {*} changedrows   旧值
 * @param {*} index         行序号
 * @param {*} record        行数据
 */
export function afterEvent(props, moduleId, key, value, changedrows, index, record) {
    let { setValByKeyAndIndex,  getValByKeyAndIndex } = this.props.editTable;

    switch(key){
        case 'fbmbillno':
            if (changedrows[0].newvalue.value ==changedrows[0].oldvalue.value) {
                return;
            }
            let fbmbillno = record.values.fbmbillno.value
            let isValidate = billValidation.call(this,fbmbillno)
            //如果票据号不合法 则清空输入        
            if(!isValidate){
                setValByKeyAndIndex(this.tableId, index, 'fbmbillno', {display:'',value:''});
            }
            //如果票据号合法 则得带出票据类型
            else{
                let data = {
                    keyValue:fbmbillno,
                    key:key
                }
                doAfterEvent.call(this,props,data,index,record)
            }
        break;

        // 出票日期
        case 'invoicedate':
            let begindate = record.values.invoicedate.value
            let endDateTemp = record.values.enddate.value
            let fbmbillnotemp = record.values.fbmbillno.value

            if(!begindate){
                return;
            }
            if(endDateTemp){
                let endTemp = new Date(endDateTemp)
                let beginTemp = new Date(begindate)
                if(endTemp.getTime() <= beginTemp.getTime()){
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000002') })  /* 国际化处理： 到期日期必须大于出票日期*/
                    setValByKeyAndIndex(this.tableId, index, 'enddate', {display:' ',value:''});
                    return
                }
            }  

            // 是否是电票
            let step = 6

            // 电子票据号
            if(fbmbillnotemp && fbmbillnotemp.length == 30){
                step =  12
            }
            // 纸质票据号
            else{
                step = 6
            }


            let begin1 = new Date(begindate)
            begin1.setMonth(begin1.getMonth() +step);
            // let enddatevalue = begin1.getFullYear() + "-"+(begin1.getMonth()+1)+"-"+begin1.getDate()+
            //         " "+begin1.getHours()+":"+begin1.getMinutes()+":"+begin1.getSeconds()

            let enddatevalue = timeFormat.call(this,begin1)
            setValByKeyAndIndex(this.tableId, index, 'enddate', {display:' ',value:enddatevalue});
        
        break;

        // 到期日期
        case 'enddate':
            let enddate = record.values.enddate.value
            let invoicedate =  record.values.invoicedate.value
            if(!enddate){
                return;
            }
            if(invoicedate){
                let end = new Date(enddate)
                let begin = new Date(invoicedate)
                if(end.getTime() < begin.getTime()){
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000003') })  /* 国际化处理： 到期日期不能小于出票日期*/
                    setValByKeyAndIndex(this.tableId, index, 'enddate', {display:' ',value:''});
                    return
                }
            }         
        break;

        // 票据金额
        case 'moneyy':
        if (changedrows[0].newvalue.value ==changedrows[0].oldvalue.value) {
            return;
        }
        let money = record.values.moneyy.value    
        if(money <= 0){
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("361805IBR") && this.props.MutiInit.getIntl("361805IBR").get('361805IBR-000004') })  /* 国际化处理： 金额应该大于0！*/
            setValByKeyAndIndex(this.tableId, index, 'moneyy', {display:'',value:''});
        }
        break;
        case "pk_curr":
            if (changedrows[0].newvalue.value ==changedrows[0].oldvalue.value) {
                return;
            }
            let pk_curr = record.values.pk_curr.value;
            let data = {
                keyValue:pk_curr,
                key:key
            }
            doCurrAfterEvent.call(this,this.props,data,index,record);
        break;
            
    }
     
}

/**
 * 时间格式化输出
 * @param {} date 
 */
function timeFormat(date){
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    
    if(month <10){
        month = "0"+month
    }
    if(day <10){
        day = "0"+day
    }
    if(hour <10){
        hour = "0"+hour
    }
    if(minute <10){
        minute = "0"+minute
    }
    if(second <10){
        second = "0"+second
    }

    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second
}

/**
 * 编辑后事件请求后台
 * @param {*} props 
 * @param {*} data 
 */
function doAfterEvent(props,data,index,record){
    ajax({
        async:false,
        url: afterEventLink,
        data,
        success: (res) => {
            if (res.success) {                       
                props.editTable.setValByKeyAndIndex(this.tableId, index, 'fbmbilltype', {display:res.data.fbmbilltypeDisplay,value:res.data.fbmbilltype});
                props.editTable.setValByKeyAndIndex(this.tableId, index, 'pk_curr', {display:res.data.currtypename,value:res.data.pk_currtype});
                if (res.data.moneyDigit) {
                    let moneyy = record.values.moneyy;
                    moneyy.scale = res.data.moneyDigit;
                    props.editTable.setValByKeyAndIndex(this.tableId, index, 'moneyy', moneyy);
                }
            }
        },
        error: (err) => {
            toast({ color: 'danger', content: err.message });                        
        }
    });
}
/**
 * 币种编辑后事件请求后台
 * @param {*} props 
 * @param {*} data 
 */
function doCurrAfterEvent(props,data,index,record){
    ajax({
        async:false,
        url: afterEventLink,
        data,
        success: (res) => {
            if (res.success) {                       
                if (res.data.moneyDigit) {
                    let moneyy = record.values.moneyy;
                    moneyy.scale = res.data.moneyDigit;
                    props.editTable.setValByKeyAndIndex(this.tableId, index, 'moneyy', moneyy);
                }
            }
        },
        error: (err) => {
            toast({ color: 'danger', content: err.message });                        
        }
    });
}
/*OWmq6Ugo6jPE4W7xoi1UXlIVrcsX6cgJWOAkcTBppIYL7h95Xzi68r/N0GDPDMmb*/