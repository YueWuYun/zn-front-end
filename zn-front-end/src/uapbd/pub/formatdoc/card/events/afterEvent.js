//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a
import { createPage, ajax, base,toast } from 'nc-lightapp-front';

let { NCMessage } = base;
let tableId = "formatdocccard"
export default function afterEvent(props, moduleId, key, value, index) {

    if (moduleId == "formatdoccform" && key === "basicdatatypecode") {
        // props.editTable[this.tableId].currentIndex;
        let allrows = props.editTable.getAllRows(this.tableId, true);
        let uniqueflag = true;
        allrows.map((item) => {
            if (index[0].rowid != item.rowid && value.refpk != null && item.values.basicdatatypecode.value === value.refpk) {
                uniqueflag = false;
            }
        });
        if (!uniqueflag) {
            // NCMessage.create({ content: this.state.json['xi-exsystem-000003'] + value.refname + this.state.json['xi-exsystem-000004'], position: 'bottom', color: 'danger' });/* 国际化处理： 基础档案[,]存在重复，请重新编辑*/
            toast({ content: this.state.json['xi-exsystem-000003'] + value.refname + this.state.json['xi-exsystem-000004'], color: 'warning' });/* 国际化处理： 基础档案[,]存在重复，请重新编辑*/
            props.editTable.setValByKeyAndRowId(this.tableId, index[0].rowid, key, { value: null, display: null });
            return;
        }
        // props.editTable.setValByKeyAndRowId(this.tableId,index[0].rowid,"basicdatatypecode",{value:null,display:null});
        props.editTable.setValByKeyAndRowId(this.tableId, index[0].rowid, "basicdatatypecode.displayname", { value: value.refname, display: value.refname });

    }
}


//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a