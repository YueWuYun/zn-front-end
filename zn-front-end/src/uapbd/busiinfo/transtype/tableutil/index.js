//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/*
**过滤数据,参数数据结构：{rows:[{rowid:,status:,values:{...}}]}
**tableData为表单上编辑前的数据  ；returnData 为编辑操作的返回值
*/
export default (function(tableData,returnData,pkFieldName){
    //map存放主键和表单对应数据数组下标
    let map={};
    for(let i=0;i<tableData.rows.length;i++){
        let key=(tableData.rows[i].values[pkFieldName].value);
        map[key]=i;
    }
    returnData.rows.forEach(row => {
        let pk=row.values[pkFieldName].value;
        let dataStatus=row.status;
        let index=map[pk];//获取该条记录对应的编辑前数据数组下标
        if(dataStatus=='3'){
            //数据为删除态
            tableData.rows.splice(index,1)//将该元素从原数据中删除
        }else if(index||index==0||index==1){
            //编辑保存的数据
            tableData.rows[index]=row;
        }else if(!index&&index!=0&&index!=1){
            //新增保存的数据
            tableData.rows.push(row);
        } 
    });
    return tableData;
}
)

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65