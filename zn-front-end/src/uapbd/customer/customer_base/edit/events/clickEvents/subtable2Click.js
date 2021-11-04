//1sAehCyb3leYzvSTL+W+s8rXQtQ/40f+1dhv1MmlqHXu07v367CzWBQJUSeOXwYV
import {ajax, base, toast,cardCache} from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
/**
 *客户联系人肩部按钮事件
 * @param record
 * @param index
 * @param props
 * @param key
 */
export  default function (props,id) {
    switch (id){
        case 'subGrid2Add':
            let gridId = props.config.subGrid2;
            let formId = props.config.linkman;
            props.form.setFormStatus(formId,'edit');
            props.form.EmptyAllFormValue(formId);
            props.modal.show('linkmanModal',{
                beSureBtnClick:()=>{
                    if(this.state.linkmanIsBeEdit){
                        let lmdata = props.form.getAllFormValue(formId);
                        lmdata.areacode = props.config.linkman;
                        lmdata.rows.status = '2';
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

                                        this.setState({
                                            linkmanIsBeEdit:false
                                        },()=>{
                                            let allrows = props.cardTable.getAllRows(gridId).length;
                                            props.cardTable.insertRowsAfterIndex(gridId,[{
                                                values:{
                                                    'pk_customer':props.form.getFormItemsValue(props.config.formId,'pk_customer'),
                                                    'pk_linkman':{
                                                        value:data[formId].rows[0].values['pk_linkman']['value'],
                                                        display:data[formId].rows[0].values['name']['value']
                                                    },
                                                    'pk_linkman.sex':{
                                                        display:data[formId].rows[0].values['sex'].display,
                                                        value:data[formId].rows[0].values['sex'].value
                                                    },
                                                    'pk_linkman.vjob':{
                                                        display:data[formId].rows[0].values['vjob'].value,
                                                        value:data[formId].rows[0].values['vjob'].value
                                                    },
                                                    'pk_linkman.phone':{
                                                        display:data[formId].rows[0].values['phone'].value,
                                                        value:data[formId].rows[0].values['phone'].value
                                                    },
                                                    'pk_linkman.cell':{
                                                        display:data[formId].rows[0].values['cell'].value,
                                                        value:data[formId].rows[0].values['cell'].value
                                                    },
                                                    'isdefault':{
                                                        value:false,
                                                        display:this.state.json['10140CUST-000093']/* 国际化处理： 否*/
                                                    }
                                                }
                                            }],allrows-1);
                                        })

                                    }
                                }
                            }
                        });
                    }
                },
                cancelBtnClick:()=>{
                }
            })
            break;
        default:
            break;
    }
}

//1sAehCyb3leYzvSTL+W+s8rXQtQ/40f+1dhv1MmlqHXu07v367CzWBQJUSeOXwYV