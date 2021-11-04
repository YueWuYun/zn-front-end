//3Fb5k8ejXuDZhi38kD+F2LBc4RSxogt9PH3WzgbMwwnHjRd5Wu6vck7okW29mb10
import{promptBox} from 'nc-lightapp-front';

export default function (props, moduleId, key, value, changedrows, index, record,type, method){

    let accname = props.form.getFormItemsValue('bankaccount','accname');
    let currtypename = record.values.pk_currtype.display;
    let acctypename = record.values.acctype.display;

    switch(key){
        case'acctype':
            //账户类型改变设置协定默认为否
            //账户类型改变清空协定金额
            props.cardTable.setValByKeyAndIndex(moduleId,index,'isconcerted',{value:false,display:this.state.json['10140BANKACC-000018']});/* 国际化处理： 否*/
            props.cardTable.setValByKeyAndIndex(moduleId,index,'concertedmny',{value:'',display:''});
            props.cardTable.setValByKeyAndIndex(moduleId,index,'name',{value:accname.value?accname.value:''+currtypename+acctypename+this.state.json['10140BANKACC-000019'],display:accname.value?accname.value:''+currtypename+acctypename+this.state.json['10140BANKACC-000019']});/* 国际化处理： 户,户*/
            break;
        case'isconcerted':
            //协定改变清空协定金额
            if(!value){
                props.cardTable.setValByKeyAndIndex(moduleId,index,'concertedmny',{value:0,display:0});
            }
            break;
        case'pk_currtype':
            props.cardTable.setValByKeyAndIndex(moduleId,index,'name',{value:accname.value?accname.value:''+currtypename+acctypename+this.state.json['10140BANKACC-000019'],display:accname.value ? accname.value :''+currtypename+acctypename+this.state.json['10140BANKACC-000019']});/* 国际化处理： 户,户*/
            break;
        case'isdefault':
            //同一币种只能设置一个默认账户，如果对应币种无默认账户，设置默认后保存成功；如果对应币种已经有默认账户，给出提示，但不影响账户的其他属性变动
            let cardData = this.props.cardTable.getAllData(moduleId);
            let isdefault = record.values.isdefault.value;
            if(isdefault && cardData && cardData['rows']){
                let pkcurrtype = record.values.pk_currtype.value;debugger
                cardData['rows'].map((row, i) => {
                    if(row.values.pk_currtype && record['rowid']!=row['rowid'] && row['status']!='3'){//排除自己和删除的
                        if(row.values.isdefault.value && pkcurrtype === row.values.pk_currtype.value){
                            promptBox({
                                color: 'info',                 // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                title: this.state.json['10140BANKACC-000098'],/* 国际化处理： 确认*/
                                content: this.state.json['10140BANKACC-000099']+row.values.name.value+this.state.json['10140BANKACC-000100'],
                                /* 国际化处理： 当前组织当前币种已存在：*//* 国际化处理： ，是否将当前账户设为默认账户？*/
                                beSureBtnClick: () => {
                                    props.cardTable.setValByKeyAndRowId(moduleId,row['rowid'],'isdefault',{value:false});
                                    props.cardTable.focusRowByIndex(moduleId, i);
                                    props.cardTable.focusRowByIndex(moduleId, index);
                                    console.log(i);console.log(index);
                                    return;
                                },
                                cancelBtnClick:()=>{
                                    props.cardTable.setValByKeyAndIndex(moduleId,index,'isdefault',{value:false});
                                    return;
                                },
                                closeBtnClick:()=>{
                                    props.cardTable.setValByKeyAndIndex(moduleId,index,'isdefault',{value:false});
                                    return;
                                }
                            });
                        }
                    }
                });
            }
            break;
        default:
            break;
    }

}

//3Fb5k8ejXuDZhi38kD+F2LBc4RSxogt9PH3WzgbMwwnHjRd5Wu6vck7okW29mb10