
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
import {Toast} from 'antd-mobile'
export default class ScreenAbout extends Component {
    constructor(props) {
        super(props);
        this.screenAoubtCommon = new ScreenAboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about,config)
        this.state = {
            data:[],
            theme:this.props.theme
        }
    }
    componentDidMount(){
        this.screenAoubtCommon.componentDidMount()
    }
    showToast = (msg) => {
        Toast.info(mgg,2)
    }
    updateState = (dic) => {
        this.setState(dic)
    }
    onClick = (tab) => {
        switch (tab){
            case MORE_MENU.Website:
                Actions.WEBSITE({url:'http://www.ahiba.org/',title:'ahiba'})
                break;
            case MORE_MENU.Feedback:
                let url = 'mailto:1005975380@qq.com'
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                        this.showToast('您的手机未安装邮箱')
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
            case MORE_MENU.About_Author:
                Actions.ABOUT_ME()
                break;
            default:
                console.log(1)
        }
    }
    getItem = (tag, icon, text) => {
        return ViewUtils.getSettingItem(()=>this.onClick(tag), icon, text,this.state.theme.styles.tabBarSelectedIcon,null);
    }
    render() {
        let contentView =
            <View>
                 {this.screenAoubtCommon.renderRepository(this.state.data)}
                 {this.getItem(MORE_MENU.Website, require('../../../res/images/ic_computer.png'), 'blog',this.state.theme.styles.tabBarSelectedIcon)}
                 {this.getItem(MORE_MENU.About_Author, require('../ScreenMy/img/ic_insert_emoticon.png'), MORE_MENU.About_Author,this.state.theme.styles.tabBarSelectedIcon)}
                 {this.getItem(MORE_MENU.Feedback, require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback,this.state.theme.styles.tabBarSelectedIcon)}
            </View>
        return this.screenAoubtCommon.renderParallax(contentView,{
            'name': 'CChub',
            'description': '这是我在学习贾鹏辉老师的课程后，用最新RN版本和Redux重构的课程项目，同时替换了多个第三方库',
            'avatar':'http://avatar.csdn.net/1/1/E/1_fengyuzhengfan.jpg',
            'backgroundImg':'http://www.devio.org/io/GitHubPopular/img/for_githubpopular_about_me.jpg',
        })
    }
}
