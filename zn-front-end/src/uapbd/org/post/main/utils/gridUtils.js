//X49mkq0Jz988OggDeDoPpZ6PQqGJkbaM30AohC3kXVnhRqI+YLzT5nUYn7p/apEo
/**
 *把后台操作 新增 ，删除，修改返回的grid数据更新到缓存的grid数据
 * @param sourceGrid 后台返回的grid数据
 * @param targerGrid 缓存的grid数据
 * @returns targerGrid
 */

export default function(sourceGrid,targerGrid){

    let tempdata ={};
    //遍历返回的sourceGrid rows 如果是status是新增的直接push到targerGrid中
    //如果是修改则放到临时的tempdata
    sourceGrid.forEach((ele)=>{
        if(ele.status =='2'){
            targerGrid.push(ele);
        }else{
            tempdata[ele.rowid] = ele;
        }
    });
    //替换targerGrid 中rowid 和sourceGrid 中相同的
    targerGrid.map((ele,index)=>{
        targerGrid[index] = tempdata[ele.rowid]||ele;
    });
    //移除targerGrid中status是3的(删除的数据)
    targerGrid.map((ele,index)=>{
        if(ele.status =='3'){
            targerGrid.remove(ele);
        }
    })

    return targerGrid;

}

//X49mkq0Jz988OggDeDoPpZ6PQqGJkbaM30AohC3kXVnhRqI+YLzT5nUYn7p/apEo