//i2vFQcwYT1wC0fhlLBqp6gQ56z26hGlJ44OaF80/ePGT0lFUlhaJ+xaNA0Ls2tzI

/**
 * 转化成树需要的结构
 * @param needData= {
        pid: "pk_parent",//父亲id
        refcode:"type_code",//节点的code
        refname: "type_name",//节点name
        refpk:"pk_contracttype",//节点pk
        id:"pk_contracttype",//节点pk
        values:{}//这里可以随意赋值，一般赋树节点的对象值
    } ;
 * @param refTreeRootName//根节点需要展示的名字
 * @param queryTreeData//查询树回来的值
 * @param props//this.props
 * @returns {*}//返回一个乱序的树结构数据
 */
function transformToTree (needData, refTreeRootName,  queryTreeData, props, onlyname) {
    let formatData =[];
    let hasRootNode = false;//是否有根节点
    if(queryTreeData.length>0){
        let pidValue = '';
        
        formatData = queryTreeData.map(( item ) => {
            if(item[needData.refpk] === 'root'){
                pidValue = null;
                hasRootNode = true;
            }else{
                pidValue = item[needData.pid]?item[needData.pid] :"root"
            }
            let tempData = {
                pid: pidValue,
                refcode: item[needData.refcode],
                refname: onlyname? item[needData.refname]:item[needData.refcode]+" "+item[needData.refname],
                refpk: item[needData.refpk],
                id: item[needData.id],
                values: item,
                key :item[needData.refpk],
                title :onlyname? item[needData.refname]: item[needData.refcode]+" "+item[needData.refname],
                children:[],
                fpid: item[needData.fpid]?item[needData.fpid] :"root",
            }
            return tempData;
        });
    }
    if(!hasRootNode){
        let root = {
            pid: null,//根节点不需要父节点
            refcode:"root",
            refname: refTreeRootName?refTreeRootName :"树根",
            refpk:"root",
            id:"root",
            key :'root',
            title :refTreeRootName?refTreeRootName :"树根",
            fpid:'null'
        }
        formatData.push(root);
    }
    
   
    //转化成树结构createTreeData
    let disorderedTreeData = props.syncTree.createTreeData(formatData);
    // if(onlyname){
    //     return disorderedTreeData.splice(0, 1);
    // }
    return disorderedTreeData;
}
//返回的节点以及转化后并不是有序的，需排序
function sortTree(disorderedTreeData) {
    disorderedTreeData.sort(sortTreeByCode);
    disorderedTreeData.map( (item) => {
        if(item.children){
            sortTree(item.children);
        }else{
            item.children = []
        }
    });

}

function sortTreeByCode(a, b){
    if(a.refcode > b.refcode){
        return 1
    }else if(a.refcode < b.refcode){
        return -1
    }else{
        return 0;
    }
}

export {
    transformToTree,
    sortTree
}
//i2vFQcwYT1wC0fhlLBqp6gQ56z26hGlJ44OaF80/ePGT0lFUlhaJ+xaNA0Ls2tzI