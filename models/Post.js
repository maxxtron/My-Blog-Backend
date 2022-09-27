import mongoose from 'mongoose';

//пишем схему таблицы юзеров(required - обязательное поле, unique - уникальное)

const PostSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            //если тэгов нету,то вернем пустой массив
            default: [],
        },
         //количество просмотров статьи
        viewsCount: {
            type: Number,
            default: 0,
    },
        imageUrl: String,
        user: {
            //обясняем с mongoose какой тип айди приходит
            type: mongoose.Schema.Types.ObjectId,
            //ссылаемся на отдельную модель пользователя
            ref: 'User',
            required: true
}},
    {
        //дата создания
        timestamps: true
    })
export default mongoose.model('Post', PostSchema);