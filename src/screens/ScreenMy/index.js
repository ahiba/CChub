
import React,{Component} from 'react'
import {
    View,
    Text,
    Button,
    Image,
    ScrollView,
    TouchableHighlight,
    StyleSheet,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import NavigationBar from '../../components/NavigationBar'
import MoreMenu,{MORE_MENU,COPY_RIGHT} from '../../common/MoreMenu'
import ViewUtils from '../../util/ViewUtils'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import {MenuProvider} from 'react-native-popup-menu'
import ScreenTheme from './ScreenTheme'
import codePush from 'react-native-code-push'
import ShareUtile from '../../native/ShareUtil'
import BaseComponent from '../../common/BaseComponent'
export default class ScreenMy extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            themeViewVisilbe:false,
            theme:this.props.theme
        }
    }
    qqauth(){
        ShareUtile.auth(0,(code,result,message) =>{
            this.setState({result:message});
            if (code == 200){
                this.setState({result:result.uid});
            }
        });
    }
    sinaauth(){
        ShareUtile.auth(1,(code,result,message) =>{
            this.setState({result:message});
            if (code == 200){
                this.setState({result:result.uid});
            }
        });
    }
    wxauth(){
        ShareUtile.auth(2,(code,result,message) =>{
            this.setState({result:message});
            if (code == 200){
                this.setState({result:result.uid});
            }
        });
    }
    sinashare(){
        // alert('ok');
        ShareUtile.share('sssss','http://dev.umeng.com/images/tab2_1.png','http://www.umeng.com/','title',1,(code,message) =>{
            this.setState({result:message});
        });
    }
    qqshare(){
        ShareUtile.share('sssss','http://dev.umeng.com/images/tab2_1.png','http://www.umeng.com/','title',0,(code,message) =>{
            this.setState({result:message});

        });
    }
    wxshare(){
        ShareUtile.share('sssss','http://dev.umeng.com/images/tab2_1.png','http://www.umeng.com/','title',2,(code,message) =>{
            this.setState({result:message});

        });
    }
    shareboard(){
        var list = [0,1,2]
        ShareUtile.shareboard('sssss','http://dev.umeng.com/images/tab2_1.png','http://www.umeng.com/','title',list,(code,message) =>{
            this.setState({result:message});

        });
    }
    share = () => {
        this.shareboard()
    }
    update = () => {
        codePush.sync({
            updateDialog: {
                appendReleaseDescription: true,
                descriptionPrefix:'\n\n更新内容：\n',
                title:'更新',
                mandatoryUpdateMessage:'',
                mandatoryContinueButtonLabel:'更新',
            },
            mandatoryInstallMode:codePush.InstallMode.IMMEDIATE,
        });
    }
    onClick = (tab) => {
        switch (tab){
            case MORE_MENU.About:
                Actions.ABOUT({theme:this.state.theme})
                break;
            case MORE_MENU.Custom_Language:
                Actions.CUSTOM_KEY({flag:FLAG_LANGUAGE.flag_language,theme:this.state.theme})
                break;
            case MORE_MENU.Sort_Language:
                Actions.SORT_KEY({ 'isRemoveKey':true,flag:FLAG_LANGUAGE.flag_language,theme:this.state.theme})
                break;
            case MORE_MENU.Custom_Key:
                Actions.CUSTOM_KEY({ isRemoveKey:true,flag:FLAG_LANGUAGE.flag_key,theme:this.state.theme})
                break;
            case MORE_MENU.Sort_Key:
                Actions.SORT_KEY({flag:FLAG_LANGUAGE.flag_key,theme:this.state.theme})
                break;
            case MORE_MENU.Remove_Key:
                Actions.CUSTOM_KEY({ isRemoveKey:true,flag:FLAG_LANGUAGE.flag_key,theme:this.state.theme})
                break;
            case MORE_MENU.Custom_Theme:
                this.setState({
                    themeViewVisible:true
                })
                break;
            case MORE_MENU.Copyright:
                Actions.COPYRIGHT({theme:this.state.theme})
                break;
            case MORE_MENU.Refresh:
                this.update()
                break;
            case MORE_MENU.Share:
                this.share()
                break;
            case MORE_MENU.About_Author:
                Actions.ABOUT_ME({theme:this.state.theme})
                break;
        }
    }
    renderThemeView = () => {
        return(
            <ScreenTheme
                visible = {this.state.themeViewVisible}
                {...this.props}
                onClose = {()=>this.setState({themeViewVisible:false})}
            />
        )
    }
    getItem = (tag, icon, text) => {
        return ViewUtils.getSettingItem(()=>this.onClick(tag), icon, text,this.state.theme.styles.tabBarSelectedIcon,null);
    }
    renderRightButton = () => {
        let _menus = [MORE_MENU.About,MORE_MENU.About_Author,MORE_MENU.Custom_Key]
        return(
            <View style={{width:24,height:24,marginRight:10}}>
                <MoreMenu
                    menus = {_menus}
                    theme = {this.state.theme}
                />
            </View>
        )
    }
    render() {
        let statusBar = {backgroundColor:this.state.theme.themeColor}
        let navigationBar = <NavigationBar
                                title="我的"
                                statusBar = {statusBar}
                                style = {this.state.theme.styles.navBar}
                                rightButton = {this.renderRightButton()}
                            />
        return (
            <MenuProvider>
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <ScrollView>
                    <TouchableHighlight
                        onPress = {()=>this.onClick(MORE_MENU.About)}
                    >
                        <View style={[styles.item,{height:90}]}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={require('../../../res/images/ic_trending.png')}
                                       style={[{width:40,height:40,marginRight:10},this.state.theme.styles.tabBarSelectedIcon]}/>
                                <Text>CChub</Text>
                            </View>
                            <Image source={require('../../../res/images/ic_tiaozhuan.png')}
                                style={[{width:22,height:22,marginRight:10},this.state.theme.styles.tabBarSelectedIcon]}
                            />
                        </View>
                    </TouchableHighlight>
                    <View style={GlobalStyles.line}/>
                    <Text style={styles.groupTitle}>趋势管理</Text>
                    {/*自定义语言*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Language, require('./img/ic_custom_language.png'), '自定义语言')}
                    {/*语言排序*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Sort_Language, require('./img/ic_swap_vert.png'), '语言排序')}

                    {/*最热管理*/}
                    <Text style={styles.groupTitle}>最热管理</Text>
                    {/*自定义标签*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Key, require('./img/ic_custom_language.png'), '自定义标签')}
                    {/*标签排序*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Sort_Key, require('./img/ic_swap_vert.png'), '标签排序')}
                    {/*标签移除*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Remove_Key, require('./img/ic_remove.png'), '标签移除')}
                    {/*设置*/}
                    <Text style={styles.groupTitle}>设置</Text>
                    {/*自定义主题*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Custom_Theme, require('./img/ic_view_quilt.png'), '自定义主题')}
                    {/*关于作者*/}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Copyright, require('./img/ic_insert_emoticon.png'), '版权声明')}
                    <View style={GlobalStyles.line}/>
                    {this.getItem(MORE_MENU.Refresh, require('./img/ic_insert_emoticon.png'), '检查更新')}
                    <View style={GlobalStyles.line}/>
                    {/*{this.getItem(MORE_MENU.Share, require('./img/ic_insert_emoticon.png'), '分享')}*/}
                    {/*<View style={GlobalStyles.line}/>*/}
                    {this.getItem(MORE_MENU.About_Author, require('./img/ic_insert_emoticon.png'), '关于作者')}
                    <View style={GlobalStyles.line}/>
                    {this.renderThemeView()}
                </ScrollView>
            </View>
            </MenuProvider>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1
    },
    item:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        height:60,
        backgroundColor:'white'
    },
    groupTitle:{
        marginTop:10,
        marginBottom:5,
        marginRight:10,
        fontSize:12
    }
})