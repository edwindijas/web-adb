export const easyPromise = <ResolveType, RejectType> (): EasyPromise<ResolveType, RejectType> => {
    let reject: PromiseFunc<ResolveType>,
        resolve:  PromiseFunc<ResolveType>, 
        prom = new Promise<ResolveType>((res, rej) => 
            {
                resolve = res;
                reject = rej;
            }
        )

     // @ts-ignore: Undefined error
    return {prom, reject , resolve} as EasyPromise<ResolveType, RejectType>
}



interface EasyPromise<T, R> {
    prom: Promise<T>,
    resolve: PromiseFunc<T>,
    reject: PromiseFunc<R>
}

type PromiseFunc<T> = (arg: T) => void

