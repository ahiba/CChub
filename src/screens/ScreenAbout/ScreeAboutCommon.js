
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
    Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import ViewUtils from '../../util/ViewUtils'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import FavoriteDao from '../../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../../expand/dao/DataReposity'
import ProjectModal from '../../modal/ProjectModal'
import Utils from '../../util/Utils'
import ReposityCeil from '../../components/ReposityCeil'
import ReposityUtils from '../../expand/dao/ReposityUtils'
export const FLAG_ABOUT = {flag_about:'about',flag_about_me:'about_me'}
export default class ScreenAboutCommon{
    constructor(props,updateState,flag_about,config) {
        this.props = props
        this.updateState = updateState
        this.flag_about = flag_about
        this.repositories = []
        this.favoriteKes = null
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_my)
        this.config = config
        this.reposityUtils = new ReposityUtils(this)
    }
    componentDidMount(){
        if(this.flag_about===FLAG_ABOUT.flag_about){
            this.reposityUtils.fetchReposity(this.config.info.currentRepoUrl)
        }else{
            let urls = []
            let items = this.config.items
            for(let i=0,len=items.length;i<len;i++){
                urls.push(this.config.info.url+items[i])
            }
            this.reposityUtils.fetchReposities(urls)
        }
    }
    onNotifyDataChanged = (items) => {//通知数据发生改变　items 改变的数据
        this.updateFavorite(items)
    }
    updateFavorite = (repositories) => {//更新项目的用户收藏状态
        if(repositories) this.repositories = repositories
        if(!this.repositories) return
        if(!this.favoriteKes){
             this.favoriteDao.getFavoriteKeys()
                 .then(keys=>{
                     this.favoriteKes = keys
                 })
        }
        let projectModals = []
        let items = this.repositories
        for(let i=0,len=items.length;i<len;i++){
            // projectModals.push(new ProjectModal(items[i],Utils.checkFavorite(items[i],this.favoriteKes?this.favoriteKes:[])))
            projectModals.push({item:items[i]['item']?items[i]['item']:items[i],isFavorite:Utils.checkFavorite(items[i],this.favoriteKes?this.favoriteKes:[])})
        }
            this.updateState({
               data:projectModals
            })
    }
    onSelect = (projectModal) => {
        Actions.REPOSITY_DETAIL({item: projectModal.item,theme:this.props.theme})
    }
    onFavorite = (item,isFavorite) => {
        if(isFavorite){
            this.favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item))
        }else{
            this.favoriteDao.removeFavoriteItem(item.id.toString())
        }
    }
    renderRepository = (projectModals) => {//创建项目视图
        if(!projectModals||projectModals.length===0) return null
        let views = []
        for(let i=0,len=projectModals.length;i<len;i++){
            let projectModal = projectModals[i]
            views.push(
                <ReposityCeil
                    key = {projectModal.item.id}
                    projectModal = {projectModal}
                    onSelect={()=>{
                    this.onSelect(projectModal)
                }}
                    onFavorite = {(item,isFavorite)=>{this.onFavorite(item,isFavorite)}}
                    theme = {this.props.theme}
                />
            )
        }
        return views
    }

    getParallaxConfig = (params) => {
        let config = {}
        config. renderBackground=() => (
            <View key="background">
                <Image source={{uri:params.backgroundImg,
                                width: window.width,
                                height: PARALLAX_HEADER_HEIGHT}}/>
                <View style={{position: 'absolute',
                              top: 0,
                              width: window.width,
                              backgroundColor: 'rgba(0,0,0,.4)',
                              height: PARALLAX_HEADER_HEIGHT}}/>
            </View>
        )
        config.renderForeground=() => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={ styles.avatar } source={{
                  uri: params.avatar,
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE
                }}/>
                <Text style={ styles.sectionSpeakerText }>
                    {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                    {params.description}
                </Text>
            </View>
        )
        config.renderStickyHeader=() => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        )
        config.renderFixedHeader=() => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(()=>Actions.pop())}
            </View>
        )
        return config
    }
    renderParallax = (contentView,params) => {
        let config = this.getParallaxConfig(params)
        return(
            <ParallaxScrollView
                headerBackgroundColor="#333"
                backgroundColor = {this.props.theme.themeColor}
                stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                backgroundSpeed={10}
                {...config}
            >
                {contentView}
            </ParallaxScrollView>
        )
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems:'center',
        paddingTop:(Platform.OS==='ios')?20:0,
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left:0,
        top:0,
        paddingRight:0,
        flexDirection:'row',
        alignItems:'center',
        paddingTop:(Platform.OS==='ios')?20:0,
        justifyContent:'space-between'
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});
