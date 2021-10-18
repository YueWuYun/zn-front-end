/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/
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
    pageCode: '36070PBR_D5_list',
    //查询区域编码
    searchCode: 'search_D5',
    //表格区域编码
    tableCode: 'table_D5'
}

/**
 * 卡片常量定义
 */
const card = {      
    //表头区域编码
    headCode: 'head',
    //头部按钮区域编码
    btnHeadCode: 'card_head'
}
/**
 * 字段名
 */
const field = {
    //表头主键
    pk: 'pk_paybill'
}

/**
 * 公共常量定义
 */
const comm = { 
    billType: 'F5',    
    //缓存KEY
    dataSource: 'tm.cmp.paybill.datasource',
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
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/