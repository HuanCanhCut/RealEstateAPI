import { AppError, BadRequestError, NotFoundError } from '../errors/errors'
import { InternalServerError } from '../errors/errors'
import { Category } from '../models'
import { sequelize } from '~/config/database'

class CategoryService {
    getCategories = async (page: number, per_page: number) => {
        try {
            const { rows: categories, count: total } = await Category.findAndCountAll({
                distinct: true,
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(
                                SELECT COUNT(1)
                                FROM posts
                                WHERE posts.category_id = Category.id
                            )`),
                            'post_count',
                        ],
                    ],
                },
                limit: per_page,
                offset: (page - 1) * per_page,
            })

            return {
                categories,
                total,
            }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    createCategory = async ({ name }: { name: string }) => {
        try {
            const hasCategory = await Category.findOne({
                where: {
                    name,
                },
            })

            if (hasCategory) {
                throw new BadRequestError({ message: 'Danh mục đã tồn tại' })
            }

            const category = await Category.create({ name })

            return category
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    updateCategory = async ({ id, name }: { id: number; name: string }) => {
        try {
            const category = await Category.findByPk(id)

            if (!category) {
                throw new NotFoundError({ message: 'Category not found' })
            }

            await category.update({ name })

            return category
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    deleteCategory = async ({ id }: { id: number }) => {
        try {
            const category = await Category.findByPk(id)

            if (!category) {
                throw new NotFoundError({ message: 'Category not found' })
            }

            await Category.destroy({
                where: {
                    id,
                },
            })
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }
}

export default new CategoryService()
