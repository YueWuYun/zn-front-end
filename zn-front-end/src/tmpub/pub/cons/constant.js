/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/
/** 地址栏参数 */
export const URL_PARAM = {
  /** 主键 */
  ID: 'id',
  /** 界面状态 */
  STATE: 'status',
  /** 场景标志 */
  SCENE: 'scene',
  /** 预算联查参数 */
  TBB_LINK: 'pk_ntbparadimvo',
  /** 联查主键 */
  LINK_ID: 'linkId',
  /** 来源单据主键 */
  PK_SRC: 'pk_src'
}

/**Saga字端定义 */
export const sagaField = {
  /**冻结状态 */
  frozen: 'saga_frozen',
  /**全局事务id */
  gtxid: 'saga_gtxid',
  /**本地事务id */
  btxid: 'saga_btxid',
  /**分布式事务状态 */
  status: 'saga_status'
}

/**Saga冻结状态枚举 */
export const sagaFrozenEnum = {
  /**冻结 */
  frozen: 1,
  /**未冻结 */
  unfrozen: 0
}

/**Saga事务状态枚举 */
export const sagaStateEnum = {
  /**成功 */
  success: 0,
  /**失败 */
  fail: 1
}
/**
* 场景标志
*/
export const SCENE = {
  /**
  * 默认场景
  */
  DEFAULT: 'defaultsce',
  /**
  * 审批场景
  */
  APPROVE: 'approvesce',
  /**
  * 联查
  */
  LINK: 'linksce',
  /**
  * 凭证反联查
  */
  FIP: 'fip',
  /**
  * 其他
  */
  OTHER: 'othersce'
}

/**
* 联查类型
*/
export const LINKTYPE = {
  /**普通联查 */
  NORMAL: 'NORMAL',
  /**单据追溯 */
  BILL_REVIEW: 'BILL_REVIEW'
}

/**
 * 联查地址栏参数
 */
export const LINK_PARAM = {
  ARAP: {
    FLAG: "flag",
    FLAG_VALUE: 'ftsLinkArap'
  }
}
/**
 * 模块信息
 */
export const MODULE_INFO = {
  TMPUB: 'tmpub',
  TMPUB_NUM: '3601'
}

/** 公共请求URL定义 */
export const COMMON_URL = {
  //电子签章打印检查
  ELECSIGNPRINTCHECK: '/nccloud/tmpub/pub/elecsignprintcheck.do'
}

/**公共缓存 */
export const cache = {
  //汇率信息
  rateinfo: 'rateinfo',
  /**是否进行异常弹框 */
  iserrtoast: 'iserrtoast'
}
/**预算控制类型 */
export const SPLIT_TBBCTRLTYPE = '_ctrltype_';
/**预算提示类型 */
export const tbbwarntype = {
  /**柔性控制 */
  flexibility: '0',
  /**刚性控制 */
  inflexibility: '1',
  /**预警 */
  warning: '2',
}
/*HsJGgXoCueKidK+JSYUoEit8HjXWTk45EvayaeQ5pnOmTlkZtC8etYSK3z8tDKqX*/