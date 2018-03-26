import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native'
import ViewUtils from '../../util/ViewUtils'
import {Actions} from 'react-native-router-flux'
import NavigationBar from '../../components/NavigationBar'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import {COPY_RIGHT} from '../../common/MoreMenu'
export default class SceenCopyright extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            theme:this.props.theme
        }
    }
    onBack = () => {
        Actions.pop()
    }
    onClick(tag){
        switch (tag){
            case COPY_RIGHT.react:
                Actions.WEBSITE({url:'https://github.com/facebook/react',title:'facebook/react'})
                break
            case COPY_RIGHT.react_native:
                Actions.WEBSITE({url:'https://github.com/facebook/react-native',title:'facebook/react-native'})
                break
            case COPY_RIGHT.redux:
                Actions.WEBSITE({url:'https://github.com/reactjs/redux',title:'reactjs/redux'})
                break
            case COPY_RIGHT.react_redux:
                Actions.WEBSITE({url:'https://github.com/reactjs/react-redux',title:'reactjs/react-redux'})
                break
            case COPY_RIGHT.redux_thunk:
                Actions.WEBSITE({url:'https://github.com/gaearon/redux-thunk',title:'gaearon/redux-thunk'})
                break
            case COPY_RIGHT.react_native_router_flux:
                Actions.WEBSITE({url:'https://github.com/aksonov/react-native-router-flux',title:'aksonov/react-native-router-flux'})
                break
            case COPY_RIGHT.antd_mobile:
                Actions.WEBSITE({url:'https://github.com/ant-design/ant-design-mobile',title:'ant-design/ant-design-mobile'})
                break
            case COPY_RIGHT.GitHubTrending:
                Actions.WEBSITE({url:'https://github.com/crazycodeboy/GitHubTrending',title:'crazycodeboy/GitHubTrending'})
                break
            case COPY_RIGHT.react_native_check_box:
                Actions.WEBSITE({url:'https://github.com/crazycodeboy/react-native-check-box',title:'crazycodeboy/react-native-check-box'})
                break
            case COPY_RIGHT.react_native_htmlview:
                Actions.WEBSITE({url:'https://github.com/jsdf/react-native-htmlview',title:'jsdf/react-native-htmlview'})
                break
            case COPY_RIGHT.react_native_parallax_scroll_view:
                Actions.WEBSITE({url:'https://github.com/i6mi6/react-native-parallax-scroll-view',title:'i6mi6/react-native-parallax-scroll-view'})
                break
            case COPY_RIGHT.react_native_popup_menu:
                Actions.WEBSITE({url:'https://github.com/instea/react-native-popup-menu',title:'instea/react-native-popup-menu'})
                break
            case COPY_RIGHT.react_native_scrollable_tab_view:
                Actions.WEBSITE({url:'https://github.com/skv-headless/react-native-scrollable-tab-view',title:'skv-headless/react-native-scrollable-tab-view'})
                break
            case COPY_RIGHT.react_native_sortable_listview:
                Actions.WEBSITE({url:'https://github.com/deanmcpherson/react-native-sortable-listview',title:'deanmcpherson/react-native-sortable-listview'})
                break
            case COPY_RIGHT.react_native_tab_navigator:
                Actions.WEBSITE({url:'https://github.com/happypancake/react-native-tab-navigator',title:'happypancake/react-native-tab-navigator'})
                break

        }
    }
    getItem = (tag, icon, text) => {
        return ViewUtils.getSettingItem(()=>this.onClick(tag), icon, text,this.state.theme.styles.tabBarSelectedIcon,null);
    }
    render(){
        let statusBar = {backgroundColor:this.state.theme.themeColor}
        let navigationBar =
            <NavigationBar
                title='版权声明'
                statusBar = {statusBar}
                style = {this.state.theme.styles.navBar}
                leftButton={ViewUtils.getLeftButton(()=>{this.onBack()})}
            />
        return(
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <ScrollView>
                <Text style={styles.groupTitle}>MIT</Text>
                {this.getItem(COPY_RIGHT.react, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.redux, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.redux)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_redux, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_redux)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.redux_thunk, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.redux_thunk)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native_router_flux, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native_router_flux)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.antd_mobile, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.antd_mobile)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.GitHubTrending, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.GitHubTrending)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native_check_box, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native_check_box)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native_htmlview, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native_htmlview)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native_parallax_scroll_view, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native_parallax_scroll_view)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native_popup_menu, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native_popup_menu)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native_scrollable_tab_view, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native_scrollable_tab_view)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native_sortable_listview, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native_sortable_listview)}
                <View style={GlobalStyles.line}/>
                {this.getItem(COPY_RIGHT.react_native_tab_navigator, require('./img/ic_insert_emoticon.png'), COPY_RIGHT.react_native_tab_navigator)}
                <View style={GlobalStyles.line}/>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    groupTitle:{
        marginTop:10,
        marginBottom:5,
        marginRight:10,
        fontSize:12
    }
})
