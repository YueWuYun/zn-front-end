//t062wrAbzsHyGvc+J5WsZFS5JQpJqOhk7tZ3wshRW9fDTY1ZtxRTii9f8OyJs6NJ
import { ajax, toast,promptBox } from 'nc-lightapp-front';
import { pagecode,formId, tableId} from '../constants';


let keys =['nmoney','nnum','nprice','cmaterrialid']
export default function bodyafterEvent(props, moduleId, key, value, changedrows, i, s, g) {
    //表体编辑后事件
    if (moduleId == this.tableId) {
        switch (key) {
            case 'costcompid':
                if(value.length > 0 ){
                    let updateBody = []
                    let insertRows = []
                    value.forEach(function (value, index) {
                        if (index == 0) {
                            updateBody.push({
                                index: i, data: {
                                    status: 0, values: {
                                        'costcompid': { display: value.refcode, value: value.refpk },
                                        'costcompid.vcostcomponentname': { display: value.refname, value: value.refname }
                                    }
                                }
                            });
                        } else {
                            insertRows.push({
                                status: 0, values: {
                                    'costcompid': { display: value.refcode, value: value.refpk },
                                    'costcompid.vcostcomponentname': { display: value.refname, value: value.refname }
                                }
                            });
                        }
                    })
                    this.props.cardTable.updateDataByIndexs(this.tableId, updateBody);
                    if(insertRows.length > 0){
                        this.props.cardTable.insertRowsAfterIndex(this.tableId, insertRows, i);
                    }
                } else{
                    let updateBody =[{
                        index: i, data: {
                            status: 0, values: {
                                'costcompid': { display: '', value: ''},
                                'costcompid.vcostcomponentname': { display: '', value: ''}
                            }
                        }
                    }]
                    this.props.cardTable.updateDataByIndexs(this.tableId, updateBody);
                }           
                
                break;
                // case 'celementid':
                //     if(value.length > 0 ){
                //         let updateBody = []
                //         let insertRows = []
                //         value.forEach(function (value, index) {
                //             if (index == 0) {
                //                 updateBody.push({
                //                     index: i, data: {
                //                         status: 0, values: {
                //                             'celementid': { display: value.refcode, value: value.refpk },
                //                             'celementid.factorname': { display: value.refname, value: value.refname }
                //                         }
                //                     }
                //                 });
                //             } else {
                //                 insertRows.push({
                //                     status: 0, values: {
                //                         'celementid': { display: value.refcode, value: value.refpk },
                //                         'celementid.factorname': { display: value.refname, value: value.refname }
                //                     }
                //                 });
                //             }
                //         })
                //         this.props.cardTable.updateDataByIndexs(this.tableId, updateBody);
                //         if(insertRows.length > 0){
                //             this.props.cardTable.insertRowsAfterIndex(this.tableId, insertRows, i);
                //         }
                //     } else{
                //         let updateBody =[{
                //             index: i, data: {
                //                 status: 0, values: {
                //                     'celementid': { display: '', value: ''},
                //                     'celementid.factorname': { display: '', value: ''}
                //                 }
                //             }
                //         }]
                //         this.props.cardTable.updateDataByIndexs(this.tableId, updateBody);
                //     }           
                    
                //     break;  
            default:
                       
                break;
        }


    }

}

//t062wrAbzsHyGvc+J5WsZFS5JQpJqOhk7tZ3wshRW9fDTY1ZtxRTii9f8OyJs6NJ