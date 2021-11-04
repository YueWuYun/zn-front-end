//3EuVk8AqpCwffBDmPdQdlnnt5c1lXKiC+GhKUuAPBdfRkmTbHw0PUHzY39mUcp2Chm1B7vbsXc9e
lonseO8xxA==
/**
 * 网银信息模板
 * @param metaitems
 * @param data
 */
export default function (metaitems,data) {
    let jsonarr = JSON.parse(data);

    if(metaitems.length === 0 || jsonarr.length ===0){
        return;
    }
    metaitems.map((item)=>{
        jsonarr.map((obj)=>{
            if(item.label === obj.displayname){
                item.required =  !obj.isempty.value;
                item.visible = obj.isvisible.value;
            }
        })
    });
}

//3EuVk8AqpCwffBDmPdQdlnnt5c1lXKiC+GhKUuAPBdfRkmTbHw0PUHzY39mUcp2Chm1B7vbsXc9e
lonseO8xxA==