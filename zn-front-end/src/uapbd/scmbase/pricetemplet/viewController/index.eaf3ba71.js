/*! @ncctag {"project":"","branch":"","provider":"","date":"2020-5-11 15:05:29"} */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("nc-lightapp-front")):"function"==typeof define&&define.amd?define(["nc-lightapp-front"],t):"object"==typeof exports?exports["uapbd/scmbase/pricetemplet/viewController/index"]=t(require("nc-lightapp-front")):e["uapbd/scmbase/pricetemplet/viewController/index"]=t(e["nc-lightapp-front"])}(window,(function(e){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="../../../../",n(n.s=17)}({0:function(t,n){t.exports=e},1:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getLangByResId=t.initLang=void 0;var i=n(0);t.initLang=function(e,t,n,o){e.lang=null,e.inlt=null,(0,i.getMultiLang)({moduleId:t,domainName:n,callback:function(t,n,i){n&&(e.lang=t,e.inlt=i),o&&o()},needInlt:!0})},t.getLangByResId=function(e,t,n){return function(e,t){if(!e)throw(0,i.toast)({color:"danger",content:"请检查代码中this是否能够取到！当前为undifined,位置："+t}),new Error("请检查代码中this是否能够取到！当前为undifined,位置："+t)}(e,t),n?e.inlt?e.inlt.get(t,n)||t:"":e.lang?e.lang[t]||t:""}},17:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setButtonEnable=t.togglePageStatus=void 0;var i=n(49);t.togglePageStatus=i.togglePageStatus,t.setButtonEnable=i.setButtonEnable},49:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setButtonEnable=t.togglePageStatus=void 0;var i=n(7),o=n(1);function l(e){var t=e.editTable.getCheckedRows(i.AREA.table_head);t&&t.length>0?e.button.setButtonDisabled(i.BUTTON.Delete,!1):e.button.setButtonDisabled(i.BUTTON.Delete,!0)}t.togglePageStatus=function(e,t){this.UIStatus=t,function(e,t){var n=e.button,o=n.setButtonVisible,l=n.setButtonDisabled;switch(t){case i.STATUS.browse:o(i.BUTTON_EDIT,!1),o(i.BUTTON_BROWSE,!0);l({Add:!1,Delete:!1,Refresh:!1});break;case i.STATUS.edit:o(i.BUTTON_BROWSE,!1),o(i.BUTTON_EDIT,!0)}}(e,t),l(e);var n=e.editTable.setStatus;n(i.AREA.table_head,t),n(i.AREA.table_body,t),i.STATUS.browse==t?e.button.setPopContent(i.BUTTON.Delete_inline_head,(0,o.getLangByResId)(this,"4004PRICETEMPLET-000011")):e.button.setPopContent(i.BUTTON.Delete_inline_head)},t.setButtonEnable=l},7:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.AREA={table_head:"table_head",table_body:"table_body",table_head_inline:"table_head_inline",table_body_inline:"table_body_inline"},t.APPCODE="400400600",t.PAGECODE="400400600_list",t.ACTION_URL={initData:"/nccloud/uapbd/pricetemplate/query.do",save:"/nccloud/uapbd/pricetemplate/save.do",update:"/nccloud/uapbd/pricetemplate/update.do",delete:"/nccloud/uapbd/pricetemplate/delete.do",bodyAfterEdit:"/nccloud/uapbd/pricetemplate/bodyAfterEdit.do"},t.BUTTON={Add:"Add",Edit_inline_head:"Edit_inline_head",Delete:"Delete",Refresh:"Refresh",Save:"Save",Cancel:"Cancel",Delete_inline_head:"Delete_inline_head",AddLine_inline_body:"AddLine_inline_body",DeleteLine_inline_body:"DeleteLine_inline_body"},t.BUTTON_BROWSE=["listButtonGroup","Add","Delete","Refresh","Edit_inline_head","Delete_inline_head"],t.BUTTON_EDIT=["Save","Cancel","AddLine_inline_body","DeleteLine_inline_body"],t.STATUS={edit:"edit",browse:"browse"},t.SAVE_TYPE={add:"add",edit:"edit"},t.FIELD={cpriceitem:"cpriceitem"}}})}));
//# sourceMappingURL=index.eaf3ba71.js.map