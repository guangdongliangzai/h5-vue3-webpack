class Middleware {
    constructor() {
        this.i = 0;
        this.middleware = (next) => {
            // console.log(next);
            return next()
        }
    }
    run(fn) {
        console.log(this)
        this.middleware(
            () => fn.call(this)
        )
    }
    use(fn) {
        const previousFn = this.middleware
        this.middleware = (next) =>
            previousFn.call(this, () => {
                // console.log(fn);
                return fn.call(this, next)
            })
    }
}



const instance = new Middleware()




instance.use(function(next) {
    setTimeout(() => {
        console.log('first')
        this.firstMiddlewareLoaded = true
        next()
    }, 500)
})

instance.use(function(next) {
    setTimeout(() => {
        console.log('second')
        this.secondMiddlewareLoaded = true
        next()
    }, 250)
})

instance.use(function(next) {
    console.log('third')
    this.ThirdMiddlewareLoaded = true
    next()
})
const start = new Date()
instance.run(function() {
    console.log('first middleware loaded:', this.firstMiddlewareLoaded)
    console.log('second middleware loaded:', this.secondMiddlewareLoaded)
    console.log('Third middleware loaded:', this.ThirdMiddlewareLoaded)
    console.log('time passed:', new Date() - start)
})



export default instance