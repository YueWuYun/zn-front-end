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
    pageCode: '36070TBR_L01',
    //查询区域编码
    searchCode: 'search_transformbill_L01',
    //表格区域编码
    tableCode: 'table_transformbill_L01'
}

/**
 * 卡片常量定义
 */
const card = {      
    //页面编码
    pageCode: '36070TBR_C01',
    //表头区域编码
    headCode: 'form_transformbill_C01',
    //头部按钮区域编码
    btnHeadCode: 'card_head'
}
/**
 * 字段名
 */
const field = {
    //表头主键
    pk: 'pk_transformbill'
}

/**
 * 公共常量定义
 */
const comm = { 
    billType: '36S4',    
    //缓存KEY
    dataSource: 'tm.cmp.transform.datasource',
    /**是否进行异常弹框 */
    iserrtoast: 'iserrtoast',
    //指派类型¬
    assignType: {
        commit: 0,
        savecommit: 1
    }
}

const baseURL = '/nccloud/cmp/billmanagement/';

/**
 * 请求地址常量定义
 */
const url = {
    //列表地址
    listPage: '/list',
    //卡片地址
    cardPage: '/card',
    //列表请求地址
    list: {
        LIST2CARD_CHECK: baseURL + 'go2cardcheck.do',
    },
    //卡片请求地址
    card: {        
        //编辑后事件
        afteredit: baseURL + 'tfbafteredit.do',        
    },
    //公共请求
    common: {
       
    }
}


/**
 * 常量定义
 */
export default {
    list, card, comm, field,url
}
/*cI4u54VYZVPxnvGrX5EL6PYCr6LcJg/XGbrjr+nrMVtfUrkU/sSMLLvhorW1ZjgB*/