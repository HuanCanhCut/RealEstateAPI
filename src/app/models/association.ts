import { Category, Comment, Contract, Favorite, Post, PostDetail, RefreshToken, User } from './index'

const associations = () => {
    // User relations
    User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' })
    Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

    User.hasMany(Contract, { foreignKey: 'customer_id', as: 'contracts' })
    Contract.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' })

    User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' })
    Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

    Post.hasOne(PostDetail, { foreignKey: 'post_id', as: 'detail' })
    PostDetail.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })

    Post.hasOne(Contract, { foreignKey: 'post_id', as: 'contract' })
    Contract.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })

    Post.hasMany(Favorite, { foreignKey: 'post_id', as: 'favorites' })
    Favorite.belongsTo(Post, { foreignKey: 'post_id', as: 'post' })

    Category.hasMany(Post, { foreignKey: 'category_id', as: 'posts' })
    Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

    User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refresh_tokens' })
    RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

    User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' })
    Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
}

export default associations
