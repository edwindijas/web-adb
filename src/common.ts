


/*type BeautyProm = {
    promise: Promise<any>,
    resolve: (value?: any) => void,
    reject: (value?: any) => void
}*/


export const beautyProm = ()  => {
    let resolve, reject;

    const promise = new Promise(
        (res, rej) => {
            resolve = res;
            reject = rej;
        }
    )

    return {resolve, reject, promise}
}

