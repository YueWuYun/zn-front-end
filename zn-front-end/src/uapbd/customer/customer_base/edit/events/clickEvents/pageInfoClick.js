//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1
export default  function(props, pk){
    setTimeout(()=>{
        this.props.setUrlParam(pk);
        setTimeout(()=>{
            this.getdata(pk,this.toogleBtnState.bind(this));
        })
    })
}

//j07c8riwYnz20MYibuDbtPeOXt4DvrbzffZgR90bPDqEaQcZrRYIqVVhMas+nZp1