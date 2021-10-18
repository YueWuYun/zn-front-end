/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
import { URL_PARAM, SCENE, LINKTYPE, sagaField, sagaFrozenEnum, sagaStateEnum } from "../../../../../tmpub/pub/cons/constant";
import base from "..";
/**
 * 小应用所涉及的常量定义，避免采用字符串变量，导致定义混乱松散不利于维护
 */

/**
 * 列表常量定义
 */
const list = {
    //页面编码
    pageCode: '36340CDIR_L01',
    //查询区域编码
    searchCode: '36340CDIR_L01_search',
    //表格区域编码
    tableCode: '36340CDIR_L01_head'
}

/**
 * 卡片常量定义
 */
const card = {      
    //表头区域编码
    headCode: '36340CDIR_C01_head',
    //头部按钮区域编码
    btnHeadCode: 'card_head'
}
/**
 * 字段名
 */
const field = {
    //表头主键
    pk: 'pk_intlist'
}

/**
 * 公共常量定义
 */
const comm = { 
    billType: '36LG',   
    //缓存KEY
    dataSource: 'tm.ifac.demandinttrcpt.datasource',
    /**是否进行异常弹框 */
    iserrtoast: 'iserrtoast', 
    //指派类型¬
    assignType: {
        commit: 0,
        savecommit: 1
    }
}


/**
 * 常量定义
 */
export default {
    list, card, comm, field
}
/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/