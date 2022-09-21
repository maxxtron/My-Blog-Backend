import mongoose from 'mongoose';

//пишем схему таблицы юзеров(required - обязательное поле, unique - уникальное)

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatar: String,

},
    {
        //дата создания
        timestamps: true
    })
export default mongoose.model('User', UserSchema);