const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const db=require('./querries')
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (req, res) => {
    res.json({
        info: 'Sample home page'
    })
})

app.get('/listemployees',db.getEmployees)

app.get('/findemployee/:id',db.getEmployeeByID)

app.post('/insert',db.insertEmployee)

app.put('/update',db.updateEmployee)

app.delete('/delete/:id',db.deleteUser)

app.get('*',(req,res)=>{
     res.send('Broken link');
})

app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
})