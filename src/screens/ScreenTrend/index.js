
import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Navigator,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    Button,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native'
import {Toast} from 'antd-mobile'
import {Actions} from 'react-native-router-flux'
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import DataReposity,{FLAG_STORAGE} from '../../expand/dao/DataReposity'
import TrendingCeil from '../../components/TrendingCeil'
import NavigationBar from '../../components/NavigationBar'
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import ProjectModal from '../../modal/ProjectModal'
import Utils from '../../util/Utils'
const API_URL = 'https://github.com/trending/'
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
let dataReposity = new DataReposity(FLAG_STORAGE.flag_trending)
import MoreMenu,{MORE_MENU} from '../../common/MoreMenu'
import {MenuProvider} from 'react-native-popup-menu'
import Popover from '../../components/Popover'
import BaseComponent from '../../common/BaseComponent'
export default class ScreenTrend extends BaseComponent {
    // 自定义当前页面路由配置，后面介绍的TabNavigator也使用这个对象中的属性
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language)
        this.state = {
            languages:[],
            timeSpan:'?since=daily',
            theme:this.props.theme
        }
        this.loadData()
    }
    loadData = () => {
        this.languageDao.fetch()
            .then(result=>{
                console.log('popular result ',result)
                this.setState({
                    languages:result
                })
            })
            .catch(error=>{
                console.log(error)
            })
    }
    changeTimespan = (value) => {
        this.setState({
            timeSpan:value
        })
    }
    renderTitleView = () => {
        let {changeTimespan} = this
        return(
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{ fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                }}>趋势</Text>
                <View style={{width:12,height:12,marginLeft:5}}>
                    <Popover
                        {...{
                            changeTimespan
                        }}
                    />
                </View>
            </View>
        )
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
        let titleView = <Popover/>
        let statusBar = {backgroundColor:this.state.theme.themeColor}
        let navigationBar =
            <NavigationBar
                titleView={this.renderTitleView()}
                rightButton = {this.renderRightButton()}
                statusBar = {statusBar}
                style = {this.state.theme.styles.navBar}
            />
        let contents = this.state.languages.length>0?
            <ScrollableTabView
                tabBarBackgroundColor={this.state.theme.themeColor}
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle = {{backgroundColor:'#e7e7e7',height:2}}
                renderTabBar={()=><ScrollableTabBar/>}
            >
                {this.state.languages.map((element,i)=>{
                    return  element.checked?<TrendingTab tabLabel={element.name} theme={this.state.theme} key={i} timeSpan={this.state.timeSpan} {...this.props}>{element.name}</TrendingTab>:null
                })}
            </ScrollableTabView> : null
        return (
            <MenuProvider>
            <View style={styles.container}>
                {navigationBar}
                {contents}
            </View>
            </MenuProvider>
        )
    }
}
class TrendingTab extends React.Component {
    constructor(props) {
        super(props)

        this.page = 1 //当前页面
        this.state = {
            data: [],//列表数据结构
            isRefresh: false,//下拉刷新
            isLoadMore: false,//加载更多
            favoriteKeys:[]
        }
    }

    componentDidMount() {
        this.loadData(this.props.timeSpan)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan);
        }
    }

    showToast = (msg) => {
        Toast.info(msg, 1)
    }
    getFavoriteKeys = () => {
        favoriteDao.getFavoriteKeys()
            .then(keys=>{
                if(keys){
                    this.updateState({
                        favoriteKeys:keys
                    })
                }
                this.flushFavoriteState()
            })
            .catch(error=>{
                console.log(error)
                this.flushFavoriteState()
            })
    }
    flushFavoriteState = () => {
        let projectModals = []
        let items = this.items
        for(let i=0,len=items.length;i<len;i++){
            projectModals.push(new ProjectModal(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)))
        }
        if(this.page==1){
            this.updateState({
                isRefresh:false,
                data:projectModals
            })
        }else{
            this.updateState({
                isLoadMore:false,
                data:this.state.data.concat(projectModals)
            })
        }
    }
    updateState = (dic) => {
        if(!this) return
        this.setState(dic)
    }
    loadData = (timeSpan) => {
        if(this.page===1){
            this.setState({
                isRefresh:true
            })
        }else {
            this.setState({
                isLoadMore:true
            })
        }
        let url = this.getUrl(timeSpan,this.props.tabLabel)
        dataReposity.fetchReposity(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : []
                this.getFavoriteKeys()
                if (result && result.update_date && !dataReposity.checkDate(result.update_date)) {
                    // this.showToast('数据过时')
                    return dataReposity.fetchNetReposity(url)
                }
            })
            .then(items => {
                if (!items && items.length == 0) return
                this.items = items
                this.getFavoriteKeys()
            })
            .catch(error => {
                if(this.page==1){
                    this.setState({
                        isRefresh:false
                    })
                }else{
                    this.setState({
                        isLoadMore:false
                    })
                }
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }
    getUrl = (timeSpan,category) => {
        console.log('getUrl timespan',timeSpan)
        return API_URL + category + timeSpan
    }
    onSelect = (projectModal) => {
        Actions.REPOSITY_DETAIL({item: projectModal.item,flag:FLAG_STORAGE.flag_trending,theme:this.props.theme})
    }
    onFavorite = (item,isFavorite) => {
        if(isFavorite){
            favoriteDao.saveFavoriteItem(item.fullName,JSON.stringify(item))
        }else{
            favoriteDao.removeFavoriteItem(item.fullName)
        }
    }
    createListItem = (projectModal) => {
        return <TrendingCeil
            key = {projectModal.item.fullName}
            onSelect={()=>{
                    this.onSelect(projectModal)
                }}
            projectModal={projectModal}
            onFavorite = {(item,isFavorite)=>{this.onFavorite(item,isFavorite)}}
            theme = {this.props.theme}
        />
    }
    createEmptyView = () => {
        return (
            <View style={{height:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:16}}>
                    暂无列表数据，下拉刷新
                </Text>
            </View>
        )
    }
    onRefresh = () => {
        if (!this.state.isRefresh) {//不处于下拉刷新
            this.page = 1
            this.loadData()
        }
    }
    onLoadMore = () => {
        // if (!this.state.isLoadMore && this.state.data.length > 0) {
        //     this.page = this.page + 1
        //     this.loadData()
        // }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    //item显示的布局
                    renderItem={({item})=>this.createListItem(item)}
                    //空布局
                    ListEmptyComponent={this.createEmptyView}
                    //下拉刷新相关
                    onRefresh={()=>this.onRefresh()}
                    refreshing={this.state.isRefresh}
                    //加载更多
                    onEndReached={()=>this.onLoadMore()}
                    onEndReachedThreshold={0.1}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
})


