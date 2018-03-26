
import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Image,
    TouchableOpacity,
} from 'react-native'

export default class ReposityCeil extends Component{
    constructor(props){
        super(props)
        console.log('this.props.projectModal.isFavorite',this.props.projectModal.isFavorite)
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
        let item = this.props.projectModal.item?this.props.projectModal.item:this.props.projectModal
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
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}} >
                            <Text>Author:</Text>
                            <Image
                                style={{width:22,height:22}}
                                source={{uri:item.owner.avatar_url}}
                            />
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text>Stars:</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        {favoriteBtn}
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