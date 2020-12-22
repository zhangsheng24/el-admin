/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 * 防抖函数分为非立即执行版和立即执行版
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result
    const later = function () {
        const last = +new Date() - timestamp
        if(last <wait && last > 0){
            timeout=setTimeout(later,wait-last)
        }else{
            //非立即执行版
            timeout=null
            if(!immediate){
                result=func.apply(context,args)
                if (!timeout) context = args = null
            }
        }
    }
    // 当疯狂改变屏幕尺寸，这个函数疯狂执行，timestamp疯狂等于
    // 新的时间戳
    return function (...args) {
        context = this
        timestamp = +new Date()
        const callNow=immediate && !timeout
        if (!timeout) timeout = setTimeout(later, wait)
        if(callNow){// 立即执行版
            result = func.apply(context, args)
            context = args = null
        }
        return result
    }

    /**
     * 当在500ms之内疯狂改变屏幕尺寸，那么timestamp会一直
     * 更新为当前时间戳，一开始的时候，timeout是undefined，也就是从0开始计时
     * 所以就开始记录下来一个定时器timeout = setTimeout(later, wait)
     * 在500ms之后开始执行回调函数later，执行later函数的时候
     * 一开始的时候last变量是小于500的，所以又出现了一个新的定时器
     * setTimeout(later,wait-last)这个定时器会在500-last毫秒之后再次执行later函数
     * 如果我们在一开始的时候就疯狂改变屏幕尺寸，那么timestamp会疯狂改变时间错
     * 当500-last之后又会执行第二次later函数，由于timestamp在疯狂改变
     * 所以+new Date() - timestamp的值一直小于wait，以至于，走了if判断
     * 然后又开启下一个定时器，定时器的时间wait-last会根据last的变化而变化，但是不会大于500
     * 如果我们一直都在疯狂改变屏幕尺寸，那么last永远小于500
     * 只有当执行到某个时间的时候停了下了，或者上一次和这一次改变屏幕尺寸的触发事件所需的时间
     * 大于500ms的时候，最后一个定时器的执行时间在wait-last+当前的之间戳-上一次结束的timestamp
     *  大于等于500
     * 经计算：当屏幕从开始改变到结束，在这段时间内
     *  timestamp会一直变化，直到固定在屏幕结束改变
     * 此时，+new Date() - timestamp=292
     * 那么在wait-last=500-292=208之后又会重新执行later函数
     * 此时+new Date() - timestamp=507，因为上一次执行later函数的时候last已经等于292了
     * 说明当执行到later函数中的const last = +new Date() - timestamp已经用了292毫秒
     * 又等了208毫秒之后又执行later函数，执行到const last = +new Date() - timestamp
     * 这一段代码的时候timestamp还是上一个的值，因为已经在上一次执行later的时候停止了
     * 导致+new Date() - timestamp其实是等于上一次多出来的292加上等待208之后的时间再加上这一次执行到
     * 这端代码所需的时间7，一共就是507，当然这些数字都不是准确的，只是在某一次改变屏幕尺寸下做的测试
     * 不过结果都一样。
     */
}