
//test 无效代码
let initState = {
    info:{}
}
const LOAD_INFO = 'github/ScreenMy/LOAD_INFO'

export const loadInfo = () => (dispatch,getState) => {
    let info = {
        name:'shine',
        sex:'male'
    }
    dispatch({
        type:LOAD_INFO,
        info
    })
}

export default function my(state=initState,action) {
    let {type,info} = action
    switch (type){
        case LOAD_INFO:
            return {...state,info}
            break
        default:
            return state
    }
}