import PostModel from '../models/Post.js'

//создаем статью
export const create  = async (req, res) => {
    try{
        //создаем doc и указать что там находится
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            //тут мы получаем с бэкенда инфу а не от юзера
            user: req.userId,
        });

        //создаем документ после его подготовки
        const post = await doc.save()

        //возвращаем ответ
        res.json(post)
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

//получаем все статьи
export const getAll = async (req,res) => {
    try{
        //находим все статьи + возвращаем информацию о пользователе
        const posts = await PostModel.find().populate('user', '-passwordHash').exec()

        //возвращаем массив статей
        res.json(posts)
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

//получаем одну статью
export const getOne = async (req,res) => {
    try {
        //вытаскаиваем id статьи
        const postId = req.params.id;

        //ищем и вытаскиваем статью и обновляем количество просмотров
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                //инкрементируем (увеличиваем количество просмотров)
                $inc: {
                    viewsCount: 1,
                }
            },
            {
                //возвращаем обновленный
                returnDocument: 'after'
            },
            //функция которая будет показывать,пришла ошибка или документа
            (err, doc) => {
                //есди ошибка
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось получить статью'
                    });
                }
                //если такого документа нету (undefined)
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    });
                }

                //если все хорошо,возвращаем документ
                res.json(doc)
            }
        ).populate('user', '-passwordHash')
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
}


export const remove = async ( req, res ) => {
    try {
        //вытаскаиваем id статьи
        const postId = req.params.id

        //находим и удаляем статью по айди
       await PostModel.findByIdAndDelete({
            _id: postId
        },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить статью'
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        massage: 'Статья не найдена'
                    })
                }

                res.json({
                    massage: 'Статья успешно удалена'
                })
            }
        )
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось удалить статью'
        });
    }
}

export const update = async (req,res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne({
            _id: postId
        },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags?.split(',')
            });
        res.json({
            message: 'Статья успешно обновлена'
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }
}