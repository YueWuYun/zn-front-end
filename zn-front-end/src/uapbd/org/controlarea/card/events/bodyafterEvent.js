//Zy7AqPOxncupTK40pWgxPBHbQv1+RypJro5vGvkvzmm4inVd30sPQaYOczlX1Wtk
import { ajax, toast, promptBox } from 'nc-lightapp-front';

//需要走编辑后事件的字段信息
let keys =['nmoney','nnum','nprice','cmaterialid']

export default function bodyafterEvent(props, moduleId, key, value, changedrows, i, s, g) {
    //表体编辑后事件
    if (moduleId == this.tableId) {
        //表体编辑后事件
        if (moduleId == this.tableId) {
            let rows = this.props.cardTable.getAllRows(this.tableId);
            if (changedrows.length > 1) {
                //props.cardTable.setValByKeyAndIndex(tableId,i,key,{value: value[0].refpk ,display: value[0].refname}); 
                rows[i].values[key] = { value: value[0].refpk, display: value[0].refname }
            }
            switch (key) {
                case 'pk_setofbook':
                    // 
                    if(changedrows[0].newvalue.value != changedrows[0].oldvalue.value){
                        this.props.cardTable.setValByKeyAndRowId(this.tableId,changedrows[0].rowid,'pk_accchart',{value:null, display: null});
                        this.props.cardTable.setValByKeyAndRowId(this.tableId,changedrows[0].rowid,'pk_factorchart',{value:null, display: null});
                    }
                }
            }

        if(keys.indexOf(key) !=-1){
            if(changedrows.length > 1){
                this.props.cardTable.setValByKeyAndIndex(this.tableId,i,key,{value : value[0].refpk ,display: value[0].refname});
            }
            ajax({
                url: '/nccloud/cm/inprocomstuff/cardbodyafteredit.do',
                data: {
                    rowindex: 0,
                    editindex: i,
                    pageId: this.pageId,
                    changedrows: changedrows,
                    tableId: this.tableId,
                    body: props.cardTable.getDataByIndex(this.tableId, i),
                    formEvent: props.createFormAfterEventData(this.pageId, this.formId, this.tableId, key, value),
                    uiState: this.props.getUrlParam('status')
                },
                async: false,
                success: (res) => {
                    
                    let {body,head} = res.data;
                    if (head) {
                        this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                    }
                    if (body) {
                        //由于表体有些数据可能出现多选的情况，多选之后，部分数据需要插入，一条数据更新当前行
                        if(body[this.tableId].rows.length > 1){
                            let rows = body[this.tableId].rows;
                            let updateBody ={
                                areacode : this.tableId,
                                rows :[]
                            }
                            let insertRows =[]
                            rows.forEach(function(value,i){
                                if(i == 0){
                                    updateBody.rows.push(value);
                                }else{
                                    insertRows.push(value);
                                }
                            })
                            this.props.cardTable.updateDataByRowId(this.tableId, updateBody);
                            this.props.cardTable.insertRowsAfterIndex(this.tableId, insertRows,i);
                        }else{
                            this.props.cardTable.updateDataByRowId(this.tableId, res.data.body[this.tableId]);
                        }
                        
                    }
                }
            });
        }
        

        let body = props.cardTable.getDataByIndex(this.tableId, i);
        let allRowsNumber = this.props.cardTable.getNumberOfRows(this.tableId);
        //该节点根据物料判断是否是空白行，其余节点可能有差异，根据自己的差异进行修改
        let cmaterialid = body.values.cmaterialid ? body.values.cmaterialid.value : null; 
        //如果最后一行本身是空白行，就不再进行新增了
	    if (allRowsNumber == (i + 1) && cmaterialid) {
            this.props.cardTable.addRow(this.tableId,undefined,undefined,false);
        }



    }

}

//Zy7AqPOxncupTK40pWgxPBHbQv1+RypJro5vGvkvzmm4inVd30sPQaYOczlX1Wtk