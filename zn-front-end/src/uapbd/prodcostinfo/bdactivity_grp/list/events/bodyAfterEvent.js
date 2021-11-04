//t062wrAbzsHyGvc+J5WsZFS5JQpJqOhk7tZ3wshRW9fDTY1ZtxRTii9f8OyJs6NJ

import { ajax, toast, promptBox } from 'nc-lightapp-front';

let whitOutkeys =['bscrapfactor','bshrinkfactor']//不走编辑后事件的key
export default function bodyafterEvent(props, moduleId, key, value, changedrows, index, record) {
    if(whitOutkeys.indexOf(key)!=-1){
        return;
    }
	
    
    if(changedrows[0].newvalue.value == changedrows[0].oldvalue.value){
		return;
    }
    if (moduleId == this.tableId) {
        // if(key =='pk_factorchart' || key =='pk_elementsystem'){//只有要素体系和要素表有编辑后事件
        //     let grid = {
        //         model : {
        //             rows:[record]
        //         },
        //         pageid : this.pageId
        //     }
        //     ajax({
        //         url: '/nccloud/mapub/costtype/afterevent.do',
        //         data: {
        //             grid: grid,
        //             pageId: this.pageId,
        //             key :key
        //         },
        //         async: false,
        //         success: (res) => {
        //             if (res.data) {
        //                props.editTable.updateDataByIndexs(this.tableId,[{index:index ,data :res.data[this.tableId].rows[0]}]);
        //             }
        //         }
        //     });
        // }
        //编辑最后一行的时候需要新增行
        // let allData = props.editTable.getAllRows(this.tableId);
        // let size = 0;
        // allData.forEach(item => {
        //     if(item.status !='3'){
        //         size ++;
        //     }
        // });
        // if(size == (index+1)){
        //     this.addLine(false);
        // }
    



    }

}

//t062wrAbzsHyGvc+J5WsZFS5JQpJqOhk7tZ3wshRW9fDTY1ZtxRTii9f8OyJs6NJ