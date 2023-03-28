import {app} from "../setting";
import {runDB} from "../mongoDB";

const port = 3002

const startApp = async () => {
    await runDB().then(()=>{
        console.log('Все заебумба')
    })
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()