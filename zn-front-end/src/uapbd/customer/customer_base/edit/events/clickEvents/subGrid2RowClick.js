//yDANJnO1cwRZhJZwFx1Xmr5AX3PqiXxHbYjgazmnNfIlnrh7V0Rl6oXBliyODaMY
/**
 *客户联系人双击事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
import {ajax} from 'nc-lightapp-front';
export default function (props,record,index) {

    let gridId2 = props.config.subGrid2;
    let formId = props.config.linkman;
    let recordVal = record.values;


    let pk_linkman = record.values.pk_linkman.value;

    ajax({
        url:'/nccloud/uapbd/custsubinfo/queryLinkman.do',
        data:{
            queryCondition:{
                pk_linkman:pk_linkman,
                pagecode:props.config.pagecode,
                areacode:props.config.linkman
            }
        },
        success:(res)=>{
            let{success,data} = res;
            if(success){
                if(data){
                    props.form.setAllFormValue({
                        [formId]:data[formId]
                    });
                }else{
                    props.form.EmptyAllFormValue(formId)
                }
            }
        }

    });
    props.form.setFormStatus(formId,props.cardTable.getStatus(gridId2));

    props.modal.show('linkmanModal',{

        beSureBtnClick:()=>{
            let lmdata = props.form.getAllFormValue(formId);
            lmdata.areacode = props.config.linkman;
            lmdata.rows.status =recordVal['pk_custlinkman']?'1':'2';

            ajax({
                url:'/nccloud/uapbd/custsubinfo/saveLinkman.do',
                data:{
                    'pageid':props.config.pagecode,
                    'gridModel':lmdata
                },
                success:(res)=>{
                    let{success,data} =res;
                    if(success){
                        if(data){
                            //联系人修改成功 更新列表数据
                            let returnvalues = {
                                'pk_customer':{
                                    value:recordVal['pk_customer']['value']
                                },
                                'pk_custlinkman':{
                                    value:recordVal['pk_custlinkman']&&recordVal['pk_custlinkman']['value']
                                },
                                'pk_linkman':{
                                    value:data[formId].rows[0].values['pk_linkman'].value,
                                    display:data[formId].rows[0].values['name'].value
                                },
                                'pk_linkman.sex':data[formId].rows[0].values.sex,
                                'pk_linkman.vjob':{
                                    value:data[formId].rows[0].values['vjob']['value'],
                                    display:data[formId].rows[0].values['vjob']['value']
                                },
                                'pk_linkman.phone':{
                                    value:data[formId].rows[0].values['phone']['value'],
                                    display:data[formId].rows[0].values['phone']['value']
                                },
                                'pk_linkman.cell':{
                                    value:data[formId].rows[0].values['cell']['value'],
                                    display:data[formId].rows[0].values['cell']['value']
                                }
                            }
                            record.valuse =Object.assign(record.values,returnvalues)
                            props.cardTable.updateDataByIndexs(gridId2,[{
                                index:index,
                                data:record
                            }]);
                        }
                    }
                }
            });

        },
        cancelBtnClick:()=>{

        }

    });


}

//yDANJnO1cwRZhJZwFx1Xmr5AX3PqiXxHbYjgazmnNfIlnrh7V0Rl6oXBliyODaMY