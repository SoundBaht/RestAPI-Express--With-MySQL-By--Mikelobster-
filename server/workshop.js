const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const port = 8000

app.use(bodyparser.json())

let users = []
let counter = 1

app.listen(port,(req , res) => {
    console.log('http server run at :' + port)
})

/*
    โจทย์
    GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
    POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
    GET /users/:id สำหรับการดึง users รายคนออกมา
    PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
    DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

// 1.GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users' , (req , res) => {
    // res.json(users)

    //ใช้ map modify array
    const filterUsers = users.map(user => {
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.firstname + ' ' + user.lastname
        }
    })
    res.json(filterUsers)
})

// 2.POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/user', (req , res ) => {
    let user = req.body
    user.id = counter
    counter += 1

    users.push(user)
    res.json({
        message: 'add ok',
        user : user
    })
}) 

// 3.GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id' , (req , res) => {
    let id = req.params.id
    
//หา index
    let selectedIndex = users.findIndex(user => user.id == id)

    res.json(users[selectedIndex])
})

// 4.PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', (req , res) => {
    let id = req.params.id
    let updateUser = req.body

    //ค้นหาข้อมูล user
    let selectedIndex = users.findIndex(user => user.id == id)

    //update ข้อมูล user
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
    users[selectedIndex].age = updateUser.age || users[selectedIndex].age
    users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender


    res.json( {
        message: 'udapte user complete!',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})

// 5.DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
//path DELETE /user/:id
app.delete('/users/:id' , (req , res) =>{
    let id = req.params.id
    //หาก่อนว่า index ของ user ที่จะลบคือ index ไหน
    let selectedIndex = users.findIndex (user => user.id == id)

    users.splice(selectedIndex , 1)

    res.json({
        message: 'delete complete',
        indexDeleted: selectedIndex
    })
})