
import React,{Component} from 'react'
import {Provider} from 'react-redux'
import { Scene, Router, ActionConst } from 'react-native-router-flux'
import configueStore from './src/reduxes/configueStore'
let store = configueStore()
import ScreenTab from './src/screens/ScreenTab'
import ScreenPopular from './src/screens/ScreenPopular'
import ScreenTrend from './src/screens/ScreenTrend'
import ScreenCollect from './src/screens/ScreenTrend'
import ScreenMy from './src/screens/ScreenMy'
import ScreenWelcome from './src/screens/ScreenWelcome'
import ScreenReposityDetail from './src/screens/ScreenReposityDetail'
import ScreenCustomKey from './src/screens/ScreenMy/ScreeCustomKey'
import ScreenSortKey from './src/screens/ScreenMy/ScreenSortKey'
import ScreenAbout from './src/screens/ScreenAbout/'
import ScreenAboutMe from './src/screens/ScreenAbout/ScreenAboutMe'
import ScreenWebsite from './src/screens/ScreenAbout/ScreenWebsite'
import ScreenSearch from './src/screens/ScreenSearch'
import ScreenCopyright from './src/screens/ScreenMy/SceenCopyright'
import * as scenes from './src/contants/scene'
export default class RootApp extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
        <Provider store={store} >
            <Router>
                <Scene key="root">
                <Scene
                    key={scenes.SCENE_WELCOME}
                    component={ScreenWelcome}
                    title="欢迎"
                    initial
                    type={ActionConst.RESET}
                    hideNavBar
                    duration={0}
                />
                <Scene
                    key={scenes.SCENE_TAB}
                    component={ScreenTab}
                    title="tab"
                    hideNavBar
                    duration={0}
                />
                <Scene
                    key={scenes.SCENE_POPULAR}
                    component={ScreenPopular}
                    title="流行"
                    hideNavBar
                    duration={0}
                />
                <Scene
                    key={scenes.SCENE_TREND}
                    component={ScreenTrend}
                    title="趋势"
                    hideNavBar
                    duration={0}
                />
                <Scene
                    key={scenes.SCENE_COLLECT}
                    component={ScreenCollect}
                    title="收藏"
                    hideNavBar
                    duration={0}
                />
                <Scene
                    key={scenes.SCENE_MY}
                    component={ScreenMy}
                    title="我的"
                    hideNavBar
                    duration={0}
                />
                    <Scene
                        key={scenes.SCENE_REPOSITY_DETAIL}
                        component={ScreenReposityDetail}
                        title="项目"
                        hideNavBar
                        duration={0}
                    />
                    <Scene
                        key={scenes.SCENE_CUSTOM_KEY}
                        component={ScreenCustomKey}
                        title="自定义标签"
                        hideNavBar
                        duration={0}
                    />
                    <Scene
                        key={scenes.SCENE_SORT_KEY}
                        component={ScreenSortKey}
                        title="标签排序"
                        hideNavBar
                        duration={0}
                    />
                    <Scene
                        key={scenes.SCENE_ABOUT}
                        component={ScreenAbout}
                        title="关于项目"
                        hideNavBar
                        duration={0}
                    />
                    <Scene
                        key={scenes.SCENE_WEBSITE}
                        component={ScreenWebsite}
                        title="Website"
                        hideNavBar
                        duration={0}
                    />
                    <Scene
                    key={scenes.SCENE_ABOUT_ME}
                    component={ScreenAboutMe}
                    title="关于作者"
                    hideNavBar
                    duration={0}
                     />
                    <Scene
                        key={scenes.SCENE_COPYRIGHT}
                        component={ScreenCopyright}
                        title="版权声明"
                        hideNavBar
                        duration={0}
                    />
                    <Scene
                        key={scenes.SCENE_SEARCH}
                        component={ScreenSearch}
                        title="搜索页面"
                        hideNavBar
                        duration={0}
                    />
                </Scene>
            </Router>
        </Provider>)
    }
}

