const router = require('express').Router();
const controller = require('../controllers/orderController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.delete('/:id', controller.remove);

module.exports = router;
