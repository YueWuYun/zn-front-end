//P29foyyxf5dwsON3665JbK705Kl/7OEjaoUVdsFtAx62lybNzv9kAmuiDQak9Uwa
export default function (props, moduleId, key, value, changedrows, index,record) {

    switch (key) {
        case 'isdefault':
            if(value){
                let alltabledata = props.cardTable.getAllData(moduleId);
                alltabledata.rows.map((r,i)=>{
                    if(index !== i){
                        props.cardTable.setValByKeyAndIndex(moduleId,i,'isdefault',{value:false});
                    }else{
                        return;
                    }
                });
            }
            break;
    }
}
//P29foyyxf5dwsON3665JbK705Kl/7OEjaoUVdsFtAx62lybNzv9kAmuiDQak9Uwa