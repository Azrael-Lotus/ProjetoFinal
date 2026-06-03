const { Category } = require('../models');
const { catchAsync, AppError } = require('../middlewares/errorHandler');

/**
 * Lista todas as categorias
 * GET /categories
 */
exports.getAll = catchAsync(async (req, res) => {
  const categories = await Category.findAll();
  res.json({ success: true, data: categories });
});

/**
 * Busca uma categoria pelo ID
 * GET /categories/:id
 */
exports.getById = catchAsync(async (req, res, next) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return next(new AppError('Categoria não encontrada', 404));
  }
  res.json({ success: true, data: category });
});

/**
 * Cria uma nova categoria
 * POST /categories
 */
exports.create = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

/**
 * Atualiza uma categoria existente pelo ID
 * PUT /categories/:id
 */
exports.update = catchAsync(async (req, res, next) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return next(new AppError('Categoria não encontrada', 404));
  }
  await category.update(req.body);
  res.json({ success: true, data: category });
});

/**
 * Remove uma categoria pelo ID
 * DELETE /categories/:id
 */
exports.remove = catchAsync(async (req, res, next) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return next(new AppError('Categoria não encontrada', 404));
  }
  await category.destroy();
  res.json({ success: true, message: 'Categoria removida com sucesso' });
});
