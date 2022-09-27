import {validationResult} from "express-validator";

//ожидаем req,res,next
export default (req, res, next) => {
    //если произошла ошибка то дальше запрос выпольнятся не будет
    //получаем все ошибки
    const  errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    next();
}