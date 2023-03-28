export const getFilter = (params: any, withRegex:boolean = false) => {
    let filter: any = {}
    const validParams:any = {}
    const filterCheck = (p: any) => !!p

    Object.keys(params).forEach((key) => {
        if (filterCheck(params[key])) validParams[key] = params[key];
    })
    const arrKeys =  Object.keys(validParams)
    if (arrKeys.length > 1) {
        filter.$or = arrKeys.map((key) => {
          if(withRegex)  return {[key]: {$regex: new RegExp(`${validParams[key]}`, 'i')}}
          return {[key]: validParams[key]}
        })
    }
    if(arrKeys.length === 1) {
        const singleKey = arrKeys[0]
        if(withRegex)   filter[singleKey] = {$regex: new RegExp(`${validParams[singleKey]}`, 'i')}
        else filter = {[singleKey]: validParams[singleKey]
        }
    }
     return filter
}