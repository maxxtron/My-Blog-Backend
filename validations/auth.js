import { body } from "express-validator"

export const registerValidation = [
    //eсли эмейл корректный
    body('email').isEmail(),
    ////усли пароль корректный
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    //если не придет аватар то норм,ну если придет то надо проверить является ли она ссылкой
    body('avatarUrl').optional().isURL(),
]