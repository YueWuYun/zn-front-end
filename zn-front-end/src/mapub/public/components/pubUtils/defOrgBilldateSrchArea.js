
/**
 * 初始化页面模板的时候给查询区附加值
 * hanzhhm
 * @param {*} props 
 * @param {*} areacode 查询区域编码
 * @param {*} data 模板信息
 */
export default function setDefOrgBilldateSrchArea(props, areacode, data) {
    if (!props || !areacode || !data || !data.template || !data.context) {
        return;
    }
    let meta = data.template;
    //获取默认业务单元
    let { pk_org, org_Name } = data.context;
    let transtype = null;
    let transtype_name = null;
    if (data.context.paramMap != null && data.context.paramMap.transtype != null && data.context.paramMap.transtype_name != null){
        transtype = data.context.paramMap.pk_transtype;
        transtype_name = data.context.paramMap.transtype_name;
    }
    
    var billdateInitialvalue = null;
    if (data.template.query != null){
        var queryschemes = data.template.query.queryschemes;
    }
    if (queryschemes != null && queryschemes.length > 0) {
        for (var i = 0; i < queryschemes.length; i++) {
            let queryscheme = queryschemes[i];
            if (queryscheme.isquickqs == true) {
                //遍历快速查询方案设置的默认值
                let renderobj4web = queryscheme.renderobj4web;
                if (renderobj4web != null && renderobj4web.length > 0) {
                    for (var i = 0; i < renderobj4web.length; i++) {
                        if (renderobj4web[i].attrcode == 'billdate') {
                            billdateInitialvalue = renderobj4web[i].initialvalue;
                            break;
                        } else if (renderobj4web[i].attrcode == 'root'){
                            let childrenRenderobj4web = renderobj4web[i].children;
                            if (childrenRenderobj4web != null && childrenRenderobj4web.length > 0){
                                for(var j = 0; j < childrenRenderobj4web.length; j++){
                                    if (childrenRenderobj4web[j].attrcode == 'billdate') {
                                        billdateInitialvalue = childrenRenderobj4web[j].initialvalue;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    //遍历查询区域字段，将默认业务单元赋值给组织字段
    meta[areacode].items.map((item) => {
        if (item.attrcode == 'pk_org') {
            item.initialvalue = { 'display': org_Name, 'value': pk_org }
        } else if (item.attrcode == 'billdate') {
            item.initialvalue = billdateInitialvalue;
        } else if (item.attrcode == 'pk_tradetypeid' && transtype_name){
            item.initialvalue = { 'display': transtype_name, 'value': transtype }
        }
    });
}
