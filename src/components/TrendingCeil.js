
import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Image,
    TouchableOpacity,
} from 'react-native'
import HTMLView from 'react-native-htmlview'
export default class TrendingCeil extends Component{
    constructor(props){
        super(props)
        // console.log('this.props.projectModal.isFavorite',this.props.projectModal.isFavorite)
        this.state = {
            isFavorite:this.props.projectModal.isFavorite,
            favoriteIcon:this.props.projectModal.isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        }
    }
    componentWillReceiveProps(nextProps){
        this.setFavoriteState(nextProps.projectModal.isFavorite)
    }
    onPressFavorite = () => {
        this.props.onFavorite(this.props.projectModal.item,!this.state.isFavorite)
        this.setFavoriteState(!this.state.isFavorite)

    }
    setFavoriteState = (isFavorite) => {
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
        })
    }
    render(){
        // let {data} = this.props
        let item = this.props.projectModal.item?this.props.projectModal.item:this.props.projectModal
        let description = `<p>${item.description}</p>`
        let favoriteBtn = <TouchableOpacity
            onPress = {()=>{this.onPressFavorite()}}
        >
            <Image style={[{width:22,height:22},this.props.theme.styles.tabBarSelectedIcon]} source={this.state.favoriteIcon}/>
        </TouchableOpacity>
        return(
            <TouchableOpacity
                onPress = {this.props.onSelect}
                style={styles.container}>
                <View style={styles.ceil_container}>
                    <Text style={styles.title}>{item.fullName}</Text>
                    {/*<Text style={styles.description}>{this.props.data.description}</Text>*/}
                    <HTMLView
                        value={description}
                        onLinkPress={(url)=>{}}
                        stylesheet={{
                            p:styles.description,
                            a:styles.description
                        }}
                    />
                    <View style={{flexDirection:'row',alignItems:'center',fontSize:14,marginBottom:2,color:'#757575',borderRadius:2}}>
                        <Text>Stars:</Text>
                        <Text>{item.meta}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}} >
                            <Text>Build by:</Text>
                            {item.contributors.map((element,i,arr)=>{
                                return     <Image
                                    key = {i}
                                    style={{width:22,height:22}}
                                    source={{uri:arr[i]}}
                                />
                            })}

                        </View>
                        {favoriteBtn}
                        {/*<Image style={{width:22,height:22}} source={require('../../res/images/ic_star.png')}/>*/}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container:{flex:1},
    title:{
        fontSize:16,
        marginBottom:2,
        color:'#212121'
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:'#757575',
        borderRadius:2
    },
    ceil_container:{
        backgroundColor:'white',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:3,
        borderColor:'#dddddd',
        borderWidth:0.5,
        shadowColor:'gray',
        shadowOffset:{width:0.5,height:0.5},
        shadowRadius:1,
        shadowOpacity:0.4,
        elevation:2

    }
})
