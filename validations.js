import {body} from "express-validator"

export const loginValidation = [
    //eсли эмейл корректный
    body('email', 'неверный формат почты').isEmail(),
    ////усли пароль корректный
    body('password', 'пароль должен быть минимум 5 символов').isLength({min: 5}),
]
export const registerValidation = [
    //eсли эмейл корректный
    body('email', 'неверный формат почты').isEmail(),
    ////усли пароль корректный
    body('password', 'пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'имья должно содержать минимум 3 символа').isLength({min: 3}),
    //если не придет аватар то норм,ну если придет то надо проверить является ли она ссылкой
    body('avatarUrl', 'неверная ссылка на аватарку').optional().isURL(),
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 3}).isString(),
    body('tags', 'Неверный формат тэгов').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]