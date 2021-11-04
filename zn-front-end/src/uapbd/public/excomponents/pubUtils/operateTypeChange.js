//0n+peaU+hO7rQSKuDuf8IWTwBznjCtToPIoX2sxycRyL4QR07VgNXdA6L5l1KULN

/**
 * lishhk
 * 查询区会计期间操作符判断，等于参照是多选，其他的是单选
 */
let operateTypeChange =  (that,attrcodes,searchId,record,index) =>{
    if(attrcodes && attrcodes.length>0){
        if(attrcodes.indexOf(record)>=0){
            if(index=="="){
                that.props.search.setTemlateByField(searchId,record,'isMultiSelectedEnabled',true);
            }else{
                that.props.search.setTemlateByField(searchId,record,'isMultiSelectedEnabled',false);
            }
        }
    }
}

export { operateTypeChange };
//0n+peaU+hO7rQSKuDuf8IWTwBznjCtToPIoX2sxycRyL4QR07VgNXdA6L5l1KULN