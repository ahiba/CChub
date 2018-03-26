
import React,{Component} from 'react'
import {
    View,
    Text,
    Button,
    Image,
    ScrollView,
    TouchableHighlight,
    StyleSheet,
    ListView,
    Dimensions,
    Platform,
    Linking,
    Clipboard
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import ViewUtils from '../../util/ViewUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import config from '../../../res/data/config.json'
import ScreenAboutCommon,{FLAG_ABOUT} from './ScreeAboutCommon'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import {Toast} from 'antd-mobile'
const FLAG = {
    REPOSITORY: '开源项目',
    BLOG: {
        name: '技术博客',
        items: {
            PERSONAL_BLOG: {
                title: '个人博客',
                url: 'https://ahiba.org',
            },
            GITHUB: {
                title: 'GitHub',
                url: 'https://github.com/ahiba',
            },
        }
    },
    CONTACT: {
        name: '联系方式',
        items: {
            QQ: {
                title: 'QQ',
                account: '1005975380@qq.com',
            },
            Email: {
                title: 'Email',
                account: '1005975380@qq.com',
            },
        }
    },
}
export default class ScreenAboutMe extends Component {
    constructor(props) {
        super(props);
        this.screenAoubtCommon = new ScreenAboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about_me,config)
        this.state = {
            data:[],
            showRepository:false,
            showBlog:false,
            showQQ:false,
            showContact:false,
            theme:this.props.theme,
            author:config.author
        }
    }
    componentDidMount(){
        this.screenAoubtCommon.componentDidMount()
    }
    showToast = (msg) => {
        Toast.info(msg,2)
    }
    getClickIcon = (isShow) => {
        return isShow?require('../../../res/images/ic_tiaozhuan_up.png'):require('../../../res/images/ic_tiaozhuan_down.png')
    }
    updateState = (dic) => {
        this.setState(dic)
    }
    onClick = (tab) => {
        switch (tab){
            case FLAG.BLOG:
                this.updateState({showBlog:!this.state.showBlog})
                break;
            case FLAG.REPOSITORY:
                this.updateState({showRepository:!this.state.showRepository})
                break;
            case FLAG.CONTACT:
                this.updateState({showContact:!this.state.showContact})
                break;
            case FLAG.CONTACT.items.QQ:
                Clipboard.setString(tab.account)
                this.showToast(`qq:${tab.account}已复制到剪切板`)
                break;
            case FLAG.CONTACT.items.Email:
                let url = `mailto:${tab.account}`
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                        this.showToast('您的手机未安装邮箱')
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;

            case FLAG.BLOG.items.GITHUB:
            case FLAG.BLOG.items.PERSONAL_BLOG:
                Actions.WEBSITE({url:'http://www.ahiba.org/',title:'ahiba'})
                break;
        }
    }
    getItem = (tag, icon, text) => {
        return ViewUtils.getSettingItem(()=>this.onClick(tag), icon, text,this.state.theme.styles.tabBarSelectedIcon,null);
    }
    renderItems = (dic,isShowAccount) => {
        if(!dic) return null
        let views = []
        for(let i in dic){
            let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title
            views.push(
                <View>
                    {ViewUtils.getSettingItem(()=>this.onClick(dic[i]),'',title,this.state.theme.styles.tabBarSelectedIcon)}
                    <View style={GlobalStyles.line}/>
                </View>
            )
        }
        return views
    }
    render() {
        let contentView =
            <View>
                {ViewUtils.getSettingItem(()=>this.onClick(FLAG.BLOG), require('../../../res/images/ic_computer.png'), FLAG.BLOG.name,this.state.theme.styles.tabBarSelectedIcon,this.getClickIcon(this.state.showBlog))}
                <View style={GlobalStyles.line}/>
                {this.state.showBlog?this.renderItems(FLAG.BLOG.items):null}

                {ViewUtils.getSettingItem(()=>this.onClick(FLAG.REPOSITORY), require('../../../res/images/ic_code.png'), FLAG.REPOSITORY,this.state.theme.styles.tabBarSelectedIcon,this.getClickIcon(this.state.showRepository))}
                <View style={GlobalStyles.line}/>
                {this.state.showRepository?this.screenAoubtCommon.renderRepository(this.state.data):null}

                {ViewUtils.getSettingItem(()=>this.onClick(FLAG.CONTACT), require('../../../res/images/ic_contacts.png'), FLAG.CONTACT.name,this.state.theme.styles.tabBarSelectedIcon,this.getClickIcon(this.state.showContact))}
                <View style={GlobalStyles.line}/>
                {this.state.showContact?this.renderItems(FLAG.CONTACT.items,true):null}
            </View>
        return this.screenAoubtCommon.renderParallax(contentView,this.state.author)
    }
}
