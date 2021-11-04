//mgBVjmwkvoNAq04L4PpN6ZIA/QzxBV+MCAAG69A2uj/sL1GH7iYAwCCuEuAH74h4
/**
 * 
 * @description  表体的编辑前事件
 * @param props 内部方法，moduleId(区域id), item(模版当前列的项), index（当前索引）,value（当前值）, record（行数据）
 * 
 * 
 */

export function beforeEvent(props, moduleId, item, index, value, record){
    console.log("beforeEvent::",this,props, moduleId, item, index, value, record);
    let meta = props.meta.getMeta();

    return meta;
}
//mgBVjmwkvoNAq04L4PpN6ZIA/QzxBV+MCAAG69A2uj/sL1GH7iYAwCCuEuAH74h4