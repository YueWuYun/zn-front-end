//kVfUC1lt3rAA0yi5CTqilYp95mYTMEwmS5J3cHq3VGPSwBW6nL4UT+YLtXolZcPR
/**
 * 网银信息模板
 * @param metaitems
 * @param data
 */
export default function (metaitems,data,flag) {
    let jsonarr;
    if(!!data){
        jsonarr = JSON.parse(data)
    }else{
        return;
    }
    if(metaitems.length === 0 || jsonarr.length ===0){
        return;
    }
    metaitems.map((item)=>{
        jsonarr.map((obj)=>{
            if(item.label === obj.displayname){
                item.required = flag ? obj.isempty.value:false;
                item.visible = flag ? obj.isvisible.value:true;
            }
        })
    });
}

//kVfUC1lt3rAA0yi5CTqilYp95mYTMEwmS5J3cHq3VGPSwBW6nL4UT+YLtXolZcPR