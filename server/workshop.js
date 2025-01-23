const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const port = 8000

app.use(bodyparser.json())

let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tutorials',
        port:8889
    }) 
}

app.listen(port, async(req , res) => {
    await initMySQL()
    console.log('http server run at :' + port)
})

//ทดลอง GET แบบ query SELECT 
app.get('/testdb' , (req , res) => {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tutorials',
        port:8889
    }).then((conn) => {
        conn
        .query('SELECT * FROM users')
        .then((results) => {
            res.json(results[0])
        })
        .catch((error) => {
            console.error('Error fetching users:' , error.message)
            res.status(500).json({error: 'Error fetching users'})
        })
    })
})

//ทดลองใช้ async , await
app.get('/testdb-new' , async (req , res) => {
    try{
        const results = await conn.query('SELECT * FROM users')
        res.json(results[0])
    }
    catch (error){
        console.error('Error fetching users:' , error.message)
        res.status(500).json({error: 'Error fetching users'}) 
    }
   
})

//=================== workshop =========================

// 1.GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users' , async (req , res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})

// 2.POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/user', async (req , res ) => {

    try{
    let user = req.body
    const results = await conn.query('INSERT INTO users SET ?', user)
    
    res.json({
        message: 'insert ok',
        data: results[0]
    })
    }
    catch (error){
        res.status(500).json({
            message: 'something wrong',
            //errorMessage: error.message //message จะขึ้นโชว์ฝั่ง user ด้วย ควรจะทำแบบนี้เฉพาะ Dev
        })
        console.error('error message' , error.message) //ควรจะใช้ท่านี้
    }
}) 

// 3.GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id' , async (req , res) => {
    try{
        let id = req.params.id
        const results = await conn.query('SELECT * FROM users WHERE id = ?' , id)
        
        if(results[0].length > 0) {
            res.json(results[0][0])
        }
        else {
            res.status(404).json({
                message: 'หาไม่เจอ'
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: 'something not right',
        })
    }
})

// 4.PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', async (req , res) => {
    try{
        let id = req.params.id
        let updateUser = req.body
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser,id] )
        
        res.json({
            message: 'update ok',
            data: results[0]
        })
        }
        catch (error){
            res.status(500).json({
                message: 'something wrong',
                //errorMessage: error.message //message จะขึ้นโชว์ฝั่ง user ด้วย ควรจะทำแบบนี้เฉพาะ Dev
            })
            console.error('error message' , error.message) //ควรจะใช้ท่านี้
        }
    
})

// 5.DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
//path DELETE /user/:id
app.delete('/users/:id' , async (req , res) =>{
    try{
        let id = req.params.id
        const results = await conn.query('DELETE FROM users WHERE id = ?', id )
        
        res.json({
            message: 'delete ok',
            data: results[0]
        })
        }
        catch (error){
            res.status(500).json({
                message: 'something wrong',
                //errorMessage: error.message //message จะขึ้นโชว์ฝั่ง user ด้วย ควรจะทำแบบนี้เฉพาะ Dev
            })
            console.error('error message' , error.message) //ควรจะใช้ท่านี้
        }

})