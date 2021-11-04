//t062wrAbzsHyGvc+J5WsZFS5JQpJqOhk7tZ3wshRW9fDTY1ZtxRTii9f8OyJs6NJ

import { ajax, toast, promptBox } from 'nc-lightapp-front';

/**
 * author kangjjd
 */
export default function bodyafterEvent(props, moduleId, key, value, changedrows, index, record) {
    if(changedrows[0].newvalue.value == changedrows[0].oldvalue.value){
		return;
    }
    if (moduleId == this.tableId) {
            let grid = {
                model : {
                    rows:[record]
                },
                pageid : this.pageId
            }
            ajax({
                url: '/nccloud/uapbd/bdcostcomponent/afterevent.do',
                data: {
                    grid: grid,
                    pageId: this.pageId,
                    key :key
                },
                async: false,
                success: (res) => {
                    if (res.data) {
                       props.editTable.updateDataByIndexs(this.tableId,[{index:index ,data :res.data[this.tableId].rows[0]}]);
                    }
                }
            });

        //编辑最后一行的时候需要新增行
        let allData = props.editTable.getAllRows(this.tableId);
        let size = 0;
        allData.forEach(item => {
            if(item.status !='3'){
                size ++;
            }
        });
        if(size == (index+1)){
            this.addLine(false);
        }
    



    }

}

//t062wrAbzsHyGvc+J5WsZFS5JQpJqOhk7tZ3wshRW9fDTY1ZtxRTii9f8OyJs6NJ