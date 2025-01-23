const express = require('express')
const bodyparser = require('body-parser')
const app = express()

app.use(bodyparser.json())


const port = 8000


let users = []
let counter = 1

// path = /test
app.get('/test', (req , res) => {
    let user = {
        firstname : 'test',
        lastname: 'นามสกุล',
        age: 14
    }
    res.json(user)
})

app.get('/users', (req , res)=> {
    res.json(users)
})

// path = POST / user
app.post('/user', (req, res) => {
    let user =req.body
    user.id = counter
    counter += 1


    users.push(user)
    res.json({
        message: 'add ok',
        user: user
    })
})

//path = PUT /user:id
app.put('/user/:id', (req , res) => {
    let id = req.params.id
    let updateUser = req.body

    //ค้นหาข้อมูล user
    let selectedIndex = users.findIndex(user => user.id == id)

    //update ข้อมูล user
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
    users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname



    res.json( {
        message: 'udapte user complete!',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})


//path = PATCH /user:id
app.patch('/user/:id', (req , res) => {
    let id = req.params.id
    let updateUser = req.body

    //ค้นหาข้อมูล user
    let selectedIndex = users.findIndex(user => user.id == id)

    //update ข้อมูล user
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname 
    }

    if(updateUser.lastname){
        users[selectedIndex].lastname = updateUser.lastname 
    }
    res.json( {
        message: 'udapte user complete!',
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    })
})


//path DELETE /user/:id
app.delete('/users/:id' , (req , res) =>{
    let id = req.params.id
    //หาก่อนว่า index ของ user ที่จะลบคือ index ไหน
    let selectedIndex = users.findIndex (user => user.id == id)

    //ลบ user ท่า delete
    // delete users[selectedIndex]

    //ลบ user ท่า splice
    users.splice(selectedIndex , 1)

    res.json({
        message: 'delete complete',
        indexDeleted: selectedIndex
    })
})

app.listen(port,(req , res) => {
    console.log('http server run at' + port)
})