import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import { registerValidation } from 'validations/auth.js'

//подключаемся к mongoDB с помощу mongoose
mongoose.connect('mongodb+srv://maxxtron:zx40wi3o@cluster0.rcmdjgy.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch(err => console.log('DB ERROR',err))

//создаем express приложение
const app = express();

//учим приложение распозновать json
app.use(express.json())

//отлавливаем post запрос + валидация
app.post('/auth/register', (req, res) => {

})

//запускаем сервер (порт)
app.listen(4444, (err) => {
    if(err) {
        return console.log(err)
    }
//если без ошибок удачно запустился
    console.log('Server OK')
});

