export default function makeCancelable(promise) {
    let hasCanceled = false
    const wrappePromise = new Promise((resolve,reject)=>{
        promise.then((val)=>{
            hasCanceled?reject({isCanceled:true}):resolve(val)
        })
        promise.catch((error)=>{
            hasCanceled?reject({isCanceled:true}):resolve(error)
        })
    })
    return {
        promise:wrappePromise,
        cancel(){
            hasCanceled:true
        }
    }
}
