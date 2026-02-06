import { NextFunction, Response } from 'express'

import { responsePagination } from '../response/responsePagination'
import CategoryService from '../services/CategoryService'
import { CreateCategoryRequest, UpdateCategoryRequest } from '../validators/api/categorySchema'
import { IdRequest, PaginationRequest } from '../validators/api/commonSchema'

class CategoryController {
    getCategories = async (req: PaginationRequest, res: Response, next: NextFunction) => {
        try {
            const { page, per_page } = req.query

            const { categories, total } = await CategoryService.getCategories(Number(page), Number(per_page))

            res.json(
                responsePagination({
                    req,
                    data: categories,
                    total,
                    count: categories.length,
                    current_page: Number(page),
                    per_page: Number(per_page),
                }),
            )
        } catch (error) {
            return next(error)
        }
    }

    createCategory = async (req: CreateCategoryRequest, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body

            const category = await CategoryService.createCategory({ name })

            res.status(201).json({
                data: category,
            })
        } catch (error) {
            return next(error)
        }
    }

    updateCategory = async (req: UpdateCategoryRequest, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body
            const { id } = req.params

            const category = await CategoryService.updateCategory({ id: Number(id), name })

            res.json({
                data: category,
            })
        } catch (error) {
            return next(error)
        }
    }

    deleteCategory = async (req: IdRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params

            await CategoryService.deleteCategory({ id: Number(id) })

            res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }
}

export default new CategoryController()
