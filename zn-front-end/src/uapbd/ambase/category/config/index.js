//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
export const config={
    formId : 'head',
    treeId : 'categoryTree',
    bodyvosId : 'bodyvos',
    ajaxurl : {
        loadtree:'/nccloud/uapbd/amcategory/loadtree.do',
        loadtreeByCode:'/nccloud/uapbd/amcategory/loadtreebycode.do',
        query4form:'/nccloud/uapbd/amcategory/queryCategory4Form.do',
        savecategory:'/nccloud/uapbd/amcategory/savecategory.do',
        addcategory:'/nccloud/uapbd/amcategory/addcategory.do',
        deletecategory:'/nccloud/uapbd/amcategory/deletecategory.do',
        enablecategory:'/nccloud/uapbd/amcategory/enablecategory.do',
        disablecategory:'/nccloud/uapbd/amcategory/disablecategory.do',
        editcategory:'/nccloud/uapbd/amcategory/editcategory.do',
        loadleveltree:'/nccloud/uapbd/amcategory/loadleveltree.do',
        printcategorycard:'/nccloud/uapbd/amcategory/printcategorycard.do',
        queryparam:'/nccloud/uapbd/amcategory/categoryparamref.do'
    },
    keys : ['input_length','input_digit','nullflag']  //过来空行时，忽略的字段
}
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65