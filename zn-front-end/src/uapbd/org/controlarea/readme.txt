一些api注意说明：一定要详细了解以下说明，以及细看文档
做完单据之后麻烦删除该文档
1.
initMetaByPkorg() 
单据有主组织，新增时,将其他字段设置为不可编辑. 
显示主组织是pk_org时，使用方法可以不变:initMetaByPkorg();  显示主组织是pk_org_v时，调用需传参:initMetaByPkorg('pk_org_v')

resMetaAfterPkorgEdit()
选择主组织以后，恢复其他字段的编辑性

注意：以上两个api一定要成对出现，使用完initMetaByPkorg()时，必须在合适的时机使用resMetaAfterPkorgEdit()之后，
才能再继续使用initMetaByPkorg()，否则resMetaAfterPkorgEdit()将把页面信息还原不回去了。


2.开关的使用和作用
this.props.beforeUpdatePage();//打开开关
this.props.updatePage(this.formId, this.tableId); //关闭开关
只要是为了优化卡片界面的渲染问题，减少渲染次数；
文档地址，使用说明
http://git.yonyou.com/nc-pub/Public_Document/blob/master/%E5%89%8D%E7%AB%AF/%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/cardTable%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E9%80%82%E9%85%8D%E8%B0%83%E6%95%B4.md



3.单页缓存参考文档地址 
主要是对于浏览器中的一些缓存处理，重点关注下文档
http://git.yonyou.com/nc-pub/Public_Document/tree/master/%E5%89%8D%E7%AB%AF/%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/%E5%89%8D%E7%AB%AF%E5%8D%95%E9%A1%B5%E5%BA%94%E7%94%A8%E7%BC%93%E5%AD%98%E9%80%82%E9%85%8D
