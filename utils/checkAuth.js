// функция которая решает,можно ли возвращать информацию о пользователе
import jwt from "jsonwebtoken";

export default (req, res, next) => {

    //парсим токен и расшифровуем (если пришел токен то с помощю регулярки заменяем слово Bearer на пустую строчку
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    //если токен есть то расшифровуем его
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');

            //если смогли расшифровать то в userId передаем то что смогли расшифровать
            req.userId = decoded._id;

            //все нормально и выпольняем следующую функцию
            next();
        }
        catch (err) {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    }
    //если нету то:
    else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}