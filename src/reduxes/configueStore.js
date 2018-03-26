
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducer';
let rootReducer = combineReducers({
    ...reducers
});
export default function configureStore() {
    if(process.env.NODE_ENV === 'production'){
        return createStore(
            rootReducer,
            compose(
                applyMiddleware(thunk)
            )
        );
    }else{
        return createStore(
            rootReducer,
            compose(
                applyMiddleware(thunk),
                window.devToolsExtension ? window.devToolsExtension() : f=>f
            )

        );
    }
}

