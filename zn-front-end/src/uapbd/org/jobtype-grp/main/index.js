//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import ReactDOM from 'react-dom';
import JobType from '../../jobtype-base/main'
import { createPage, base, ajax ,NCCreateSearch,toast} from 'nc-lightapp-front';

let config = {
    nodeType: 'group',
    funcode: '10100JTB',
    pageCode: "10100JTG_jobtype",
    relFunCode: "10100JTG"
}

let JobTypeGrp = createPage({
    billinfo:{
        billtype: 'form',
        pagecode: config.pageCode,
        bodycode: 'jobtype'
    },
    initTemplate: []
})(JobType)

ReactDOM.render(<JobTypeGrp {...config}/>, document.querySelector('#app'))
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65