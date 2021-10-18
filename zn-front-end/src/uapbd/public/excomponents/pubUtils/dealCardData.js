
/**
 * hanzhhm
 * 主子表清除表格表单数据，为了数据上行流量,减少压缩时间
 */

// tableIds 一主多子传tableIds数组
// 一组一子不用传
let dealCardData = (that,cardData,tableIds) =>{
    let newCardData = JSON.parse(JSON.stringify(cardData));
    let head = newCardData.head[that.formId].rows[0];
    dealHead(head ,newCardData);

    if(tableIds){
        tableIds.forEach(tableId => {
            let bodys =  newCardData.bodys[tableId].rows;
            dealbodys(bodys,newCardData);
        });
    }else{
        let bodys =  newCardData.body[that.tableId].rows;
        dealbodys(bodys,newCardData);
    } 
    return newCardData;
}


let dealHead = (head) =>{
    let values = head.values;
    Object.keys(values).map((key, index) => {
        //清空value和display
        let value = values[key].value;
        let scale = values[key].scale;
        let valueFlag = getValueFlag(value);

        if (!valueFlag && (scale == '-1' || !scale)) {
            values[key] = {};
        } else {
            //去掉display
            if (scale && valueFlag) {
                values[key] = { value: value, scale: scale };
            } else if (scale && !valueFlag) {
                values[key] = { scale: scale };
            } else if (!scale && valueFlag) {
                values[key] = { value: value };
            }

        }
    });
}

let dealbodys = (bodys) =>{
    let length = bodys.length;
    for(let i = 0 ;i < length ; i ++){
        let body = bodys[i];
        if(!body){
            continue;
        }
        let values = body.values;
        Object.keys(values).map((key) => {
            //清空value和display
            let value = values[key].value;
            let scale = values[key].scale;
            let valueFlag = getValueFlag(value);

            if(!valueFlag&& (scale == '-1'||!scale)){
                values[key] ={};
            }else{
                //去掉display
                if(scale && valueFlag){
                    values[key] ={value:value,scale:scale};
                }else if(scale && !valueFlag){
                    values[key] ={scale:scale};
                }else if(!scale && valueFlag){
                    values[key] ={value:value};
                }
               
            }
        });
    }
}
//false 代表value不存在 true代表value存在
let getValueFlag = (value)=>{
    //因为value可能为布尔类型，布尔类型为false的话也认为是有值的
    if(value===null || value===undefined || value === ''){
        return false;
    }else{
        return true;
    }
}


export { dealCardData};