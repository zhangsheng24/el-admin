import request from '@/utils/request'
import resource from './resource'

export default function (name,params,other={}){
    if(name.slice(0,4) === 'http'){
        let arg={
            url:name,
            params,
            other
        }
        return request(arg)
    }else{
        let paths=name.split('.')
        let apiArgs=resource
        paths.forEach(item=>{
            if(typeof apiArgs === 'undefined'){
                throw Error('无对应接口')
            }
            apiArgs=apiArgs[item]
        })
        if(typeof apiArgs === 'object' && apiArgs.method && apiArgs.url){
            let arg={
                method:apiArgs.method,
                url:apiArgs.url,
                params,
                other
            }
            return request(arg)
        }
        throw Error('请求基础数据缺少',name)
    }
}