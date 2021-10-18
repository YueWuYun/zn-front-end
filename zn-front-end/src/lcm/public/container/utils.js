/**
 * 按钮整理不包含按钮组
 * @param {*} buttons 全部按钮集合
 */
export const handleBtnData = (buttons) => {
  let btnsArray = [];
  const handleFunc = (btns) => {
    btns.map((item) => {
      if (item.type != "buttongroup") {
        btnsArray.push(item.key);
      }
      if (item.children && item.children.length > 0) {
        handleFunc(item.children);
      }
    });
  };
  handleFunc(buttons);
  return btnsArray;
};

/**
 * 按钮规则处理
 * args[0] 参数为 对应处理规则
 * 其余参数应传递给对应按钮规则函数
 */
export function btnRuleHandle(...args) {
  // 按钮显隐性集合
  let btnsVisible = {};
  // 按钮编辑性集合
  let btnsDisable = {};
  // 按钮主次性集合
  let btnsPrimary = {};
  args[0].forEach((item) => {
    let { key, visible, disable, primary } = item;
    visible = handleRule.call(this, visible, undefined, ...args.slice(1));
    disable = handleRule.call(this, disable, undefined, ...args.slice(1));
    primary = handleRule.call(this, primary, undefined, ...args.slice(1));
    if (typeof visible !== "undefined") {
      btnsVisible[key] = visible;
    }
    if (typeof disable !== "undefined") {
      btnsDisable[key] = disable;
    }
    if (typeof primary !== "undefined") {
      btnsPrimary[key] = primary;
    }
  });
  return {
    btnsVisible,
    btnsDisable,
    btnsPrimary,
  };
}

/**
 * 规则处理
 * @param {*} rule 每条规则
 * @param {*} def 默认值
 * @param {*} args 其他参数
 */
export function handleRule(rule, def, ...args) {
  if (typeof rule !== "undefined") {
    // 有处理规则时
    if (rule instanceof Boolean) {
      // 当前规则 为 boolean 时 直接返回当前规则
      return rule;
    } else if (rule instanceof Function) {
      // 当前规则 为 function 时 返回当前规则执行结果 （执行结果应该为 boolean）
      return Boolean(rule.call(this, ...args));
    } else {
      // 其他的类型 强转 为 boolean 后返回
      return Boolean(rule);
    }
  } else {
    // 处理规则 未设置时 需赋默认值
    return def;
  }
}

export const AccSum = (num1, num2, signal = true) => {
  let r1, r2, m, n;
  try {
    r1 = num1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  let type = signal ? 1 : -1;
  return (num1 * m + type * num2 * m) / m;
};

/**
 * 判断传入值是否为空
 *
 * @param {*} value - 需要判断的值
 */
export const isEmpty = (value) => [null, undefined, ""].includes(value);

/**
 * 给列表查询区域赋默认业务单元(在setMeta之后使用)
 * @param {*} areaCode 列表查询区域编码
 * @param {*} context  后端缓存中存储的全局上下文信息
 */
export const setDefOrg2ListSrchArea = function (context, field = "pk_org") {
  let { SearchConfig, search } = this.props;
  // 查询区不显示时直接跳出
  if (!SearchConfig.show) return;
  //判空
  if (!hasDefaultOrg(context)) return;
  //判断查询区域组织是否有值，如果有则表明快速查询方案已个性化定制。无需加载默认业务单元
  if (hasSearchValue(search, SearchConfig.searchId, field)) return;
  //获取默认业务单元
  let { pk_org, org_Name } = context;
  let searchData = { display: org_Name, value: pk_org };
  //更新列表查询区域
  search.setSearchValByField(SearchConfig.searchId, field, searchData);
};

/**
 * 给高级查询区域赋默认业务单元(在setMeta之前使用)
 * @param {*} data  createUIDom请求返回数据
 */
export const setDefOrg2AdvanceSrchArea = function (data, field = "pk_org") {
  let { SearchConfig } = this.props;
  // 查询区不显示时直接跳出
  if (!SearchConfig.show) return;
  let { template, context } = data;
  //判空
  if (!hasDefaultOrg(context)) return;
  //获取默认业务单元
  let { pk_org, org_Name } = context;
  //遍历查询区域字段，将默认业务单元赋值给组织字段
  template[SearchConfig.searchId].items.map((item) => {
    if (item.attrcode == field) {
      item.initialvalue = { display: org_Name, value: pk_org };
    }
  });
};

/**
 * 判断查询区域查询条件是否有值
 * @param {*} search 查询区的方法
 * @param {*} areaCode 查询区域编码
 * @param {*} item 查询条件字段名
 */
const hasSearchValue = function (search, areaCode, item) {
  try {
    let searchValue = search.getSearchValByField(areaCode, item);
    return searchValue &&
      searchValue.value &&
      (searchValue.value.firstvalue || searchValue.value.secondvalue)
      ? true
      : false;
  } catch (e) {
    return true;
  }
};

/**
 * 判断是否有默认业务单元数据
 * @param {*} context createUIDom请求返回数据
 */
export const hasDefaultOrg = function (context) {
  return context && context.pk_org;
};

/**
 * 单据场景信息
 * 获取当前场景下单据 页面编码、是否联查 等信息
 * @param { String } page_id // 正常页面ID
 * @param { String } page_id_link // 所有联查场景下的页面ID
 * @param { Function } initTemplateFun // 处理模板 meta 数据方法
 */
export const sceneInfo = function ({ page_id, page_id_link, page_id_approve, initTemplate }) {
  let { getUrlParam } = this.props;
  let scene = getUrlParam("scene");
  let pk_ntbparadimvo = getUrlParam("pk_ntbparadimvo"); // 预算反联查
  // 预算反联查 内部统一定为 "ntbLink"
  scene = pk_ntbparadimvo ? "ntbLink" : scene;
  // 所有联查场景 （联查场景下不需要对模板 meta 进行处理）
  switch (scene) {
    case "linksce": // 其他联查
    case "fip": // 凭证反联查
    case "ntbLink": // 预算反联查
      // 一般联查场景
      return {
        currentScene: "linksce",
        initTemplateFun: null,
        pageId: page_id_link,
      };
    case "approvesce":
      // 审批联查场景 
      return {
        currentScene: "approvesce",
        initTemplateFun: null,
        pageId: page_id_approve,
      };
    default:
      // 正常场景
      return {
        currentScene: null,
        initTemplateFun: initTemplate,
        pageId: page_id,
      };
  }
};