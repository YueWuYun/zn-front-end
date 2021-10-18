/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { openBtn } from "../tableButtonClick/openBtn";
import { deletelineBtn } from "../tableButtonClick/deletelineBtn";
import { editmoreBtn } from "../tableButtonClick/editmoreBtn";
/**
 * 操作列中按钮
 * @param {*} props 
 * @param {*} key 
 * @param {*} text 
 * @param {*} record 
 * @param {*} index 
 */
export default function tableButtonClick(props, key, text, record, index) {

    switch (key) {

         //展开
         case 'closeBtn':
         openBtn.call(this, record, index);
         break;
        //展开
        case 'openBtn':
            openBtn.call(this, record, index);
            break;
        //删行
        case 'deletelineBtn':
            deletelineBtn.call(this, record, index);
            break;
        //编辑展开
        case 'editmoreBtn':
            editmoreBtn.call(this, record, index);
            break;
    }
}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/