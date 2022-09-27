import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import {loginValidation, postCreateValidation, registerValidation} from './validations.js'
import {checkAuth, handleValidationErrors} from './utils/index.js';
import {PostController, UserController} from "./controllers/index.js";
import cors from 'cors'

//подключаемся к mongoDB с помощу mongoose (blog - база данных)
mongoose.connect('mongodb+srv://maxxtron:zx40wi3o@cluster0.rcmdjgy.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch(err => console.log('DB ERROR',err))

//создаем express приложение
const app = express();

//создаем хранилище где будут сохранятся картинки
const storage = multer.diskStorage({
    //путь где будут сохранятся картинки
    destination: (_, __, callback) => {
        //функция говорит что не возвращает ошибку и сохраняет в папку uploads
        callback(null,'uploads')
    },
    //как будет называтся файл
    filename: (_, file, callback) => {
        //функция говорит что не возвращает ошибку и вытаскивает оригинальное имья
        callback(null,file.originalname)
    }
});

//
const upload = multer({ storage })

//учим приложение распозновать json
app.use(express.json())

//убираем ошибку cors
app.use(cors())

//если приходит любой запрос с upload
app.use('/uploads', express.static('uploads'))

//----------- Все что связанно с User -------------//

//сделаем авторизацию
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)

//отлавливаем post запрос + валидация (парсим)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

//проверяем,можем ли мы получить информацию о себе
app.get('/auth/me', checkAuth, UserController.getMe)


//----------- Все что связанно с Post -------------//
//route для upload (файлов) ожидаем image, если картинка пришла то res
app.post('/uploads', checkAuth, upload.single('image'), (req,res) => {
    res.json({
        //передаем url uploads и вытаскиваем из запроса файл
        url:`/uploads/${req.file.originalname}`
    })
})


//----------- Все что связанно с Post -------------//

//создаем новый route

//получаем все статьи
app.get('/posts', PostController.getAll)

//получаем одну статью по динамическому параметру
app.get('/posts/:id', PostController.getOne)

//проверяем сделан ли checkAuth и потом проверяем валидацию и уже создаем новую статью
app.post('/posts', checkAuth, handleValidationErrors, postCreateValidation, PostController.create)

//удаляем статью
app.delete('/posts/:id', checkAuth, PostController.remove)

//обновляем статью
app.patch('/posts/:id', checkAuth, handleValidationErrors, postCreateValidation, PostController.update)

//запускаем сервер (порт)
app.listen(4444, (err) => {
    if(err) {
        return console.log(err)
    }
//если без ошибок удачно запустился
    console.log('Server OK')
});

