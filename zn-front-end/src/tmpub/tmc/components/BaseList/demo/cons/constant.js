/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
import API_URL from './api';
export const APP_CONFIG = {
    APP_INFO: {
        //小应用编码
        appcode: '36650BA',
        //联查小应用编码 非必传，有联查时传
        appcodeLink: '36650BAL',
        //审批小应用编码 非必传，有审批联查时传
        appcodeApprove: '36650BAA',
        //打印输出编码
        nodekey: 'bondapplycard',
        //单据类型
        billtype: '3620',
        //页面标题
        pageTitle: '发债申请',
        //主键
        primaryId: 'pk_bondapply',
        //单据编号
        billNo: 'applycode',
        //缓存标示 命名规范：领域名.模块名.节点名.自定义名
        dataSource: 'tm.bond.apply.datasource',
    },
      
    //列表页常量
    LIST: {
        //页面编码
        pageId: '36650BA_LIST',
        //表格区域编码
        tableId: 'table',
        //查询区域编码
        searchId: 'search',
        //默认禁用按钮名称
        disabledBtn: ['Delete', 'Commit', 'Uncommit', 'Print', 'Output', 'Attachment', 'ApproveDetail', 'CreditAmount'],
        //表头按钮区域编码
        headBtnCode: 'list_head',
        //表格行按钮区域编码
        bodyBtnCode: 'list_inner',
        //查询区域oid
        oid: '1001Z61000000000P23O',
        //操作列按钮数量
        buttonLimit: 3,
        //查询区域缓存
        searchCache: {
            //查询区域缓存Key
            key: 'bond.bond.apply.searchCache',
            //查询区域缓存数据的名称空间
            dataSource: 'bond.bond.apply.searchSpace'
        },
        /* 
            表头按钮禁用状态
            key:根据哪个字段判断按钮是否禁用
            btnName:按钮编码
        */
        disabledBtnsParam: [{
            key: 'creditagreementid', //授信协议编号
            btnName: 'CreditAmount'    //联查授信额度
        }],
    },
    API_URL
}

/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/