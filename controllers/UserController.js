import bcryptjs from "bcryptjs";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

//создаем регистрацию
export const register = async (req, res) => {
    try {
        //шифруем пароль
        const password = req.body.password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt)

        //подготавливаем документ на создание пользователя
        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarURL: req.body.avatar,
        })

        //создаем юзера
        const user = await doc.save()

        //возвращаем token
        const token = jwt.sign({
                _id:user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            })

        //не будет возвращать passwordHash
        const { passwordHash, ...userData } = user._doc;

        //возвращаем информацию о пользователе
        res.json({
            ...userData,
            token
        })
    }
    catch(err) {
        console.log(err);
        res.status(500).json('не удалось зарегестрироватся');
    }
};

//делаем логинизацию
export const login = async (req,res) => {
    try{
        //есть ли пользователь в базе данных
        const user = await UserModel.findOne({
            email: req.body.email
        });

        //если нету то:
        if (!user) {
            return res.status(404).json({
                message: "пользователь не найден" //временно для проверки работы
            })
        }

        //если пользователь есть в базе данных и проверит,сходится ли пароль
        const isValidPass = await bcryptjs.compare(req.body.password, user._doc.passwordHash);

        //если они не сходятся то:
        if(!isValidPass) {
            return res.status(400).json({
                message: "неверный логин или пароль"
            })
        }

        //если пользователь есть и пароль корректный то создаем новый токен
        const token = jwt.sign({
                _id:user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            })

        //не будет возвращать passwordHash
        const { passwordHash, ...userData } = user._doc;

        //возвращаем информацию о пользователе
        res.json({
            ...userData,
            token
        })
    }

    catch(err) {
        console.log(err);
        res.status(500).json('не удалось авторизоватся');
    }
};

//берем данные юзера
export const getMe = async (req, res) => {
    try{
        //необходимо найти юзера по id
        const user = await UserModel.findById(req.userId)

        //если такого пользователя нету то:
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        //если пользователь нашелься то:
        //не будет возвращать passwordHash
        const { passwordHash, ...userData } = user._doc;

        //возвращаем информацию о пользователе
        res.json(userData)
    }
    catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        });
    }
};