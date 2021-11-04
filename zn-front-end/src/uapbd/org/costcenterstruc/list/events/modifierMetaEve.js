//b3OqxkBDUNW/hvo7vtxfUiqrubbU0FiVlJ2U/BraeWakr9bY6sxYW6agcF/EmXfo
import { createPage, ajax, toast,promptBox } from 'nc-lightapp-front';
const tableid = 'head';
export default function modifierMetaEve(props, meta, json) {
    let event = {
        label: json['barappobject-000010'],/* 国际化处理： 操作*/
        attrcode: 'opr',
        itemtype: 'customer',
        visible: true,
        fixed: 'right',
        width: "160px",
        textAlign: "center",

        render(text, record, index) {
            return props.button.createOprationButton(['edit', 'delete','center'], {
                area: "row",
                buttonLimit: 3,
                onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index)
            });
        }
    }
    meta['head'].items.push(event);
    props.meta.setMeta(meta);
}

function tableButtonClick(props, key, text, record, index) {
    switch (key) {
        // case 'edit':
        //     props.pushTo('/card', {
        //         status: 'edit',
        //         pk_barappobject: record.pk_barappobject.value
        //     });
        //     break;

        case 'edit':
            onTableInnerButtonClick(props);
            break;
        case 'delete':
            delLine(props,record,index);  
            break;
             
            // let key = record.values.pk_code.value;
            // let selectedRows = [];
            // let deleteData = this.getDeleteData(selectedRows);
            
            // record.key = {value:record.key}
            // let barappobject = {rows:[{values:record}]};
            // let data={ dictcode: barappobject }
            // let data ={
            //     head:{
            //        rows: [{
            //            status: "0",
            //            isOptimized: false,
            //            index:1,
            //            values: {
            //                versionName: {},
            //                code: { value: "" },
            //                name: { value: "" },
            //                default: { value: "" },
            //                versionNumber:{value:""},
            //                versionName:{value:""},
            //                effectiveDate:{value:""},
            //                expirationDate:{value:""},
            //                enable:{value:""},
            //                creatPerson:{value:""},
            //                creatData:{value:""},
            //                Lastmodifiedby:{value:""},
            //            }
            //        },
            //        {
            //         status: "0",
            //         isOptimized: false,
            //         index:2,
            //         values: {
            //             versionName: {},
            //             code: { value: "01" },
            //             name: { value: "成本中心结构1" },
            //             default: { value: "是" },
            //             versionNumber:{value:"202001"},
            //             versionName:{value:"初始版本"},
            //             effectiveDate:{value:"2020-2-15"},
            //             expirationDate:{value:"9999-12-31"},
            //             enable:{value:"已启用"},
            //             creatPerson:{value:"张三"},
            //             creatData:{value:"2020-1-1"},
            //             Lastmodifiedby:{value:"李四"},
            //         }
            //     },
            //     ]
            //     }  
            // }
            
        //    props.table.setTableData("head",data.head);
            // props.table.deleteTableRowsByIndex('head', index);
            props.table.deleteTableRowsByIndex('head', index);
           props.table.deleteCacheId('head', record.values.code.value);
            toast({ color: 'success' });
            break;
            
           
            // ajax({
            //     url: '/nccloud/bcbd/barappobject/delete.do',
            //     data: { dictcode: barappobject },
            //     success: (res) => {
            //         if (res && res.success && res.data.status) {
            //             props.table.deleteTableRowsByIndex('head', index);
            //             props.table.deleteCacheId('head', record.pk_barappobject.value);
            //             toast({ color: 'success' });
            //         }else if (res.data.errmsg) {
            //             toast({ color: 'danger', content: res.data.errmsg });
            //         }
            //     }
            // })
           
    }
}

function onRowClick(props,moduleId,record,index){
    this.props.editTable.focusRowByIndex(tableid,index);
    this.setState(
        {
            formData:{
                toFormStatus:'browse',
                selectData:record.values
            }
        }
    );
}

function delLine(props,record,index){
    //  let rows = props.editTable.getCheckedRows(tableid);
    //  let ids = [];
    //  rows.forEach((e)=>{
    //      ids.push(e.index)
    //  });
    //  props.editTable.delRowsByIndex(tableid, ids);
    props.editTable.deleteTableRowsByIndex("head", index,false);
    
     let pk = record.values.code.value;
     let data ={
          'pk':pk,
           'operateCode':'edit',
           data:{'pk':pk},
     }
     //loadGridData(props,record);
     toast({
        color: 'success',
        title: '删除成功'
    });
   
}


function onTableInnerButtonClick(props){
	//if(props.editTable.getStatus('head') === 'edit'){//编辑状态
      //  props.editTable.deleteTableRowsByIndex('head', 0);
        props.editTable.setStatus('head','edit');
	//}else{//浏览态
		// let dataArr=[];
		// let delObj = {
		// 	status: '3',
		// 	rowid : record.rowid,
		// 	values: record.values
		// };
		// let indexArr=[];
		// dataArr.push(delObj);
		// Utils.convertGridEnablestate(dataArr);
		// indexArr.push(index);
		// let data = {
		// 	OrgRelationTypeID : config.OrgRelationTypeID,
		// 	pageid:config.pagecode,
		// 	model: {
		// 		areaType: 'table',
		// 		pageinfo: null,
		// 		rows: dataArr
		// 	}
		// };
		// props.editTable.deleteTableRowsByIndex(tableid, indexArr);
		// 			let allD = props.editTable.getAllData(tableid);
		// 			Utils.filterDelRows(allD.rows);//过滤清除删除状态的行
		// 			cacheTools.set(config.cacheId,allD);
		// 			props.editTable.setTableData(tableid,allD);
				
	//}
}




//b3OqxkBDUNW/hvo7vtxfUiqrubbU0FiVlJ2U/BraeWakr9bY6sxYW6agcF/EmXfo