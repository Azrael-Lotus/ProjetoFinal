const { Book, Category } = require('../models');
const { catchAsync, AppError } = require('../middlewares/errorHandler');

exports.getAll = catchAsync(async (req, res) => {
  const books = await Book.findAll({ include: [{ model: Category, as: 'category' }] });
  res.json({ success: true, data: books });
});

exports.getById = catchAsync(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id, { include: [{ model: Category, as: 'category' }] });
  if (!book) {
    return next(new AppError('Livro não encontrado', 404));
  }
  res.json({ success: true, data: book });
});

exports.create = catchAsync(async (req, res, next) => {
  const { categoryId } = req.body;
  const category = await Category.findByPk(categoryId);
  if (!category) {
    return next(new AppError('Categoria inválida', 400));
  }
  const book = await Book.create(req.body);
  res.status(201).json({ success: true, data: book });
});

exports.update = catchAsync(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return next(new AppError('Livro não encontrado', 404));
  }
  if (req.body.categoryId) {
    const category = await Category.findByPk(req.body.categoryId);
    if (!category) {
      return next(new AppError('Categoria inválida', 400));
    }
  }
  await book.update(req.body);
  res.json({ success: true, data: book });
});

exports.remove = catchAsync(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return next(new AppError('Livro não encontrado', 404));
  }
  await book.destroy();
  res.json({ success: true, message: 'Livro removido com sucesso' });
});
