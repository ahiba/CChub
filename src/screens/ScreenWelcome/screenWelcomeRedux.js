import ThemeDao from '../../expand/dao/ThemeDao'
let initState = {
  theme:{}
}
let themeDao = new ThemeDao()
const LOAD_THEME = 'github/ScreenWelcome/LOAD_THEME'

export const loadTheme = () => (dispatch,getState) => {//载入主题设置
    let theme = {}
    themeDao.getTheme().then((data)=>{
        console.log('data loadThem',data)
        theme = data
        dispatch({
            type:LOAD_THEME,
            theme
        })
    })

}

export default function welcome(state=initState,action) {
    let {type,theme} = action
    console.log('redux theme',theme)
    switch (type){
        case LOAD_THEME:
            return {...state,theme}
            break
        default:
            return state
    }
}
